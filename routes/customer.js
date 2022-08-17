const express = require("express"); /// imort express
const router = express.Router();
const customer=require("../controllers/customer");
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company",checkToken,customer.getCustomers);
router.post("/add",checkToken,customer.insert);
router.put("/update",checkToken,customer.update);
router.delete("/delete/:id",checkToken,customer.delete);

module.exports=router;
 