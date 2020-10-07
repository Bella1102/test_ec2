var mysql = require("mysql");

var database_connection = mysql.createConnection({
  host: "database-1.cykc9uxxtfie.us-east-2.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "cj926926",
  database: "test",
});

database_connection.connect();

module.exports = {
  database: database_connection,
};
