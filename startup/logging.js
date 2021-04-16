require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, {
    filename: "logfile.log",
    handleExceptions: true,
  });

  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost/vidly",
    handleExceptions: true,
  });
};
