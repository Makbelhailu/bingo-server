const mongoose = require("mongoose");

const cartelaSchema = new mongoose.Schema(
  {
    numbers: {
      type: Map,
      of: [[Number]],
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Cartela = mongoose.model("Cartela", cartelaSchema);
module.exports = Cartela;
