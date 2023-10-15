const Product = require("../models/Product");

const createProduct = async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};
const updatedProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};
const getSingleProduct = async (req, res) => {
  try {
    // const product = await Product.find(req.params.id);
    const product = await Product.findById(req.params.id);
    const similarProduct = await Product.find(
      {
        categories: product.categories,
        _id: { $ne: product._id },
        isActive: true,
      },
      { name: 1, colors: 1, _id: 1 }
    );
    res.status(200).json({ product, similarProduct });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllProduct = async (req, res) => {
  const page = req.query.page || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 4;
  const query = {};
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const countPromise = Product.countDocuments(query);
    const itemsPromise = Product.find(query)
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
const getAllPublicProduct = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });
    return res.status(200).json(products);
  } catch (e) {
    return res.status(401).json(e);
  }
};
module.exports = {
  createProduct,
  updatedProduct,
  deleteProduct,
  getSingleProduct,
  getAllProduct,
  getAllPublicProduct,
};
