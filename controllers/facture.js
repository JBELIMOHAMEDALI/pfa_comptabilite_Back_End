const queryy =require("./db_query");

exports.getall=(req,res)=>{
    const sql="select * from facture";
    queryy.sql_request(sql,null,res);
 
};
//commet
exports.insert=(req,res)=>{
    const values=[[[req.body.numero_facture,req.body.id_client,req.body.date_de_livraison,req.body.reference,req.body.reference_article,req.body.designation,req.body.prix_unitaire_hors_taxe,req.body.quantité_demandee,req.body.stock,req.body.conditionnement,req.body.remise,req.body.prix_unitaire_net]]];
    const sql="insert into facture values ?";
    
    queryy.sql_request(sql,values,res);
    console.log(queryy.sql_request(sql,values,res));
}
//
exports.update=(req,res)=>{
    const values=[req.body.numero_facture,req.body.id_client,req.body.date_de_livraison,req.body.reference,req.body.reference_article,req.body.designation,req.body.prix_unitaire_hors_taxe,req.body.quantité_demandee,req.body.stock,req.body.conditionnement,req.body.remise,req.body.prix_unitaire_net];
    const sql=" UPDATE `facture` SET numero_facture= ?, id_client =?, date_de_livraison =?, reference =?, reference_article =?, designation =?, prix_unitaire_hors_taxe =?, stock =?, conditionnement =?, remise =?, prix_unitaire_net =? WHERE facture.id_facture = ? ";
    queryy.sql_request(sql,values,res);
}

exports.delete=(req,res)=>{
    const values=[req.params.id];
    const sql="delete from facture where id_facture = ?";
    queryy.sql_request(sql,values,res);
}
