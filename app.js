const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const app = express();
const db = require("./db/db.js");

const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/accountRoutes.js");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, auth-token"
  );
  next();
});

app.use(express.json());
app.use("/api/user", authRoutes);
app.use("/api/account", accountRoutes);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
