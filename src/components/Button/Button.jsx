import { motion, useReducedMotion } from 'framer-motion';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  icon = null,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled && !shouldReduceMotion ? { scale: 1.02, y: -0.5 } : undefined}
      whileTap={!disabled && !shouldReduceMotion ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {icon && <span className="btn-icon-wrapper">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
