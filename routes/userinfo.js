const express = require("express"); /// imort express
const router = express.Router();
const userinfo=require("../controllers/userinfo")
const checkToken = require('../middleware/checkToken');

router.get("/info",checkToken,userinfo.getuserinfo);



module.exports=router;
 