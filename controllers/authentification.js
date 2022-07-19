const queryy =require("./db_query");
const bcrypt =require("bcrypt");
const client = require('../db_connection');
exports.login=(req,res)=>{
    const values=[req.body.email,req.body.passe];
   // console.log(email,mot_passe)
  //  console.log("okkokkkko")
   
    const sql="select * from users where email = ? ";
    client.query(sql,values,(err,rows)=>{
        if(!err){
          //  console.log(rows[0].mot_passe);
            if(rows.length==1){
                bcrypt.compare(req.body.mot_passe,rows[0].mot_passe,(err,same)=>{
                    if(err){
                        return  res.status(500).json({
                            err:true,
                            message: "Auth failed ! Check email AND/OR password ",
                            //message:err,
                        })    
                    }
                    if(same){
                        return res.status(200).json({
           
                            err:false,
                            rows:rows,
                            message:'utilisateur trouvé'
                        })
                    }else{
                        return  res.status(404).json({
                            err:true,
                            message: "Auth failed ! Check email AND/OR password ",

                           // message:err,
                        })    
                    }
                })
            }
            else
              return  res.status(404).json({
                    err:false,
                    rows:[],
                    message:"Aucun utilisateur trouvé ! "
                   // message:err,
                })        
        }else{
            return  res.status(500).json({
                err:true,
                message:err.sqlMessage
               // message:err,
            })    
        }
    })
    

}
exports.register=(req,res)=>{
    const {nom,prenom,email,mot_passe,id_type_users,id_societe}=req.body;
    //const pass=req.body.mot_passe;
    bcrypt.hash(mot_passe,10,(err,encrypted)=>{
        if(err){
            return  res.status(500).json({
                err:true,
                message: "Auth failed ! Check email AND/OR password ",
                //message:err,
            })    
            
            
        }else{
            const values=[[[nom,prenom,email,encrypted,id_type_users,id_societe]]];
            const sql="insert into users (nom, prenom, email, mot_passe, id_type_users, id_societe)  values ?";
            queryy.sql_request(sql,values,res);
        }
    })
   

}



