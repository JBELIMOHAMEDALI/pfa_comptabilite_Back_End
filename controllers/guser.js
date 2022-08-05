// const client = require("../config/db_config");

// exports.findOneGuser = (profileId) => {
//   const sql = "select * from guser where user.profileId=?";
//   client.query(sql, [profileId], (err, rows) => {
//     if (!err) {
//       if (rows.length == 1) return { user: rows[0], exist: true };
//       else return { user: null, exist: false };
//     }
//     return {
//       message: err.sqlMessage,
//       user: null,
//       exist: false
//     };
//   });
// };
// exports.createGuser = (profileId,firstname,lastname) => {
//   const values = [[[profileId, firstname,lastname]]];
//   // const newUser={profileId, firstname,lastname}
//   //
//   const sql = "INSERT INTO guser(profileId, firstname,lastname) VALUES ?";
//   client.query(sql, values, (err, rows) => {
//     if (!err) {
//       console.log(rows);
//       if (rows.affectedRows>0) return { newUser:rows, inserted: true };
//       else return  { newUser:null, inserted: false };
//     }
//     return {
//       message: err.sqlMessage,
//       inserted: false,
//       newUser:null,
//     };
//   });
// };
