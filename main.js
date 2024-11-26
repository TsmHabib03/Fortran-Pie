document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    threshold: 0.1,
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Smooth scrolling for nav links
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', event => {
      event.preventDefault();
      const targetId = anchor.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);

      window.scrollTo({
        top: targetElement.offsetTop - 50,
        behavior: 'smooth',
      });
    });
  });
});