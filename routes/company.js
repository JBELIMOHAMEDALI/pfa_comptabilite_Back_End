const express = require("express"); /// imort express
const router = express.Router();
const company=require("../controllers/company");
const checkToken = require('../middleware/checkToken');

router.get("/get",checkToken,company.getUserCompanies);
router.get("/get/selected",checkToken,company.getSelectedCompany);
router.get("/verify/selected",checkToken,company.verifySelectedCompany);

router.post("/add",checkToken,company.insert);
router.put("/update",checkToken,company.update);
router.delete("/delete/:id",checkToken,company.delete);
router.put("/set/selection/:id_company",checkToken,company.setSelected);


module.exports=router;
 