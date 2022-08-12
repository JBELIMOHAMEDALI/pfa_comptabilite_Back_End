const express = require('express');
const router=express.Router();
const planComptable=require("../controllers/accountingPlan")
const checkAuth = require('../middleware/checkToken');

router.post('/import',checkAuth,planComptable.importFile)

router.delete('/unlink/:fileName',checkAuth,planComptable.unlinkFile)

router.get('/export/:fileName',checkAuth,planComptable.exportFile)

router.get('/get/:id_company/:srouceFile',checkAuth,planComptable.getaccountingPlanByCompany);

router.get('/get/sources/:id_company',checkAuth,planComptable.getAllUserSources);



module.exports=router;

