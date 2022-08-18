const express = require('express');
const router=express.Router();
const accountingPlan=require("../controllers/accountingPlan")
const checkAuth = require('../middleware/checkToken');

router.post('/import/:id_company',checkAuth,accountingPlan.importFile);
router.delete('/unlink/:id_company/:uploadFile',checkAuth,accountingPlan.unlinkFile);
// router.get('/export/:filename',checkAuth,accountingPlan.exportFile);
router.get('/get/sources/:id_company',checkAuth,accountingPlan.getAllSources);
router.get('/get/:id_company/:uploadFile',checkAuth,accountingPlan.getaccountingPlanByCompany);

//CRUD
router.put('/update/:id_row',checkAuth,accountingPlan.updaterow);
router.post('/add/row',checkAuth,accountingPlan.addrow);
router.delete('/delete/row/:id_row',checkAuth,accountingPlan.deleterow);

router.post('/add',checkAuth,accountingPlan.addAccountingPlan);


module.exports=router;

