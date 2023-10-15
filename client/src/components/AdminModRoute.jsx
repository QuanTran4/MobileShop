import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const AdminModRoute = () => {
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();
  useEffect(() => {
    if (!user || user.role ==='user') {
      nav("/");
    }
  }, []);
  return (
    <div className="flex-6 text-center w-100">
        <Outlet />
    </div>
  );
};

export default AdminModRoute;
