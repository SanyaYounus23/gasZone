const mongoose = require('mongoose');

const serviceProviderSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    address: String,
    cnic:String,
    img: {
        data: Buffer,
        contentType: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    storename:String,
    storelocation:String,
    storecontact:String
 
});

const serviceProviderModel = new mongoose.model("serviceproviders",serviceProviderSchema);
module.exports = serviceProviderModel;