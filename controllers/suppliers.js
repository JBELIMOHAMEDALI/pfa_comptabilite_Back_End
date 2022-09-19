const query = require("../functions/db_query");

exports.getsuppliers = (req, res) => {
 // console.log();
//  const {id_compny} =req.params.id_company;
//   console.log()
  let sql;
  if (req.query.limit) {
    const limit = req.query.limit ;
    const offset = req.query.offset ;
    sql = `select (SELECT COUNT(*) FROM suppliers  
    where suppliers.id_company =${req.params.id_company})
     AS totalItems , suppliers.* from suppliers  where suppliers.id_company=${req.params.id_company}
    LIMIT ${limit} OFFSET ${offset}`;
  } else {//layout companies
    sql = `select suppliers.* from suppliers where suppliers.id_company=${req.params.id_company}`;
  }
  query.sql_request(sql, null, res,true);

};
// exports.get1= (req, res) => {
//   const { id_user } = req.decoded.user;
//   const sql = `select * from suppliers WHERE id_company =${id_user}`;
//   query.sql_request(sql, null, res, true);
// };

exports.insert = (req, res) => {
  const {
    nom_suppliers,
    email_suppliers,
    adr_suppliers,
    id_company
  } = req.body;
  const values = [
    [
      [nom_suppliers,
        email_suppliers,
        adr_suppliers,
        id_company
      ]
    ]
  ];
// 
  const sql = `INSERT INTO suppliers( nom_suppliers, email_suppliers, adr_suppliers, id_company) VALUES ?`;

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
    const {
        nom_suppliers,
        email_suppliers,
        adr_suppliers,
        id
      } = req.body;
      const values = [
          
            nom_suppliers,
            email_suppliers,
            adr_suppliers,
            id
          
      ];
    //   UPDATE `product` SET `id_product`='[value-1]',`name`='[value-2]',`ref`='[value-3]',`quantity`='[value-4]',`description`='[value-5]',`sale_price`='[value-6]',`income_account`='[value-7]',`tax`='[value-8]',`cost`='[value-9]',`expenses_account`='[value-10]',`photo`='[value-11]',`id_company`='[value-12]' WHERE 1
  const sql = `UPDATE suppliers SET nom_suppliers = ? , email_suppliers = ? , adr_suppliers = ? WHERE id = ?`;
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from suppliers where id = ?";
  query.sql_request(sql, values, res);
};
