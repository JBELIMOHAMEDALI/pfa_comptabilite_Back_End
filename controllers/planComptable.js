const fs = require("fs");
const multer = require("multer");
const query = require("../functions/db_query");
const readXlsxFile = require("read-excel-file/node");

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
      callback(new Error("make sure you File type must be .xls"), false);
    }
  },
});

module.exports.importFile = (req, res) => {
  const uploadResult = uploadExcel.single("plan");
  uploadResult(req, res, (err) => {
    if (!err) {
      importFileToDb(
        req.file.path, //uploads\\excel-files\\PLAN COMPTABLE.xlsx
        res
      );
    } else {
      res.status(500).json({
        err: true,
        message: "File not uploaded ! retry later",
      });
    }
  });
};

function importFileToDb(exFile, res) {
  readXlsxFile(exFile)
    .then((rows) => {
      const sql = "INSERT INTO pcmptable (`col`,`desc`) VALUES ?";
      query.sql_request(sql, [rows.filter((row) => !row.includes(null))], res);
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
  fs.unlink(`${process.env.UNLINK_FILE_PATH}/${filename}.xls`, (err) => {
    if (err) {
      return res.status(500).json({
        err: true,
        message: err.message,
        // message:'remove file failed ! please retry later'
      });
    }
    // const sql = `delete from pcomptable where source = ?`;
    // query.sql_request(sql, [path], res);

    return res.status(200).json({
      err: false,
      message: "File unlinked Successfully !",
    });
  });
};
