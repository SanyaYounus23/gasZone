const mongoose = require('mongoose');

const locationSchema= new mongoose.Schema({
location:String
 
});

const locationModel = new mongoose.model("locations",locationSchema);
module.exports = locationModel;