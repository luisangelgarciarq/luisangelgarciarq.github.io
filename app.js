/* arqluisgarcia — Portafolio V2. Funciona con Live Server y GitHub Pages. */
(() => {
  'use strict';
  const projects = window.ARQLUISGARCIA_PROYECTOS || [];
  const one = (selector, base = document) => base.querySelector(selector);
  const all = (selector, base = document) => [...base.querySelectorAll(selector)];
  const pad = (n) => String(n).padStart(2, '0');
  const word = (str) => (str == null ? '' : String(str));

  function initNavigation() {
    const toggle = one('.menu-toggle');
    const menu = one('#menu-movil');
    if (!toggle || !menu) return;
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    all('a', menu).forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
  }

  function createProjectCard(p) {
    const anchor = document.createElement('a');
    anchor.className = 'project-card';
    anchor.href = `proyecto.html?obra=${encodeURIComponent(p.id)}`;
    anchor.setAttribute('aria-label', `Ver proyecto ${p.nombre}, ${p.imagenes.length} imágenes`);
    const frame = document.createElement('div');
    frame.className = 'image-wrap';
    const img = document.createElement('img');
    img.src = p.imagenes[0].src;
    img.alt = `Render del proyecto ${p.nombre}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    const counter = document.createElement('span');
    counter.className = 'photo-count';
    counter.textContent = `${pad(p.imagenes.length)} IMÁGENES`;
    frame.append(img, counter);
    const row = document.createElement('div');
    row.className = 'project-card-heading';
    const content = document.createElement('div');
    const number = document.createElement('div');
    number.className = 'project-card-number';
    number.textContent = `${p.numero} / ${p.tipo.toUpperCase()}`;
    const title = document.createElement('h3');
    title.textContent = p.nombre;
    const sub = document.createElement('p');
    sub.textContent = p.ubicacion || p.tipo;
    content.append(number, title, sub);
    const arrow = document.createElement('span');
    arrow.className = 'project-card-arrow';
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    row.append(content, arrow);
    anchor.append(frame, row);
    return anchor;
  }

  function initHome() {
    const grid = one('#projects-grid');
    if (!grid || !projects.length) return;
    function applyFilter(category) {
      grid.replaceChildren();
      const selection = projects.filter(p => category === 'all' || (category === 'campo' ? p.tipo === 'Casa de campo' : p.tipo !== 'Casa de campo'));
      selection.forEach(p => grid.append(createProjectCard(p)));
      all('.filter').forEach(btn => {
        const on = btn.dataset.filter === category;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', String(on));
      });
    }
    all('.filter').forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
    applyFilter('all');
    const img = one('#hero-image');
    const name = one('#hero-project-name');
    const loc = one('#hero-project-location');
    const number = one('#slide-number');
    const link = one('#hero-detail-link');
    const prev = one('#hero-prev');
    const next = one('#hero-next');
    const frame = one('#hero-frame');
    let current = 0;
    let interval = null;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(index) {
      current = (index + projects.length) % projects.length;
      const p = projects[current];
      img.src = p.imagenes[0].src;
      img.alt = `Vista del proyecto ${p.nombre}`;
      name.textContent = p.nombre;
      loc.textContent = p.ubicacion || p.tipo;
      number.textContent = pad(current + 1);
      link.href = `proyecto.html?obra=${encodeURIComponent(p.id)}`;
    }
    const stop = () => { if (interval) clearInterval(interval); interval = null; };
    const start = () => { if (!reducedMotion) { stop(); interval = setInterval(() => { if (!document.hidden) show(current + 1); }, 6500); } };
    prev.addEventListener('click', () => {show(current - 1); start();});
    next.addEventListener('click', () => {show(current + 1); start();});
    frame.addEventListener('mouseenter', stop);
    frame.addEventListener('mouseleave', start);
    frame.addEventListener('focusin', stop);
    frame.addEventListener('focusout', (event) => {if (!frame.contains(event.relatedTarget)) start();});
    let touchStart = null;
    frame.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, {passive:true});
    frame.addEventListener('touchend', e => { if (touchStart === null) return; const delta = e.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 42) {show(current + (delta > 0 ? -1 : 1));start();} touchStart=null; }, {passive:true});
    show(0);
    start();
    const form = one('#contact-form');
    if (form) form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = `Consulta web: ${word(data.get('servicio'))}`;
      const body = [
        `Nombre: ${word(data.get('nombre'))}`,
        `Correo: ${word(data.get('correo'))}`,
        `Servicio: ${word(data.get('servicio'))}`,
        '', 'Mensaje:', word(data.get('mensaje')),
        '', 'Adjunto los archivos del proyecto desde mi correo, si corresponde.'
      ].join('\n');
      window.location.href = `mailto:arqluisanghels@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  function initProjectPage() {
    if (document.body.dataset.page !== 'proyecto') return;
    const params = new URLSearchParams(location.search);
    const id = params.get('obra');
    const project = projects.find(p => p.id === id) || projects[0];
    if (!project) return;
    document.title = `${project.nombre} · arqluisgarcia`;
    one('#project-position').textContent = project.numero;
    one('#project-title').textContent = project.nombre;
    one('#project-type').textContent = project.tipo;
    one('#fact-name').textContent = project.nombre;
    one('#fact-location').textContent = project.ubicacion || '';
    one('#fact-location-row').hidden = !project.ubicacion;
    one('#fact-area').textContent = project.area || '';
    one('#fact-area-row').hidden = !project.area;
    // NO se corrige, reescribe ni resume el texto del Word.
    one('#original-word-text').textContent = project.descripcionOriginal;
    const photo = one('#detail-image');
    const caption = one('#image-label');
    const count = one('#image-count');
    const thumbs = one('#thumbnails');
    const lightbox = one('#lightbox');
    const lightboxImg = one('#lightbox-image');
    const lightboxCounter = one('#lightbox-counter');
    let current = 0;
    let returnFocus = null;
    function render(index) {
      current = (index + project.imagenes.length) % project.imagenes.length;
      const item = project.imagenes[current];
      photo.src = item.src;
      photo.alt = `${project.nombre}: ${item.alt}`;
      caption.textContent = item.alt;
      count.textContent = `${pad(current + 1)} / ${pad(project.imagenes.length)}`;
      all('.thumb', thumbs).forEach((t,i) => {
        t.classList.toggle('current', i === current);
        t.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
      if (!lightbox.hidden) {
        lightboxImg.src = item.src;
        lightboxImg.alt = photo.alt;
        lightboxCounter.textContent = `${pad(current + 1)} / ${pad(project.imagenes.length)}`;
      }
      const active = all('.thumb', thumbs)[current];
      if (active) active.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
    }
    project.imagenes.forEach((entry, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'thumb';
      b.setAttribute('aria-label', `Mostrar imagen ${i+1}: ${entry.alt}`);
      const small = document.createElement('img');
      small.src = entry.src;
      small.alt = '';
      small.loading = i > 5 ? 'lazy' : 'eager';
      b.append(small);
      b.addEventListener('click', () => render(i));
      thumbs.append(b);
    });
    one('.detail-prev').addEventListener('click', () => render(current - 1));
    one('.detail-next').addEventListener('click', () => render(current + 1));
    function openLightbox() {
      returnFocus = document.activeElement;
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      render(current);
      one('.lightbox-close').focus();
    }
    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
      if (returnFocus) returnFocus.focus();
    }
    one('.expand-image').addEventListener('click', openLightbox);
    one('.lightbox-close').addEventListener('click', closeLightbox);
    one('.lightbox-prev').addEventListener('click', () => render(current - 1));
    one('.lightbox-next').addEventListener('click', () => render(current + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !lightbox.hidden) {closeLightbox();return;}
      if (e.key === 'ArrowLeft' && !lightbox.hidden) render(current - 1);
      if (e.key === 'ArrowRight' && !lightbox.hidden) render(current + 1);
    });
    let dragStart = null;
    one('.project-main-image').addEventListener('touchstart', e => dragStart = e.touches[0].clientX, {passive:true});
    one('.project-main-image').addEventListener('touchend', e => {
      if (dragStart == null) return;
      const diff = e.changedTouches[0].clientX - dragStart;
      if (Math.abs(diff) > 44) render(current + (diff > 0 ? -1 : 1));
      dragStart = null;
    }, {passive:true});
    render(0);
  }

  function init() {
    initNavigation();
    all('.copyright-year').forEach(e => e.textContent = new Date().getFullYear());
    initHome();
    initProjectPage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
