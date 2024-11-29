const Cartela = require("../models/cartelaModel");
const User = require("../models/userModel");

const addCartela = async (req, res) => {
  try {
    const { userId, cartela } = req.body;

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ status: false, message: "Invalid user" });

    if (user.cartela) {
      const cartelaData = await Cartela.findById(user.cartela);
      if (!cartelaData || cartelaData.isDefault) {
        const newCartela = await Cartela.create({ numbers: cartela });

        if (!newCartela)
          return res
            .status(403)
            .json({ status: false, message: "Cant Add Cartelas" });

        user.cartela = newCartela._id;
        await user.save();

        return res.status(201).json({
          status: true,
          cartela: newCartela,
          message: "Cartela added Successfully",
        });
      }

      const modCartela = new Map(cartelaData.numbers);
      Object.entries(cartela).forEach(([key, value]) => {
        modCartela.set(key, value);
      });
      cartelaData.numbers = modCartela;
      await cartelaData.save();

      return res.status(201).json({
        status: true,
        cartela: cartelaData,
        message: "Cartela added Successfully",
      });
    } else {
      const cartelaData = await Cartela.create({ numbers: cartela });

      if (!cartelaData)
        return res
          .status(403)
          .json({ status: false, message: "Cant Add Cartelas" });

      user.cartela = cartelaData._id;
      await user.save();

      return res.status(201).json({
        status: true,
        cartela: cartelaData,
        message: "Cartela added Successfully",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: true,
      message: e.message,
    });
  }
};

const addDefaultCartela = async (req, res) => {
  try {
    const { cartela } = req.body;

    const cartelaData = await Cartela.create({
      numbers: cartela,
      isDefault: true,
    });

    if (!cartelaData)
      return res
        .status(403)
        .json({ status: false, message: "Cant Add Cartelas" });

    res.status(201).json({
      status: true,
      cartela: cartelaData,
      message: "Cartela added Successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: true,
      message: e.message,
    });
  }
};

const applyDefaultCartela = async (req, res) => {
  try {
    const { id } = req.params;

    const cartelaData = await Cartela.findOne({ isDefault: true });

    if (!cartelaData)
      return res
        .status(403)
        .json({ status: false, message: "Cant Apply Cartelas" });

    const newCartela = await Cartela.create({ numbers: cartelaData.numbers });

    if (!newCartela)
      return res
        .status(403)
        .json({ status: false, message: "Cant Create Default Cartelas" }); 

    const userData = await User.findByIdAndUpdate(id, { cartela: newCartela._id });

    if (!userData) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid User" });
    }

    res.status(201).json({
      status: true,
      cartela: cartelaData,
      message: "Cartela Apply Successfully",
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

    const cartela = await Cartela.findOne({
      $or: [{ _id: id }, { isDefault: true }],
    });

    if (!cartela)
      return res
        .status(404)
        .json({ status: false, message: "Can't find Cartela" });

    res.status(200).json({
      status: true,
      cartela,
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
  applyDefaultCartela
};
