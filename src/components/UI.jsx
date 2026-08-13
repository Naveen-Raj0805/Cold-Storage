import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertCircle, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Skeleton from '@mui/material/Skeleton';

// Count-up Hook for numerical statistics
const useCountUp = (targetValue, duration = 1000) => {
  const [count, setCount] = useState('');
  const isAnimatedRef = useRef(false);

  useEffect(() => {
    if (isAnimatedRef.current) {
      setCount(targetValue);
      return;
    }

    const numStr = String(targetValue).replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    
    if (isNaN(num)) {
      setCount(targetValue);
      return;
    }

    const nonNumPart = String(targetValue).replace(/[0-9.,]/g, '').trim();
    const prefix = String(targetValue).startsWith('$') ? '$' : '';
    const suffix = targetValue.toString().includes('%') ? '%' : (nonNumPart ? ' ' + nonNumPart : '');
    const hasComma = targetValue.toString().includes(',');

    let start = 0;
    const end = num;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easePercentage = percentage * (2 - percentage);
      const currentVal = start + (end - start) * easePercentage;
      
      let formattedVal = currentVal;
      if (numStr.includes('.')) {
        const decimals = numStr.split('.')[1].length;
        formattedVal = currentVal.toFixed(decimals);
      } else {
        formattedVal = Math.floor(currentVal);
      }

      if (hasComma) {
        formattedVal = formattedVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

      setCount(`${prefix}${formattedVal}${suffix}`);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
        isAnimatedRef.current = true;
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return count;
};

// Stat Card Component
export const StatCard = ({ icon: Icon, title, value, desc, trend, statusColor, index = 0 }) => {
  const animatedValue = useCountUp(value);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: shouldReduceMotion ? 0 : index * 0.08 
      }}
      whileHover={shouldReduceMotion ? { boxShadow: "var(--shadow-card)" } : { y: -4, boxShadow: "var(--shadow-card)" }}
    >
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon" style={{ 
            backgroundColor: statusColor ? `var(--status-${statusColor}-bg)` : 'var(--primary-light)',
            color: statusColor ? `var(--status-${statusColor})` : 'var(--primary-color)'
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-card-value">{animatedValue}</div>
      <div className="stat-card-footer">
        {trend && (
          <span className="stat-trend" style={{ 
            color: trend.isPositive ? 'var(--status-success)' : 'var(--status-danger)' 
          }}>
            {trend.value}
          </span>
        )}
        <span className="stat-desc">{desc}</span>
        {statusColor && !trend && (
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: `var(--status-${statusColor})`,
            marginLeft: 'auto'
          }} />
        )}
      </div>
    </motion.div>
  );
};

