import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { newOrder } from "../services/order";
import { clearCart } from "../slices/CartSlice";
import { Container } from "react-bootstrap";
import { retrieveSession } from "../services/payment";
const CheckoutSuccess = ({ socket }) => {
  const location = useLocation();
  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [session, setSession] = useState(null);
  const [orderId, setOrderId] = useState();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const form = {
    products: cart?.cartItems.map((item) => ({
      productId: item._id,
      productName: item.name,
      color: item.color,
      colorId: item.colorId,
      quantity: item.cartQuantity,
      productPrice: item.price,
    })),
    amount: cart.total,
  };
  useEffect(() => {
    const createOrder = () => {
      form.address = session.customer_details.address;
      form.address.phone = session.customer_details.phone;
      form.payment_method = session.payment_method_types[0];
      form.userId = user.username;
      newOrder(form)
        .then((res) => {
          setOrderId(res.data._id);
          socket.emit("orderSuccess");
          dispatch(clearCart());
        })
        .catch((err) => {});
    };

    session && createOrder();
  }, [session]);
  useEffect(() => {
    const first = () => {
      // order by Card
      if (location.search) {
        retrieveSession(location.search.split("session_id=")[1]).then((res) => {
          console.log(res.data);
          setSession(res.data);
        });
      }

      // order by Cash
      if (location.state) {
        const username = user?.username || location.state.data.name;

        form.payment_method = "cash";
        form.address = location.state.data;
        form.userId = username;
        console.log(form);
        newOrder(form)
          .then((res) => {
            setOrderId(res.data._id);
            socket.emit("orderSuccess");
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
        {location.search !== "" || location.state !== null ? (
          <>
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
          </>
        ) : (
          <h5>No payment detected. Please Checkout first!</h5>
        )}
      </Container>
    </>
  );
};
export default CheckoutSuccess;
