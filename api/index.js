const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const corsOption = {
  origin:"http://localhost:8081"
}
const app = express();
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to MongoDB");
  } catch (error) {
    throw error;
  }
};
app.use(cors(corsOption));
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.get("/api/", (req,res) =>{
  res.send("hello");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!",process.env.PORT||5000);
  connect();
});
