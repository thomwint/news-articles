const express = require('express');

const router = express.Router();
const Article = require('../models/Article');
// const Note = require('../models/Note');

// Route for getting all Articles from the db
router.get('/', (req, res) => {
  Article.find({})
    .populate('note')
    .exec((err, found) => {
      if (err) {
        console.log(err);
      } else {
        const hbsObject = { article: found };
        res.render('index', hbsObject);
      }
    });
});


module.exports = router;
