const User = require("../models/userModel");
const Cartela = require("../models/cartelaModel");

const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }).populate("cartela");

    if (!user) {
      return res.status(404).json({ status: false, message: "Invalid User" });
    }
    if (!user.cartela) {
      const cartela = await Cartela.findOne({ isDefault: true });
      user.cartela = cartela;
    }

    res.cookie("user", JSON.stringify(user), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ status: true, data: user, message: "Login Successfully" });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("user");
  res.status(200).json({ status: true, message: "Logged out Successfully" });
};

const addUser = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.create(data);

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Cant Create User" });
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

module.exports = {
  getUser,
  addUser,
  updateCut,
  updateStatus,
  logout,
};
