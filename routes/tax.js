const express = require("express"); /// imort express
const router = express.Router();
const taxe=require("../controllers/tax")

router.get("/get",taxe.getall);
router.post("/add",taxe.insert);
router.put("/update",taxe.update);
router.delete("/delete/:id",taxe.delete);
//commet


module.exports=router;
 