const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const User = require("./models/User");
const app = express();
const http = require("http").Server(app);
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to MongoDB");
  } catch (error) {
    throw error;
  }
};
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//Add this before the app.get() block
let onlineUsers = [];
socketIO.on("connection", (socket) => {
  socket.on("addnewUser", async (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    const adminsAndMods = await User.findOne(
      { _id: userId, role: { $ne: "user" } },
      { unreadNoti: 1 }
    );
    if (adminsAndMods && adminsAndMods?.unreadNoti) {
      const user = onlineUsers.find(
        (user) => user.userId === adminsAndMods._id.toString()
      );
      socketIO.to(user.socketId).emit("newOrder", "newOrder123");
    }
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
  });

  socket.on("logout", () => {
    socket.disconnect(true);
  });

  socket.on("orderSuccess", async () => {
    const adminsAndMods = await User.find(
      { role: { $ne: "user" } },
      { _id: 1 }
    );
    const a = adminsAndMods.map((item) => {
      return (item._id = item._id.toString());
    });
    a.forEach(async (item) => {
      const user = onlineUsers.find((user) => user.userId === item);
      if (user) {
        socketIO.to(user.socketId).emit("newOrder", "newOrder123");
      } else {
        const user = await User.findByIdAndUpdate(
          item,
          {
            $set: { unreadNoti: true },
          },
          { new: true }
        );
      }
    });
  });
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/stripe", stripeRoute);

http.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running on port", process.env.PORT || 5000);
  connect();
});
