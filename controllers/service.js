const query = require("../functions/db_query");

exports.getservice = (req, res) => {
  let sql;
  if (req.query.limit) {
    const { limit, offset } = req.query;
    sql = `select * , (count(*) OVER()) AS totalItems  from service join suppliers
    on suppliers.id_company=service.id_company 
    where service.id_company=${req.params.id_company}
    and operation = ${req.params.operation} LIMIT ${limit} OFFSET ${offset}`;
  } else {
    //layout companies
    sql = `select service.* from service where service.id_company=${req.params.id_company}`;
  }
  query.sql_request(sql, null, res, true);
};

exports.insert = (req, res) => {
  const {
    name,
    ref,
    description,
    sale_price,
    tax,
    cost,
    operation,
    id_company,
    id_suppliers,
    id_accounting_plan,
  } = req.body;
  const values = [
    [
      [
        name,
        ref,
    description,
        sale_price,
        tax,
        cost,
        operation,
        id_company,
        id_suppliers,
        id_accounting_plan,
      ],
    ],
  ];
  //
  const sql = `INSERT INTO service (name, ref, description, sale_price, tax,cost,operation, id_company, id_suppliers, id_accounting_plan)  VALUES  ?`;

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
  const {
    name,
    ref,
    description,
    sale_price,
    tax,
    cost,
    id_suppliers,
    id_accounting_plan,
    id_service
  } = req.body;
  const values = [
    name,
    ref,
    description,
    sale_price,
    tax,
    cost,
    id_suppliers,
    id_accounting_plan,
    id_service
  ];
  const sql = `UPDATE service SET name = ?, ref = ?, description = ?, sale_price = ?, tax = ?, cost = ?,
   id_suppliers = ?, id_accounting_plan = ?
WHERE id_service = ?`;
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from service where id_service = ?";
  query.sql_request(sql, values, res);
};


exports.getTransactions = (req, res) => {
  const {limit,offset} = req.query
  const {operation,id_company}=req.params
  const sql=`
  SELECT ser.*,sup.*,acc.*,com.name as companyName,com.domain , (count(*) OVER()) AS totalItems from service ser 
  JOIN company com join suppliers sup
  JOIN accounting_plan acc on ser.id_company = com.id_company 
  and ser.id_suppliers = sup.id and ser.id_accounting_plan = acc.id 
  WHERE ser.id_company = ?
  and ser.operation = ? 
  LIMIT ${limit} OFFSET ${offset}  
  `
  query.sql_request(sql, [id_company,operation], res,true);
};