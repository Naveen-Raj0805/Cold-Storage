import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/agrifreeze_logo.png';
import './SplashScreen.css';

export const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 3-second splash timer
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="splash-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Frost Particles */}
          <div className="frost-particles">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="frost-particle"
                style={{
                  left: `${(i * 8.5) % 100}%`,
                  width: `${6 + (i % 5) * 3}px`,
                  height: `${6 + (i % 5) * 3}px`,
                  animationDelay: `${(i * 0.25) % 2.5}s`,
                  animationDuration: `${2.5 + (i % 3) * 0.5}s`
                }}
              />
            ))}
          </div>

          {/* Leaf Pulse Ring */}
          <div className="logo-glow-ring" />

          {/* Centered Logo Card with Leaf Animations */}
          <motion.div
            className="splash-content"
            initial={{ scale: 0.82, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 1.08, y: -20, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="splash-logo-container">
              {/* Shimmer Light Reflection over leaves */}
              <div className="leaf-shimmer" />

              {/* Exact Unaltered Logo Image */}
              <img
                src={logoImg}
                alt="AgriFreeze - Uncompromised freshness from source to scale"
                className="splash-logo-img"
              />
            </div>

            {/* 3-Second Loading Bar */}
            <div className="splash-progress-track">
              <div className="splash-progress-fill" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
