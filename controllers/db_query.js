const client = require('../db_connection');
module.exports.sql_request=(sql,values,res)=>{
    client.query(sql,values,(err,rows)=>{
        if(!err){
            if(rows.length>0||rows.affectedRows>0)
               return res.status(sql.includes('insert')?201:200).json({
                    err:false,
                    rows:rows,
                })
            else
              return  res.status(404).json({
                    err:false,
                    rows:[],
                    message:"Aucune données trouvées ! "
                })        
        }
    
        else{
            client.rollback()
            return res.status(500).json({
                err:true,
                // message:err.sqlMessage
                message:err.sqlMessage.includes('Duplicate')?'Redondances de données ! ':'Opération non effectuée ! Réessayer plus tard',
            });
        }
    })

}