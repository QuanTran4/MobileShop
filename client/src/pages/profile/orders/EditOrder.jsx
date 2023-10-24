import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleOrder, updateOrder } from "../../../services/order";
import { Card, CardBody, Col, Form, Row } from "react-bootstrap";
import FormatPrice from "../../../components/FormatPrice";
import { useSelector } from "react-redux";

const EditOrder = () => {
  const { _id } = useParams();
  const [data, setData] = useState();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    getSingleOrder(_id).then((res) => {
      setData(res.data);
    });
  }, []);
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };
  const handleUpdate = () => {
    setMessage();
    updateOrder(_id, data)
      .then(() => {
        setSuccess(true);
        setMessage("Order Updated successfully");
      })
      .catch(() => {
        setSuccess(false);
        setMessage("Error when update order");
      });
  };
  return (
    <div className="flex-6 text-center w-100 h-100">
      {data && (
        <div className="container mt-5 mb-2">
          <Row className="mx-auto mb-2 border-bottom">
            <Col md={2} className="text-break border-end">
              <h5>Order Id </h5>
              {data._id}
            </Col>
            <Col md={2} className="text-break border-end">
              <h5>User Id</h5>
              {data.userId}
            </Col>
            <Col md={3}>
              <h5>Total Products</h5>
              {data.products.map((product, index) => {
                return (
                  <Row key={index}>
                    <Col md={12} className="mb-2">
                      {product.productName}, {product.color}, Quantity:{" "}
                      {product.quantity}
                    </Col>
                  </Row>
                );
              })}
            </Col>
            <Col md={1} className="text-break border-end">
              <h5>Total price</h5>

              <FormatPrice price={data.amount} />
            </Col>
            <Col md={2} className="border-end">
              <h5>Shipment status</h5>
              {user.role === 'user' ? (
                <Col className="text-success">
                  <h3>{data.status}</h3>
                </Col>
              ) : (
                <>
                  {data.status === "success" ? (
                    <Col className="text-success">
                      <h3>{data.status}</h3>
                    </Col>
                  ) : (
                    <select
                      value={data.status}
                      onChange={handleChange}
                      className="forn-Text"
                    >
                      <option value="pending">Pending</option>
                      <option value="On Delivery">On Delivery</option>
                      <option value="success">Success</option>
                    </select>
                  )}
                </>
              )}
            </Col>
            <Col md={2} className="text-break border-end">
              <h5>User Address</h5>
              <Row className="d-flex flex-column ">
                <Col>
                  <b>City</b>: {data.address.city}
                </Col>
                <Col>
                  <b>Country</b>: {data.address.country}
                </Col>
                <Col>
                  <b>Address</b>: {data.address.line1}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      )}
      {user.role === "user" ? null : (
        <button className="btn btn-block btn-primary" onClick={handleUpdate}>
          Update Order
        </button>
      )}
      {message && (
        <>
          <p className={success ? "text-success" : "text-danger"}>{message}</p>
        </>
      )}
    </div>
  );
};

export default EditOrder;
