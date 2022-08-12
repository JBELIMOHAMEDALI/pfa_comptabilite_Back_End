const express = require('express');
const router=express.Router();
const planComptable=require("../controllers/planComptable")
const checkAuth = require('../middleware/checkToken');

router.post('/import',checkAuth,planComptable.importFile)

router.delete('/unlink/:fileName',checkAuth,planComptable.unlinkFile)


module.exports=router;

