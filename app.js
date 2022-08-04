const express = require("express"); /// import express
const app = express(); //execution express
require("dotenv").config();
const db = require("./db_connection"); //connection db
const cors = require("cors"); //blockage acces
const auth = require("./routes/auth");
const company = require("./routes/company");
const plan_comptable = require("./routes/plan_comptable");
const tax = require("./routes/tax");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.connect((error) => {
  if (error) throw error;
  console.log("Connected to db ");
});

app.use("/auth/user", auth);
app.use("/company", company);
app.use("/plan_comptable", plan_comptable);
app.use("/tax", tax);

//commet
app.use((req, res) => {
  res.status(404).json({ error: "api not found" });
});
module.exports = app;
