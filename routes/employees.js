const express = require("express"); /// imort express
const router = express.Router();
const employees=require("../controllers/employees");
const checkToken = require('../middleware/checkToken');

router.get("/get",checkToken,employees.getUserEmployees);
router.post("/add",checkToken,employees.insert);
router.put("/update",checkToken,employees.update);
router.delete("/delete/:id",checkToken,employees.delete);

module.exports=router;
 