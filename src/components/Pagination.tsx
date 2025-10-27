import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="d-flex justify-content-center mt-5 pt-3">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}>
            <span>&larr;</span> <span className="d-none d-sm-inline">Previous</span>
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item d-none d-sm-block ${currentPage === number ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}>
            <span className="d-none d-sm-inline">Next</span> <span>&rarr;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
