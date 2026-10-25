// Pointer-move handler for elements with the `.spotlight` class (see index.css).
// It writes the cursor position into CSS variables, so the glow follows the mouse without React re-renders.
export const trackSpotlight = (event) => {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  element.style.setProperty('--my', `${event.clientY - rect.top}px`);
};
