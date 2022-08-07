const express = require("express"); /// imort express
const router = express.Router();
const dashboard=require("../controllers/dashboard");
const checkUserAuth=require("../middleware/checkAuth");

router.get("/get",checkUserAuth,dashboard.get);

module.exports=router;
 