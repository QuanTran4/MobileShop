import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LOGOUT } from "../slices/UserSlice";
import { getTotals } from "../slices/CartSlice";
import { Nav, Navbar, Container, NavLink, NavDropdown } from "react-bootstrap";
const NavBar = () => {
  const nav = useNavigate();
  const { user: currentUser } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    const getTotal = () => {
      dispatch(getTotals());
    };
    cart && getTotal();
  }, [cart, dispatch]);
  const logOut = useCallback(() => {
    dispatch(LOGOUT());
    nav("/");
  }, [dispatch]);

  const handleNav = (path) => {
    nav(path);
  };
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="md"
        bg="dark"
        data-bs-theme="dark"
        className="mb-5"
      >
        <Navbar.Brand href="/">Mobile Store</Navbar.Brand>
        <Navbar.Brand as={Link} to={"/cart"} className="d-flex flex-fill justify-content-end">
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
                <NavLink href="/profile">
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
