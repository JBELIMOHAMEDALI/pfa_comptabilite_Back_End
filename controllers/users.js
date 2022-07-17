const queryy =require("./db_query");

exports.getall=(req,res)=>{
    const sql="select * from users";
    queryy.sql_request(sql,null,res);
 
};
//commet
exports.insert=(req,res)=>{
    const values=[[[req.body.nom,req.body.prenom,req.body.email,req.body.mot_passe,req.body.id_type_users,req.body.id_societe]]];
    const sql="insert into users values ?";
    queryy.sql_request(sql,values,res);
}
//
exports.update=(req,res)=>{
    const values=[req.body.nom,req.body.prenom,req.body.email,req.body.mot_passe,req.body.id_type_users,req.body.id_societe,req.body.id];
    const sql=" UPDATE `users` SET nom= ?, prenom =?, email =?, mot_passe =?, id_type_users =?, id_societe =? WHERE users.id_users = ? ";
    queryy.sql_request(sql,values,res);
}

exports.delete=(req,res)=>{
    const values=[req.params.id];
    const sql="delete from users where id_users = ?";
    queryy.sql_request(sql,values,res);
}
exports.login=(req,res)=>{
    const values=[req.body.email,req.body.passe];
    const sql="select * from users where email = ? et mot_passe = ?";
    queryy.sql_request(sql,values,res);
}