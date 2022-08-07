const express = require("express"); /// imort express
const router = express.Router();
const plan_comptable=require("../controllers/plan_comptable")

router.get("/get",plan_comptable.getall);
router.post("/add",plan_comptable.insert);
router.put("/update",plan_comptable.update);
router.delete("/delete/:id",plan_comptable.delete);


module.exports=router;
 