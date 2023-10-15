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
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="container shadow-lg">
      {data && (
        <Row>
          {/* <Swiper
            //   spaceBetween={50}
            modules={[Navigation]}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            navigation
            loop={true}
            breakpoints={{
              480: {
                slidesPerView: "1",
              },
              768: {
                slidesPerView: "2",
              },
              960: {
                slidesPerView: "3",
              },
              1180: {
                slidesPerView: "4",
              },
            }}
          >
            {data.map((product) => {
              return (
                <SwiperSlide>
                  <div
                    className=" m-2 p-3 rounded card text-center"
                    key={product._id}
                    //   style={{width: '18rem',height:'20rem'}}
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
                        //   to={"product/" + product.name}
                        to={`/products/${product._id}`}
                        className="btn btn-dark m-1"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper> */}
          {data.map((product) => {
            return (
              <Col md={3}
                className=" rounded card"
                key={product._id}
                //   style={{width: '18rem',height:'20rem'}}
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
                    //   to={"product/" + product.name}
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
