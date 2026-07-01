import "./message.js";

/* ===== UTILITY ===== */
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* ===== NAVBAR ===== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const navItems  = navLinks.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ===== ACTIVE SECTION HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting)
      navItems.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { threshold: 0.3 }).observe !== undefined &&
  sections.forEach(s =>
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting)
          navItems.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { threshold: 0.3 }).observe(s)
  );

/* ===== TYPING EFFECT ===== */
const typedEl = document.getElementById('typed-text');
const phrases = ['IT Student', 'Cyber Security Analyst', 'Web Developer','Python Developer' , 'Hardware Technician', 'Network Technician'];
let pi = 0, ci = 0, del = false;

function type() {
  const cur = phrases[pi];
  typedEl.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
  let delay = del ? 50 : 90;
  if (!del && ci === cur.length)  { delay = 2000; del = true; }
  else if (del && ci === 0)       { del = false; pi = (pi + 1) % phrases.length; delay = 300; }
  setTimeout(type, delay);
}
type();

/* ===== SCROLL REVEAL ===== */
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => ro.observe(el));

/* ===== SKILLS — TABS + RING ANIMATION ===== */
const CIRCUMFERENCE = 213.6;

function animateRings(panel) {
  panel.querySelectorAll('.sk-ring').forEach(ring => {
    const pct = parseFloat(ring.getAttribute('data-pct')) || 0;
    const fill = ring.querySelector('.sk-ring-fill');
    if (fill) fill.style.strokeDashoffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
  });
}

function resetRings(panel) {
  panel.querySelectorAll('.sk-ring-fill').forEach(f => {
    f.style.strokeDashoffset = CIRCUMFERENCE;
  });
}

const skTabs   = document.querySelectorAll('.sk-tab');
const skPanels = document.querySelectorAll('.sk-panel');

skTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');
    skTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    skPanels.forEach(p => {
      if (p.getAttribute('data-panel') === target) {
        resetRings(p);
        p.classList.add('active');
        p.querySelectorAll('.reveal-up').forEach(el => {
          el.classList.remove('visible');
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
        });
        setTimeout(() => animateRings(p), 80);
      } else {
        p.classList.remove('active');
      }
    });
  });
});

const skillsEl = document.getElementById('skills');
if (skillsEl) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const active = skillsEl.querySelector('.sk-panel.active');
        if (active) animateRings(active);
      }
    });
  }, { threshold: 0.2 }).observe(skillsEl);
}

/* ===== PROJECT FILTER ===== */
const pfBtns = document.querySelectorAll('.pf-btn');
const pcards = document.querySelectorAll('.pcard');
const fadeStyle = document.createElement('style');
fadeStyle.textContent = '@keyframes cardIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(fadeStyle);

pfBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pfBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.getAttribute('data-filter');
    pcards.forEach(c => {
      if (f === 'all' || c.getAttribute('data-category') === f) {
        c.classList.remove('hidden');
        c.style.animation = 'cardIn .35s ease forwards';
      } else {
        c.classList.add('hidden');
      }
    });
  });
});

/* ===== CONTACT FORM ===== */
const form    = document.getElementById('contact-form');
const subBtn  = document.getElementById('submit-btn');
const formOk  = document.getElementById('form-success');

const showErr = (id, msg) => {
  document.getElementById(id + '-error').textContent = msg;
  document.getElementById(id).style.borderColor = 'var(--red)';
};
const clrErr = (id) => {
  document.getElementById(id + '-error').textContent = '';
  document.getElementById(id).style.borderColor = '';
};
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  const v = id => document.getElementById(id).value.trim();
  ['name','email','subject','message'].forEach(f => clrErr(f));
  if (!v('name'))                   { showErr('name',    'Please enter your name.');             ok = false; }
  if (!v('email'))                  { showErr('email',   'Please enter your email.');            ok = false; }
  else if (!validEmail(v('email'))) { showErr('email',   'Please enter a valid email address.'); ok = false; }
  if (!v('subject'))                { showErr('subject', 'Please enter a subject.');             ok = false; }
  if (!v('message'))                { showErr('message', 'Please write a message.');             ok = false; }
  if (!ok) return;

  const t = subBtn.querySelector('.btn-text');
  const l = subBtn.querySelector('.btn-loading');
  t.style.display = 'none'; l.style.display = 'flex'; subBtn.disabled = true;
  setTimeout(() => {
    t.style.display = 'flex'; l.style.display = 'none'; subBtn.disabled = false;
    formOk.style.display = 'flex'; form.reset();
    setTimeout(() => { formOk.style.display = 'none'; }, 5000);
  }, 1600);
});
['name','email','subject','message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clrErr(id));
});

/* ===== BACK TO TOP ===== */
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 400), { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== FOOTER YEAR ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== STAT COUNTERS ===== */
function countUp(el, target, suffix) {
  let start;
  const run = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / 1400, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

const heroStatCards = document.querySelector('.hero-stat-cards');
if (heroStatCards) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const data = [
          { id: 'stat-projects', n: 5,  s: '' },
          { id: 'stat-certs',    n: 3,  s: '' },
          { id: 'stat-skills',   n: 10, s: '' },
        ];
        data.forEach(({ id, n, s }) => {
          const el = document.getElementById(id);
          if (el) countUp(el, n, s);
        });
      }
    });
  }, { threshold: 0.5 }).observe(heroStatCards);
}
