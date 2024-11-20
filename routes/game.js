const router = require("express").Router();
const { getTodayGame, addGame } = require("../controllers/gameController");

router.get("/today/:id", getTodayGame);
router.post("/", addGame);

module.exports = router;
