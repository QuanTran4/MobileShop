import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      nav("/");
    }
  }, []);
  return (
    <>
      <div className="d-flex">
        <SideBar />
        <Outlet />
      </div>
    </>
  );
};

export default ProtectedRoute;
