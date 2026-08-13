import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export const AnimatedCounter = ({ value, duration = 1.5, suffix = '', decimals = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Convert string like "1.2" or "85" to number
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      setCount(value); // Fallback to raw string if not a number
      return;
    }

    let start = 0;
    const end = numericValue;
    const totalFrames = duration * 60; // 60fps
    let frame = 0;

    const counter = () => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out expo formula for a smooth finish
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * easeOutExpo;
      
      setCount(current);

      if (frame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        setCount(end); // Ensure exact final value is reached
      }
    };

    requestAnimationFrame(counter);
  }, [isInView, value, duration]);

  const formattedCount = typeof count === 'number'
    ? count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : count;

  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {formattedCount}
      {suffix}
    </span>
  );
};
