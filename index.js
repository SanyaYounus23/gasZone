const express = require("express");
const customerModel = require("./model/customer");
const serviceProviderModel = require("./model/serviceprovider");
const teammemberModel = require("./model/teammember");
const locationModel = require("./model/location");
const productModel = require("./model/product");
const bcrypt = require("bcrypt");
require("./database");
const bodyParser = require('body-parser');
const app=express();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const nodemailer = require('nodemailer');
const bodyparser = require('body-parser');
const port=3000;


app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("\index.ejs");
})

app.get("/admin-login", (req, res) => {
    res.render("login/login.ejs");
  });

  app.post("/post-login", (req, res) => {
    res.redirect("admin/dashboard.ejs");
  });


  app.get("/dashboard", (req, res) => {
    res.render("admin/dashboard.ejs");
  });


  app.get("/admin", (req, res) => {
    res.render("\admin.ejs");
  });
  app.get("/services", (req, res) => {
    res.render("\services.ejs");
  });

  app.get("/serviceproviderdashboard", (req, res) => {
    res.render("service/Dashboard.ejs");
  });

  app.get("/orders", (req, res) => {
    res.render("\orders.ejs");
  });
  app.get("/profile", (req, res) => {
    res.render("service\SPprofile.ejs");
  });



  app.get("/manage", (req, res) => {
    res.render("service/manage.ejs");
  });
  app.get("/customer2", async(req, res) => {
     try {
        const cat = await serviceProviderModel.find();
        res.render("service/SPcustomers.ejs", { cat });
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
      }
     
    });
  app.get("/earnings", (req, res) => {
    res.render("service/earnings.ejs");
  });
  app.get("/adminuser", (req, res) => {
    res.render("admin/adduser.ejs");
  });
  app.get("/addproduct", (req, res) => {
    res.render("service/addproducts.ejs");
  });
  app.get("/viewproduct", (req, res) => {
    res.render("service/viewproduct.ejs");
  });
  app.get("/adminorders", (req, res) => {
    res.render("admin/manageorder.ejs");
  });


  app.get("/stepone", (req, res) => {
    res.render("order/stepone.ejs");
  });
  app.get("/product", (req, res) => {
    res.render("order/stepproduct.ejs");
  });
  app.get("/steptwo",async (req, res) => {
 // Route to handle POST request for getting service providers by Products

app.post("/providerdata", async(req, res) => {
  try {
    const info = {
      name: req.body.name,
      storename: req.body.storename,
      storelocation: req.body.storelocation,
      storecontact: req.body.storecontact,
    };
    
    // Find service providers with matching criteria
    const serviceProviders = await serviceProviderModel.find(info);

    if (serviceProviders.length === 0) {
      return res.status(404).json({ error: 'No products Found' });
    }

    // Render the template with the serviceProviders data
    res.render("order/steptwo.ejs", { serviceProviders });
  } catch (err) {
    console.error('Error fetching service providers:', err);
    res.send("Error");
  }
});

   
  });
  app.get("/stepthree", (req, res) => {
    res.render("order/stepthree.ejs");
  });

  app.get("/stepfinal", (req, res) => {
    res.render("order/step.ejs");
  });
  app.get("/providers", (req, res) => {
    res.render("admin/provider.ejs");
  });
  // View providers
  app.get("/viewproviders", async(req, res) => {
    try {
      const user = await serviceProviderModel.find();
      res.render("admin/viewprovider.ejs", { user });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    }
   
  });
  
  // Delete Request to delete category by ID
app.delete("/service/:id", async (req, res) => {
  const categoryId = req.params.id;
  try {
    const deleteCategory = await categoryModel.findByIdAndDelete(categoryId);
    if (!deleteCategory) {
      return res.status(404).send({ error: "Category Not Found" });
    }
    res.send(deleteCategory);
  } catch (error) {
    res.status(500).send({
      error: "Error deleting category",
      details: error,
    });
  }
});

  //view teammember
  app.get("/viewuser", async(req, res) => {
    try {
      const users = await teammemberModel.find();
      res.render("admin/viewuser.ejs", { users });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    }
   
  });

  app.post("/selectserviceprovider", (req,res)=>{
    const id = req.body.id;
  });

  //view products
  app.get("/viewproducts", async (req, res) => {
    try {
      const products = await productModel.find();
      res.render("service/viewproduct.ejs", { products }); // Pass the products to the template
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

 // Route to handle POST request for getting service providers by location
 app.post("/getlocation", async(req,res) => {
  const data={
    location:req.body.location
  }
  try {
    // Find service providers with matching location
    const serviceProviders = await serviceProviderModel.find({ storelocation
      : data.location });

    if (serviceProviders.length === 0) {
      return res.status(404).json({ error: 'No service providers found for the given location' });
    }

    // You can choose to send all matching service providers or just the first one found
    res.render("order/steptwo.ejs",{ serviceProviders });
  } catch (err) {
    console.error('Error fetching service providers:', err);
    res.send("Error");
}});
  // Multer configuration for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  // Multer to use storage
  const upload = multer({ storage: storage });
  // Handle Add Service Provider Post Request
  app.post("/add-provider", upload.single("image"), async (req, res, next) => {
    try {
      const obj = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        address: req.body.address,
        cnic:req.body.cnic,
        storename:req.body.storename,
        storelocation:req.body.storelocation,
        storecontact:req.body.storecontact,
        img: {
          data: fs.readFileSync(
            path.join(__dirname + "/uploads/" + req.file.filename)
          ),
          contentType: req.file.mimetype,
        },
      };
  
      const post = await serviceProviderModel.create(obj);
      console.log(post);
      res.send(" Added");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding ");
    }
  });


   //Post Method for Team Members
app.post("/add-posts",async (req, res) => {
  try {

    const obj = {
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      contact:req.body.contact,
      location:req.body.location,
      gender:req.body.gender,
      role:req.body.role
  
    };

    const post = await teammemberModel.insertMany(obj);
    console.log(post);
    res.send(" Added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding ");
  }
});
   //Post Method for Products
   app.post("/add-products",upload.single("image"),async (req, res) => {
    try {
   
      const data = {
        productid:req.body.productid,
        productname:req.body.productname,
        productsize:req.body.productsize,
        productprice:req.body.productprice,
        serviceproviderid:req.body.serviceproviderid,
        img: {
          data: fs.readFileSync(
            path.join(__dirname + "/uploads/" + req.file.filename)
          ),
          contentType: req.file.mimetype,
        },
      };
      
    
  
      const post = await productModel.create(data);
      console.log(post);
      res.send(" Added");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding ");
    }
  });





//customer
  app.post("/add-customer", async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      location: req.body.loaction,
      gender: req.body.gender,
      cylinder: req.body.cylinder,
      quantity: req.body.quantity,
    
    };
    console.log(data)
  
    const existingCustomer = await customerModel.findOne({ email: data.email });
    if (existingCustomer) {
      res.send("Customer already exists. Please choose a different name.");
    } else {
      const customer = await customerModel.insertMany(data);
      console.log(data);
      res.send("Customer Added");
    }
  });
  
app.listen(port,()=>{
    console.log(`server is working on ${port}`);
})