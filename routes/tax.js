const express = require("express"); /// imort express
const router = express.Router();
const tax=require("../controllers/tax")
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company",checkToken,tax.getTaxes);
router.post("/add",checkToken,tax.insert);
router.put("/update",checkToken,tax.update);
router.delete("/delete/:id",checkToken,tax.delete);


module.exports=router;
 