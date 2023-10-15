import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getAllPublicProducts } from "../services/product";
import { Col, Row } from "react-bootstrap";
const Products = () => {
  const [data, setData] = useState();
  useEffect(() => {
    getAllPublicProducts(null)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
      });
  }, []);
  return (
    <div className="container shadow-lg">
      {data && (
        <Row>
          {data.map((product) => {
            return (
              <Col md={3}
                className=" rounded card"
                key={product._id}
              >
                <img
                  className="card-img-top p-3"
                  src={product.colors[0].image}
                  alt={product.name}
                  height={200}
                  width={200}
                />
                <div className="card-body">{product.name}</div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">
                    {Intl.NumberFormat("en-US").format(product.price)} VND
                  </li>
                </ul>
                <div className="card-body">
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-dark m-1"
                  >
                    Detail
                  </Link>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default Products;
