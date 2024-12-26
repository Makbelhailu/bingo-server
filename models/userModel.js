const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cut: Number,
    houseCut: {
      type: Number,
      default: 0.3,
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

userSchema.index({ name: 1 }, { unique: false });
const User = mongoose.model("User", userSchema);

// User.collection.dropIndex("name_1", (err, result) => {
//   if (err) console.error("Error dropping index:", err);
//   else console.log("Index dropped successfully:", result);
// });
module.exports = User;
