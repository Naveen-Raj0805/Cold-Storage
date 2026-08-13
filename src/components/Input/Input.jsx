import React, { useState } from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  value = '',
  onChange,
  name,
  error = '',
  required = false,
  className = '',
  placeholder = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const hasValue = value !== undefined && value !== null && value.toString() !== '';

  return (
    <div
      className={`input-group floating ${isFocused ? 'is-focused' : ''} ${
        hasValue ? 'has-value' : ''
      } ${className}`}
    >
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        placeholder={isFocused ? placeholder : ''}
        className={`input-field ${error ? 'has-error' : ''}`}
        id={`input-${name}`}
        {...props}
      />
      {label && (
        <label htmlFor={`input-${name}`} className="input-label">
          {label} {required && '*'}
        </label>
      )}
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
