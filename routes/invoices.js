const express = require("express"); /// imort express
const router = express.Router();
const invoices=require("../controllers/invoices");
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company",checkToken,invoices.getinvoices);

module.exports=router;
 