import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Card, CardBody, Col, Container } from "react-bootstrap";
import { getProductByCategory } from "../services/product";
import Products from "../components/Products";

const SCate = () => {
  const { category } = useParams();
  const [data, setData] = useState();
  const [filter, setFilter] = useState();
  useEffect(() => {
    getProductByCategory(category).then((res) => {
      console.log(res.data);
      setData(res.data);
      setFilter(res.data);
    });
  }, []);

  const compare = (a, b, ascendingOrder) => {
    if (a < b) {
      return ascendingOrder ? -1 : 1;
    }
    if (a > b) {
      return ascendingOrder ? 1 : -1;
    }
    return 0;
  };

  const handleChange = (value) => {
    if (value == "none") {
      setFilter([...data]);
    } else {
      let toAscending;
      switch (value) {
        case "high":
          toAscending = true;
          break;
        case "low":
          toAscending = false;
          break;
      }
      let current = [...data];
      current.sort((a, b) => compare(a.price, b.price, toAscending));
      setFilter([...current]);
    }
  };

  return (
    <>
      <NavBar />
      <Container className="d-flex">
        <div>
          <p>Price</p>
          <select onChange={(e) => handleChange(e.target.value)}>
            <option value="none">Default</option>
            <option value="high">Low to high</option>
            <option value="low">High to low</option>
          </select>
        </div>
        <Products content={filter} />
      </Container>
    </>
  );
};

export default SCate;
