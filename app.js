var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var query = require("./src/query");

var SERVER_PORT = 5000;

var app = express();

// applying middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/tasks", query.getTasks);
app.post("/task", query.createTask);
app.get("/task/:taskId", query.getTaskById);
app.delete("/task/:taskId", query.deleteTaskById);
app.put("/task/:taskId", query.updateTaskById);

if (!module.parent) {
  app.listen(SERVER_PORT, function () {
    console.log("Server is listening at port :  ", SERVER_PORT);
  });
}

module.exports = app;
