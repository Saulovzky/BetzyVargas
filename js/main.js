(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Año del pie
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Indicador de sección activa ---------- */
  var links = $$('.nav__links a[href^="#"]');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  // las secciones sin enlace propio se asocian a la más cercana
  var alias = { evidencia: null, inicio: null };
  if ('IntersectionObserver' in window) {
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        var key = id in alias ? alias[id] : id;
        if (key === current) return;
        current = key;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        if (key && map[key]) map[key].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Servicios: pestañas ---------- */
  var tabs = $$('.svc__tab');
  var panels = $$('.svc__panel');
  var tabRow = $('.svc__tabs');
  // center = true solo tras una acción de la persona; mueve únicamente la fila
  // de pestañas (en móvil es horizontal), nunca desplaza la página.
  function select(key, focus, center) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-key') === key;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus({ preventScroll: true });
      if (on && center && tabRow.scrollWidth > tabRow.clientWidth) {
        tabRow.scrollTo({ left: t.offsetLeft - (tabRow.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
    panels.forEach(function (p) { p.hidden = p.id !== 'panel-' + key; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('data-key'), false, true); });
    t.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next.getAttribute('data-key'), true, true); }
    });
  });
  if (tabs.length) select('peritaje');

  // Accesos por situación (hero): abren el servicio indicado
  $$('[data-svc]').forEach(function (a) {
    a.addEventListener('click', function () { select(a.getAttribute('data-svc'), false, true); });
  });

  // "Consultar este servicio": preselecciona el formulario
  var form = $('#form');
  $$('[data-consult]').forEach(function (b) {
    b.addEventListener('click', function () {
      form.elements.servicio.value = b.getAttribute('data-consult');
      $('#contacto').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      setTimeout(function () { form.elements.nombre.focus({ preventScroll: true }); }, 450);
    });
  });

  /* ---------- Lupa sobre el documento ---------- */
  var spec = $('#specimen');
  if (spec) {
    var pos = { x: 36, y: 41 };
    function paint() {
      spec.style.setProperty('--lx', pos.x + '%');
      spec.style.setProperty('--ly', pos.y + '%');
    }
    function fromEvent(e) {
      var r = spec.getBoundingClientRect();
      pos.x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      pos.y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
      paint();
    }
    var dragging = false;
    spec.addEventListener('pointerdown', function (e) {
      dragging = true;
      if (e.pointerType === 'mouse') spec.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    spec.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse' || dragging) fromEvent(e);
    });
    ['pointerup', 'pointercancel'].forEach(function (n) {
      spec.addEventListener(n, function () { dragging = false; });
    });
    spec.addEventListener('keydown', function (e) {
      var step = 4, ok = true;
      if (e.key === 'ArrowLeft') pos.x -= step;
      else if (e.key === 'ArrowRight') pos.x += step;
      else if (e.key === 'ArrowUp') pos.y -= step;
      else if (e.key === 'ArrowDown') pos.y += step;
      else ok = false;
      if (ok) {
        e.preventDefault();
        pos.x = Math.max(0, Math.min(100, pos.x));
        pos.y = Math.max(0, Math.min(100, pos.y));
        paint();
      }
    });
    paint();
  }

  /* ---------- Barra móvil: se oculta al llegar a contacto ---------- */
  var dock = $('#dock'), contacto = $('#contacto');
  if (dock && contacto && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      dock.classList.toggle('is-hidden', es[0].isIntersecting);
    }, { threshold: 0.25 }).observe(contacto);
  }

  /* ---------- Formulario (abre el correo, sin servidor) ---------- */
  var note = $('#form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true;
    ['nombre', 'correo', 'mensaje'].forEach(function (n) {
      var el = f[n];
      var bad = !el.value.trim() || (n === 'correo' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Completa los campos marcados en rojo.'; return; }
    var subject = 'Consulta: ' + f.servicio.value;
    var body = 'Nombre: ' + f.nombre.value + '\nCorreo: ' + f.correo.value +
      '\nServicio: ' + f.servicio.value + '\n\n' + f.mensaje.value;
    window.location.href = 'mailto:betvargas81@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Abriendo tu aplicación de correo.';
  });
})();
