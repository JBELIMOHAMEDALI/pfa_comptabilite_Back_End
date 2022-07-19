const express = require("express"); /// imort express
const router = express.Router();
const user=require("../controllers/users")

router.get("/get",user.getall);
router.post("/add",user.insert);
router.put("/update",user.update);
router.delete("/delete",user.delete);
//commet


module.exports=router;
 