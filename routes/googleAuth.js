const express = require("express"); /// imort express
const router = express.Router();
const passport = require("passport");
require("../config/passportConfig")(passport);

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
    successRedirect: "http://localhost:4200/user/dashboard",
    failureRedirect: "http://localhost:4200/signin",
    session: false,
    failureMessage: true,
    // failWithError: true,
  }),
  (req, res) => {
    // res.redirect("/profile");
  }
);

module.exports = router;
