import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleOrder, updateOrder } from "../../../services/order";
import { Card, CardBody, Col, Form, Row } from "react-bootstrap";

const EditOrder = () => {
  const { _id } = useParams();
  const [data, setData] = useState();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState();
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
    console.log(data);
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
              Order Id {data._id}
            </Col>
            <Col md={2} className="text-break border-end">
              User Id {data.userId}
            </Col>
            <Col md={3}>
              Products
              {data.products.map((product,index) => {
                return (
                  <Row key={index}>
                    <Col md={12} className="mb-2" >
                      Name {product.productName}, Color {product.color} Quantity{" "}
                      {product.quantity}
                    </Col>
                  </Row>
                );
              })}
            </Col>
            <Col md={1} className="text-break border-end">
              Total price {data.amount}
            </Col>
            <Col md={2} className="border-end">
              Shipment status
              {data.status === 'success' ? <Col className="text-success"><h3>{data.status}</h3></Col>:
              <select
                value={data.status}
                onChange={handleChange}
                className="forn-Text"
              >
                <option value="pending">Pending</option>
                <option value="On Delivery">On Delivery</option>
                <option value="success">Success</option>
              </select>
              }
            </Col>
            <Col md={2} className="text-break border-end">
              User Address
              <Row>
                <Col>City {data.address.city}</Col>
                <Col>Country {data.address.country}</Col>
                <Col>Address {data.address.line1}</Col>
              </Row>
            </Col>
          </Row>
        </div>
      )}
      <button className="btn btn-block btn-primary" onClick={handleUpdate}>
        Update Order
      </button>
      {message && (
        <>
          <p className={success ? "text-success" : "text-danger"}>{message}</p>
        </>
      )}
    </div>
  );
};

export default EditOrder;
