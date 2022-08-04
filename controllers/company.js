const queryy =require("../middleware/db_query");

exports.getall=(req,res)=>{
    const sql="select * from societe";
    queryy.sql_request(sql,null,res);
 
};
exports.insert=(req,res)=>{
    const {nom_societe,domaine_societe}=req.body;
    const values=[[[nom_societe,domaine_societe]]];
                    console.log(req.body)
                    //
    const sql="INSERT INTO societe(nom_societe, domaine_societe) VALUES ?";
    
    queryy.sql_request(sql,values,res);
    //console.log(queryy.sql_request(sql,values,res));
}
//
exports.update=(req,res)=>{
    const {nom_societe,domaine_societe,id_societe}=req.body;

    const values=[nom_societe,domaine_societe,id_societe];
    const sql="UPDATE societe SET nom_societe = ?, domaine_societe = ? WHERE id_societe = ?";
    queryy.sql_request(sql,values,res);
}

exports.delete=(req,res)=>{
    const values=[req.params.id];
    console.log(values)
    const sql="delete from societe where id_societe = ?";
    queryy.sql_request(sql,values,res);
}
