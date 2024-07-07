const mongoose = require('mongoose');

const productSchema= new mongoose.Schema({
   productid:String,
   productname:String,
   productsize:String,
   productprice:String,
   serviceproviderid:String,
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

const productModel = new mongoose.model("products",productSchema);
module.exports = productModel;