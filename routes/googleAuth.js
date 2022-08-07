const express = require("express"); /// imort express
const router = express.Router();
const passport = require("passport");
require("../config/passportConfig")(passport);
const jwt = require('jsonwebtoken');

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
    res.redirect(`http://localhost:4200/app/redirection/${accessToken}`)
  }
);//redirect empty LS and response !=null

module.exports = router;
