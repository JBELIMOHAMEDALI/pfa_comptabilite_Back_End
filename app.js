require("dotenv").config();
const express = require("express"); /// import express
const app = express(); //execution express
const db = require("./config/db_config"); //connection db
const cors = require("cors"); //blockage acces
const auth = require("./routes/auth");

const googleAuth = require("./routes/googleAuth");

const company = require("./routes/company");
const plan_comptable = require("./routes/plan_comptable");
const tax = require("./routes/tax");
const passport = require("passport");
require("./config/passportConfig")(passport);



app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // origin:"*"
  })
  );
  
// app.set('view-engine','ejs');
// app.get('/login',(req,res)=>{
//   res.render('login.ejs')
// })
// app.get('/profile',(req,res)=>{
//   res.render('profile.ejs')
// })

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
app.use("/auth/google",googleAuth);



app.use((req, res) => {
  res.status(404).json({ error: "api not found" });
});
module.exports = app;
