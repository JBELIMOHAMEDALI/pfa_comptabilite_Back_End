const queryy =require("./db_query");

exports.getall=(req,res)=>{
    const sql="select * from tab_test";
    queryy.sql_request(sql,null,res);

};

exports.insert=(req,res)=>{
    const values=[[[req.body.nom]]];
    const sql="insert into tab_test values ?";
    queryy.sql_request(sql,values,res);
}

exports.update=(req,res)=>{
    const values=[req.body.nom,req.body.id];
    const sql="update tab_test set nom = ? where id = ? ";
    queryy.sql_request(sql,values,res);
}

exports.delete=(req,res)=>{
    const values=[req.params.id];
    const sql="delete from tab_test where id = ?";
    queryy.sql_request(sql,values,res);
}