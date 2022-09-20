const query = require("../functions/db_query");

exports.getservice = (req, res) => {
  let sql;
  if (req.query.limit) {
    const { limit, offset } = req.query;
    sql = `select (count() OVER()) AS totalItems ,service. from service  where service.id_company=${req.params.id_company}
    LIMIT ${limit} OFFSET ${offset}`;
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
    quantity,
    sale_price,
    tax,
    id_company,
    id_suppliers,
    id_accounting_plan,
  } = req.body;
  const values = [
    [
      [
        name,
        ref,
        quantity,
        sale_price,
        tax,
        id_company,
        id_suppliers,
        id_accounting_plan,
      ],
    ],
  ];
  //
  const sql = `INSERT INTO service(name, ref, description, sale_price, tax, id_company, id_suppliers,id_accounting_plan) VALUES  ?`;

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
  const {
    name,
    ref,
    quantity,
    sale_price,
    tax,
    id_suppliers,
    id_service,
    id_accounting_plan,
  } = req.body;
  const values = [
    name,
    ref,
    quantity,
    sale_price,
    tax,
    id_suppliers,
    id_service,
    id_accounting_plan,
  ];
  //   UPDATE product SET id_product`='[value-1]',name`='[value-2]',`ref`='[value-3]',`quantity`='[value-4]',`description`='[value-5]',`sale_price`='[value-6]',`income_account`='[value-7]',`tax`='[value-8]',`cost`='[value-9]',`expenses_account`='[value-10]',`photo`='[value-11]',`id_company`='[value-12]' WHERE 1
  const sql = `UPDATE service SET name = ?,ref = ?,description = ?,sale_price = ?,tax = ?,id_suppliers = ?,id_accounting_plan =?
WHERE id_service = ?`;
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from service where id_service = ?";
  query.sql_request(sql, values, res);
};
