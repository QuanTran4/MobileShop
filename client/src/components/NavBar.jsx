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
const NavBar = () => {
  const nav = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];
  const { user: currentUser } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [noti, setNoti] = useState(null);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  //update cart total
  useEffect(() => {
    const getTotal = () => {
      dispatch(getTotals());
    };
    cart && getTotal();
  }, [cart, dispatch]);

  //user logout of server
  useEffect(() => {
    const disconnect = () => {
      socket.emit("logout");
    };
    currentUser === null && socket !== null && disconnect();
  }, [socket, currentUser]);

  //set user to enter socket server
  useEffect(() => {
    if (socket === null) return;
    else {
      if (currentUser === null) {
        socket.emit("logout");
      } else {
        socket.emit("addnewUser", currentUser._id);
      }
    }
  }, [socket, currentUser]);

  //enter socket server
  useEffect(() => {
    if (currentUser !== null) {
      setSocket(io("http://localhost:8080"));
    }
  }, [currentUser]);

  //send order success to socket server
  // useEffect(() => {
  //   const createOrder = () => {
  //     socket.emit("orderSuccess");
  //   };
  //   pathname === "success" && createOrder();
  // }, [pathname]);

  //admin or mod when logged in will see a new order notif
  useEffect(() => {
    if (socket === null) return;
    socket.on("newOrder", (res) => {
      setNoti(res);
    });
  }, [socket]);

  const logOut = useCallback(() => {
    dispatch(LOGOUT());
    nav("/");
  }, []);
  const clearNoti = () => {
    editUser(currentUser._id, { unreadNoti: false }).then((res) => {
      setNoti(null);
      nav("/profile/orders");
    });
  };
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="md"
        bg="dark"
        data-bs-theme="dark"
        className="mb-3"
      >
        <Navbar.Brand href="/">Mobile Store</Navbar.Brand>
        <Navbar.Brand
          as={Link}
          to={"/cart"}
          className="d-flex flex-fill justify-content-end"
        >
          <span className="justify-content-end">
            <i
              className="fa fa-shopping-cart"
              aria-hidden={true}
              style={{ fontSize: "28px" }}
            />
            <span className="text-primary d-inline-block">{cart.amount}</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarScroll"
          data-bs-target="#navbarScroll"
        />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <Nav>
            {currentUser !== null ? (
              <>
                {currentUser.role !== "user" && noti !== null && (
                  <NavItem
                    onClick={() => clearNoti()}
                    onMouseEnter={(e) => {
                      e.target.style.cursor = "pointer";
                    }}
                  >
                    <span className="text-info">New Order</span>
                    <i
                      className="fa fa-bell"
                      aria-hidden="true"
                      style={noti !== null ? { fontSize: 24 } : {}}
                    ></i>
                  </NavItem>
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
              </>
            ) : (
              <>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/register">Register</NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
export default NavBar;
