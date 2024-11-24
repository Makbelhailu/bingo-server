const router = require("express").Router();
const {
  getTodayGame,
  addGame,
  getAllWin,
} = require("../controllers/gameController");

router.get("/today/:id", getTodayGame);
router.get("/totalHouseWin/:userId", getAllWin);
router.post("/", addGame);

module.exports = router;
