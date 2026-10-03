(() => {
  const LINE_ID = document.body.dataset.lineId || '@filmlab';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // เปิดแชต LINE OA พร้อมข้อความที่พิมพ์ไว้ให้
  const lineChatUrl = (text) =>
    `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ID)}/?${encodeURIComponent(text)}`;

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

  /* ---------- "ถามราคา" buttons → LINE with message ---------- */
  document.querySelectorAll('[data-line-msg]').forEach((el) => {
    el.href = lineChatUrl(el.dataset.lineMsg);
    el.target = '_blank';
    el.rel = 'noopener';
  });

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

      const url = lineChatUrl(lines.join('\n'));
      openLink.href = url;
      // ถ้าเบราว์เซอร์บล็อกหน้าต่างใหม่ ให้แสดงปุ่มเปิด LINE แทน
      const win = window.open(url, '_blank');
      openLink.hidden = Boolean(win);
      status.textContent = win
        ? 'เปิด LINE แล้ว กดส่งข้อความในแชตได้เลย'
        : 'ข้อความพร้อมแล้ว กดปุ่มด้านล่างเพื่อเปิด LINE';
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
