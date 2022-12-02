const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");


const app = express();


app.listen(3000, () => {
  console.log("Server started ...");
});

app.get("/", (req, res) => {
  res.send("Hello From The Server");
})


const connection = mysql.createConnection({
  host: "database-1.c0rbzmgklnqg.eu-central-1.rds.amazonaws.com",
  user: "admin",
  password: "00250025",
  database: "stats"
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected successfully to MySql server")
});

let date = '2022-05-30_00-23'
let time = '47m47s'
let idrep = '4'
let link = 'GHost++_2022-05-30_00-23_LegionTD_x20_-prссah_+4_(47m47s).w3g\n'




let query = `INSERT INTO REPS (date, time, idrep, link)
                     VALUES ('${date}', '${time}', '${idrep}', '${link}')`;

connection.query(query, function (err, result, fields) {
  // if any error while executing above query, throw error
  if (err) throw err;
  // if there is no error, you have the result
  console.log(result);
});


