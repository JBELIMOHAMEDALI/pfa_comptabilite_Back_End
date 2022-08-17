const express = require("express"); /// imort express
const router = express.Router();
const employees=require("../controllers/employee");
const checkToken = require('../middleware/checkToken');

router.get("/get/:id_company",checkToken,employees.getEmployees);
router.post("/add",checkToken,employees.insert);
router.put("/update",checkToken,employees.update);
router.delete("/delete/:id",checkToken,employees.delete);

module.exports=router;
 