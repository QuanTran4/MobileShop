const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String },
    categories: { type: String, required: true },
    colors: [
      {
        color: { type: String },
        image: { type: String },
        inStock: { type: Number },
      },
    ],
    productImage: { type: [String] },
    price: { type: Number, required: true },
    discount:{type: Number},
    isActive: { type: String, default: 'Inactive' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
