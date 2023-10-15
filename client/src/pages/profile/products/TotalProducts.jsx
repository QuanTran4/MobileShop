import React, { useState, useEffect, useCallback } from "react";
// import { DataGrid } from "@mui/x-data-grid";
import { productColumn } from "../../../dataGridColumn/gridColumns";
import { Link } from "react-router-dom";
import { deleteProduct, getAllProducts } from "../../../services/product";
import { Col, Pagination, Row } from "react-bootstrap";

const TotalProducts = () => {
  const [data, setData] = useState();
  const [openModal, setOpenModal] = useState();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
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
    getAllProducts({ page, perPage }).then((res) => {
      console.log(res.data)
      setData(res.data.items);
      setPageCount(res.data.pagination.pageCount);
    });
  }, [page,perPage]);
  const handleModal = (id) => {
    setOpenModal(id);
  };
  const handleDelete = (id) => {
    // deleteProduct(id);
    setData(data.filter((item) => item._id !== id));
  };
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
    <>
      <div className="d-flex justify-content-center align-items-center">
        <h3 className="mx-auto">Products</h3>
        <Link to={"new"} className="text-right">
          <h5>Add Product</h5>
        </Link>
      </div>
      {data ? (
        <>
          <div>
            <Row className="mx-auto mb-2 border-bottom">
              <Col md={1}>ProductId</Col>
              <Col md={1}>Product Name</Col>
              <Col md={1}>Category</Col>
              <Col md={1}>Price</Col>
              <Col md={1}>Product Images</Col>
              <Col md={2}>Colors</Col>
              <Col md={1}>Status</Col>
              <Col md={1}>Edit</Col>
              <Col md={1}>Delete</Col>
            </Row>
            {data.map((item) => {
              return (
                <Row className="mx-auto mb-2 border-bottom" key={item._id}>
                  <Col md={1} className="text-break border-end">
                    {item._id}
                  </Col>
                  <Col md={1} className="text-break border-end">
                    {item.name}
                  </Col>
                  <Col md={1} className="text-break border-end">
                    {item.categories}
                  </Col>
                  <Col md={1} className="text-break border-end">
                    {item.price}
                  </Col>
                  <Col md={1} className="text-break border-end">
                    {item.productImage.length !== 0 &&
                    item.productImage.length > 1 ? (
                      <>
                        <img
                          src={item.productImage[0]}
                          width={"100px"}
                          height={"100px"}
                        />
                        and {item.productImage.length - 2} images more
                      </>
                    ) : (
                      <img
                        src={item.productImage[0]}
                        width={"100px"}
                        height={"100px"}
                      />
                    )}
                  </Col>
                  <Col md={2} className="text-break border-end">
                    {item.colors.map((color, index) => {
                      return (
                        <span className="d-flex mx-auto mb-2" key={index}>
                          Color: {color.color}, inStock:{" "}
                          {color.inStock ? "true" : "false"}{" "}
                          <img
                            src={color.image}
                            width={"100px"}
                            height={"100px"}
                          />
                        </span>
                      );
                    })}
                  </Col>

                  {item.isActive ? (
                    <Col md={1} className="text-break border-end">
                      Active
                    </Col>
                  ) : (
                    <Col md={1} className="text-break border-end">
                      Inactive
                    </Col>
                  )}
                  <Col md={1} className="text-break border-end">
                    <button className="btn btn-primary btn-block">
                      <Link
                        to={`${item._id}`}
                        state={{ type: "Edit Product", product: item }}
                      >
                        Edit
                      </Link>
                    </button>
                  </Col>
                  <Col md={1}>
                    <button
                      className="btn btn-danger btn-block"
                      onClick={() => handleModal(item._id)}
                    >
                      Delete
                    </button>
                    <div className={openModal === item._id ? "" : "d-none"}>
                      <p className="mb-2">
                        Do you want to delete this Product ?
                      </p>
                      <span>
                        <button
                          className="me-2 bg-info mx-auto"
                          onClick={() => handleDelete(item._id)}
                        >
                          Yes
                        </button>
                        <button
                          className="bg-warning"
                          onClick={() => setOpenModal()}
                        >
                          No
                        </button>
                      </span>
                    </div>
                  </Col>
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
    </>
  );
};
export default TotalProducts;
