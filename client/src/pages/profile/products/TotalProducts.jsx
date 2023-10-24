import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getAllProducts } from "../../../services/product";
import { Col, Container, Pagination, Row } from "react-bootstrap";
import PaginationComponent from "../../../components/Pagination";
import { toast } from "react-toastify";

const TotalProducts = () => {
  const [data, setData] = useState();
  const [openModal, setOpenModal] = useState();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [perPage, setPerPage] = useState(5);
  useEffect(() => {
    getAllProducts({ page, perPage }).then((res) => {
      setData(res.data.items);
      setPageCount(res.data.count);
    });
  }, [page, perPage]);
  const handleModal = (id) => {
    setOpenModal(id);
  };
  const handleDelete = (id) => {
    deleteProduct(id).then((res) => {
      toast.done(res.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    });
    setData(data.filter((item) => item._id !== id));
  };
  return (
    <>
      <Container className="d-flex mb-4">
        <h3 className="mx-auto">Products</h3>
        <Link to={"new"} className="text-right">
          <h5>Add Product</h5>
        </Link>
      </Container>
      {data ? (
        <div className="h-100 overflow-auto">
          <div className="mb-4">
            <Row className="mx-auto mb-2 border-bottom">
              <Col md={1}>
                <h5>Id</h5>
              </Col>
              <Col md={1}>
                <h5>Name</h5>
              </Col>
              <Col md={1}>
                <h5>Category</h5>
              </Col>
              <Col md={1}>
                <h5>Price</h5>
              </Col>
              {/* <Col md={1}>Product Images</Col> */}
              <Col md={2}>
                <h5>Colors</h5>
              </Col>
              <Col md={1}>
                <h5>Status</h5>
              </Col>
              <Col md={1}>
                <h5>Edit</h5>
              </Col>
              <Col md={1}>
                <h5>Delete</h5>
              </Col>
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
                  <Col md={2} className="text-break border-end">
                    {item.colors.map((color, index) => {
                      return (
                        <span className="d-flex mx-auto mb-2" key={index}>
                          Color: {color.color}, inStock:{" "}
                          {color.inStock ? "true" : "false"}
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
                        className="text-decoration-none text-white"
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
          <Container>
            <PaginationComponent
              itemsCount={pageCount}
              itemsPerPage={perPage}
              currentPage={page}
              setCurrentPage={setPage}
              setItemsPerPage={setPerPage}
              alwaysShown={false}
            />
          </Container>
        </div>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};
export default TotalProducts;
