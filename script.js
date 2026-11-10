// Smooth scroll offset handled via CSS scroll-padding-top; close mobile menu on link click
document.addEventListener('DOMContentLoaded', () => {

  /* Header scroll state */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile nav */
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('nav ul');
  const backdrop = document.querySelector('.nav-backdrop');

  function closeMenu() {
    hamburger?.classList.remove('open');
    navUl?.classList.remove('show');
    backdrop?.classList.remove('show');
  }

  function toggleMenu() {
    const open = navUl?.classList.toggle('show');
    hamburger?.classList.toggle('open', !!open);
    backdrop?.classList.toggle('show', !!open);
  }

  hamburger?.addEventListener('click', toggleMenu);
  backdrop?.addEventListener('click', closeMenu);
  navUl?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* Hero image slideshow */
  (function () {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slideshow-dots');
    if (!slides.length || !dotsContainer) return;

    let current = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); restart(); });
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      slides[current].classList.remove('active');
      dotsContainer.children[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dotsContainer.children[current].classList.add('active');
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(() => goTo((current + 1) % slides.length), 5500);
    }

    restart();
  })();

  /* Scroll-reveal animations */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* Back to top */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
