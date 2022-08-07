const express = require("express"); /// imort express
const router = express.Router();
const company=require("../controllers/company")

router.get("/get",company.getall);
router.post("/add",company.insert);
router.put("/update",company.update);
router.delete("/delete/:id",company.delete);

module.exports=router;
 