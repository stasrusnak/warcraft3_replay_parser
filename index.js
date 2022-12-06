const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./config.json')

const app = express();
const links = require('./models/links.model');


mongoose.connect(config.mongo_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true

})
  .then(() => {
    console.log('mongodb connected !')
  })
  .catch(error => console.log('mongodb connected error! :' + error))



app.listen(3000, () => {
  console.log("Server started ...");
});

app.get("/", (req, res) => {
  res.send("Hello From The Server");
})

app.get("/map", async (req, res) => {
  // links.find({})
  let link = await links.find({});


  res.send(link);

})

