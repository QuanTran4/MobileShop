const Order = require("../models/Order");

const createOrder = async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    return res.status(200).json(order);
  } catch (err) {
    return res.status(403).json(err);
  }
};
const updatedOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAllOrder = async (req, res) => {
  const page = req.query.page || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 4;
  const query = {};
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const countPromise = Order.countDocuments(query);
    const itemsPromise = Order.find(query)
      .sort({ createdAt: -1 })
      .limit(ITEMS_PER_PAGE)
      .skip(skip);
    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = Math.ceil(count / ITEMS_PER_PAGE);
    return res.status(200).json({
      pagination: { count, pageCount },
      items,
    });
  } catch (e) {
    return res.status(401).json(e);
  }
};
const getMonthlyIncome = async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getUserOrder = async (req, res) => {
  const page = req.query.page || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 4;
  const query = { userId: req.params.id };
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const countPromise = Order.countDocuments(query);
    const itemsPromise = Order.find(query)
      .sort({ createdAt: -1 })
      .limit(ITEMS_PER_PAGE)
      .skip(skip);
    const [count, items] = await Promise.all([countPromise, itemsPromise]);

    const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

    return res.status(200).json({
      pagination: { count, pageCount },
      items,
    });
  } catch (e) {
    return res.status(403).json(e);
  }
};
module.exports = {
  createOrder,
  updatedOrder,
  deleteOrder,
  getAllOrder,
  getMonthlyIncome,
  getUserOrder,
  getSingleOrder,
};
