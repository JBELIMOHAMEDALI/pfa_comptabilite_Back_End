const express = require('express');
const router=express.Router();
const planComptable=require("../controllers/accountingPlan")
const checkAuth = require('../middleware/checkToken');

router.post('/import',planComptable.importFile)

router.delete('/unlink/:fileName',planComptable.unlinkFile)

router.get('/export/:fileName',planComptable.exportFile)

router.get('/get/:id_company/:srouceFile',planComptable.getaccountingPlanByCompany);

router.get('/get/sources/:id_company',planComptable.getAllUserSources);



module.exports=router;

