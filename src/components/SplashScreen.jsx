import React from 'react';
import { motion } from 'framer-motion';

export const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        backgroundImage: 'radial-gradient(circle at 50% 40%, #ecfdf5 0%, #ffffff 85%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        overflow: 'hidden'
      }}
    >
      {/* Outer Layer 1: Ambient Pulsing Mint Light Halo */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.7) 0%, rgba(209, 250, 229, 0.35) 50%, transparent 75%)',
          pointerEvents: 'none'
        }}
      />

      {/* Outer Layer 2: Rotating High-Tech Emerald Orbit Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '2px dashed rgba(52, 211, 153, 0.45)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          zIndex: 10
        }}
      >
        {/* Ultra-Attractive Rounded Emblem with Floating Hover Animation */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.08, rotate: 1.5 }}
          style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            padding: '6px',
            background: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 50%, #10b981 100%)',
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.28), 0 0 50px rgba(167, 243, 208, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {/* Inner Circular Card Container */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.05)'
          }}>
            <img
              src="/agrifreeze-3d-logo.jpg"
              alt="AgriFreeze Brand Emblem"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          </div>

          {/* Shimmer Accent Badge Ring */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              border: '2px solid rgba(52, 211, 153, 0.6)',
              pointerEvents: 'none'
            }}
          />
        </motion.div>

        {/* Brand Tagline & Typography */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.6rem', 
            fontWeight: 800, 
            margin: 0, 
            letterSpacing: '-0.025em',
            fontFamily: 'var(--font-heading, sans-serif)',
            color: '#0f172a'
          }}>
            Agri<span style={{ color: '#10b981' }}>Freeze</span>
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            marginTop: '0.5rem'
          }}>
            <div style={{ width: '36px', height: '2px', backgroundColor: '#34d399' }} />
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#047857', 
              margin: 0,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: 'var(--font-heading, sans-serif)'
            }}>
              PRESERVE TODAY, FEED TOMORROW
            </p>
            <div style={{ width: '36px', height: '2px', backgroundColor: '#34d399' }} />
          </div>
        </div>

        {/* High-Tech Glowing Mild Green Progress Loading Bar */}
        <div style={{
          width: '220px',
          height: '4px',
          backgroundColor: '#e2e8f0',
          borderRadius: '99px',
          overflow: 'hidden',
          marginTop: '0.25rem'
        }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: 'linear' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #a7f3d0 0%, #34d399 50%, #10b981 100%)',
              borderRadius: '99px',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)'
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
