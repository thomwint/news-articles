// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
// const database = require('./models');
// Routes
const routes = require('./routes/routes');
// const scrape = require('./routes/scrape');
// const articles = require('./routes/articles');

// Require all models
// const models = require('./models');

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Public directory
app.use(express.static('public'));

// Database configuration with mongoose
const databaseUrl = 'mongodb://thomwint:Britty123!@ds155903.mlab.com:55903/heroku_1wj8v9tt';

if (process.env.MONGODB_URL) {
  mongoose.connect(process.env.MONGODB_URL);
} else {
  mongoose.connect(databaseUrl);
}

const db = mongoose.connection;

db.on('error', (err) => {
  console.log(`Mongoose Error: ${err}`);
});

db.on('open', () => {
  console.log('Mongoose connection successful.');
});

// Routes
app.use('/', routes);
require('./controllers/ScrapeController')(app);

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}!`);
});
