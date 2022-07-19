const express = require("express"); /// imort express
const router = express.Router();
const auth=require("../controllers/authentification")

router.post("/login",auth.login);
router.post("/register",auth.register);
module.exports=router;