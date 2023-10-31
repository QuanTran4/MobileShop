import React, {  useEffect,   useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProduct } from "../services/product";
import { useDispatch } from "react-redux";
import { addItem } from "../slices/CartSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Col, Container, Row } from "react-bootstrap";
import parse from "html-react-parser";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const location = useLocation();
  const path = location.pathname.split("/");
  const [data, setData] = useState();
  const [cart, setCart] = useState();
  const [color, setColor] = useState();
  const [disabled, setDisabled] = useState(false);
  const [similarProduct, setSimilarProduct] = useState();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getProduct(path[2]).then((res) => {
      console.log(res.data);
      setData(res.data.product);
      const { colors } = res.data.product;
      colors.map((color) => {
        if (color.inStock !== 0) {
          return setColor(color);
        }
      });
      setCart(res.data.product);
      setSimilarProduct(res.data.similarProduct);
      setOpen(false);
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
        toast.success("Item added to cart", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    };
    cart?.colors && getDispatch();
  }, [cart]);

  return (
      <Container>
        {data && (
          <>
            <Row>
              <Col md={6} className="text-center">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  slidesPerView={1}
                  navigation
                  loop={true}
                  autoplay
                >
                  <SwiperSlide>
                    {color && (
                      <img
                        src={color ? color.image : null}
                        alt="img"
                        height={300}
                        width={"80%"}
                      />
                    )}
                  </SwiperSlide>

                  {data.productImage.map((product, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <img src={product} alt={product} height={300} />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </Col>
              <Col md={6}>
                <Row>
                  <h3 className="mb-2">
                    <b>{data.name}</b>
                  </h3>
                  <h5 className="text-end mb-2">
                    {Intl.NumberFormat("en-US").format(data.price)} VND
                  </h5>
                  <Row className="mb-2 d-flex">
                    <span className="me-2">Color</span>
                    {data.colors.map((item, index) => {
                      return (
                        <Col md={1} key={index} className="me-1">
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
                      <button onClick={() => handleCart(color)}>
                        Add to cart
                      </button>
                    </span>
                  )}
                </Row>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col
                md={8}
                className="description"
                style={
                  !open
                    ? {
                        height: 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }
                    : {}
                }
              >
                {data?.desc ? (
                  <div>
                    <h2 className="text-center">Description</h2>
                    {parse(`${data.desc}`)}
                  </div>
                ) : (
                  <>NO DESCRIPTION</>
                )}

                {!open && (
                  <div
                    className="sticky-bottom text-center"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <button>More</button>
                  </div>
                )}
              </Col>
              <Col md={4}>
                <Row className="d-flex mb-5">
                  <h4 className="text-center"> Similar Product</h4>
                  {similarProduct.map((items) => {
                    return (
                      <Col
                        md={6}
                        className="d-flex flex-column mb-2"
                        key={items._id}
                        onMouseEnter={(e) => {
                          e.target.style.cursor = "pointer";
                        }}
                      >
                        <Link
                          to={`/${items.categories}/${items._id}`}
                          className="text-decoration-none"
                        >
                          <img
                            src={items.colors[0].image}
                            className="img-fluid"
                          />
                          <span className="text-break text-dark">
                            {items.name}
                          </span>
                        </Link>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          </>
        )}
      </Container>
  );
};

export default ProductDetail;
