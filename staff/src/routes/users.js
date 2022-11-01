const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { buildJsonReponse } = require("../helpers");

dotenv.config();

const router = express.Router();

const validateBody = (body) => {
  if (!("username" in body)) {
    return [false];
  }

  return [true];
};

const generateAccessToken = (username) =>
  jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });

router.post("/", function (req, res, next) {
  let body = req.body;

  const [valid] = validateBody(body);

  console.log("Validating body...", JSON.stringify(body));

  if (!valid) {
    buildJsonReponse({ error: "Bad Request", status: 400, res });
    return;
  }

  const token = generateAccessToken({ username: req.body.username });
  buildJsonReponse({ body: { token }, res });
});

module.exports = router;
