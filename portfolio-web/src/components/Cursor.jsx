import React, { useEffect, useRef } from 'react';

/**
 * Cursor — dot + lagging ring cursor.
 * - Dot follows mouse instantly.
 * - Ring lerps toward mouse with a 0.18 lag factor.
 * - Ring expands when hovering interactive elements.
 * Hidden on touch/mobile via CSS.
 */
const Cursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0; // mouse
    let rx = 0, ry = 0; // ring position (lerped)
    let rafId;

    // Move dot instantly
    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    // Animate ring with lag
    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover expansion on interactive elements
    const SELECTORS = 'a, button, .btn, .glass, .tilt-card, [role="button"], label[for]';
    const addActive    = () => ring.classList.add('active');
    const removeActive = () => ring.classList.remove('active');

    const attachHover = () => {
      document.querySelectorAll(SELECTORS).forEach((el) => {
        el.addEventListener('mouseenter', addActive);
        el.addEventListener('mouseleave', removeActive);
      });
    };

    // Attach immediately + re-attach when DOM mutates (e.g. modals open)
    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};

export default Cursor;
