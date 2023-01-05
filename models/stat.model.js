const {model, Schema} = require('mongoose')
const statsSchema = new Schema({
  nickName: {
    type: String,
    required: true
  },
  PTS: {
    type: String,
    required: true
  },
  Games: {
    type: String,
  },
  winRate: {
    type: String,
  },
  wins: {
    type: String,
  },
  lose: {
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


module.exports = model('stats', statsSchema)
