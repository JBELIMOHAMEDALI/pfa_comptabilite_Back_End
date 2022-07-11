module.exports = require('mysql').createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "pfa_comptable",
    multipleStatements:true
});