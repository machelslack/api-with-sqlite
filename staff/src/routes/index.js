const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" }, function (err, html) {
    res.status(200);
    res.setHeader("content-type", "text/html");
    res.send(html);
  });
});

module.exports = router;
