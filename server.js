//require dependencies
const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");

const PORT = process.env.PORT || 3000;
// initialize express
const app = express()

// Set up an Express Router
const router = express.Router();

// Require our routes file pass our router object
require("./routes/routes")(router);

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Make public a static dir
app.use(express.static("public"));

// Have every request go through our router middleware
app.use(router);

// Set Handlebars.

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(methodOverride("_method"));

const databaseUrl = 'mongodb://thomwint:Britty123!@ds155903.mlab.com:55903/heroku_1wj8v9tt';
if(process.env.MONGODB_URI){
	mongoose.connect(process.env.MONGODB_URI);
}else {
	mongoose.connect(databaseUrl)
}

const db = mongoose.connection;

db.on('error', err => {
  console.log(`Mongoose Error: ${err}`);
});

db.once("open", () => {
  console.log("Mongoose connection successful.");
});

app.listen(PORT, () => {
  console.log("App running on port 3000!");
});
