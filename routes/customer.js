const express = require("express"); /// imort express
const router = express.Router();
const customer=require("../controllers/customer");
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company",checkToken,customer.getCustomers);
router.get("/list_customer_select_option/:id_company",checkToken,customer.list_customer_select_option);
router.post("/add",checkToken,customer.insert);
router.put("/update",checkToken,customer.update);
router.delete("/delete/:id",checkToken,customer.delete);

module.exports=router;
 