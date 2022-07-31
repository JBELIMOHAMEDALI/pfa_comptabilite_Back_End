const queryy =require("./db_query");

exports.getallAccounts=(req,res)=>{
    const sql="select * from plan_comptable";
    queryy.sql_request(sql,null,res);
 
}

exports.getall=(req,res)=>{
    const sql="select * from headfacturevente";
    queryy.sql_request(sql,null,res);
 
};
//commet
exports.insert=(req,res)=>{
    let lisTid = []
    let idHead ;
    let idDetail;
    const values=[[[req.body.resultsType.Journal,
                    req.body.resultsType.Serie,
                    req.body.resultsType.Numero,
                    req.body.resultsType.Date,
                    req.body.resultsType.NatureF,
                    req.body.resultsType.NExterne,
                    req.body.resultsType.Reference,
                    JSON.stringify(req.body.detailsType)]]];
                    //
    
    const sql="insert into headfacturevente (`Journal`, `Serie`, `Numero`, `Date`, `NatureF`, `NExterne`, `Reference`, `Detail`) values ?;";
    
    queryy.sql_request(sql,values,res);
}
//
exports.update=(req,res)=>{
    const values=[req.body.resultsType.Journal,
        req.body.resultsType.Serie,
        req.body.resultsType.Numero,
        req.body.resultsType.Date,
        req.body.resultsType.NatureF,
        req.body.resultsType.NExterne,
        req.body.resultsType.Reference,
        JSON.stringify(req.body.detailsType),
        req.body.resultsType.id_head];
    const sql=" UPDATE `headfacturevente` SET Journal= ?, Serie =?, Numero =?, Date =?, NatureF =?, NExterne = ?, Reference = ?,Detail= ? WHERE id_head = ? ";
    queryy.sql_request(sql,values,res);
}

exports.delete=(req,res)=>{
    const values=[req.params.id];
    console.log(values)
    const sql="delete from headfacturevente where id_head = ?";
    queryy.sql_request(sql,values,res);
}

exports.getById=(req,res)=>{
    const values=[req.params.id];
    console.log(values)
    const sql="select * from headfacturevente where id_head = ?";
    queryy.sql_request(sql,values,res);
}
