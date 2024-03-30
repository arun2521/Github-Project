require("dotenv").config({ path: "src/.env" });
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoute");

const app = express();
app.use(express.json());

app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;

// console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to db"))
  .catch((e) => console.error(e));

app.listen(PORT, () => {
  console.log("listening");
});
