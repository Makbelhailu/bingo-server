const Cartela = require("../models/cartelaModel");
const User = require("../models/userModel");

const addCartela = async (req, res) => {
  try {
    const { userId, cartelas } = req.body;

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ status: false, message: "Invalid user" });

    const cartelaData = await Cartela.create({ numbers: cartelas });

    if (!cartelaData)
      return res
        .status(403)
        .json({ status: false, message: "Cant Add Cartelas" });

    user.cartela = cartelaData._id;
    await user.save();

    res.status(201).json({
      status: true,
      cartelas: cartelaData,
      message: "Cartela added Successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: true,
      message: e.message,
    });
  }
};

const addDefaultCartela = async (req, res) => {
  try {
    const { cartelas } = req.body;

    const cartelaData = await Cartela.create({ numbers: cartelas });

    if (!cartelaData)
      return res
        .status(403)
        .json({ status: false, message: "Cant Add Cartelas" });

    res.status(201).json({
      status: true,
      cartelas: cartelaData,
      message: "Cartela added Successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: true,
      message: e.message,
    });
  }
};

const getCartela = async (req, res) => {
  try {
    const { id } = req.params;

    const cartelas = await Cartela.findOne({
      $or: [{ _id: id }, { isDefault: true }],
    });

    if (!cartelas)
      return res
        .status(404)
        .json({ status: false, message: "Can't find Cartela" });

    res.status(200).json({
      status: true,
      cartelas,
      message: "Cartela fetched successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: true,
      message: e.message,
    });
  }
};

module.exports = {
  addCartela,
  getCartela,
  addDefaultCartela,
};
