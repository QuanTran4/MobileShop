const Product = require("../models/Product");

const createProduct = async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json("Product Created Successfully!");
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
    res.status(200).json("Product Updated Successfully!");
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
    const product = await Product.findById(req.params.id);
    const similarProduct = await Product.find(
      {
        categories: product.categories,
        _id: { $ne: product._id },
        isActive: "Active",
      },
      { name: 1, colors: { $slice: 1 }, _id: 1, categories: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5);
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
    return res.status(200).json({
      count,
      items,
    });
  } catch (e) {
    return res.status(401).json(e);
  }
};
const getAllPublicProduct = async (req, res) => {
  try {
    const Phones = await Product.find(
      { isActive: "Active" },
      { _id: 1, name: 1, price: 1, colors: { $slice: 1 }, categories: 1,discount:1 }
    )
      .sort({
        createdAt: -1,
      })
      .limit(4);

    const Tablet = await Product.find(
      { isActive: "Active", categories: "Tablet" },
      { _id: 1, name: 1, price: 1, colors: { $slice: 1 }, categories: 1,discount:1 }
    )
      .sort({
        createdAt: -1,
      })
      .limit(4);

    const Laptop = await Product.find(
      { isActive: "Active", categories: "Laptop" },
      { _id: 1, name: 1, price: 1, colors: { $slice: 1 }, categories: 1,discount:1 }
    )
      .sort({
        createdAt: -1,
      })
      .limit(4);
    const data = { phone: Phones, tablet: Tablet, laptop: Laptop };
    return res.status(200).json(data);
  } catch (e) {
    return res.status(401).json(e);
  }
};
const getProductByCategory = async (req, res) => {
  const { category } = req.params;
  const query = {};
  const products = await Product.find(
    { categories: category },
    { name: 1, colors: { $slice: 1 }, price: 1, _id: 1, categories: 1 }
  );
  return res.status(200).json(products);
};
module.exports = {
  createProduct,
  updatedProduct,
  deleteProduct,
  getSingleProduct,
  getAllProduct,
  getAllPublicProduct,
  getProductByCategory,
};
