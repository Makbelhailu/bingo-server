const router = require("express").Router();
const {
  getGames,
  addGame,
  getAllWin,
} = require("../controllers/gameController");

router.get("/today/:id", getGames);
router.get("/totalHouseWin/:userId", getAllWin);
router.post("/", addGame);

module.exports = router;
