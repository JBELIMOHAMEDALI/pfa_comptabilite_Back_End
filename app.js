const express = require('express'); /// imort express
const app=express();//exection express
const db = require("./db_connection");//connection db 
const cors=require("cors");//blopckage du accsses
const test_tab=require("./routes/tab_test");//blopckage du accsses
const users =require("./routes/users")
const facture =require("./routes/facture")
const auth =require("./routes/authentification")
const societe =require("./routes/societe")
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
app.use("/users",users)
app.use("/facture",facture)
app.use("/auth",auth)
app.use("/societe",societe)

//commet
module.exports=app;