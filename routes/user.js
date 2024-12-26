const router = require("express").Router();
const {
  getUser,
  logout,
  addUser,
  updateCut,
  updateStatus,
  getUserById,
  getBranch,
  transfer,
  transaction,
} = require("../controllers/userController");

router.get("/getBranch", getBranch);
router.get("/transaction/:id", transaction);
router.get("/:id", getUserById);
router.post("/register", addUser);
router.post("/login", getUser);
router.post("/logout", logout);
router.post("/transfer", transfer);
router.put("/updateCut/:id", updateCut);
router.put("/updateStatus/:id", updateStatus);

module.exports = router;
