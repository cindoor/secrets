//jshint esversion:6

require('dotenv').config()  //does not need a constant. must be placed at the very top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

////// Create new database //////

// 1st - create schema that is a js object created from the mongoose schema class
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
  });
 
// add encrypt package as a plugin and define certain field to encrypt
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

// 2nd - create model using the schema - singular form
const User = new mongoose.model("User", userSchema);


////////////////////////////////////////////////////

app.get("/", function(req, res) {
    res.render("home"); //render home.ejs page
});

app.get("/login", function(req, res) {
    res.render("login"); //render login.ejs page
});

app.get("/register", function(req, res) {
    res.render("register"); //render register.ejs page
});

// catches the form info from /register page and allows user to access the secrets.ejs page
app.post("/register", function(req, res) {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {    //save the new document to the collection
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

// catches the form info from /login page and allows user to access the secrets.ejs page
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function () {
    console.log("Server has started running on port 3000.");
});









