import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css';

const Dropdown = ({
  label,
  value,
  onChange,
  options = [],
  name,
  error = '',
  className = '',
  required = false,
  placeholder = 'Select option...',
  ...props
}) => {
  return (
    <div className={`dropdown-group ${className}`}>
      {label && <label className="dropdown-label">{label}</label>}
      <div className="dropdown-select-wrapper">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`dropdown-select ${error ? 'has-error' : ''}`}
          id={`dropdown-${name}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="dropdown-arrow">
          <ChevronDown size={16} />
        </span>
      </div>
      {error && <span className="dropdown-error-msg">{error}</span>}
    </div>
  );
};

export default Dropdown;
