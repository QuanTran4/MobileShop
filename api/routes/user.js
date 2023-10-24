const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const {updateUser,
  deleteUser,
  getSingleUser,
  getAllUser,
  getUserStats,
  createUser,} = require('../controllers/user')
const router = require("express").Router();

router.post("/:id", verifyTokenAndAdmin, createUser);//ADMIN CREATE USER
router.put("/:id", verifyTokenAndAuthorization, updateUser);//UPDATE
router.delete("/:id", verifyTokenAndAuthorization, deleteUser);//DELETE
router.get("/find/:id", verifyTokenAndAuthorization, getSingleUser);//GET USER
router.get("/", verifyTokenAndAdmin, getAllUser);//GET ALL USER
router.get("/stats", verifyTokenAndAdmin, getUserStats);//GET USER STATS
module.exports = router;
