const sqlite3 = require("sqlite3").verbose();
let jsonData = require("./data.json");

const { dataSet } = jsonData;

const addRecord = (
  { name, salary, currency, on_contract, department, sub_department },
  database
) =>
  new Promise((resolve, reject) => {
    database.run(
      `INSERT INTO Staff VALUES (null,"${name}","${salary}","${currency}","${on_contract}","${department}","${sub_department}")`,
      function (err, rows) {
        if (err) {
          reject(err);
        }

        resolve({ message: `${this.lastID} has been inserted`, rows });
      }
    );
  });

const createTables = (database) => {
  database.run(
    "CREATE TABLE IF NOT EXISTS Staff (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, currency TEXT, on_contract TEXT, department TEXT,sub_department TEXT)",
    (err) => {
      if (err) {
        throw Error(`Getting create table error ${err}`);
      }
      dataSet.forEach((record) => addRecord({ ...record }, database));
    }
  );
};

const database = new sqlite3.Database("staff.db", (err) => {
  if (err) {
    console.log("Getting databse error " + err);
  }
  createTables(database);
});

module.exports = {
  database,
  addRecord,
};
