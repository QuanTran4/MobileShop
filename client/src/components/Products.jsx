import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getAllPublicProducts } from "../services/product";
import { Card, CardBody, Col, Row } from "react-bootstrap";
// import parse from "html-react-parser";
import FormatPrice from "../Helper/FormatPrice";
const Products = ({ content, title }) => {
  const [data, setData] = useState();
  useEffect(() => {
    setData(content);
  }, [content]);
  return (
    <>
      {data && (
        <Row className="ms-2 mx-auto mb-4 w-100">
          {title && (
            <Col md={12}>
              <span className="d-flex">
                <h3>{title}</h3>
                <Link to={`/${data[0].categories}`} className="ms-auto">
                  Watch more
                </Link>
              </span>
            </Col>
          )}
          {data.map((product) => {
            return (
              <Col
                lg={3}
                md={5}
                key={product._id}
                className="mb-2 text-center"
                width={"100%"}
                style={{ position: "inherit" }}
              >
                  <img
                    src={product.colors[0].image}
                    alt="Image"
                    height={250}
                    width={"100%"}
                    // style={{ position: "inherit" }}
                    // onMouseEnter={(e) => {
                    //   e.target.style.cursor = "pointer";
                    //   e.target.style.scale = '1.2'
                    // }}
                    // onMouseOut={(e) =>{
                    //   e.target.style.scale = '1'
                    // }}
                    className="mb-2"
                  />
                  <span>
                    <h5>{product.name}</h5>
                    <p>
                      <FormatPrice price={product.price} />
                    </p>
                    {/* {product?.desc && (
                      <>
                        <p className="text-break">
                          {parse(
                            `${product.desc}`.slice(
                              0,
                              product.desc.indexOf("</h")
                            )
                          )}
                        </p>
                      </>
                    )} */}
                    <Link
                      to={`/${product.categories}/${product._id}`}
                      className="btn btn-secondary"
                    >
                      Detail
                    </Link>
                  </span>
              </Col>
            );
          })}
        </Row>
      )}
    </>
  );
};

export default Products;
