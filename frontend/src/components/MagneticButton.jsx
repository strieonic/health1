import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = '', onClick, style, strength = 0.2, as = 'button', href, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  const handleMouse = useCallback((e) => {
    if (!ref.current) return;
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  }, [strength]);

  const reset = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const MotionTag = as === 'a' ? motion.a : motion.button;

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      animate={{ 
        x: position.x, 
        y: position.y,
        scale: isPressed ? 0.96 : 1,
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
      href={href}
      style={{ ...style }}
      {...props}
    >
      {children}
    </MotionTag>
  );
};

export default MagneticButton;
