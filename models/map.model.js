const {model, Schema} = require('mongoose')
// const playersSchema = new Schema({ nickname: String });
// const leaversSchema = new Schema({ leaverids: String });
// const flagsSchema = new Schema({ flagsids: String });
const mapsSchema = new Schema({
  idrep: {
    type: Number,
    default: 0
  },
  time: {
    type: String,
    required: true
  },
  date: {
    type: String,
  },
  link: {
    type: String,
    default: ''
  },
  pars: {
    type: Number,
    default: 0
  },
  winners:{
    type: Array,
    default: undefined
  },
  losers:{
    type: Array,
    default: undefined
  },
  rmk:{
    type: Array,
    default: undefined
  },
  leavers:{
    type: Array,
    default: undefined
  },
  date_insert: {
    type: Date,
    default: Date.now
  },

})


module.exports = model('maps', mapsSchema)
