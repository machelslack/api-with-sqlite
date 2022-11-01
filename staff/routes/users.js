const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

const generateAccessToken = (username) =>
  jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.status(200);
  res.setHeader("content-type", "text/plain");
  res.send("respond with a resource");
});

router.post("/", function (req, res, next) {
  res.status(200);
  res.set("content-type", "application/json");
  const token = generateAccessToken({ username: req.body.username });
  res.json(token);
});

module.exports = router;
