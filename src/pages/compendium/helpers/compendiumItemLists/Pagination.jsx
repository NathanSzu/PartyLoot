import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

export default function Pagination({ nextPage, prevPage, onPageChange }) {
  return (
    <nav aria-label="Page navigation">
      <ButtonGroup className="justify-content-end w-100">
        {/* Previous Page Button */}
        <Button
          variant="light"
          onClick={() => onPageChange('prevPage', prevPage)}
          disabled={!prevPage}
          aria-label="Previous"
        >
          &laquo; Previous
        </Button>

        {/* Next Page Button */}
        <Button
          variant="light"
          onClick={() => onPageChange('nextPage', nextPage)}
          disabled={!nextPage}
          aria-label="Next"
        >
          Next &raquo;
        </Button>
      </ButtonGroup>
    </nav>
  );
}