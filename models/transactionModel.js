const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);
const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
