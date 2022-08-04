const express = require("express"); /// imort express
const router = express.Router();
const auth=require("../controllers/auth")

router.post("/signin",auth.signin);
router.post("/signup",auth.signup);
router.get("/validate/:hasheduser",auth.validate);
router.post("/reset",auth.reset);
router.post("/google/signin",auth.googlesignin);

module.exports=router;