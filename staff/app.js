const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { authenticateToken } = require("./src/middleware/authentication");

const indexRouter = require("./src/routes/index");
const usersRouter = require("./src/routes/users");
const staffRouter = require("./src/routes/staff");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/staff", staffRouter);

module.exports = app;
