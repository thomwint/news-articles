//scraping tools
const request = require("request");
const cheerio = require("cheerio");
const Article = require("../models/Article");
const Note = require("../models/Note");

module.exports = (router) => {
  router.get("/", (req, res) => {
    Article.find(
      {
        saved: false
      },
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.render("index", { article: doc });
        }
      }
    );
  });

  // route renders the saved page
  router.get("/saved", (req, res) => {
    Article.find({ saved: true })
      .populate("notes", "body")
      .exec((err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.render("saved", { saved: doc });
        }
      });
  });

  router.get("/scrape", (req, res) => {
    request(
      "https://www.reuters.com/news/archive/newsOne",
      (err, res, html) => {
        const $ = cheerio.load(html);
        $(".story-content").each((i, element) => {
          const result = {};

          result.title = $(this)
            .children("a")
            .children()
            .text();
          (result.summary = $(element)
            .children("p")
            .text()),
            (result.link = `https://www.reuters.com/news/${$(element)
              .children("a")
              .attr("href")}`);

          const entry = new Article(result);
          entry.save((err, doc) => {
            if (err) {
              console.log(err);
            } else {
              console.log(doc);
            }
          });
        });
      }
    );
    res.redirect("/");
  });

  router.post("/saved/:id", (req, res) => {
    Article.update({ _id: req.params.id }, { $set: { saved: true } }, function(
      err,
      doc
    ) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/");
      }
    });
  });

  router.post("/delete/:id", (req, res) => {
    Article.update({ _id: req.params.id }, { $set: { saved: false } }, (
      err,
      doc
    ) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/saved");
      }
    });
  });

  router.post("/saved/notes/:id", (req, res) => {
    const newNote = new Note(req.body);
    console.log("new note" + newNote);
    newNote.save((error, doc) => {
      if (error) {
        res.send(error);
      } else {
        Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { notes: doc._id } },
          { new: true }
        ).exec((err, newdoc) => {
          if (err) {
            res.send(err);
          } else {
            res.redirect("/saved");
          }
        });
      }
    });
  });

  router.post("/saved/delete/:id", (req, res) => {
    Note.remove({ _id: req.params.id }, (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/saved");
      }
    });
  });
};