// Form Input (Floating Label)
export const FormInput = ({ label, id, name, type = 'text', value, onChange, required = false, placeholder = ' ', error }) => {
  const isPasswordType = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);

  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  const isFloating = (value !== undefined && value !== null && String(value).trim() !== '') || (placeholder && placeholder.trim() !== '');

  return (
    <div className="form-group">
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type={inputType}
          id={id}
          name={name}
          className="form-input"
          placeholder={placeholder || ' '}
          value={value}
          onChange={onChange}
          required={required}
          style={{ paddingRight: isPasswordType ? '2.5rem' : undefined }}
        />
        <label htmlFor={id} className={`form-label ${isFloating ? 'is-floating' : ''}`}>{label}</label>
        
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            onMouseEnter={() => setIsToggleHovered(true)}
            onMouseLeave={() => setIsToggleHovered(false)}
            style={{
              position: 'absolute',
              right: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: '0.25rem',
              cursor: 'pointer',
              color: isToggleHovered ? '#10b981' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'color var(--transition-fast)'
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.span
            className="form-validation-msg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

// Form Select (Floating Label)
export const FormSelect = ({ label, id, name, value, onChange, required = false, options = [], error }) => {
  return (
    <div className="form-group">
      <select
        id={id}
        name={name}
        className="form-select"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled hidden></option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label htmlFor={id} className="form-label">{label}</label>
      {error && <span className="form-validation-msg">{error}</span>}
    </div>
  );
};

// Form Textarea (Floating Label)
export const FormTextarea = ({ label, id, name, value, onChange, required = false, placeholder = ' ', rows = 3, error }) => {
  return (
    <div className="form-group">
      <textarea
        id={id}
        name={name}
        rows={rows}
        className="form-textarea"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <label htmlFor={id} className="form-label">{label}</label>
      {error && <span className="form-validation-msg">{error}</span>}
    </div>
  );
};

// Beautiful Empty State UI
export const EmptyState = ({ 
  title = 'No results found', 
  desc = 'Try adjusting your search criteria or add new entries.', 
  icon: Icon = AlertCircle,
  actionLabel,
  onAction
}) => {
  return (
    <div className="empty-state" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="empty-state-icon" style={{ marginBottom: '1rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={48} />
      </div>
      <div className="empty-state-title" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{title}</div>
      <div className="empty-state-desc" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.25rem' }}>{desc}</div>
      {actionLabel && onAction && (
        <button 
          className="btn btn-primary" 
          onClick={onAction}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Skeleton Loader Animation using Material UI Skeleton components
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="stats-grid">
        {items.map((_, i) => (
          <div key={i} className="stat-card" style={{ cursor: 'default', pointerEvents: 'none', border: '1px solid var(--border-color)' }}>
            <div className="stat-card-header">
              <Skeleton variant="text" width={100} height={20} animation="wave" />
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
            </div>
            <Skeleton variant="text" width={120} height={42} animation="wave" style={{ margin: '0.25rem 0' }} />
            <div className="stat-card-footer">
              <Skeleton variant="text" width={140} height={16} animation="wave" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div style={{ width: '100%' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <th key={idx}>
                     <Skeleton variant="text" width={80} height={20} animation="wave" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((_, rIdx) => (
                <tr key={rIdx}>
                  {Array.from({ length: 4 }).map((_, cIdx) => (
                    <td key={cIdx}>
                      <Skeleton variant="text" width="80%" height={20} animation="wave" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="chart-card" style={{ height: '390px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="chart-card-header">
          <Skeleton variant="text" width={180} height={24} animation="wave" />
        </div>
        <Skeleton variant="rectangular" width="100%" height="100%" style={{ borderRadius: 'var(--radius-md)' }} animation="wave" />
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="card-section" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
        <Skeleton variant="circular" width={80} height={80} animation="wave" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton variant="text" width="40%" height={28} animation="wave" />
          <Skeleton variant="text" width="60%" height={20} animation="wave" />
          <Skeleton variant="text" width="30%" height={16} animation="wave" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        {items.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Skeleton variant="circular" width={24} height={24} animation="wave" />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={20} animation="wave" />
              <Skeleton variant="text" width="40%" height={14} animation="wave" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      {items.map((_, i) => (
        <Skeleton key={i} variant="text" width="100%" height={20} animation="wave" />
      ))}
    </div>
  );
};

// Custom Data Table with Search, Filter, Sort, Pagination
export const DataTable = ({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchField = 'name',
  onView,
  onEdit,
  onDelete,
  initialSortField = '',
  initialSortDirection = 'asc',
  filterKey = '',
  filterValue = '',
  pageSize = 5,
  emptyTitle,
  emptyDesc,
  emptyIcon,
  emptyActionLabel,
  onEmptyAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  const shouldReduceMotion = useReducedMotion();

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter + Search + Sort Logic
  const processedData = useMemo(() => {
    let result = [...data];

    // Status Filter (external filter)
    if (filterKey && filterValue && filterValue !== 'All') {
      result = result.filter(item => {
        const itemVal = item[filterKey];
        return String(itemVal).toLowerCase() === String(filterValue).toLowerCase();
      });
    }

    // Search Box Filter (internal filter)
    if (searchQuery.trim() !== '') {
      result = result.filter(item => {
        // Search across all string fields, or specific field
        return Object.keys(item).some(key => {
          return String(item[key]).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        if (typeof aVal === 'string') {
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        } else {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
      });
    }

    return result;
  }, [data, searchQuery, sortField, sortDirection, filterKey, filterValue]);

  // Pagination Logic
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Adjust current page if processed data reduces
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [processedData.length, totalPages, currentPage]);

  const startIdx = processedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, processedData.length);

  return (
    <div>
      <div className="table-toolbar">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
          <Search className="search-icon" size={16} />
        </div>
      </div>

      <div className="table-container">
        {paginatedData.length === 0 ? (
          data.length === 0 ? (
            <EmptyState 
              title={emptyTitle || 'No records found'} 
              desc={emptyDesc || 'There are no items to display at this moment.'} 
              icon={emptyIcon}
              actionLabel={emptyActionLabel}
              onAction={onEmptyAction}
            />
          ) : (
            <EmptyState 
              title="No matching results found" 
              desc="Try adjusting your search criteria or filters." 
              icon={Search} 
            />
          )
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    className={col.sortable ? 'sortable' : ''}
                    onClick={() => col.sortable && handleSort(col.accessor)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {col.header}
                      {col.sortable && sortField === col.accessor && (
                        <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
                {(onView || onEdit || onDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rIdx) => (
                <motion.tr 
                  key={row.id || rIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: shouldReduceMotion ? 0 : rIdx * 0.02 }}
                  whileHover={{ backgroundColor: "var(--border-light)" }}
                  style={{ transition: "background-color 0.15s ease-out" }}
                >
                  {columns.map((col) => {
                    const value = row[col.accessor];
                    return (
                      <td key={col.accessor}>
                        {col.cell ? col.cell(row) : value}
                      </td>
                    );
                  })}
                  {(onView || onEdit || onDelete) && (
                    <td>
                      <div className="table-actions">
                        {onView && (
                          <motion.button 
                            className="btn-icon-sm view-btn" 
                            onClick={() => onView(row)} 
                            title="View Detail"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye size={14} />
                          </motion.button>
                        )}
                        {onEdit && (
                          <motion.button 
                            className="btn-icon-sm edit-btn" 
                            onClick={() => onEdit(row)} 
                            title="Edit"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit2 size={14} />
                          </motion.button>
                        )}
                        {onDelete && (
                          <motion.button 
                            className="btn-icon-sm delete-btn" 
                            onClick={() => onDelete(row)} 
                            title="Delete"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {processedData.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {startIdx} to {endIdx} of {processedData.length} entries
          </div>
          {totalPages > 1 && (
            <div className="pagination-actions">
              <button
                className="btn-pagination"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} style={{ verticalAlign: 'middle' }} /> Previous
              </button>
              <button
                className="btn-pagination"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, footerButtons }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div 
            className="modal-content"
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.92, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.92, y: 15, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">{title}</h3>
              <motion.button 
                className="modal-close-btn" 
                onClick={onClose}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
              >
                ×
              </motion.button>
            </div>
            <div className="modal-body">{children}</div>
            {footerButtons && <div className="modal-footer">{footerButtons}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Avatar Component (Handles initials or Image URL)
export const Avatar = ({ src, name }) => {
  const isUrl = typeof src === 'string' && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:') || src.includes('.'));
  if (isUrl) {
    return (
      <img 
        src={src} 
        alt={name || 'User Avatar'} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: 'inherit', 
          objectFit: 'cover',
          display: 'block'
        }} 
      />
    );
  }
  return <>{src || (name ? name[0] : 'U')}</>;
};
