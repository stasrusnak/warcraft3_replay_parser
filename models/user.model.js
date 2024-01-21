const {model, Schema} = require('mongoose')
const userSchema = new Schema({
  nick: {
    type: String,
    unique: true,
    required: true,
  },
  PTS: {
    type: Number,
    default: 0
  },
  prevPTS: {
    type: Number,
    default: 0
  },
  Games: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  leavers:{
    type: Number,
    default: 0
  },
  rmk:{
    type: Number,
    default: 0
  },
  lose: {
    type: Number,
    default: 0
  },
  color: {
    type: Number,
    default: 0
  },
  idreps:{
    type: Array,
    default: undefined
  },
  date_insert: {
    type: Date,
    default: Date.now
  },
})


module.exports = model('users', userSchema)
