const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
// const compression = require("compression");
require("dotenv").config();

const userRouter = require("./routes/user");
const cartelaRouter = require("./routes/cartela");
const gameRouter = require("./routes/game");

const app = express();

// app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use(
  "/bingo-audio",
  express.static(path.join(__dirname, "dist", "public", "bingo-audio"))
);

app.use("/api/user", userRouter);
app.use("/api/cartela", cartelaRouter);
app.use("/api/game", gameRouter);

app.use("/bingo-audio", (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  next();
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.get("/test", (req, res) => {
  res.send("server is working");
});

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  })
  .then(() => {
    const port = process.env.PORT || 5500;
    app.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error("Error connecting to DB", e.message);
  });

module.exports = app;
