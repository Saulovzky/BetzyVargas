(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  // Año del footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sombra de la barra al hacer scroll
  function onScroll() {
    nav.classList.toggle('is-stuck', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Aparición suave al hacer scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Formulario: abre el correo con el mensaje ya redactado (sin backend)
  var form = document.getElementById('form');
  var note = document.getElementById('form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var ok = true;
    ['nombre', 'correo', 'mensaje'].forEach(function (n) {
      var el = f[n];
      var bad = !el.value.trim() || (n === 'correo' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = 'Revisa los campos marcados.';
      return;
    }
    var subject = 'Consulta: ' + f.servicio.value;
    var body = 'Nombre: ' + f.nombre.value + '\nCorreo: ' + f.correo.value +
      '\nServicio: ' + f.servicio.value + '\n\n' + f.mensaje.value;
    window.location.href = 'mailto:betvargas81@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Abriendo tu aplicación de correo…';
  });
})();
