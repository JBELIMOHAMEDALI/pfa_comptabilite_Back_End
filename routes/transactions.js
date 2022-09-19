const express = require("express"); /// imort express
const router = express.Router();
const transactions=require("../controllers/transactions");
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company",checkToken,transactions.getTransactions);

module.exports=router;
 