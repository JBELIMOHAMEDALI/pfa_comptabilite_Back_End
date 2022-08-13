const express = require("express"); /// imort express
const router = express.Router();
const auth = require("../controllers/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post(
  "/signin",
  passport.authenticate("local", {
    failureFlash: true,
  }),
  (req, res) => {
    const { uid, status } = req.user;
    // if (uid === -1) {
    //   req.session.destroy();
    // } else {
    //   const hour = 3600000;
    //   req.session.cookie.expires = new Date(Date.now() + hour);
    //   req.session.cookie.maxAge = hour;
    // }
    // req.session.save()
    return res.status(status).json(req.user);
  }
);

router.post("/signup", auth.signup);
router.get("/validate/:hasheduser", auth.validate);

router.post("/verify/reset/email", auth.verify_reset_email);
router.post("/verify/reset/code", auth.verify_reset_code);
router.put("/reset/password", auth.reset_password);

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
    const accessToken = jwt.sign(
      {
        user: req.user,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.EXPIRES_IN }
    );
    // const tokenEncrypted = encryptToken(accessToken);
    res.redirect(
      `${process.env.CORS_ORIGIN}/app/redirection/${accessToken}`
    );
  }
); //redirect empty LS and response !=null

router.post("/logout", auth.logout);

module.exports = router;
