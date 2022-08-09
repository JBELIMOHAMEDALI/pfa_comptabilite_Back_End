const express = require("express"); /// imort express
const router = express.Router();
const dashboard=require("../controllers/dashboard");
const checkToken=require("../middleware/checkToken");
const {checkAuthenticated}=require("../middleware/checkSession");


router.get("/get",checkAuthenticated,checkToken,dashboard.get);

module.exports=router;
 