import React, { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const GlowCard = ({ children, className = '', style = {}, onClick, glowColor = 'rgba(255,51,102,0.15)', as = 'div' }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: '-60px' });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      ref={cardRef}
      className={`glow-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        overflow: 'hidden',
        isolation: 'isolate',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        borderColor: isHovering ? 'var(--border-light)' : 'var(--border-subtle)',
        boxShadow: isHovering ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        ...style,
      }}
    >
      {/* Glow orb that follows mouse */}
      {isHovering && (
        <div
          style={{
            position: 'absolute',
            top: mousePos.y,
            left: mousePos.x,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 0,
            transition: 'none',
          }}
        />
      )}
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </MotionTag>
  );
};

export default GlowCard;
