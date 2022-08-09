const dbClient = require("../config/db_config");

const {encryptToken} = require("../functions/encryption");
const bcrypt = require('bcrypt');

module.exports.findUserByid = (id) => {
  const sql = `select * from user where user.id_user=?`;
  dbClient.query(sql, [id], (err, rows) => {
    if (err) return null;
    return rows[0].id_user;
  });
};

module.exports.findLocalUserByemail = (email, password) => {
  let sql = ` SELECT DISTINCT user.* from user where USER.email=? AND USER.actif=?and provider=? `;

  dbClient.query(sql, [email, "1", "ATA"], (err, rows) => {
    if (err) {
      //   return res.status(500).json({
      //     err: true,
      //     message: "An error occured in server !  ",
      //   });
      return null
    }
    if (rows.length == 1) {
      bcrypt.compare(password, rows[0].password, (err, same) => {

        if (err) {
          //   return res.status(500).json({
          //     err: true,
          //     message: "An error occured in server !  ",
          //   });
          return null
        }
        if (same) {
        //   const user = rows[0]; //user without company test
          const { id_user, crypted } = rows[0];
          sql = `    
                SELECT user.*, COUNT(id_company) as nb_companies
                FROM COMPANY JOIN user 
                ON company.id_user=user.id_user                  
                where user.id_user=?
              `;
          dbClient.query(sql, [id_user], (err, rows) => {

            // if (!err) {
                return rows[0]
            //   const { nb_companies } = rows[0];
            //   const payload = {
            //     user:
            //       nb_companies === 0
            //         ? { user, nb_companies }
            //         : { user: rows[0] },
            //   };
            //   const accessToken = jwt.sign(
            //     {
            //       userData: payload,
            //     },
            //     process.env.ACCESS_TOKEN_SECRET,
            //     { expiresIn: process.env.EXPIRES_IN }
            //   );
            //   const encryptedToken = encryptToken.encrypt(accessToken);

            //   //   return res.status(200).json({
            //   //     err: false,
            //   //     message: "Auth successfull !",
            //   //     accessToken:encryptedToken
            //   //   });
            //   return {
            //     err: false,
            //     message: "Auth successfull !",
            //     accessToken: encryptedToken,
            //   };
            // } 
            // else {
              //   return res.status(500).json({
              //     err: true,
              //     message: "An error occured in server !",
              //   });
              // return null
            // }
          });
        } else {
          //   return res.status(404).json({
          //     err: true,
          //     message: "Auth failed ! Check email AND/OR password ",
          //   });
          return null
        }
      });
    } else {
      //   return res.status(404).json({
      //     err: true,
      //     message: "Auth failed ! Check email AND/OR password ",
      //   });
      return null;
    }
  });
};
