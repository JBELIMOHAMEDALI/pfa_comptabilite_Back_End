const express = require("express"); /// imort express
const router = express.Router();
const passport = require("passport");
const passportConfig=require("../config/passportConfig")(passport);
const jwt = require('jsonwebtoken');
const encryptToken = require('../middleware/encryptToken');



// passportConfig(passport,)//find userby id methods



router.get(
  "/",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
  // (req, res) => res.json('access')
);
router.get(
  "/callback",
  passport.authenticate("google", {
    // successRedirect: `http://localhost:4200/app/dashboard?response=${req.user.id}`,
    failureRedirect: "http://localhost:4200/signin",
    session: false,
    failureMessage: true,
    failWithError: true,
  }),
  (req, res) => {

    const accessToken = jwt.sign(
      {
        user: req.user,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: process.env.EXPIRES_IN }
    );
    const tokenEncrypted=encryptToken.encrypt(accessToken)
    res.redirect(`http://localhost:4200/app/redirection/${tokenEncrypted}`)
  }
);//redirect empty LS and response !=null

module.exports = router;
