const query = require("../functions/db_query");

exports.getCustomers = (req, res) => {
  const { id_user } = req.decoded.user;
  const { limit, offset } = req.query;
    const { id_company } = req.params;

  const sql = `select customer.* from customer 
  join user join company on 
    user.id_user=company.id_user and company.id_company=customer.id_company
     where user.id_user=${id_user} and customer.id_company = ${id_company} LIMIT ${limit} OFFSET ${offset}`;
  query.sql_request(sql, null, res, true);
};

exports.list_customer_select_option = (req, res) => {
  const { id_company } = req.params;
  const sql = `SELECT * from customer WHERE id_company = ${id_company}`;
  query.sql_request(sql, null, res, true);
};

exports.insert = (req, res) => {
  const {
    fullname,
    address,
    email,
    phone,
    company_name,
    payment_method,
    id_company
  } = req.body;
  const values = [
    [
      [fullname,
        address,
        email,
        phone,
        company_name,
        payment_method,
        id_company
      ]
    ]
  ];

  const sql = `INSERT INTO customer(fullname,email,phone,address,company_name,payment_method,id_company) VALUES ?`;

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
    const {
        fullname,
        address,
        email,
        phone,
        company_name,
        payment_method,
        id
      } = req.body;
      const values = [
        
          fullname,
            address,
            email,
            phone,
            company_name,
            payment_method,
           id
      ];
  const sql = `UPDATE customer SET fullname = ?, address = ?, email = ?, phone=? ,company_name = ?,payment_method = ?
    WHERE id = ?`;
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from customer where id = ?";
  query.sql_request(sql, values, res);
};


// (SELECT COUNT(*) FROM customer
// join user join company on 
//   user.id_user=company.id_user and company.id_company=customer.id_company
//    where user.id_user=${id_user} and customer.id_company = ${id_company}) 
//    AS totalItems,