import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addItem,
  removeItem,
  deleteItem,
  getTotals,
  clearCart,
} from "../slices/CartSlice";
import FormatPrice from "../components/FormatPrice";
import {
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardTitle,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { createPaymentIntent } from "../services/payment";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();
  const EmptyCart = () => {
    return (
      <Container className="container">
        <Row>
          <Col md={12} className="py-5 bg-light text-center">
            <h4 className="p-3 display-5">Your Cart is Empty</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </Col>
        </Row>
      </Container>
    );
  };

  const ShowCart = () => {
    const [checkOut, setCheckOut] = useState(false);
    const [payment, setPayment] = useState(false);
    const [data, setData] = useState({});
    const increase = (product) => {
      dispatch(addItem(product));
    };
    const decrease = (product) => {
      dispatch(removeItem(product));
    };
    const deletes = (product) => {
      dispatch(deleteItem(product));
    };
    const clear = () => {
      dispatch(clearCart());
    };
    useEffect(() => {
      dispatch(getTotals());
      if (user) setCheckOut(true);
    }, [cart, dispatch, user]);
    const stripe = () => {
      if (checkOut) {
        createPaymentIntent({ cart, user }).then((res) => {
          window.location.href = res.data.url;
        });
      } else {
        toast.info("Must be logged in to checkout", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    const manual = () => {
      // if (checkOut) {
      //   setPayment(true);
      // } else {
      //   toast.info("Must be logged in to checkout", {
      //     position: toast.POSITION.TOP_CENTER,
      //   });
      // }
      setPayment(true);
    };
    const handleChange = (e) => {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      nav("/success", { state: { data } });
    };
    return (
      <Container className="h-100 gradient-custom">
        <Row className="d-flex justify-content-center my-4">
          <Col md={8}>
            <Card className="mb-4">
              <CardHeader className="py-3 d-flex">
                <h5>Item List</h5>
                <h5 className="ms-auto">
                  <button onClick={() => clear()}>
                    <i className="fa fa-trash"></i> Clear Cart
                  </button>
                </h5>
              </CardHeader>
              <CardBody>
                {cart.cartItems.map((item) => {
                  return (
                    <Row className="d-flex align-items-center border-bottom border-2">
                      <Col lg={3} md={12}>
                        <CardImg
                          src={item.thumbnail}
                          alt={item.title}
                          className="img-fluid"
                        ></CardImg>
                      </Col>

                      <Col lg={5} md={6}>
                        <div>
                          <strong>{item.name}</strong>
                        </div>
                        <div>Color: {item?.color}</div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div
                          className="d-flex mb-4"
                          style={{ maxWidth: "300px" }}
                        >
                          <button
                            className="btn px-3"
                            disabled={item.cartQuantity === 1}
                            onClick={() => {
                              decrease(item);
                            }}
                          >
                            <i className="fa fa-minus"></i>
                          </button>

                          <p className="mx-5">{item.cartQuantity}</p>

                          <button
                            className="btn px-3"
                            onClick={() => {
                              increase(item);
                            }}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                        <div>
                          <span className="d-flex justify-content-end">
                            <button
                              className="btn px-3"
                              onClick={() => {
                                deletes(item);
                              }}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </span>
                        </div>
                      </Col>
                    </Row>
                  );
                })}
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 sticky-top">
              <>
                <CardHeader className="py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </CardHeader>
                <CardBody>
                  <ul className="list-group list-group-flush">
                    {cart.cartItems.map((cartItem) => (
                      <li className="list-group-item d-flex justify-content-between border-0 px-0 pb-0">
                        {cartItem.name} ({cartItem.color})
                        <span>
                          {cartItem.cartQuantity} x{" "}
                          <FormatPrice price={cartItem.price} />
                        </span>
                      </li>
                    ))}
                    <hr />
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>
                          <FormatPrice price={cart.total} />
                        </strong>
                      </span>
                    </li>
                  </ul>

                  {!payment ? (
                    <div className="d-flex justify-content-between">
                      <button onClick={() => stripe()}>Pay with Card</button>
                      Or
                      <button onClick={() => manual()}>Cash Payment</button>
                    </div>
                  ) : (
                    <>
                      <CardTitle>
                        <button onClick={() => setPayment(false)}>
                          <i className="fa fa-arrow-left"></i>
                        </button>
                      </CardTitle>
                      <CardBody>
                        <Form
                          onSubmit={handleSubmit}
                          className="d-flex flex-column"
                        >
                          {user === null &&
                          <>
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            name='name'
                            onChange={handleChange}
                            placeholder="Name or Fullname"
                            className="form-control"
                            required
                          />
                          </>
                          }
                          <label htmlFor="address">Address</label>
                          <input
                            type="text"
                            name="address"
                            placeholder="123 Pham Van Chieu"
                            className="form-control"
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="number">Phone number</label>
                          <input
                            type="number"
                            name="number"
                            onKeyDown={(e) =>
                              ["-", "+", "e", "E", "."].includes(e.key) &&
                              e.preventDefault()
                            }
                            className="form-control"
                            required
                            onChange={handleChange}
                          />
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="123@gmail.com"
                            // defaultValue={user.email}
                            className="form-control"
                            // required
                            onChange={handleChange}
                          />
                          <button type="submit">Order</button>
                        </Form>
                      </CardBody>
                    </>
                  )}
                </CardBody>
              </>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <Link to={"/"}>
          <h5 className="text-center">Continue Shopping</h5>{" "}
        </Link>
        {cart.cartItems.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
    </>
  );
};

export default Cart;
