const sqlite3 = require("sqlite3").verbose();
let jsonData = require("./data.json");

const { dataSet } = jsonData;

const addRecord = ({
  name,
  salary,
  currency,
  on_contract,
  department,
  sub_department,
}) => {
  databaseInstance.run(
    `INSERT INTO Staff VALUES (null,"${name}","${salary}","${currency}","${on_contract}","${department}","${sub_department}")`
  );
};

const createTables = (database) => {
  console.log("Creating Databse table-  ");
  database.run(
    "CREATE TABLE IF NOT EXISTS Staff (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, currency TEXT, on_contract TEXT, department TEXT,sub_department TEXT)",
    (err) => {
      if (err) {
        console.log("Getting create table error " + err);
      }
      dataSet.forEach((record) => addRecord({ ...record }));
    }
  );
};

const database = new sqlite3.Database("staff.db", (err) => {
  if (err) {
    console.log("Getting databse error " + err);
  }
  createTables(database);
});

module.exports = database;
