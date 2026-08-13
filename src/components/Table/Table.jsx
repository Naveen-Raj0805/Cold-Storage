import React from 'react';
import { ArrowUp, ArrowDown, Eye, Edit, Trash2 } from 'lucide-react';
import './Table.css';

const Table = ({
  headers = [],
  data = [],
  sortKey = '',
  sortOrder = 'asc',
  onSort,
  actions = []
}) => {
  const handleHeaderClick = (header) => {
    if (header.sortable && onSort) {
      onSort(header.key);
    }
  };

  const renderSortIndicator = (header) => {
    if (!header.sortable || sortKey !== header.key) return null;
    return (
      <span className="sort-indicator">
        {sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      </span>
    );
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'view':
        return <Eye size={16} />;
      case 'edit':
        return <Edit size={16} />;
      case 'delete':
        return <Trash2 size={16} />;
      default:
        return null;
    }
  };

  const getActionLabel = (type) => {
    switch (type) {
      case 'view':
        return 'View Details';
      case 'edit':
        return 'Edit Row';
      case 'delete':
        return 'Delete Row';
      default:
        return 'Action';
    }
  };

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={header.sortable ? 'sortable' : ''}
                  onClick={() => handleHeaderClick(header)}
                  style={{ width: header.width || 'auto' }}
                >
                  {header.label}
                  {renderSortIndicator(header)}
                </th>
              ))}
              {actions.length > 0 && <th style={{ width: '120px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length + (actions.length > 0 ? 1 : 0)} className="text-center" style={{ padding: '3rem' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {headers.map((header) => (
                    <td key={header.key}>
                      {header.render
                        ? header.render(row[header.key], row)
                        : row[header.key] !== undefined && row[header.key] !== null
                        ? row[header.key].toString()
                        : '-'}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td>
                      <div className="table-actions-cell">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className={`table-action-btn action-${action.type}`}
                            onClick={() => action.onClick(row)}
                            title={action.label || getActionLabel(action.type)}
                            aria-label={action.label || getActionLabel(action.type)}
                          >
                            {action.icon || getActionIcon(action.type)}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
