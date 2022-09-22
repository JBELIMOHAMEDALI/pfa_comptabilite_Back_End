const queryy =require("../functions/db_query");


// 
exports.get = (req, res) => {

     let  sql = `SELECT SUM(product.cost)+(SELECT SUM(service.sale_price+(service.sale_price*service.tax))
      from service WHERE service.id_company = ${req.params.id_company} and service.operation= ${req.params.operation} ) 
      AS totalprix from product WHERE
       product.id_company = ${req.params.id_company} and product.operation=${req.params.operation}`;

    queryy.sql_request(sql, null, res);
  };