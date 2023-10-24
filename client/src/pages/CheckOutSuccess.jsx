import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { newOrder } from "../services/order";
import { clearCart } from "../slices/CartSlice";
import { Container } from "react-bootstrap";
import { useSearchParams, useParams } from "react-router-dom";
import { retrieveSession } from "../services/payment";
const CheckoutSuccess = () => {
  const location = useLocation();

  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [session, setSession] = useState(null);
  const [orderId, setOrderId] = useState();
  const dispatch = useDispatch();
  const nav = useNavigate();
  useEffect(() => {
    const createOrder = () => {
      console.log(session);
      const form = {
        userId: user._id,
        products: cart.cartItems.map((item) => ({
          productId: item._id,
          productName: item.name,
          color: item.color,
          colorId: item.colorId,
          quantity: item.cartQuantity,
          productPrice: item.price,
        })),
        amount: cart.total,
        address: session.shipping_details,
        // payment_status: data.status,
        payment_method: session.payment_method_types[0],
      };
      newOrder(form)
        .then((res) => {
          setOrderId(res.data._id);
          dispatch(clearCart());
        })
        .catch((err) => {});
    };

    session && createOrder();
  }, [session]);
  useEffect(() => {
    const first = () => {
      if (location.search) {
        retrieveSession(location.search.split("session_id=")[1]).then((res) => {
          setSession(res.data);
        });
      }
      if (location.state) {
        console.log("first");
        const form = {
          userId: user._id,
          products: cart.cartItems.map((item) => ({
            productId: item._id,
            productName: item.name,
            color: item.color,
            colorId: item.colorId,
            quantity: item.cartQuantity,
            productPrice: item.price,
          })),
          amount: cart.total,
          address: location.state.data,
          payment_method: "cash",
        };
        newOrder(form)
          .then((res) => {
            setOrderId(res.data._id);
            dispatch(clearCart());
          })
          .catch((err) => {});
      }
    };
    first();
  }, []);

  return (
    <>
      <Container
        className="d-flex text-center flex-column"
        style={{ height: "75vh" }}
      >
        {orderId ? (
          <>
            <h5>
              Order has been created successfully. Your order number is{" "}
              {orderId}
            </h5>
            <button onClick={() => nav("/")}>Go to Homepage</button>
          </>
        ) : (
          <h5>Payment Successful. Your order is being prepared...</h5>
        )}
      </Container>
    </>
  );
};
export default CheckoutSuccess;
