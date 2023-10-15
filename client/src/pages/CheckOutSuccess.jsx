import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { newOrder } from "../services/order";
import { clearCart } from "../slices/CartSlice";

const CheckoutSuccess = () => {
  const location = useLocation();
  const data = location.state.stripeData;
  const cart = location.state.cart;
  const { user } = useSelector((state) => state.user);
  const [orderId, setOrderId] = useState();
  const dispatch = useDispatch();
  const nav = useNavigate();
  useEffect(() => {
    createOrder();
  }, []);
  const createOrder = async () => {
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
      address: data.billing_details.address,
      payment_status: data.status,
    };
    newOrder(form)
      .then((res) => {
        setOrderId(res.data._id);
        dispatch(clearCart());
      })
      .catch((err) => {
        console.log("err");
      });
  };
  return (
    <div className="d-flex justify-content-center align-items-center text-center flex-column">
      {orderId ? (
        <b>
          Order has been created successfully. Your order number is {orderId}
        </b>
      ) : (
        <b>Successful. Your order is being prepared...</b>
      )}
      <button onClick={() => nav("/")}>Go to Homepage</button>
    </div>
  );
};
export default CheckoutSuccess;
