require("dotenv").config();
const express = require("express"); /// import express
const app = express(); //execution express
const db = require("./config/db_config"); //connection db
const cors = require("cors"); //blockage acces
const auth = require("./routes/auth");

const employees = require("./routes/employees");

const session = require("express-session");

const company = require("./routes/company");
const accountingPlan = require("./routes/accountingPlan");
const tax = require("./routes/tax");
const dashboard = require("./routes/dashboard");
const userInfo = require("./routes/userinfo");

const passport = require("passport");
const {initGooglePassportConfig,initLocalPassportConfig}=require("./config/passportConfig");



app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  cookie: {  }

}));

app.use(passport.initialize());
app.use(passport.session())


initGooglePassportConfig(passport)
initLocalPassportConfig(passport)


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

app.use('/uploads/excel-files',express.static('uploads/excel-files'))


app.use("/dashboard", dashboard);
app.use("/auth/user", auth);
app.use("/company", company);
// app.use("/plan_comptable", plan_comptable);
app.use("/tax", tax);
app.use("/user", userInfo);
app.use("/employee", employees);
app.use("/accounting/plan", accountingPlan);




app.use((req, res) => {
  res.status(404).json({ error: "api not found" });
});
module.exports = app;
//require('crypto').randomBytes(48, function(err, buffer) { var token = buffer.toString('hex'); console.log(token)});