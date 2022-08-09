const queryy =require("../functions/db_query");

exports.getall=(req,res)=>{
    const sql="select * from taxe";
    queryy.sql_request(sql,null,res);
 
}
//commet
exports.insert=(req,res)=>{
    const values=[[[req.body.code_taxe,
                    req.body.intitule,
                    req.body.compte_taxe,
                    req.body.type_de_taxe,
                    req.body.sens,
                    req.body.taux_pourcentage,
                    req.body.numero]]];
                   
                    //
    const sql="insert into taxe (code_taxe,intitule, compte_taxe, type_de_taxe, sens, taux_pourcentage, numero) values ?";
    
    queryy.sql_request(sql,values,res);
}

exports.update=(req,res)=>{
    const values=[req.body.code_taxe,
        req.body.intitule,
        req.body.compte_taxe,
        req.body.type_de_taxe,
        req.body.sens,

        req.body.taux_pourcentage,
        req.body.numero,
        
        req.body.id_taxe
    ];
    const sql="UPDATE `taxe` SET code_taxe = ? , intitule = ? , compte_taxe = ? , type_de_taxe = ? ,sens = ? , taux_pourcentage = ? , numero = ? WHERE id_taxe = ?";
    queryy.sql_request(sql,values,res);
}

exports.delete=(req,res)=>{
    const values=[req.params.id];
    const sql="delete from taxe where id_taxe = ?";
    queryy.sql_request(sql,values,res);
}
