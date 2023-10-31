import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { getProductByCategory } from "../services/product";
import Products from "../components/Products";

const SCate = () => {
  const { category } = useParams();
  const [data, setData] = useState();
  const [filter, setFilter] = useState();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getProductByCategory(category).then((res) => {
      setData(res.data);
      setFilter(res.data);
    });
  }, []);
  const handleChange = (value) => {
    if (value == "none") {
      setFilter([...data]);
    }
    let current = [...filter];
    if (value == "high") {
      current.sort((a, b) => a.price - b.price);
    }
    if (value == "low") {
      current.sort((a, b) => b.price - a.price);
    }
    setFilter([...current]);
  };
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <Container className="d-flex p-0 mb-4">
        <Col md={1}>
          <div className="mx-auto mb-2 sticky-top">
            <span className="d-flex flex-column">
              <h4>Price</h4>
              <label>
                Highest
                <input
                  type="radio"
                  name="price"
                  value="high"
                  onChange={(e) => handleChange(e.target.value)}
                />
              </label>
              <label>
                Lowest
                <input
                  type="radio"
                  name="price"
                  value="low"
                  onChange={(e) => handleChange(e.target.value)}
                />
              </label>
            </span>
          </div>
        </Col>
        <Col
          md={11}
        >
          {filter ? <Products content={filter} open={'open'} /> : <>Loading...</>}
        </Col>
      </Container>
    </>
  );
};

export default SCate;
