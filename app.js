const express = require('express'); /// imort express
const app=express();//exection express
const db = require("./db_connection");//connection db 
const cors=require("cors");//blopckage du accsses
const test_tab=require("./routes/tab_test");//blopckage du accsses
app.use(express.urlencoded({extended: true}));  
app.use(express.json());
db.connect((error)=>{
if(error){
    console.log(error.message);
}else{
    console.log("Connecte to db ")
}
})
app.use(cors())
app.use("/test_tab",test_tab)


module.exports=app;