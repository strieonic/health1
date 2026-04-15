import React, { useRef, useEffect, useState } from 'react';

const MorphingShape = ({ className = '' }) => {
  const svgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate organic blob path based on time + mouse
  const generatePath = (offset, scale, mouseInfluence) => {
    const points = 8;
    const angleStep = (Math.PI * 2) / points;
    const cx = 250 + (mousePos.x - 0.5) * mouseInfluence;
    const cy = 250 + (mousePos.y - 0.5) * mouseInfluence;

    let path = '';
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep + offset;
      const radius = scale + Math.sin(angle * 3 + offset * 2) * 30 + Math.cos(angle * 2) * 20;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      path += (i === 0 ? 'M' : 'L') + ` ${x} ${y} `;
    }
    return path + 'Z';
  };

  return (
    <div className={`morphing-shape ${className}`} style={{ 
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      <svg 
        ref={svgRef}
        viewBox="0 0 500 500"
        style={{ 
          width: '100%', height: '100%',
          filter: 'blur(60px)',
          opacity: 0.5,
        }}
      >
        <defs>
          <linearGradient id="morphGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3366" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF6B8A" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="morphGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4DE8C8" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="morphGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFB347" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF3366" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Layer 1 — Primary accent blob */}
        <path fill="url(#morphGrad1)">
          <animate 
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values={`
              ${generatePath(0, 150, 30)};
              ${generatePath(1, 160, 30)};
              ${generatePath(2, 145, 30)};
              ${generatePath(0, 150, 30)}
            `}
          />
        </path>

        {/* Layer 2 — Teal accent blob */}
        <path fill="url(#morphGrad2)">
          <animate 
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values={`
              ${generatePath(1.5, 120, 20)};
              ${generatePath(2.5, 130, 20)};
              ${generatePath(0.5, 115, 20)};
              ${generatePath(1.5, 120, 20)}
            `}
          />
        </path>

        {/* Layer 3 — Warm accent blob */}
        <path fill="url(#morphGrad3)">
          <animate 
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values={`
              ${generatePath(3, 100, 15)};
              ${generatePath(4, 110, 15)};
              ${generatePath(2, 95, 15)};
              ${generatePath(3, 100, 15)}
            `}
          />
        </path>
      </svg>

      {/* Aurora mesh gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at ${30 + mousePos.x * 40}% ${20 + mousePos.y * 30}%, rgba(255,51,102,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at ${60 + mousePos.x * 20}% ${70 + mousePos.y * 20}%, rgba(0,212,170,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(255,179,71,0.04) 0%, transparent 40%)
        `,
        transition: 'background 0.5s ease',
      }} />
    </div>
  );
};

export default MorphingShape;
