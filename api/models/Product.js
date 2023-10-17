const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String },
    categories: { type: String, required: true },
    // publisher: {type:String, required:true},
    colors: [
      {
        color: { type: String },
        image: { type: String },
        inStock: { type: Boolean },
      },
    ],
    productImage: { type: [String] },
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
