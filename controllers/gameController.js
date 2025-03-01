const Game = require("../models/gameModel");
const User = require("../models/userModel");
const getStartAndEndOfDay = require("../libs/getDuration");

const getGames = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    const { start, end } = getStartAndEndOfDay(
      date || new Date().toISOString()
    );
    let totalEarn = 0;
    const user = await User.findById(id);

    if (!user)
      return res
        .status(404)
        .json({ status: false, message: "Invalid User Id" });

    // if (user.limit <= 0) {
    //   return res
    //     .status(401)
    //     .json({ status: false, message: "You have finished your Credit" });
    // } else
    if (!user.status) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized User" });
    }
    const userId = user._id;

    const totalPlay = await Game.countDocuments({
      userId,
      createdAt: { $gte: start, $lt: end },
    });

    const games = await Game.find({
      userId,
      createdAt: { $gte: start, $lt: end },
    }).sort({ createdAt: -1 });

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
        totalPlay,
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

    if (user.limit < totalWin) {
      return res
        .status(400)
        .json({ status: false, message: "Insufficient Credit" });
    } else if (user.limit === 0) {
      return res
        .status(401)
        .json({ status: false, message: "You have finished your Credit" });
    } else if (!user.status) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized User" });
    }

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
    user.houseCut = cut;
    await user.save();

    res
      .status(200)
      .json({ status: true, game, message: "Game data Stored Successfully" });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

const getAllWin = async (req, res) => {
  try {
    const { userId } = req.params;
    const allWin = await Game.find({ userId }).select("houseWin");
    if (!allWin) {
      return res
        .status(403)
        .json({ status: false, message: "Can't add Game data" });
    }
    console.log(allWin[0]);
    const totalHouseWin = allWin.reduce((a, b) => a + b.houseWin, 0);

    res.status(200).json({
      status: true,
      totalHouseWin,
      message: "Here is your total Earn",
    });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

module.exports = {
  getGames,
  addGame,
  getAllWin,
};
