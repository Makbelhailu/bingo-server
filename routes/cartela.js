const router = require("express").Router();
const {
  addCartela,
  getCartela,
  addDefaultCartela,
  applyDefaultCartela,
} = require("../controllers/cartelaController");

router.get("/:id", getCartela);
router.post("/add", addCartela);
router.post("/addDefault", addDefaultCartela);
router.post("/applyDefault/:id", applyDefaultCartela);

module.exports = router;
