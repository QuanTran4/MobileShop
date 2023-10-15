const {
  createOrder,
  deleteOrder,
  updatedOrder,
  getMonthlyIncome,
  getAllOrder,
  getUserOrder,
  getSingleOrder,
} = require("../controllers/order");
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/", verifyToken, createOrder); //CREATE
router.put("/:id", verifyTokenAndAdmin, updatedOrder); //UPDATE
router.delete("/:id", verifyTokenAndAdmin, deleteOrder); //DELETE
router.get("/find/:id", verifyTokenAndAuthorization,getUserOrder); //GET USER ORDERS
router.get("/", verifyTokenAndAdmin,getAllOrder); // //GET ALL
router.get('/single/:id',getSingleOrder)
router.get("/income", verifyTokenAndAdmin, getMonthlyIncome); // GET MONTHLY INCOME

module.exports = router;
