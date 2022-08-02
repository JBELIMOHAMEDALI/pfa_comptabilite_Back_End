const express = require("express"); /// import express
const router = express.Router();
const facture=require("../controllers/facture")

router.get("/getAccounts", facture.getallAccounts);
router.get("/get",facture.getall);
router.post("/add",facture.insert);
router.put("/update",facture.update);
router.delete("/delete/:id",facture.delete);
router.get("/getByID/:id", facture.getById);

//commet


module.exports=router;
 
