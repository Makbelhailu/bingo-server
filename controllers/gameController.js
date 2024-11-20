const Game = require("../models/gameModel");
const User = require("../models/userModel");
const getStartAndEndOfDay = require("../libs/getDuration");

const getTodayGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = getStartAndEndOfDay();
    let totalEarn = 0;
    const user = await User.findById(id);

    if (!user)
      return res
        .status(404)
        .json({ status: false, message: "Invalid User Id" });

    const userId = user._id;

    const games = await Game.find({
      userId,
      createdAt: { $gte: start, $lt: end },
    });

    if (games.length > 0) {
      totalEarn = games.reduce((a, b) => {
        return a + b.houseWin;
      }, 0);
    }

    const credit = user.limit;

    res.status(200).json({
      status: true,
      data: {
        games,
        totalEarn,
        credit,
      },
      message: "Game data fetched Successfully",
    });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

const addGame = async (req, res) => {
  try {
    const { userId, bet, players, totalWin, houseWin, cut } = req.body;

    const user = await User.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ status: false, message: "Invalid User Id" });

    const game = await Game.create({
      userId,
      bet,
      players,
      totalWin,
      houseWin,
      cut,
    });

    if (!game)
      return res
        .status(403)
        .json({ status: false, message: "Can't add Game data" });

    user.limit -= houseWin;
    await user.save();

    res
      .status(200)
      .json({ status: true, game, message: "Game data Stored Successfully" });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

module.exports = {
  getTodayGame,
  addGame,
};
