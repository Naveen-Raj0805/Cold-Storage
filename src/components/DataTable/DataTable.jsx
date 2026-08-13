import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DataTable.css';

const DataTable = ({ 
  columns, 
  data = [], 
  searchQuery = '', 
  searchKeys = [], 
  itemsPerPage = 5,
  emptyMessage = 'No matching records found.'
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery || searchKeys.length === 0) return data;
    
    const query = searchQuery.toLowerCase().trim();
    return data.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchKeys]);

  // Pagination calculation
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Adjust page if data length changes (e.g. searching)
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="data-table-container">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  style={{ width: col.width || 'auto', textAlign: col.align || 'left' }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="table-row">
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="table-empty-cell">
                  <div className="table-empty-text">{emptyMessage}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="table-pagination">
          <span className="pagination-info">
            Showing <span className="text-semibold">{startIndex + 1}</span> to{' '}
            <span className="text-semibold">{endIndex}</span> of{' '}
            <span className="text-semibold">{totalItems}</span> entries
          </span>
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
