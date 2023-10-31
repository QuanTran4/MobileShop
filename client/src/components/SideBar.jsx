import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SideBar = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="flex-1 border-end">
      <h4>
        <Link to="/profile" className="text-decoration-none">
          Dashboard
        </Link>
      </h4>
      {user.role !== "user" ? (
        <>
          <div className="p-3 bg-secondary.bg-gradient">
            <Link
              to="/profile/users"
              className="text-decoration-none link-info"
            >
              Users
            </Link>
          </div>
          <div className="p-3 bg-secondary.bg-gradient">
            <Link
              to="/profile/products"
              className="text-decoration-none link-info"
            >
              Products
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="p-3 bg-secondary.bg-gradient">
            <Link
              to={`/profile/${user._id}`}
              className="text-decoration-none link-info"
            >
              Edit Profile
            </Link>
          </div>
        </>
      )}
      <div className="p-3 bg-secondary.bg-gradient">
        <Link to="/profile/orders" className="text-decoration-none link-info">
          Order
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
