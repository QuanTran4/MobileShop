import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../../services/requestMethods";
import Chart from "../../components/Chart";

const ProfilePage = () => {
  const [userStats, setUserStats] = useState([]);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("/users/stats");
        res.data.map((item) =>
          setUserStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], "User/Month": item.total },
          ])
        );
      } catch {}
    };
    getStats();
  }, [MONTHS]);
  const { user } = useSelector((state) => state.user);
  return (
    <div className="flex-6 text-center w-100">
      {user.role === "admin" && (
        <Chart
          data={userStats}
          title="User Analytics"
          grid
          dataKey="User/Month"
        />
      )}
      {user.role === "user" && (
        <p className="border h-100 text-center">Hello {user.username}</p>
      )}
    </div>
  );
};

export default ProfilePage;
