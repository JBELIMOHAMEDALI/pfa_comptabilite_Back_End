const fs = require("fs");
const multer = require("multer");
const query = require("../functions/db_query");
const readXlsxFile = require("read-excel-file/node");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/excel-files"); //filename already used
  },
  filename: (req, file, callback) => {
    const filename = file && file.originalname.split(".")[0];
    callback(null, filename + ".xls");
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
    .then((rows) => {
      const array = rows.filter((row) => !row.includes(null));
      const filename = req.file.filename;
      array.map((row) => {
        row.push(filename);
        row.push(id_company);
      });
      const sql =
        "INSERT INTO accounting_plan (`col`,`description`,`source`,`id_company`) VALUES ?";
      query.sql_request(sql, [array], res);
    })
    .catch((error) => {
      return res.status(500).json({
        err: true,
        message: error.message,
      });
    });
}

module.exports.unlinkFile = (req, res) => {
  const { filename, id_company } = req.params;

  fs.unlink(`${process.env.FILES_PATH}/${filename}`, (err) => {
    if (err) {
      return res.status(500).json({
        err: true,
        message: err.message,
      });
    }
    const sql = `delete from accounting_plan where source = ? and id_company = ?`;
    query.sql_request(sql, [filename, id_company], res);
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
  const { id_company, sourceFile } = req.params;
  const sql = `select accounting_plan.id , accounting_plan.col , accounting_plan.description, 
  accounting_plan.id_company from accounting_plan
  join company on company.id_company=accounting_plan.id_company 
   where accounting_plan.id_company=? and accounting_plan.source =?`;
  query.sql_request(sql, [id_company, sourceFile], res);
};

module.exports.getAllUserSources = (req, res) => {
  const sql = `select distinct source from accounting_plan 
join company on company.id_company=accounting_plan.id_company 
where accounting_plan.id_company = ? `;
  query.sql_request(sql, [req.params.id_company], res);
};

module.exports.deleterow = (req, res) => {
  const { id_row } = req.params;

  const sql = `delete from accounting_plan where id=? `;
  query.sql_request(sql, [id_row], res);
};

module.exports.updaterow = (req, res) => {
  const {  id_row } = req.params;
  const { col, description } = req.body;

  const sql = `UPDATE accounting_plan SET col=?,description=? where id=? `;
  query.sql_request(sql, [col, description, id_row], res);
};


module.exports.addrow = (req, res) => {
  const { col,description,source,id_company } = req.body;
 const sql= "INSERT INTO accounting_plan (`col`,`description`,`source`,`id_company`) VALUES ?";
  query.sql_request(sql, [[[col,description,source,id_company]]], res);
};