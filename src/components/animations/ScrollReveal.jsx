import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({ 
  children, 
  duration = 0.6, 
  delay = 0, 
  y = 30, 
  x = 0, 
  scale = 1,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 1, 0.5, 1] // Smooth easeOutQuart cubic bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
