const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
  updatedProduct,
  getAllPublicProduct,
} = require("../controllers/product");
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, createProduct); //CREATE
router.put("/:id", verifyTokenAndAdmin, updatedProduct); //UPDATE
router.delete("/:id", verifyTokenAndAdmin, deleteProduct); //DELETE
// router.get("/find/:id", getSingleProduct); //GET PRODUCT
router.get("/find/:id", getSingleProduct); //GET PRODUCT
router.get('/admin',verifyTokenAndAdmin,getAllProduct);
router.get("/", getAllPublicProduct); //GET ALL PRODUCTS
module.exports = router;
