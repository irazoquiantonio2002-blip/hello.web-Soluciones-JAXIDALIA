(function () {
  'use strict';

  /* ── Configuración de contacto ─────────────────────
     TODO: reemplaza con el número real de WhatsApp de
     Soluciones JAXIDALIA (formato: 52 + lada + número,
     solo dígitos, sin espacios ni signos). Mientras tanto
     los botones de WhatsApp llevan al formulario de contacto. */
  var WHATSAPP_NUMBER = ''; // ej. '5215512345678'

  function waLink(message) {
    if (!WHATSAPP_NUMBER) return '#contacto';
    return 'https://wa.me/' + WHATSAPP_NUMBER + (message ? '?text=' + encodeURIComponent(message) : '');
  }

  document.querySelectorAll('[data-wa-link]').forEach(function (el) {
    el.setAttribute('href', waLink(el.getAttribute('data-wa-message') || ''));
  });

  /* ── Loader ───────────────────────────────────────── */
  var loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (loader) loader.classList.add('is-hidden');
    }, 400);
  });

  /* ── Año en footer ────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Navbar scroll state ──────────────────────────── */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Menú móvil ───────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobMenu = document.getElementById('mob-menu');
  function closeMenu() {
    if (!hamburger || !mobMenu) return;
    hamburger.classList.remove('is-open');
    mobMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    mobMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ── Scroll reveal ────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ── Marquee ──────────────────────────────────────── */
  var marquee = document.getElementById('marquee');
  if (marquee) {
    var items = [
      'Videovigilancia CCTV', 'Redes de Internet', 'Audio y Video',
      'Automatización del Hogar', 'Cableado Estructurado', 'Monitoreo Remoto'
    ];
    var html = items.map(function (t) {
      return '<span>' + t + ' <i class="fa-solid fa-circle"></i></span>';
    }).join('');
    marquee.innerHTML = html + html; // duplicado para loop continuo
  }

  /* ── Contador de stats ────────────────────────────── */
  var statEls = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (statEls.length && 'IntersectionObserver' in window) {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { statIo.observe(el); });
  }

  /* ── Hero: canvas de partículas ───────────────────── */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      var hero = document.getElementById('hero');
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    function initParticles() {
      var count = Math.min(46, Math.floor((W * H) / 34000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 1 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: 0.25 + Math.random() * 0.5
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = 'rgba(23,184,214,' + (0.14 * (1 - dist / 130)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(95,225,216,' + p.a + ')';
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    resize();
    initParticles();
    draw();
    window.addEventListener('resize', function () {
      resize();
      initParticles();
      if (reduceMotion) draw();
    });
  }

  /* ── Reloj del mockup de monitoreo CCTV ───────────── */
  var cctvTime = document.getElementById('cctv-time');
  if (cctvTime) {
    function tick() {
      cctvTime.textContent = new Date().toLocaleTimeString('es-MX', { hour12: false });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ── Formulario de contacto → WhatsApp ────────────── */
  var form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('f-name').value.trim();
      var interest = document.getElementById('f-interest').value;
      var msg = document.getElementById('f-msg').value.trim();

      var text = 'Hola, soy ' + name + '. Me interesa: ' + interest + '.';
      if (msg) text += ' Detalle: ' + msg;

      if (!WHATSAPP_NUMBER) {
        alert('¡Gracias, ' + name + '! Configura tu número de WhatsApp en js/main.js (WHATSAPP_NUMBER) para activar el envío directo. Mientras tanto, guarda este mensaje:\n\n' + text);
        return;
      }
      window.open(waLink(text), '_blank', 'noopener');
    });
  }
})();
