const {model, Schema} = require('mongoose')
const linksSchema = new Schema({
  link: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  date: {
    type: String,
  },
  date_insert: {
    type: Date,
    default: Date.now
  },
  idrep: {
    type: Number,
    default: 0
  },
  pars: {
    type: Number,
    default: 0
  },

})


module.exports = model('links', linksSchema)
