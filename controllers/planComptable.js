const fs = require("fs");
const multer = require("multer");
const query = require("../functions/db_query");
const readXlsxFile = require("read-excel-file/node");
const dbClient = require("../config/db_config");
const excel = require("exceljs");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/excel-files"); //filename already used
  },
  filename: (req, file, callback) => {
    const filename = file.originalname.split(".")[0];
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
  const uploadResult = uploadExcel.single("plan-comptable-excel-file");
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
  readXlsxFile(req.file.path)
    .then((rows) => {
      const array = rows.filter((row) => !row.includes(null));
      const filename = req.file.filename;
      array.map((row) => row.push(filename));
      const sql = "INSERT INTO pcmptable (`col`,`desc`,`source`) VALUES ?";
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
  const filename = req.params.fileName;
  fs.unlink(`${process.env.FILES_PATH}/${filename}`, (err) => {
    if (err) {
      return res.status(500).json({
        err: true,
        message: err.message,
      });
    }
    const sql = `delete from pcmptable where source = ?`;
    query.sql_request(sql, [filename], res);
  });
};

module.exports.exportFile = (req, res) => {
  const filename = req.params.fileName;
  const sql = `select * from pcmptable where source = ?`;
  dbClient.query(sql, [filename], async (err, rows) => {
    if (err) {
      return res.status(500).json({
        err: true,
        message: "An error occured in server ! Retry later ",
      });
    }
    const json = JSON.parse(JSON.stringify(rows));
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("plan_comptable"); //creating worksheet

    worksheet.columns = [
      { header: "Id", key: "id", width: 10 },
      { header: "Col", key: "col", width: 30 },
      { header: "Desc", key: "desc", width: 30 },
    ];

    worksheet.addRows(json);
    workbook.xlsx
      .writeFile(
        `${process.env.FILES_PATH}/${filename}` //f server path
      )
      .then(() => {
        // console.log(__dirname);
        // res.download("uploads\\excel-files\\PLAN COMPTABLE.xlsx",'filename',(err)=>{
        //   console.log(err);
        // });
        return res.status(200).json({ err: false, created: true });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ err: true, created: false, message: error.message });
      });
  });
};
