const express = require("express"); /// imort express
const router = express.Router();
const products=require("../controllers/products");
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company",checkToken,products.getproducts);
router.post("/add",checkToken,products.insert);
router.put("/update",checkToken,products.update);
router.delete("/delete/:id",checkToken,products.delete);

module.exports=router;
 