import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.css";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminModRoute from "./components/AdminModRoute";
import ProfilePage from "./pages/profile/Profile";
import TotalUsers from "./pages/profile/users/TotalUsers";
import EditUser from "./pages/profile/users/EditUser";
import NewUser from "./pages/profile/users/NewUser";
import TotalProducts from "./pages/profile/products/TotalProducts";
import EditProduct from "./pages/profile/products/EditProduct";
import NewProduct from "./pages/profile/products/NewProduct";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import CheckoutSuccess from "./pages/CheckOutSuccess";
import TotalOrders from "./pages/profile/orders/TotalOrders";
import EditOrder from "./pages/profile/orders/EditOrder";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/success" element={<CheckoutSuccess />} />
        <Route path="/profile" element={<ProtectedRoute />}>
          <Route index element={<ProfilePage />} />
          <Route path=":_id" element={<EditUser />} />
          <Route path="users" element={<AdminModRoute />}>
            <Route index element={<TotalUsers />} />
            <Route path=":_id" element={<EditUser />} />
            <Route path="new" element={<NewUser />} />
          </Route>
          <Route path="products" element={<AdminModRoute />}>
            <Route index element={<TotalProducts />} />
            <Route path=":_id" element={<EditProduct />} />
            <Route path="new" element={<NewProduct />} />
          </Route>
          <Route path="orders">
            <Route index element={<TotalOrders />} />
            <Route path=":_id" element={<EditOrder />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
