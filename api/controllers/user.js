const User = require("../models/User");

const createUser = async (req, res) => {
  const newUser = req.body;
  try {
    const savedUser = await User.saved(newUser);
    res.status(200).json("User Created Successfully");
  } catch (err) {
    res.status(401).json(err);
  }
};
const updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json("User Updated Successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAllUser = async (req, res) => {
  const page = req.query.page || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 4;
  const query = {};
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const countPromise = User.countDocuments(query);
    const itemsPromise = User.find(query)
      .sort({ createdAt: -1 })
      .limit(ITEMS_PER_PAGE)
      .skip(skip);
    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    return res.status(200).json({
      count,
      items,
    });
  } catch (e) {
    return res.status(401).json(e);
  }
};
const getUserStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = {
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUser,
  getUserStats,
  createUser
};
