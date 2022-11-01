const express = require("express");
const router = express.Router();

router.get("/:facet", function (req, res) {
  const facet = req.params.facet;
  res.status(200);
  res.setHeader("content-type", "text/html");
  res.send(`searching by facet`);
});

module.exports = router;
