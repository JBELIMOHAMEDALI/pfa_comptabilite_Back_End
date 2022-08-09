const express = require("express"); /// imort express
const router = express.Router();
const auth = require("../controllers/auth");
const passport = require("passport");
const { encryptToken } = require("../functions/encryption");
const {
  checkAuthenticated,
  checkLoginAndRegister,
} = require("../middleware/checkSession");

router.post(
  "/signin",
  passport.authenticate("local", {
    // successRedirect:`http://${process.env.CORS_ORIGIN}/app/redirection/${tokenEncrypted}`,
    failureRedirect: `http://${process.env.CORS_ORIGIN}/signin`,
    failureFlash: true,
  }),
  (req, res) => {
    const accessToken = jwt.sign(
      {
        user: req.user,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: process.env.EXPIRES_IN }
    );
    const tokenEncrypted = encryptToken.encrypt(accessToken);
    res.redirect(
      `http://${process.env.CORS_ORIGIN}/app/redirection/${tokenEncrypted}`
    );
  }
);
// router.post("/signin",auth.signin);
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
  // (req, res) => res.json('access')
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: `http://localhost:4200/app/dashboard?response=${req.user.id}`,
    failureRedirect: `http://${process.env.CORS_ORIGIN}/signin`,
    // session: false,
    // failureMessage: true,
    // failWithError: true,
  }),
  (req, res) => {
    const accessToken = jwt.sign(
      {
        user: req.user,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: process.env.EXPIRES_IN }
    );
    const tokenEncrypted = encryptToken(accessToken);
    res.redirect(
      `http://${process.env.CORS_ORIGIN}/app/redirection/${tokenEncrypted}`
    );
  }
); //redirect empty LS and response !=null

router.get("/check", checkLoginAndRegister, (req, res) => {
 return res.status(200).json({
    check: "validated ! ",
  });
});

router.post("/logout", auth.logout);

module.exports = router;
