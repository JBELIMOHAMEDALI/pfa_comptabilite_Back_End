const express = require("express"); /// imort express
const router = express.Router();
const auth = require("../controllers/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const checkToken = require('../middleware/checkToken');

router.post(
  "/signin",
  passport.authenticate("local", {
    failureFlash: true,
  }),
  (req, res) => {
    const { status } = req.user;
    return res.status(status).json(req.user);
  }
);

router.post("/signup", auth.signup);
router.get("/validate/:hasheduser", auth.validate);

router.post("/verify/reset/email", auth.verify_reset_email);
router.post("/verify/reset/code", auth.verify_reset_code);
router.put("/reset/password", auth.reset_password);

router.post('/refresh',auth.refresh)


router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: `http://localhost:4200/app/dashboard?response=${req.user.id}`,
    failureRedirect: `${process.env.CORS_ORIGIN}/signin`,
    // session: false,
  }),
  (req, res) => {
    // const accessToken = jwt.sign(
    //   {
    //     user: req.user,
    //   },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "1h" }
    // );
    res.redirect(
      `${process.env.CORS_ORIGIN}/app/redirection/${req.user.refreshToken}`
    );
  }
); //redirect empty LS and response !=null

router.delete("/logout", checkToken,auth.logout);

module.exports = router;
