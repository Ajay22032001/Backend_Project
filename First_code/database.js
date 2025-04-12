const mysql = require('mysql2');

const msql = mysql.createConnection({
    host: "localhost",
    password: "12345",
    database: "db",
    user: "root"
});

module.exports = msql;