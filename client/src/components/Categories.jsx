import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const nav = useNavigate();
  return (
    <Card>
      <Row
        className="d-flex w-100 text-center align-items-center"
        style={{ height: 100 }}
      >
        <Col md={4}>
          <span
            onClick={() => {
              nav(`/Phone`);
            }}
            onMouseEnter={(e) => {
              e.target.style.cursor = "pointer";
            }}
          >
            <i
              className="fa fa-mobile"
              aria-hidden="true"
              style={{ fontSize: 26 }}
            ></i>
            Phone
          </span>
        </Col>
        <Col md={4}>
          <span
            onClick={() => {
              nav(`/Tablet`);
            }}
            onMouseEnter={(e) => {
              e.target.style.cursor = "pointer";
            }}
          >
            <i
              className="fa fa-tablet"
              aria-hidden="true"
              style={{ fontSize: 26 }}
            ></i>
            Tablet
          </span>
        </Col>
        <Col md={4}>
          <span
            onClick={() => {
              nav(`/Laptop`);
            }}
            onMouseEnter={(e) => {
              e.target.style.cursor = "pointer";
            }}
          >
            <i
              className="fa fa-laptop"
              aria-hidden="true"
              style={{ fontSize: 26 }}
            ></i>
            Laptop
          </span>
        </Col>
      </Row>
    </Card>
  );
};

export default Categories;
