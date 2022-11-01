const express = require("express");
const logger = require("morgan");
const { authenticateToken } = require("./src/middleware/authentication");

const indexRouter = require("./src/routes/index");
const usersRouter = require("./src/routes/users");
const staffRouter = require("./src/routes/staff");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/api/users", authenticateToken, usersRouter);
app.use("/api/staff", authenticateToken, staffRouter);

module.exports = app;
