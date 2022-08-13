const express = require('express');
const router=express.Router();
const planComptable=require("../controllers/accountingPlan")
const checkAuth = require('../middleware/checkToken');

router.post('/import/:id_company',checkAuth,planComptable.importFile);

router.delete('/delete/row/:id_row',checkAuth,planComptable.deleterow);

router.delete('/unlink/:id_company/:filename',checkAuth,planComptable.unlinkFile);

router.get('/export/:filename',checkAuth,planComptable.exportFile);

router.get('/get/sources/:id_company',checkAuth,planComptable.getAllUserSources);

router.get('/get/:id_company/:sourceFile',checkAuth,planComptable.getaccountingPlanByCompany);

router.put('/update/:id_row',checkAuth,planComptable.updaterow);

router.post('/add',checkAuth,planComptable.addrow);


module.exports=router;

