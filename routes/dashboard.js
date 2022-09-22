const express = require("express"); /// imort express
const router = express.Router();
const dashboard=require("../controllers/dashboard");
const checkToken=require("../middleware/checkToken");


router.get("/get/:id_company/:operation",checkToken,dashboard.get);

module.exports=router;
 