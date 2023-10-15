import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  addItem,
  removeItem,
  deleteItem,
  getTotals,
  clearCart,
} from "../slices/CartSlice";
import StripeCheckout from "react-stripe-checkout";
import NavBar from "../components/NavBar";
const KEY =
  "pk_test_51NsdU0JLHNsfgIKgOMlT5kFV9yoHhqxkSqgKW954DQJ7jBFrz3arNjTZLTJRc9stLW7RcgvxOKFcVDC5fr63EXTa00a4arScfO";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const nav = useNavigate();
  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Your Cart is Empty</h4>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCart = () => {
    useEffect(() => {
      dispatch(getTotals());
      if (user) setCheckOut(true);
    }, [cart, dispatch, user]);
    const [stripeToken, setStripeToken] = useState(null);
    const [checkOut, setCheckOut] = useState(false);
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
    const onToken = (token) => {
      setStripeToken(token);
    };
    useEffect(() => {
      const makeRequest = async () => {
        try {
          await axios
            .post("/api/checkout/payment", {
              tokenId: stripeToken.id,
              amount: cart.total,
              email: stripeToken.email,
              user: user._id,
              items: cart.cartItems,
            })
            .then((res) => {
              nav("/success", { state: { stripeData: res.data, cart: cart } });
            })
            .catch((err) => {
            });
        } catch (err) {
        }
      };
      stripeToken && makeRequest();
    }, [stripeToken]);
    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5>Item List</h5>
                  </div>
                  <div className="card-body">
                    {cart.cartItems.map((item) => {
                      return (
                        <div key={item.id}>
                          <div className="row d-flex align-items-center">
                            <div className="col-lg-3 col-md-12">
                              <div
                                className="bg-image rounded"
                                data-mdb-ripple-color="light"
                              >
                                <img
                                  src={item.thumbnail}
                                  // className="w-100"
                                  alt={item.title}
                                  width={100}
                                  height={75}
                                />
                              </div>
                              <button
                                className="btn px-3"
                                onClick={() => {
                                  deletes(item);
                                }}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>

                            <div className="col-lg-5 col-md-6">
                              <p>
                                <strong>{item.name}</strong>
                              </p>
                              <p>Color: {item?.color}</p>
                              {/* <p>Size: M</p> */}
                            </div>

                            <div className="col-lg-4 col-md-6">
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

                              <p className="text-start text-md-center">
                                <strong>
                                  {item.cartQuantity} x{" "}
                                  {Intl.NumberFormat("en-US").format(
                                    item.price
                                  )}{" "}
                                  VND
                                </strong>
                              </p>
                            </div>
                          </div>

                          <hr className="my-4" />
                        </div>
                      );
                    })}
                  </div>
                  <div className="card-footer">
                    <h4>
                      <button onClick={() => clear()}>
                        <i className="fa fa-trash"></i> Clear Cart
                      </button>
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4 sticky-top">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      {cart.cartItems.map((cartItem) => (
                        <li className="list-group-item d-flex justify-content-between border-0 px-0 pb-0">
                          {cartItem.name} ({cartItem.color})
                          <span>
                            {cartItem.cartQuantity} x{" "}
                            {Intl.NumberFormat("en-US").format(cartItem.price)}{" "}
                            VND
                          </span>
                        </li>
                      ))}
                      <hr />
                      <li className="list-group-item d-flex justify-content-between border-0 px-0 pb-0">
                        Total Products ({cart.amount})
                        <span>
                          {Intl.NumberFormat("en-US").format(cart.total)} VND
                        </span>
                      </li>
                      {/* <li className="list-group-item d-flex justify-content-between px-0">
                        Shipping
                        <span>
                          {Intl.NumberFormat("en-US").format(cart.shipping)} VND
                        </span>
                      </li> */}
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total amount</strong>
                        </div>
                        <span>
                          <strong>
                            {Intl.NumberFormat("en-US").format(cart.total)} VND
                          </strong>
                        </span>
                      </li>
                    </ul>

                    {checkOut ? (
                      <StripeCheckout
                        name="Mobile Shop"
                        image="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                        description={`Your total is ${cart.total}VND`}
                        // email={user.email}
                        billingAddress
                        shippingAddress
                        amount={cart.total}
                        phone
                        token={onToken}
                        stripeKey={KEY}
                        currency="VND"
                      >
                        <button> Pay with Card</button>
                      </StripeCheckout>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            alert("Must login before checkout", nav("/login"));
                          }}
                        >
                          Check Out
                        </button>
                      </>
                    )}
                    {/* <button onClick={() => handleCheckout(cart)}>
                      Check Out
                    </button> */}
                    {/* <Link
                      to="checkout"
                      className="btn btn-dark btn-lg btn-block"
                    >
                      Go to checkout
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <NavBar />
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
