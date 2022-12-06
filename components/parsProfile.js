const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const path = require('path');
const config = require('../config.json')
const mongoose = require('mongoose');
const Maps = require('../models/map.model');

mongoose.connect(config.mongo_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true

})
  .then(async () => {
    let res = await Maps.find({})






  })
  .catch(error => console.log('mongodb connected error! :' + error))


