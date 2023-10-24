import React, { useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const PaginationComponent = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  setItemsPerPage,
  alwaysShown = true,
}) => {
  const pagesCount = Math.ceil(itemsCount / itemsPerPage);
  const isPaginationShown = alwaysShown ? true : pagesCount > 1;
  const isCurrentPageFirst = currentPage === 1;
  const isCurrentPageLast = currentPage === pagesCount;
  const changePage = (number) => {
    if (currentPage === number) return;
    setCurrentPage(number);
  };
  const changeItemsPerPage = (e) => {
    let number = parseInt(e.target.value);
    setItemsPerPage(number);
    setCurrentPage(1);
  };
  const onPageNumberClick = (pageNumber) => {
    changePage(pageNumber);
  };

  const onPreviousPageClick = () => {
    changePage((currentPage) => currentPage - 1);
  };

  const onNextPageClick = () => {
    changePage((currentPage) => currentPage + 1);
  };

  const setLastPageAsCurrent = () => {
    if (currentPage > pagesCount) {
      setCurrentPage(pagesCount);
    }
  };

  let isPageNumberOutOfRange;

  const pageNumbers = [...new Array(pagesCount)].map((_, index) => {
    const pageNumber = index + 1;
    const isPageNumberFirst = pageNumber === 1;
    const isPageNumberLast = pageNumber === pagesCount;
    const isCurrentPageWithinTwoPageNumbers =
      Math.abs(pageNumber - currentPage) <= 1;

    if (
      isPageNumberFirst ||
      isPageNumberLast ||
      isCurrentPageWithinTwoPageNumbers
    ) {
      isPageNumberOutOfRange = false;
      return (
        <Pagination.Item
          key={pageNumber}
          onClick={() => onPageNumberClick(pageNumber)}
          active={pageNumber === currentPage}
        >
          {pageNumber}
        </Pagination.Item>
      );
    }

    if (!isPageNumberOutOfRange) {
      isPageNumberOutOfRange = true;
      return <Pagination.Ellipsis key={pageNumber} className="muted" />;
    }

    return null;
  });

  useEffect(setLastPageAsCurrent, [pagesCount]);

  return (
    <>
      {isPaginationShown && (
        <Row className="d-flex">
          <Col>
            <label htmlFor="order">Order Per Page</label>
            <select
              name="order"
              value={itemsPerPage}
              onChange={changeItemsPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </Col>
          <Col>
            <Pagination>
              <Pagination.Prev
                onClick={onPreviousPageClick}
                disabled={isCurrentPageFirst}
              />
              {pageNumbers}
              <Pagination.Next
                onClick={onNextPageClick}
                disabled={isCurrentPageLast}
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
};

PaginationComponent.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  alwaysShown: PropTypes.bool,
};

export default PaginationComponent;
