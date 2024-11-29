const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const compression = require("compression");
require("dotenv").config();

const userRouter = require("./routes/user");
const cartelaRouter = require("./routes/cartela");
const gameRouter = require("./routes/game");

const app = express();

// app.use(compression());
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/cartela", cartelaRouter);
app.use("/game", gameRouter);
app.get("/", (req, res) => {
  res.send("hi, the server is working");
});

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  })
  .then(() => {
    const port = process.env.PORT || 5500;
    app.listen(port, () => {
      console.log("server started successfully at port ", port);
    });
  })
  .catch((e) => {
    console.error("Error connecting to DB", e.message);
  });

module.exports = app;
