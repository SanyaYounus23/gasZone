const mongoose = require('mongoose');

const customerSchema= new mongoose.Schema({
    name:String,
    email:String,
    contact:String,
    location:String,
    gender:String,
    cylinder:String,
    quantity:String
 
});

const customerModel = new mongoose.model("customers",customerSchema);
module.exports = customerModel;