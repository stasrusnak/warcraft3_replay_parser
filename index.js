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



let query = `INSERT INTO REPS (fname, lname, birthdate, contactno, email, semester, course) 
                     VALUES ('${fname}', '${lname}', '${birthdate}', '${contactno}', '${email}', '${semester}', '${course}')`;

connection.query(query, (err, result) => {
  if (err) {
    // status code 500 is for Internal Server Error
    res.json(500, {
      msg: "Some thing went wrong please try again"
    })
  }

  res.json(200, {
    msg: "Student Registered Succesfully",
  })
})
