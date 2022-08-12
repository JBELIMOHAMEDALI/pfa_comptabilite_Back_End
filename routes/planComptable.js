const express = require('express');
const router=express.Router();
const planComptable=require("../controllers/planComptable")
const checkAuth = require('../middleware/checkToken');

router.post('/import',planComptable.importFile)

router.delete('/unlink/:fileName',planComptable.unlinkFile)

router.get('/export/:fileName',planComptable.exportFile)

module.exports=router;

