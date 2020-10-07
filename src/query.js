var database = require("../db").database;

module.exports = {
  getTasks: function (req, res) {
    database.query("SELECT * FROM task", function (err, result, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          code: "taskNotFound",
          message: "error in database while finding task",
        });
      }
      res.status(200).json({ code: "taskFound", data: result });
    });
  },

  createTask: function (req, res) {
    var requestData = req.body;
    if (!requestData.taskMessage) {
      return res.status(400).json({
        code: "taskCreationFailed",
        message: "task message not available",
      });
    }

    var taskData = {
      taskMessage: requestData.taskMessage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    database.query("INSERT INTO task SET ?", taskData, function (
      err,
      result,
      fields
    ) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          code: "taskCreationFailed",
          message: "error in database entry creation",
        });
      }
      return res
        .status(200)
        .json({ code: "taskCreated", message: "taskCreatedSuccessfully" });
    });
  },

  getTaskById: function (req, res) {
    var taskId = req.params.taskId;
    database.query("SELECT * FROM task where id=?", [taskId], function (
      err,
      result,
      fields
    ) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          code: "taskNotFound",
          message: "error in database while finding task",
        });
      }
      if (result.length === 0) {
        return res
          .status(404)
          .json({ code: "taskNotFound", message: "Task not found" });
      }
      res.status(200).json({ code: "taskFound", data: result });
    });
  },

  deleteTaskById: function (req, res) {
    var taskId = req.params.taskId;
    database.query("SELECT * from task where id=?", [taskId], function (
      err,
      result,
      fields
    ) {
      if (err) {
        console.log("Error occurred while finding task", err);
        return res.status(500).json({
          code: "taskDeleteFailed",
          message: "Error occured while finding task in database",
        });
      }
      // see if the task exists in database
      if (result.length === 0) {
        return res
          .status(400)
          .json({ code: "taskDeleteFailed", message: "Task not found" });
      }
      database.query("DELETE FROM task where id=?", [taskId], function (
        err,
        result,
        fields
      ) {
        if (err) {
          console.log("Error occurred while finding task", err);
          return res.status(500).json({
            code: "taskDeleteFailed",
            message: "Error occured while finding task in database",
          });
        }
        res.status(200).json({ code: "taskDeleted" });
      });
    });
  },

  updateTaskById: function (req, res) {
    var taskId = req.params.taskId;
    var requestData = req.body;

    if (!requestData.taskMessage) {
      return res.status(400).json({
        code: "taskUpdateFailed",
        message: "Task message not available in request",
      });
    }

    // find if task with given id is present or not
    database.query("SELECT * FROM task where id=?", [taskId], function (
      err,
      result,
      fields
    ) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          code: "taskUpdateFailed",
          message: "error in database while finding task",
        });
      }
      // checking if no data is returned from database then returning response
      if (result.length === 0) {
        return res
          .status(400)
          .json({ code: "taskUpdateFailed", message: "Task not found" });
      }

      // if task is found then we need to update the task
      database.query(
        "UPDATE task SET taskMessage=?, updatedAt=? where id=?",
        [requestData.taskMessage, new Date(), taskId],
        function (err, result, fields) {
          if (err) {
            console.log("Error while updating task", err);
            return res.status(500).json({
              code: "tasUpdateFailed",
              message: "Database error occured",
            });
          }
          res.status(200).json({ code: "taskUpdated" });
        }
      );
    });
  },
};
