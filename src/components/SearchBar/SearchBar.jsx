import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  return (
    <div className={`search-bar-container ${className}`}>
      <span className="search-bar-icon">
        <Search size={18} />
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-bar-input"
        aria-label={placeholder}
        {...props}
      />
    </div>
  );
};

export default SearchBar;
