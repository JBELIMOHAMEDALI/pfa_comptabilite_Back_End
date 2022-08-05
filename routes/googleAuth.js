const express = require("express"); /// imort express
const router = express.Router();
const passport = require("passport");
require("../config/passportConfig")(passport);

router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5001/login",
    successRedirect: "http://localhost:5001/profile",
    session: false,
    failureMessage: true,
  }),
  // (req, res) => {
    // res.redirect("/profile");
  // }
);

module.exports = router;
