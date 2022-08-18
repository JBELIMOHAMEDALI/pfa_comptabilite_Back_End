const fs = require("fs");
const multer = require("multer");
const query = require("../functions/db_query");
const readXlsxFile = require("read-excel-file/node");
const dbClient = require("../config/db_config");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/excel-files"); //filename already used
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}.xlsx`);
  },
});

const uploadExcel = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const excelTypes = [
      "application/vnd.ms-excel",
      "application/msexcel",
      "application/x-msexcel",
      "application/x-ms-excel",
      "application/x-excel",
      "application/x-dos_ms_excel",
      "application/xls",
      "application/x-xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (excelTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("make sure you File must be excel"), false);
    }
  },
});

module.exports.importFile = (req, res) => {
  const uploadResult = uploadExcel.single("accounting-plan-excel-file");
  uploadResult(req, res, (err) => {
    if (!err) {
      importFileToDb(
        req, //uploads\\excel-files\\PLAN COMPTABLE.xlsx
        res
      );
    } else {
      res.status(500).json({
        err: true,
        message: err.message,
      });
    }
  });
};

function importFileToDb(req, res) {
  const { id_company } = req.params;
  readXlsxFile(req.file.path)
    .then((fileRows) => {
      const { filename, originalname } = req.file;

      let sql =
        "INSERT INTO accounting_plan_source (`source`,`upload`) VALUES ?";
      dbClient.query(sql, [[[originalname, filename]]], (err, rows) => {
        if (!err) {
          fileRows.map((row) => {
            row.push(rows.insertId);
            row.push(id_company);
          });
          sql =
            "INSERT INTO accounting_plan (`account_number`,`description`,`id_source`,`id_company`) VALUES ?";
          query.sql_request(sql, [fileRows], res);
        } else {
          return res.status(500).json({
            err: true,
            message: "Operation not performed ! Try again later",
          });
        }
      });
    })
    .catch((error) => {
      return res.status(500).json({
        err: true,
        message: error.message,
      });
    });
}
module.exports.unlinkFile = (req, res) => {
  const { uploadFile } = req.params;
  fs.unlink(`${process.env.FILES_PATH}/${uploadFile}`, (err) => {
    // if (err) {
    //   return res.status(500).json({
    //     err: true,
    //     message: err.message,
    //   });
    // }
    const sql = `delete from accounting_plan_source where accounting_plan_source.upload = ?`;
    query.sql_request(sql, [uploadFile], res);
  });
};

// module.exports.exportFile = (req, res) => {
//   const filename = req.params.filename;
//   const sql = `select id,col,description,id_company from accounting_plan where source = ?`;
//   dbClient.query(sql, [filename], async (err, rows) => {
//     if (err) {
//       return res.status(500).json({
//         err: true,
//         message: "An error occured in server ! Retry later ",
//       });
//     }
//     const json = JSON.parse(JSON.stringify(rows));
//     const workbook = new excel.Workbook();
//     const worksheet = workbook.addWorksheet("accounting_plan"); //creating worksheet

//     worksheet.columns = [
//       { header: "Id", key: "id", width: 10 },
//       { header: "Col", key: "col", width: 30 },
//       { header: "Description", key: "description", width: 30 },
//       { header: "id_company", key: "id_company", width: 10 },
//     ];

//     worksheet.addRows(json);
//     workbook.xlsx
//       .writeFile(
//         `${process.env.WRITE_FILE_PATH}/${filename}` //f server path
//       )
//       .then(() => {
//       //  return  res.download(`uploads/excel-files/${filename}`);
//         return res.status(200).json({ err: false, created: true,'message':"File exported successfully !" });
//       })
//       .catch((error) => {
//         return res
//           .status(500)
//           .json({ err: true, created: false, message: error.message });
//       });
//   });
// };

module.exports.getaccountingPlanByCompany = (req, res) => {
  const { id_company, uploadFile } = req.params;
  const { limit, offset } = req.query;
  let sql;
  if (req.query.limit) {
    sql = `select accounting_plan.id , accounting_plan.account_number , accounting_plan.description, 
    accounting_plan.id_company , (SELECT COUNT(*) FROM accounting_plan 
    join accounting_plan_source
    on accounting_plan_source.id=accounting_plan.id_source AND                      
    accounting_plan_source.upload = ?) 
    AS totalItems  
    from accounting_plan join accounting_plan_source
    join company on company.id_company=accounting_plan.id_company and         
    accounting_plan_source.id=accounting_plan.id_source
     where accounting_plan.id_company=? and accounting_plan_source.upload =?
     LIMIT ${limit} OFFSET  ${offset}`;
  } else {
    //export case
    sql = `select  accounting_plan.account_number , accounting_plan.description     
    from accounting_plan join accounting_plan_source
    join company on company.id_company=accounting_plan.id_company and
    accounting_plan_source.id=accounting_plan.id_source
     where accounting_plan.id_company=? and accounting_plan_source.upload =? `;
  }

  query.sql_request(
    sql,
    req.query.limit
      ? [uploadFile, id_company, uploadFile]
      : [id_company, uploadFile],
    res,
    true
  );
};

module.exports.getAllSources = (req, res) => {
  const sql = `select accounting_plan_source.* from accounting_plan_source 
join company join accounting_plan on company.id_company=accounting_plan.id_company 
where accounting_plan.id_company = ? GROUP BY id`;
  query.sql_request(sql, [req.params.id_company], res);
};

module.exports.deleterow = (req, res) => {
  const { id_row } = req.params;

  const sql = `delete from accounting_plan where id=? `;
  query.sql_request(sql, [id_row], res);
};

module.exports.updaterow = (req, res) => {
  const { id_row } = req.params;
  const { account_number, description } = req.body;

  const sql = `UPDATE accounting_plan SET account_number=?,description=?   
  where accounting_plan.id=? `;
  query.sql_request(sql, [account_number, description, id_row], res);
};

module.exports.addrow = (req, res) => {
  const { account_number, description, id_source, id_company } = req.body;
  const sql =
    "INSERT INTO accounting_plan (`account_number`,`description`,`id_source`,`id_company`) VALUES ?";
  query.sql_request(
    sql,
    [[[account_number, description, id_source, id_company]]],
    res
  );
};

module.exports.addAccountingPlan = (req, res) => {
  const { source } = req.body;
  const sql = "INSERT INTO accounting_plan_source (`source`,`upload`) VALUES ?";
  query.sql_request(sql, [[[source, `${Date.now()}.xlsx`]]], res);
};
