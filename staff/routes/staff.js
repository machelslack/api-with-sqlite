const express = require("express");
const databseClient = require("../store/database");

const router = express.Router();

const buildReponse = () => [
  /**
   * do something
   */
];

const getSumStatsByContract = () => {
  return new Promise((resolve, reject) => {
    databseClient.get(
      "SELECT name, on_contract, AVG(salary), MIN(salary), Max(salary) FROM Staff GROUP BY on_contract",
      (err, rows) => {
        if (err) {
          console.log("Fetching rows error " + err);
          reject(err);
        }
        resolve(rows);
      }
    );
  });
};

const getSumStatsByDepartment = () => {
  return new Promise((resolve, reject) => {
    databseClient.get(
      "SELECT department, AVG(salary), MIN(salary), Max(salary) FROM Staff GROUP BY department",
      (err, rows) => {
        if (err) {
          console.log("Fetching rows error " + err);
          reject(err);
        }
        resolve(rows);
      }
    );
  });
};

router.get("/statistics/:facet", async function (req, res) {
  const facet = req.params.facet;
  res.status(200);
  res.setHeader("content-type", "text/html");
  res.send(`searching by facet`);

  if (facet === "on_contract") {
    await getSumStatsByContract()
      .then((rows) => {
        buildReponse({ res, rows });
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
    return;
  }

  if (facet === "department") {
    await getSumStatsByDepartment()
      .then((rows) => {
        buildReponse({ res, rows });
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
    return;
  }

  return;
});

module.exports = router;
