import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="pagination-container">
        <span className="pagination-info">
          Showing {startItem} to {totalItems} of {totalItems} entries
        </span>
      </div>
    );
  }

  return (
    <div className="pagination-container">
      <span className="pagination-info">
        Showing {startItem} to {endItem} of {totalItems} entries
      </span>
      <div className="pagination-controls" role="navigation" aria-label="Pagination Navigation">
        <button
          className="pagination-btn arrow-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
            aria-label={`Go to page ${pageNum}`}
            aria-current={currentPage === pageNum ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}

        <button
          className="pagination-btn arrow-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
