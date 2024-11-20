const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cut: Number,
    houseCut: {
      type: Number,
      default: 0.2,
    },
    limit: {
      type: Number,
      default: 10000,
    },
    cartela: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cartela",
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
