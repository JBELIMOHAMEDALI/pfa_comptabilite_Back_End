const express = require("express"); /// imort express
const router = express.Router();
const societe=require("../controllers/societe")

router.get("/get",societe.getall);
router.post("/add",societe.insert);
router.put("/update",societe.update);
router.delete("/delete/:id",societe.delete);
//commet

module.exports=router;
 