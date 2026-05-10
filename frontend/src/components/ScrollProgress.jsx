import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setIsVisible(v > 0.02);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 9998,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <motion.div
        style={{
          height: '100%',
          background: 'var(--accent-primary)',
          boxShadow: '0 0 12px var(--accent-primary-glow)',
          scaleX: scrollYProgress,
          transformOrigin: '0%',
        }}
      />
    </motion.div>
  );
};

export default ScrollProgress;
