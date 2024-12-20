const router = require("express").Router();
const {
  getUser,
  logout,
  addUser,
  updateCut,
  updateStatus,
  getUserById,
} = require("../controllers/userController");

router.get("/:id", getUserById);
router.post("/register", addUser);
router.post("/login", getUser);
router.post("/logout", logout);
router.put("/updateCut/:id", updateCut);
router.put("/updateStatus/:id", updateStatus);

module.exports = router;
