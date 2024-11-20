const router = require("express").Router();
const {
  addCartela,
  getCartela,
  addDefaultCartela,
} = require("../controllers/cartelaController");

router.get("/:id", getCartela);
router.post("/add", addCartela);
router.post("/addDefault", addDefaultCartela);

module.exports = router;
