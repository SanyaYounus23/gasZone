const mongoose = require('mongoose');

const teammemberSchema= new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  contact:String,
  location:String,
  gender:String,
  role:String
 
});

const teammemberModel = new mongoose.model("teammembers",teammemberSchema);
module.exports = teammemberModel;