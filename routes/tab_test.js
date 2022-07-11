const express = require("express"); /// imort express
const router = express.Router();
const tab_test=require("../controllers/tab_test")

router.get("/get",tab_test.getall);
router.post("/add",tab_test.insert);
router.put("/update",tab_test.update);
router.delete("/delete",tab_test.delete);


module.exports=router;
