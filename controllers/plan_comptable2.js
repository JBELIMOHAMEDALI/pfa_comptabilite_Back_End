exports.update=(req,res)=>{
    const {nom_societe,domaine_societe,id_societe}=req.body;

    const values=[nom_societe,domaine_societe,id_societe];
    const sql="UPDATE societe SET nom_societe = ?, domaine_societe = ? WHERE id_societe = ?";
    queryy.sql_request(sql,values,res);
}