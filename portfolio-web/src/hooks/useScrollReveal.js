import { useEffect } from 'react';

const useScrollReveal = (selector = '.reveal', threshold = 0.1) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold });

    const elements = document.querySelectorAll(selector);
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [selector, threshold]);
};

export default useScrollReveal;
