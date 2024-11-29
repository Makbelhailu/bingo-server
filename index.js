const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const os = require("os")
const { exec } = require("child_process");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const userRouter = require("./routes/user");
const cartelaRouter = require("./routes/cartela");
const gameRouter = require("./routes/game");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/cartela", cartelaRouter);
app.use("/game", gameRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => {
    const port = process.env.PORT || 5500;
    app.listen(port, () => {
      console.log("server started successfully at port ", port);
      if (os.platform() === "win32") {
        exec("start http://localhost:" + port);
      } else if (os.platform() === "linux") {
        exec("xdg-open http://localhost:" + port);
      }
    });
  })
  .catch((e) => {
    console.error("Error connecting to DB", e.message);
  });

