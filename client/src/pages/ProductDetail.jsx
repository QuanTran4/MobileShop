import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getProduct } from "../services/product";
import { useDispatch } from "react-redux";
import { addItem } from "../slices/CartSlice";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Col, Row } from "react-bootstrap";
import parse from "html-react-parser";

const ProductDetail = () => {
  const location = useLocation();
  const path = location.pathname.split("/");
  const [data, setData] = useState();
  const [cart, setCart] = useState();
  const [color, setColor] = useState();
  const [disabled, setDisabled] = useState(false);
  const [similarProduct, setSimilarProduct] = useState();
  const dispatch = useDispatch();
  const nav = useNavigate();
  useEffect(() => {
    getProduct(path[2]).then((res) => {
      setData(res.data.product);
      setColor(res.data.product.colors[0]);
      setCart(res.data.product);
      setSimilarProduct(res.data.similarProduct);
    });
  }, [location]);
  const handleCart = (color) => {
    setCart((prev) => ({
      ...prev,
      colors: color.color,
      colorId: color._id,
      image: color.image,
    }));
  };
  useEffect(() => {
    const getDispatch = () => {
      if (typeof cart.colors === "string") {
        dispatch(addItem(cart));
      }
    };
    cart?.colors && getDispatch();
  }, [cart]);
  return (
    <>
      <NavBar />
      <div className="container">
        {data && (
          <>
            <Row>
              <Col md={5} style={{ height: "400px" }}>
                <Swiper
                  modules={[Navigation]}
                  slidesPerView={1}
                  navigation
                  loop={true}
                >
                  <SwiperSlide>
                    {color && (
                      <img
                        src={color ? color.image : null}
                        alt="img"
                        // className="img-fluid "
                        // width={auto}
                        height={400}
                      />
                    )}
                  </SwiperSlide>

                  {data.productImage.map((product) => {
                    return (
                      <SwiperSlide>
                        <img
                          // className="img-fluid "
                          src={product}
                          alt={product}
                          // width={auto}
                          height={400}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </Col>
              <Col md={7}>
                <Row>
                  <p className="mb-2">
                    <h3>
                      <b>{data.name}</b>
                    </h3>
                  </p>
                  <p className="text-end mb-2">
                    <h5>
                      {Intl.NumberFormat("en-US").format(data.price)} VND
                    </h5>
                  </p>
                  <Row className="mb-2 d-flex">
                    <span className="me-2">Color</span>
                    {data.colors.map((item) => {
                      return (
                        <Col md={1}>
                          <button
                            className={
                              color === item ? "me-2 bg-primary" : "me-2"
                            }
                            onClick={() => {
                              setColor(item);
                              if (item.inStock !== 0) {
                                setDisabled(false);
                              } else {
                                setDisabled(true);
                              }
                            }}
                          >
                            {item.color}
                          </button>
                          <img src={item.image} width={50} height={50} />
                        </Col>
                      );
                    })}
                  </Row>

                  {disabled ? (
                    <div className="col col-md-12 mb-2">Out of Stock</div>
                  ) : (
                    <span className="col col-md-12 mb-2">
                      <button
                        disabled={disabled}
                        onClick={() => handleCart(color)}
                      >
                        Add to cart
                      </button>
                    </span>
                  )}
                </Row>
                <Row className="d-flex">
                  <p className="text-center"> Similar Product</p>
                  {similarProduct.map((items) => {
                    return (
                      <Col md={2}>
                        <img
                          src={items.colors[0].image}
                          width={100}
                          height={100}
                          onMouseEnter={(e) => {
                            e.target.style.cursor = "pointer";
                          }}
                          onClick={() => nav(`/products/${items._id}`)}
                        />
                        {items.name}
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="text-center description">{parse(`${data.desc}`)}</Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
