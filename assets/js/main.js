(() => {
  const LINE_ID = document.body.dataset.lineId || '@filmlab';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LINE links ----------
     มือถือ: เปิดแอป LINE ทันที
       - Android ใช้ intent:// (ถ้าไม่มีแอป จะไปหน้าเว็บ LINE แทน)
       - iPhone เปิดในแท็บเดิม ให้ iOS ส่งต่อเข้าแอป LINE
     คอมพิวเตอร์: เปิดหน้า LINE ในแท็บใหม่ (แสดง QR ให้สแกน) */
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = isAndroid || isIOS;

  const lineId = encodeURIComponent(LINE_ID);
  const addFriendPath = `ti/p/${lineId}`;
  // แชตไลน์แอดพร้อมข้อความที่พิมพ์ไว้ให้
  const chatPath = (text) => `oaMessage/${lineId}/?${encodeURIComponent(text)}`;

  const lineWebUrl = (path) => `https://line.me/R/${path}`;
  const lineAppUrl = (path) => (isAndroid
    ? `intent://${path}#Intent;scheme=line;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=jp.naver.line.android;S.browser_fallback_url=${encodeURIComponent(lineWebUrl(path))};end`
    : lineWebUrl(path));

  const setLineLink = (a, path) => {
    if (isMobile) {
      a.href = lineAppUrl(path);
      a.removeAttribute('target');
    } else {
      a.href = lineWebUrl(path);
      a.target = '_blank';
      a.rel = 'noopener';
    }
  };

  document.querySelectorAll('a[href^="https://line.me/R/ti/p/"]').forEach((a) => setLineLink(a, addFriendPath));
  document.querySelectorAll('[data-line-msg]').forEach((a) => setLineLink(a, chatPath(a.dataset.lineMsg)));

  /* ---------- Header border on scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Before / after slider ---------- */
  const ba = document.querySelector('.ba');
  if (ba) {
    const range = ba.querySelector('.ba-range');
    const setPos = (v) => {
      ba.style.setProperty('--pos', `${v}%`);
      range.value = v;
    };
    let touched = false;
    range.addEventListener('input', () => {
      touched = true;
      setPos(range.value);
    });

    // ขยับให้เห็นครั้งเดียวว่าลากได้
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const stops = [50, 26, 72, 50];
        const segment = 650;
        let start = null;
        const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
        const tick = (now) => {
          if (touched) return;
          if (start === null) start = now;
          const t = (now - start) / segment;
          const i = Math.floor(t);
          if (i >= stops.length - 1) return setPos(50);
          setPos(stops[i] + (stops[i + 1] - stops[i]) * ease(t - i));
          requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 700);
      }, { threshold: 0.6 });
      io.observe(ba);
    }
  }

  /* ---------- Film finder tabs ---------- */
  const tabs = [...document.querySelectorAll('.finder-tab')];
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  const keyStep = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      if (!(e.key in keyStep)) return;
      e.preventDefault();
      selectTab(tabs[(i + keyStep[e.key] + tabs.length) % tabs.length], true);
    });
  });

  /* ---------- Works: แกลเลอรีจาก works-data.js + ปุ่มกรอง ---------- */
  const worksGrid = document.getElementById('works-grid');
  const works = Array.isArray(window.FILMLAB_WORKS) ? window.FILMLAB_WORKS : [];
  if (worksGrid && works.length) {
    const ALL = 'ทั้งหมด';
    const TYPE_ORDER = ['บ้าน', 'คอนโด', 'สำนักงาน', 'ร้านค้า'];
    const dir = 'assets/img/works/';
    const cta = worksGrid.querySelector('.shot-cta');
    const filterBox = document.querySelector('.works-filter');
    let filter = ALL;

    const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    const cards = works.map((w) => {
      const n = Math.max(1, Number(w.photos) || 1);
      const photos = Array.from({ length: n }, (_, i) => `${dir}${w.id}-${i + 1}.jpg`);
      const a = document.createElement('a');
      a.className = 'shot work';
      a.href = photos[0];
      a.dataset.title = w.title;
      a.dataset.photos = photos.join(', ');
      a.dataset.type = w.type || '';
      a.innerHTML = `
        <img src="${dir}${esc(w.id)}-1-sm.jpg" alt="${esc(w.alt || `${w.title} หลังติดฟิล์ม`)}" loading="lazy">
        <span class="shot-arrow"><svg class="i"><use href="#i-arrow-ne"/></svg></span>
        <span class="shot-count"><svg class="i"><use href="#i-photo"/></svg>${n}</span>
        <span class="shot-info">
          <span class="shot-type">${esc(w.type)}</span>
          <strong>${esc(w.title)}</strong>
          <em>${esc(w.film)}</em>
        </span>`;
      return a;
    });

    // กระจายงานลงคอลัมน์แบบวนซ้ายไปขวา ลำดับในไฟล์จึงอ่านจากซ้ายไปขวาเหมือนเดิม
    const colsMQ = window.matchMedia('(max-width: 760px)');
    const render = () => {
      const count = colsMQ.matches ? 2 : 3;
      const shown = cards.filter((c) => filter === ALL || c.dataset.type === filter);
      worksGrid.textContent = '';
      const cols = Array.from({ length: count }, () => {
        const col = document.createElement('div');
        col.className = 'gallery-col';
        worksGrid.appendChild(col);
        return col;
      });
      [...shown, cta].forEach((el, i) => cols[i % count].appendChild(el));
    };

    const present = [...new Set(works.map((w) => w.type).filter(Boolean))];
    const types = [ALL, ...TYPE_ORDER.filter((t) => present.includes(t)), ...present.filter((t) => !TYPE_ORDER.includes(t))];
    types.forEach((t) => {
      const count = t === ALL ? works.length : works.filter((w) => w.type === t).length;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.innerHTML = `${esc(t)}<span>${count}</span>`;
      b.setAttribute('aria-pressed', String(t === filter));
      b.addEventListener('click', () => {
        filter = t;
        filterBox.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        render();
      });
      filterBox.appendChild(b);
    });

    if (colsMQ.addEventListener) colsMQ.addEventListener('change', render);
    render();
  }

  /* ---------- เนื้อหาค่อย ๆ ขึ้นมาตอนเลื่อนถึง ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('pending');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('pending');
        io.observe(el);
      }
    });
  }

  /* ---------- Works lightbox ---------- */
  const lb = document.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    const img = lb.querySelector('.lb-img');
    const title = lb.querySelector('.lb-title');
    const count = lb.querySelector('.lb-count');
    const prev = lb.querySelector('.lb-prev');
    const next = lb.querySelector('.lb-next');
    let photos = [];
    let index = 0;
    let label = '';

    const show = (i) => {
      index = (i + photos.length) % photos.length;
      img.src = photos[index];
      img.alt = `${label} รูปที่ ${index + 1}`;
      count.textContent = `${index + 1} / ${photos.length}`;
      if (photos.length > 1) new Image().src = photos[(index + 1) % photos.length];
    };

    document.querySelectorAll('.work[data-photos]').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        photos = card.dataset.photos.split(',').map((s) => s.trim()).filter(Boolean);
        label = card.dataset.title || '';
        title.textContent = label;
        const single = photos.length < 2;
        prev.hidden = single;
        next.hidden = single;
        count.hidden = single;
        show(0);
        lb.showModal();
      });
    });

    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
    // กดพื้นที่ว่างรอบรูปเพื่อปิด
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('lb-stage')) lb.close();
    });
    lb.addEventListener('keydown', (e) => {
      if (photos.length < 2) return;
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    // ปัดซ้าย/ขวาบนมือถือ
    let startX = null;
    img.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    img.addEventListener('pointerup', (e) => {
      if (startX === null || photos.length < 2) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    });
    img.addEventListener('dragstart', (e) => e.preventDefault());
    lb.addEventListener('close', () => img.removeAttribute('src'));
  }

  /* ---------- Quote form → LINE ---------- */
  const form = document.getElementById('quote-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const openLink = document.getElementById('f-open');
    const fields = {
      name: form.elements.name,
      phone: form.elements.phone,
    };
    const isValid = {
      name: (v) => v.trim().length > 0,
      phone: (v) => /^0\d{8,9}$/.test(v.replace(/[\s-]/g, '')),
    };
    const check = (key) => {
      const ok = isValid[key](fields[key].value);
      fields[key].closest('.field').classList.toggle('invalid', !ok);
      fields[key].setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    Object.keys(fields).forEach((key) => {
      fields[key].addEventListener('input', () => {
        if (fields[key].closest('.field').classList.contains('invalid')) check(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const okName = check('name');
      const okPhone = check('phone');
      if (!okName || !okPhone) {
        (okName ? fields.phone : fields.name).focus();
        return;
      }

      const data = new FormData(form);
      const lines = [
        'สวัสดี ขอประเมินราคาติดฟิล์ม',
        `ชื่อ: ${data.get('name').trim()}`,
        `เบอร์: ${data.get('phone').trim()}`,
        `สถานที่: ${data.get('place')}`,
        `ฟิล์มที่สนใจ: ${data.get('film')}`,
      ];
      const detail = data.get('detail').trim();
      if (detail) lines.push(`รายละเอียด: ${detail}`);

      const path = chatPath(lines.join('\n'));
      setLineLink(openLink, path);

      if (isMobile) {
        // มือถือ: เด้งเข้าแอป LINE เลย และเผื่อปุ่มกดเองถ้าแอปไม่เปิด
        openLink.hidden = false;
        status.textContent = 'กำลังเปิด LINE… ถ้าแอปไม่เปิด กดปุ่มด้านล่าง';
        window.location.href = lineAppUrl(path);
        return;
      }

      // คอมพิวเตอร์: เปิดแท็บใหม่ ถ้าเบราว์เซอร์บล็อก ให้แสดงปุ่มเปิด LINE แทน
      const win = window.open(lineWebUrl(path), '_blank');
      openLink.hidden = Boolean(win);
      status.textContent = win
        ? 'เปิด LINE แล้ว กดส่งข้อความในแชตได้เลย'
        : 'ข้อความพร้อมแล้ว กดปุ่มด้านล่างเพื่อเปิด LINE';
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
