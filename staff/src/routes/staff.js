const express = require("express");
const {
  database,
  addRecord,
  deleteRecord,
  getStatsByContract,
  getStatsByDepartment,
  getStatsBySubDepartment,
} = require("../store/database");
const { buildJsonReponse, validateFormInputInBody } = require("../helpers");

const router = express.Router();

router.get("/statistics/:facet", async function (req, res) {
  const facet = req.params.facet;
  if (facet === "on_contract") {
    await getStatsByContract(database)
      .then(({ records }) => {
        buildJsonReponse({ res, body: records });
      })
      .catch((err) => {
        buildJsonReponse({
          error: `Internal Server Error - ${err}`,
          status: 500,
          res,
        });
      });
  }

  if (facet === "department") {
    await getStatsByDepartment(database)
      .then(({ records }) => {
        buildJsonReponse({ res, body: records });
      })
      .catch((err) => {
        buildJsonReponse({
          error: `Internal Server Error - ${err}`,
          status: 500,
          res,
        });
      });
  }

  if (facet === "sub_department") {
    await getStatsBySubDepartment(database)
      .then(({ records }) => {
        buildJsonReponse({
          res,
          body: records.map((row) => {
            const {
              department = `${department}`,
              sub_department,
              ...rest
            } = row;
            return {
              department: department,
              sub_department: {
                name: sub_department,
                ...rest,
              },
            };
          }),
        });
      })
      .catch((err) => {
        buildJsonReponse({
          error: `Internal Server Error - ${err}`,
          status: 500,
          res,
        });
      });
  }
});

router.post("/", async function (req, res) {
  let body = req.body;

  const [valid] = validateFormInputInBody(body);

  if (!valid) {
    buildJsonReponse({ error: "Bad Request", status: 400, res });
    return;
  }

  await addRecord({ ...body }, database)
    .then(({ message, records }) => {
      buildJsonReponse({ res, body: records, message });
    })
    .catch((err) => {
      buildJsonReponse({
        error: `Internal Server Error - ${err}`,
        status: 500,
        res,
      });
    });
});

router.delete("/:staffId", async function (req, res) {
  const { staffId } = req.params;

  if (!staffId) {
    buildJsonReponse({ error: `Bad Request`, status: 400, res });
    return;
  }

  if (req.method === "DELETE") {
    await deleteRecord(database, staffId)
      .then(({ message, records }) => {
        buildJsonReponse({
          res,
          body: records,
          message,
        });
      })
      .catch((err) => {
        buildJsonReponse({
          error: `Internal Server Error - ${err}`,
          status: 500,
          res,
        });
      });
  }
});

module.exports = router;
