const express = require("express"); /// imort express
const router = express.Router();
const plan_comptable2=require("../controllers/plan_comptable2")

router.put("/update",plan_comptable2.update);

//commet


module.exports=router;
 