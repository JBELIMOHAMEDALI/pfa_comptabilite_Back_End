const client = require('../db_connection');
module.exports.sql_request=(sql,values,res)=>{
    client.query(sql,values,(err,rows)=>{
        if(!err){
            //console.log(rows,err);
            if(rows.length>0||rows.affectedRows>0)
               return res.status(sql.includes('insert')?201:200).json({
                
                    err:false,
                    rows:rows,
                    message:'Successful operation !'
                })
            else
              return  res.status(404).json({
                    err:false,
                    rows:[],
                    //message:"Aucune données trouvées ! "
                    message:err,
                })        
        }
    
        else{
            return res.status(500).json({
                err:true,
                 message:err.sqlMessage,
                 //reqq:values
               // message:err.sqlMessage.includes('Duplicate')?'Redondances de données ! ':'Opération non effectuée ! Réessayer plus tard',
            });
        }
    })

}