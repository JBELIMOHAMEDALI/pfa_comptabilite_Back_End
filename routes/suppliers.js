const express = require("express"); 
const router = express.Router();
const suppliers=require("../controllers/suppliers");
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company",checkToken,suppliers.getsuppliers);
router.post("/add",checkToken,suppliers.insert);
router.put("/update",checkToken,suppliers.update);
router.delete("/delete/:id",checkToken,suppliers.delete);

module.exports=router;
 