import React, { useState, useEffect } from 'react';

/**
 * Loader — full-screen intro animation.
 * Displays "<RS />" logo + gradient progress bar, then fades out after ~1.8s.
 */
const Loader = () => {
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Start fade-out after animation finishes (1.6s fill + 0.2s buffer)
    const fadeTimer = setTimeout(() => setHidden(true), 1800);
    // Remove from DOM after transition completes
    const unmountTimer = setTimeout(() => setMounted(false), 2700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div id="portfolio-loader" className={hidden ? 'hide' : ''}>
      <div className="loader-logo">&lt; RS /&gt;</div>
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
    </div>
  );
};

export default Loader;
