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
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      err: false,
      message: "Auth successfull !",
      accessToken
    });
  }
);

module.exports = router;
