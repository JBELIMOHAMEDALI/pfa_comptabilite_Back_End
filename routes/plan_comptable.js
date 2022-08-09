const express = require("express"); /// imort express
const router = express.Router();
const plan_comptable=require("../controllers/plan_comptable")
const checkToken = require('../middleware/checkToken');

router.get("/get",checkToken,plan_comptable.getall);
router.post("/add",checkToken,plan_comptable.insert);
router.put("/update",checkToken,plan_comptable.update);
router.delete("/delete/:id",checkToken,plan_comptable.delete);


module.exports=router;
 