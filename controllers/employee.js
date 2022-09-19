const query = require("../functions/db_query");

exports.getEmployees = (req, res) => {
  const { id_user } = req.decoded.user;
  const { id_company } = req.params;
  const { limit, offset } = req.query;
  const sql = `select (count(*) OVER()) AS totalItems ,employee.* from employee 
  join user join company on 
    user.id_user=company.id_user and company.id_company=employee.id_company
     where user.id_user=${id_user} and employee.id_company=${id_company} 
     LIMIT ${limit} OFFSET ${offset}`;
  query.sql_request(sql, null, res, true);
};

exports.insert = (req, res) => {
  const {
    fullname,
    address,
    email,
    phone,
    salary,
    gender,
    hiredate,
    birthdate,
    id_company,
  } = req.body;
  const values = [
    [
      [
        fullname,
        address,
        email,
        phone,
        salary,
        gender,
        hiredate,
        birthdate,
        id_company,
      ],
    ],
  ];

  const sql = `INSERT INTO employee(fullname, address,email,phone,salary,gender,hiredate,birthdate,id_company) VALUES ?`;

  query.sql_request(sql, values, res);
};
//
exports.update = (req, res) => {
  const {
    fullname,
    address,
    email,
    phone,
    salary,
    gender,
    hiredate,
    birthdate,
    id_company,
    id_employee,
  } = req.body;

  const values = [
    fullname,
    address,
    email,
    phone,
    salary,
    gender,
    hiredate,
    birthdate,
    id_company,
    id_employee,
  ];
  const sql = `UPDATE employee SET fullname = ?, address = ?, email = ?,phone = ?,salary = ?,gender=?,
  hiredate=?,birthdate=?,id_company=? 
    WHERE id_employee = ?`;
  query.sql_request(sql, values, res);
};

exports.delete = (req, res) => {
  const values = [req.params.id];
  const sql = "delete from employee where id_employee = ?";
  query.sql_request(sql, values, res);
};


// (SELECT COUNT(*) FROM employee
// join user join company on 
//   user.id_user=company.id_user and company.id_company=employee.id_company
//    where user.id_user=${id_user} and employee.id_company=${id_company}) 
//    AS totalItems,
