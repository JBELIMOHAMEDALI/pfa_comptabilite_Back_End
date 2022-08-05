const express = require("express"); /// imort express
const router = express.Router();
const passport = require("passport");
require("../config/passportConfig")(passport);

router.get("/", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/callback",
  passport.authenticate("google", {
    // successRedirect: "http://localhost:5001/profile",
    failureRedirect: "http://localhost:5001/login",
    session: false,
    // failureMessage: true,
    // failWithError: true,
  })
  ,
  (req, res) => {
    res.redirect("/profile");
  }
);

module.exports = router;
