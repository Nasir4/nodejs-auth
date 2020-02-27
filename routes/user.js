const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

//Register Post Handeling

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  //valadation process..
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please Fill In All Fields" });
  }

  //validate password
  if (password !== password2) {
    errors.push({ message: "Password Dosnt Match.." });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ message: "Password Should be atlist 6 charecters" });
  }

  //check errors
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //Datebase vladation
    User.findOne({ email: email }).then(user => {
      if (user) {
        //if user found in db
        errors.push({ message: "Email is Already Registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        //Hash Password
        //  bcrypt.genSalt(10, (err, salt)=>{ bcrypt.hash(newUser.password, salt, (err, hash)=>{

        //  }) })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newUser.password = hash;

            //save data to database
            newUser
              .save()
              .then(user => {
                req.flash("success_msg", "Your Now Register Can login");
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//Login Handel
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//Logout Handling
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Your Loggedout");
  res.redirect("/users/login");
});

module.exports = router;
