const express = require("express"); /// imort express
const router = express.Router();
const facture=require("../controllers/facture")

router.get("/get",facture.getall);
router.post("/add",facture.insert);
router.put("/update",facture.update);
router.delete("/delete",facture.delete);

//commet


module.exports=router;
 