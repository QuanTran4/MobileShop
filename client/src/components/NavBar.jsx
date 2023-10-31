import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LOGOUT } from "../slices/UserSlice";
import { getTotals } from "../slices/CartSlice";
import {
  Nav,
  Navbar,
  Container,
  NavLink,
  NavDropdown,
  NavItem,
} from "react-bootstrap";
import { editUser } from "../services/user";
import { io } from "socket.io-client";

//order them vao array admin or mod để biết ai đã check r, ai chưa.
// thêm chức năng nếu login rồi, qua browser khác login sẽ check là đang login hay chưa
// thêm chức năng nếu 1 admin or mod đang chỉnh 1 data nhất định, những admin mod khác sẽ được thông báo là đang có người chỉnh
const NavBar = ({ socket }) => {
  const nav = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];
  const { user: currentUser } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [noti, setNoti] = useState(null);
  const dispatch = useDispatch();

  //update cart total
  useEffect(() => {
    const getTotal = () => {
      dispatch(getTotals());
    };
    cart && getTotal();
  }, [cart, dispatch]);
  useEffect(() => {
    //do nothing when user try to login
    if (pathname === "login" || pathname === "success") {
      return;
    }
    //if user is logged in then add user to server
    if (currentUser !== null) {
      socket.emit("addnewUser", currentUser.username);
    }
  }, [currentUser, pathname]);
  useEffect(() => {
    //admin or mod when logged in will see a new order notif
    socket.on("newOrder", (res) => {
      setNoti(res);
    });
  }, [socket]);

  const logOut = () => {
    dispatch(LOGOUT());
    socket.emit("logout");
    nav("/");
  };
  const clearNoti = () => {
    editUser(currentUser._id, { unreadNoti: false }).then((res) => {
      setNoti(null);
      nav("/profile/orders");
    });
  };
  return (
    <Navbar
      collapseOnSelect
      expand="md"
      bg="dark"
      data-bs-theme="dark"
      className="mb-3"
    >
      <Navbar.Brand href="/">Mobile Store</Navbar.Brand>
      <Navbar.Brand className="d-flex flex-fill justify-content-end">
        <Link to={"/cart"}>
          <span className="justify-content-end">
            <i
              className="fa fa-shopping-cart"
              aria-hidden={true}
              style={{ fontSize: "28px", color: "green" }}
            />
            <span className="d-inline-block">{cart.amount}</span>
          </span>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="navbarScroll"
        data-bs-target="#navbarScroll"
      />
      <Navbar.Collapse id="navbarScroll" className="justify-content-end">
        {currentUser !== null ? (
          <Nav>
            {currentUser.role !== "user" && noti !== null && (
              <NavLink
                onClick={() => clearNoti()}
                onMouseEnter={(e) => {
                  e.target.style.cursor = "pointer";
                }}
              >
                <span className="text-info">{noti}</span>
                <i
                  className="fa fa-bell text-info"
                  aria-hidden="true"
                  style={{ fontSize: 24 }}
                ></i>
              </NavLink>
            )}

            <NavLink href="/profile">
              <img
                src={currentUser.img}
                className="rounded-circle me-1"
                width={25}
                height={25}
              />
              {currentUser.username}
            </NavLink>
            <NavLink
              onClick={() => {
                logOut();
              }}
            >
              Logout
            </NavLink>
          </Nav>
        ) : (
          <Nav>
            <NavLink href="/login">Login</NavLink>
            <NavLink href="/register">Register</NavLink>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
export default NavBar;
