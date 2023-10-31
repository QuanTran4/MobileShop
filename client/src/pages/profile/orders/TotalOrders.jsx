import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  deleteOrder,
  getAllOrder,
  getUserOrder,
} from "../../../services/order";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import PaginationComponent from "../../../components/Pagination";
import { toast } from "react-toastify";
import Moment from "react-moment";
const TotalOrders = () => {
  const { user } = useSelector((state) => state.user);
  const [openModal, setOpenModal] = useState();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState();
  const [perPage, setPerPage] = useState(5);
  const handleModal = (id) => {
    setOpenModal(id);
  };
  const handleDelete = (id) => {
    deleteOrder(id).then((res) => {
      toast.done(res.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    });
    setData(data.filter((item) => item._id !== id));
    setOpenModal();
  };
  useEffect(() => {
    const getOrder = () => {
      if (user.role === "user") {
        getUserOrder(user._id, { page, perPage })
          .then((res) => {
            setData(res.data.items);
            setPageCount(res.data.count);
          })
          .catch((err) => {});
      } else {
        getAllOrder({ page, perPage })
          .then((res) => {
            setData(res.data.items);
            setPageCount(res.data.count);
          })
          .catch((err) => {});
      }
    };
    page && perPage && getOrder();
  }, [page, perPage]);
  console.log(data);
  return (
    <div className="flex-6 text-center w-100" style={{ height: "75vh" }}>
      <Container className="d-flex mb-2">
        {user.role === "user" ? (
          <h3 className="mx-auto">{user.username} orders</h3>
        ) : (
          <h3 className="mx-auto">Total Orders</h3>
        )}
      </Container>
      {data ? (
        <div className="h-100 overflow-auto">
          <div className="mb-4">
            <Row className="mx-auto mb-2 border-bottom">
              <Col md={1}>
                <h5>OrderId</h5>
              </Col>
              {user.role == "admin" && (
                <Col md={1}>
                  <h5>UserId</h5>
                </Col>
              )}
              <Col md={2}>
                <h5>Order Date</h5>
              </Col>
              <Col md={1}>
                <h5>Amount</h5>
              </Col>
              <Col md={1}>
                <h5>Status</h5>
              </Col>
              <Col md={2}>
                <h5>Address</h5>
              </Col>
              <Col md={1}>
                <h5>Payment method</h5>
              </Col>

              {user.role === "admin" && (
                <>
                  <Col md={1}>
                    <h5>Edit</h5>
                  </Col>
                  <Col md={2}>
                    <h5>Delete</h5>
                  </Col>
                </>
              )}
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
                  <Col md={2} className="text-break text-center">
                    {/* {item.products.map((product, index) => {
                      return (
                        <span
                          className="d-flex mx-auto mb-2 justify-content-center"
                          key={index}
                        >
                          {product.quantity}x {product.productName}, {product.color}
                        </span>
                      );
                    })} */}
                    <Moment date={item.createdAt} format="MM/DD/YYYY hh:mm:ss" />
                  </Col>
                  <Col md={1} className="text-break">
                    {Intl.NumberFormat("en-US").format(item.amount)} VND
                  </Col>
                  <Col md={1} className="text-break">
                    {item.status}
                  </Col>
                  <Col md={2} className="text-break">
                    <div className="d-flex mx-auto flex-column">
                      {/* {item.address?.city && (
                        <span>City: {item.address.city}</span>
                      )}
                      {item.address?.country && (
                        <span>Country: {item.address.country}</span>
                      )}
                      {item.address?.postal_code && (
                        <span>Postal Code: {item.address.postal_code}</span>
                      )} */}
                      {/* {item.address?.address && (
                        <> */}
                          <span>Address: {item.address?.address || item.address?.city}</span>
                          <span>Phone number: {item.address?.number || item.address.phone}</span>
                        {/* </>
                      )} */}
                    </div>
                  </Col>
                  <Col md={1}>{item.payment_method}</Col>

                  {user.role === "user" ? (
                    <Col md={1}>
                      <button className="btn btn-primary btn-block">
                        <Link to={`${item._id}`} state={item}>
                          <span className="text-white">View</span>
                        </Link>
                      </button>
                    </Col>
                  ) : (
                    <>
                      <Col md={1}>
                        <button className="btn btn-primary btn-block">
                          <Link to={`${item._id}`} state={item}>
                            <span className="text-white">Edit</span>
                          </Link>
                        </button>
                      </Col>
                      <Col md={2}>
                        <button
                          className="btn btn-danger btn-block"
                          onClick={() => handleModal(item._id)}
                        >
                          Delete
                        </button>
                        <div className={openModal === item._id ? "" : "d-none"}>
                          <p className="mb-2">
                            Do you want to delete this Order ?
                          </p>
                          <span>
                            <button
                              className="me-2 btn btn-info mx-auto"
                              onClick={() => handleDelete(item._id)}
                            >
                              Yes
                            </button>
                            <button
                              className="btn btn-warning"
                              onClick={() => setOpenModal()}
                            >
                              No
                            </button>
                          </span>
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
              );
            })}
          </div>
          <Container className="mb-5">
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
    </div>
  );
};

export default TotalOrders;
