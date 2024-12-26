const User = require("../models/userModel");
const Cartela = require("../models/cartelaModel");
const Transaction = require("../models/transactionModel");
const mongoose = require("mongoose");
const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }).populate("cartela");

    if (!user) {
      return res.status(404).json({ status: false, message: "Invalid User" });
    }
    if (user.limit <= 0) {
      return res
        .status(401)
        .json({ status: false, message: "You have finished your Credit" });
    } else if (!user.status) {
      return res.status(401).json({
        status: false,
        message: "You have been blocked by admins, contact them",
      });
    }

    if (!user.cartela) {
      const cartela = await Cartela.findOne({ isDefault: true });
      user.cartela = cartela;
    }

    res.status(200).json({ status: true, user, message: "Login Successfully" });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("cartela");

    if (!user) {
      return res.status(404).json({ status: false, message: "Invalid User" });
    }

    // if (user.limit <= 0) {
    //   return res
    //     .status(401)
    //     .json({ status: false, message: "You have finished your Credit" });
    // } else
    if (!user.status) {
      return res.status(401).json({
        status: false,
        message: "You have been blocked by admins, contact them",
      });
    }

    if (!user.cartela) {
      const cartela = await Cartela.findOne({ isDefault: true });
      user.cartela = cartela;
    }

    res
      .status(200)
      .json({ status: true, user, message: "User Fetched Successfully" });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

const logout = async (req, res) => {
  res.status(200).json({ status: true, message: "Logged out Successfully" });
};

const addUser = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.create(data);

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Can't Create User" });
    }

    res.status(200).json({ status: true, data: user });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

const updateCut = async (req, res) => {
  try {
    const { cut } = req.body;
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { cut });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Can't Update Cut" });
    }

    res
      .status(200)
      .json({ status: true, data: user, message: "Registered Successfully" });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Can't Update Status" });
    }

    res.status(200).json({ status: true, data: user });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

const getBranch = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name parameter is required" });
    }

    const branch = await User.find({ name, status: true }).select(
      "username _id"
    );

    if (branch.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No active branch found for this branch",
      });
    }

    res.status(200).json({
      status: true,
      branch,
      message: "Branch Users Fetched Successfully",
    });
  } catch (e) {
    res.status(500).json({ status: false, message: e.message });
  }
};

const transfer = async (req, res) => {
  try {
    const { sender, receiver, amount } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(receiver) ||
      !mongoose.Types.ObjectId.isValid(sender)
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Sender or Receiver" });
    }

    if (amount < 100) {
      return res
        .status(400)
        .json({ status: false, message: "Amount must be greater than 100" });
    }

    const user = await User.findById(sender).select("limit");

    if (Number(user.limit) < Number(amount)) {
      return res
        .status(400)
        .json({ status: false, message: "Insufficient balance" });
    }
    const limitAdded = await User.findByIdAndUpdate(
      receiver,
      {
        $inc: { limit: amount },
      },
      { new: true }
    );

    if (!limitAdded)
      return res
        .status(400)
        .json({ status: false, message: "User not found or Cant add Limit" });

    const deducted = await User.findByIdAndUpdate(sender, {
      $inc: { limit: -amount },
    });

    if (!deducted)
      return res.status(400).json({
        status: false,
        message: "Transaction successful but not deducted from the BackOffice",
      });

    const transaction = await Transaction.create({
      sender,
      receiver,
      amount,
    });

    if (!transaction)
      return res.status(400).json({
        status: false,
        error: "Transaction successful but not recorded",
      });

    res.status(200).json({ status: true, limitAdded });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const transaction = async (req, res) => {
  try {
    const { page } = req.query;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid ID" });
    }
    const totalResult = await Transaction.countDocuments({
      $or: [{ receiver: id }, { sender: id }],
      type: "user",
    });

    const totalPage = Math.ceil(totalResult / 10);
    const transactions = await Transaction.find({
      $or: [{ receiver: id }, { sender: id }],
      type: "user",
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
      .limit(10)
      .populate("sender", "username")
      .populate("receiver", "username")
      .exec();

    if (!transactions)
      return res
        .status(400)
        .json({ error: "Cant get transaction" }, { status: 404 });

    res.status(200).json({ status: true, transactions, totalPage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
module.exports = {
  getUser,
  addUser,
  updateCut,
  updateStatus,
  logout,
  getUserById,
  getBranch,
  transfer,
  transaction,
};
