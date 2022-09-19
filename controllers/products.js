const query = require("../functions/db_query");

exports.getproducts = (req, res) => {
  let sql;
  if (req.query.limit) {
    const {limit,offset} = req.query
    sql = `select suppliers.nom_suppliers,suppliers.adr_suppliers,product.* from suppliers join product on 
    suppliers.id=product.id_suppliers where product.id_company= ${req.params.id_company} LIMIT ${limit} OFFSET ${offset}`;
  } else {//layout companies
    sql = `select product.* from product where product.id_company=${req.params.id_company}`;
  }
  query.sql_request(sql, null, res,true);
};

exports.insert = (req, res) => {
  const {
    name,
    ref,
    quantity,
    description,
    sale_price,
    tax,
    cost,
    expenses_account,
    id_company,
    id_suppliers,
    id_accounting_plan 
    
  } = req.body;
  const values = [
    [
      [name,
        ref,
        quantity,
        description,
        sale_price,
        tax,
        cost,
        expenses_account,
        id_suppliers,
        id_company,
        id_accounting_plan 
        
      ]
    ]
  ];
console.log(values)
  const sql = `INSERT INTO product  (name, ref, quantity, description, sale_price, tax, cost, id_company, id_suppliers, id_accounting_plan) VALUES ?`;

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
    const {
        name,
        ref,
        quantity,
        description,
        sale_price,
        tax,
        cost,
        expenses_account,
        id_company,
        id_suppliers,
        id_accounting_plan
        ,id
      } = req.body;
      const values = [
        [
          [name,
            ref,
            quantity,
            description,
            sale_price,
            tax,
            cost,
            expenses_account,
            id_company,
            id_suppliers,
            id_accounting_plan,
            ,id
          ]
        ]
      ];
    //   UPDATE `product` SET `id_product`='[value-1]',`name`='[value-2]',`ref`='[value-3]',`quantity`='[value-4]',`description`='[value-5]',`sale_price`='[value-6]',`income_account`='[value-7]',`tax`='[value-8]',`cost`='[value-9]',`expenses_account`='[value-10]',`photo`='[value-11]',`id_company`='[value-12]' WHERE 1
  const sql = `UPDATE product SET name = ?,ref = ?,quantity = ?,description = ?,sale_price = ?,tax = ?,cost = ?,expenses_account = ?,id_company = ?,id_suppliers = ?,id_accounting_plan = ?
  WHERE id_product = ?`;
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from product where id_product = ?";
  query.sql_request(sql, values, res);
};


// (SELECT COUNT(*) FROM product where product.id_company = ${req.params.id_company}) AS totalItems , 
