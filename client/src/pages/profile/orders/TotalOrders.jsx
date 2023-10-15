import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllOrder, getUserOrder } from "../../../services/order";
import { Link } from "react-router-dom";
import { Col, Pagination, Row } from "react-bootstrap";
const TotalOrders = () => {
  const { user } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState();
  const [perPage, setPerPage] = useState(2);
  let totalPages = [];
  for (let number = 1; number <= pageCount; number++) {
    totalPages.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={() => handlePage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  useEffect(() => {
    const getOrder = () => {
      if (user.role === "user") {
        getUserOrder(user._id, { page, perPage })
          .then((res) => {
            setData(res.data.items);
            setPageCount(res.data.pagination.pageCount);
          })
          .catch((err) => {
          });
      } else {
        getAllOrder({ page, perPage })
          .then((res) => {
            setData(res.data.items);
            setPageCount(res.data.pagination.pageCount);
          })
          .catch((err) => {
          });
      }
    };
    page && perPage && getOrder();
  }, [page, perPage]);

  const handlePrevious = () => {
    setPage((p) => {
      if (p === 1) return p;
      return p - 1;
    });
  };
  const handlePage = (number) => {
    setPage(number);
  };
  const handleNext = () => {
    setPage((p) => {
      if (p === pageCount) return p;
      return p + 1;
    });
  };

  return (
    <div className="flex-6 text-center w-100">
      <div className="d-flex justify-content-center alisgn-items-center">
        <h3 className="mx-auto">
          {user.role === "user" ? (
            <>{user.username} Orders</>
          ) : (
            <>Total Orders</>
          )}
        </h3>
      </div>
      {data ? (
        <>
          <div>
            <Row className="mx-auto mb-2 border-bottom">
              <Col md={1}>OrderId</Col>
              {user.role == "admin" && <Col md={1}>UserId</Col>}
              <Col md={3}>Product</Col>
              <Col md={1}>Amount</Col>
              <Col md={1}>Status</Col>
              <Col md={2}>Address</Col>
            </Row>
            {data.map((item) => {
              return (
                <Row className="mx-auto mb-2 border-bottom" key={item._id}>
                  <Col md={1} className="text-break">
                    {item._id}
                  </Col>
                  {user.role === "admin" && (
                    <Col md={1} className="text-break">
                      {item.userId}
                    </Col>
                  )}
                  <Col md={3} className="text-break">
                    {item.products.map((product, index) => {
                      return (
                        <span className="d-flex mx-auto mb-2" key={index}>
                          Product Name: {product.productName}, Quantity:{" "}
                          {product.quantity}
                        </span>
                      );
                    })}
                  </Col>
                  <Col md={1} className="text-break">
                    {Intl.NumberFormat("en-US").format(item.amount)} VND
                  </Col>
                  <Col md={1} className="text-break">
                    {item.status}
                  </Col>
                  <Col md={2} className="text-break">
                    <div className="d-flex mx-auto flex-column">
                      <span>City: {item.address.city}</span>
                      <span>Country:{item.address.country}</span>
                      <span>Postal Code:{item.address.postal_code}</span>
                    </div>
                  </Col>
                  {user.role === "admin" && (
                    <Col md={1}>
                      <button className="btn btn-primary btn-block">
                        <Link to={`${item._id}`} state={item}>
                          <span className="text-black">Edit</span>
                        </Link>
                      </button>
                    </Col>
                  )}
                </Row>
              );
            })}
          </div>
          <div className="container d-flex justify-content-center">
            <div className="d-flex flex-fill">
              <label htmlFor="order">Order Per Page</label>
              <select
                name="order"
                value={perPage}
                onChange={(e) => {
                  setPerPage(e.target.value);
                  setPage(1);
                }}
              >
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
            <Pagination size="sm">
              <Pagination.Prev disabled={page === 1} onClick={handlePrevious} />
              {totalPages}
              <Pagination.Next
                disabled={page === pageCount}
                onClick={handleNext}
              />
            </Pagination>
          </div>
        </>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};

export default TotalOrders;
