const express = require("express"); /// imort express
const router = express.Router();
const dashboard=require("../controllers/dashboard");
const checkToken=require("../middleware/checkToken");


router.get("/get",checkToken,dashboard.get);

module.exports=router;
 