const mysql = require('mysql2');

const msql = mysql.createConnection({
    host: "localhost",
    password: "Ajay@123",
    database: "db",
    user: "root"
});

module.exports = msql;