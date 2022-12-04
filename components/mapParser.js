const mongoose = require('mongoose');
const config = require('../config.json')


mongoose.connect(config.mongo_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => {
      setTimeout( () =>{
      console.log('123')
      }, 1000);
    })
  .catch(error => console.log('mongodb connected error! :' + error))


