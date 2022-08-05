const express = require("express"); /// imort express
const router = express.Router();
const auth=require("../controllers/auth")

router.post("/signin",auth.signin);
router.post("/signup",auth.signup);
router.get("/validate/:hasheduser",auth.validate);

router.post("/verify/reset/email",auth.verify_reset_email);
router.post("/verify/reset/code",auth.verify_reset_code);
router.put("/reset/password",auth.reset_password);

module.exports=router;