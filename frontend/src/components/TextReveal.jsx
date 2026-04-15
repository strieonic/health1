import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const TextReveal = ({ children, className = '', delay = 0, once = true, as = 'div' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Split text into words
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');
  
  if (!text) {
    // If children is not a string, use simple fade
    const MotionTag = motion[as] || motion.div;
    return (
      <MotionTag
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          visible: { 
            opacity: 1, y: 0,
            transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }
          }
        }}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        visible: {
          transition: { staggerChildren: 0.035, delayChildren: delay }
        },
        hidden: {}
      }}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{
              hidden: { 
                y: '110%',
                rotateX: -80,
                opacity: 0
              },
              visible: { 
                y: 0,
                rotateX: 0,
                opacity: 1,
                transition: {
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1]
                }
              }
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
