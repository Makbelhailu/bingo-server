const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    bet: { type: Number, required: true },
    players: { type: Number, required: true },
    totalWin: { type: Number, required: true },
    houseWin: { type: Number, required: true },
    cut: { type: Number, required: true },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
