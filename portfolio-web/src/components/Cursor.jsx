import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const Cursor = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Mouse position state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation configuration
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            // Offset by half width/height to center
            mouseX.set(e.clientX - 10);
            mouseY.set(e.clientY - 10);

            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => document.body.classList.add('cursor-clicked');
        const handleMouseUp = () => document.body.classList.remove('cursor-clicked');

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main Dot Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-5 h-5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
            />

            {/* Optional: Add a style tag for hover effects if needed */}
            <style jsx global>{`
        body {
          cursor: none; /* Hide default cursor if desired, or keep it */
        }
        a, button, [role="button"] {
          cursor: none;
        }
      `}</style>
        </>
    );
};

export default Cursor;
