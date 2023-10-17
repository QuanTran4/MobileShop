const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
  updatedProduct,
  getAllPublicProduct,
  getProductByCategory,
} = require("../controllers/product");
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, createProduct); //CREATE
router.put("/:id", verifyTokenAndAdmin, updatedProduct); //UPDATE
router.delete("/:id", verifyTokenAndAdmin, deleteProduct); //DELETE
// router.get("/find/:id", getSingleProduct); //GET PRODUCT
router.get("/find/:id", getSingleProduct); //GET PRODUCT
router.get('/admin',verifyTokenAndAdmin,getAllProduct); // GET ALL PRODUCT FOR ADMIN
router.get("/", getAllPublicProduct); //GET ALL PRODUCTS
router.get("/:category", getProductByCategory); //GET PRODUCTS BY CATEGORY
module.exports = router;
