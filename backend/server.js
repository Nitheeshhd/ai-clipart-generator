const express = require("express");
const cors = require("cors");
require("dotenv").config();

const generateRoute = require("./routes/generate");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/generate", generateRoute);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});