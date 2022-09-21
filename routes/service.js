const express = require("express"); /// imort express
const router = express.Router();
const service=require("../controllers/service");
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company/:operation",checkToken,service.getservice);
router.post("/add",checkToken,service.insert);
router.put("/update",checkToken,service.update);
router.delete("/delete/:id",checkToken,service.delete);


router.get("/get/transactions/:id_company/:operation",checkToken,service.getTransactions)

module.exports=router;