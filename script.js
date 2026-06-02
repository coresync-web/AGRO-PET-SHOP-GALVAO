// =========================================
// Header scroll effect
// =========================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// =========================================
// Mobile menu
// =========================================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on nav link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!header.contains(e.target) && nav.classList.contains('open')) {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// =========================================
// Scroll animations (Intersection Observer)
// =========================================
const animateEls = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll:not(.visible)');
      let delay = 0;

      siblings.forEach((sib, idx) => {
        if (sib === entry.target || sib.getBoundingClientRect().top <= window.innerHeight) {
          setTimeout(() => sib.classList.add('visible'), delay);
          delay += 80;
        }
      });

      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

animateEls.forEach(el => observer.observe(el));

// =========================================
// Product catalog filter
// =========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.produto-card');
const catalogoEmpty = document.getElementById('catalogoEmpty');
const produtosGrid = document.getElementById('produtosGrid');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    let visible = 0;

    productCards.forEach(card => {
      const categories = card.dataset.categories || '';
      const match = filter === 'all' || categories.split(' ').includes(filter);

      if (match) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'cardAppear 0.4s ease both';
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });

    catalogoEmpty.style.display = visible === 0 ? 'block' : 'none';
  });
});

// =========================================
// Card appear keyframe (injected)
// =========================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(styleSheet);

// =========================================
// Active nav link highlight on scroll
// =========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  threshold: 0.4,
  rootMargin: `-${72}px 0px 0px 0px`
});

sections.forEach(section => sectionObserver.observe(section));

// =========================================
// Stagger animation for grid children
// =========================================
function staggerChildren(parentSelector, childSelector, delayStep = 80) {
  const parents = document.querySelectorAll(parentSelector);
  parents.forEach(parent => {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * delayStep}ms`;
    });
  });
}

staggerChildren('.servicos__grid', '.servico-card');
staggerChildren('.diferenciais__grid', '.diferencial-card');
staggerChildren('.unidades__grid', '.unidade-card');

// =========================================
// Smooth scroll offset for fixed header
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
