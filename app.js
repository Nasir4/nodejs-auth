const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const app = express();

const db = require("./config/keys");

//passport config
require("./config/passport")(passport);

//connect to Mongo
mongoose
  .connect(db.MongoUri, { useNewUrlParser: true })
  .then(() => console.log("Mongo Db connected...."))
  .catch(err => {
    console.log(err);
  });

//Ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

//Body Parser
app.use(express.urlencoded({ extended: false }));

//Session-MiddleWear
app.use(
  session({
    secret: "Nasir",
    resave: true,
    saveUninitialized: true
  })
);

//passport middlewera
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Globle Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
const Index = require("./routes/index");
const user = require("./routes/user");

const PORT = process.env.PORT || 3000;
app.use("/", Index);
app.use("/users", user);

app.listen(PORT, () => {
  console.log("port running on 3000");
});
