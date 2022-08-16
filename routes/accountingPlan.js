const express = require('express');
const router=express.Router();
const accountingPlan=require("../controllers/accountingPlan")
const checkAuth = require('../middleware/checkToken');

router.post('/import/:id_company',checkAuth,accountingPlan.importFile);
router.delete('/unlink/:id_company/:filename',checkAuth,accountingPlan.unlinkFile);
// router.get('/export/:filename',checkAuth,accountingPlan.exportFile);
router.get('/get/sources/:id_company',checkAuth,accountingPlan.getAllUserSources);
router.get('/get/:id_company/:sourceFile',checkAuth,accountingPlan.getaccountingPlanByCompany);

//CRUD
router.put('/update/:id_row',checkAuth,accountingPlan.updaterow);
router.post('/add',checkAuth,accountingPlan.addrow);
router.delete('/delete/row/:id_row',checkAuth,accountingPlan.deleterow);


module.exports=router;

