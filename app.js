const express = require('express'); /// imort express
const app=express();//exection express
const db = require("./db_connection");//connection db 
const cors=require("cors");//blopckage du accsses
const test_tab=require("./routes/tab_test");//blopckage du accsses
const users =require("./routes/users")
// const facture =require("./routes/facture")
const auth =require("./routes/authentification")
const societe =require("./routes/societe")
const plan_comptable =require("./routes/plan_comptable")
const plan_comptable2 =require("./routes/plan_comptable2")
const taxe=require("./routes/taxe")
app.use(cors({
    origin:"http://localhost:4200",
}))

app.use(express.urlencoded({extended: true}));  
app.use(express.json());
db.connect((error)=>{
if(error){
    console.log(error.message);
}else{
    console.log("Connecte to db ")
}
})

app.use("/test_tab",test_tab)
app.use("/users",users)
// app.use("/facture",facture)
app.use("/auth",auth)
app.use("/societe",societe)
app.use("/test",plan_comptable2)
app.use("/plan_comptable",plan_comptable)
app.use("/taxe",taxe)

//commet
app.use((req, res) => {
    res.status(404).json({ error: 'api not found' })
  })
module.exports=app;