const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  about:{
    type:String,
    minlength: 5,
    maxlength: 20
  },
  avatar:{
    type:String,
    required: true,
    minlength: 5,
    maxlength: 30
  },
})

const User = mongoose.model('user', userSchema);

module.exports = User