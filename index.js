const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
// -----------------------------------------
// -------------- CONECTIONS DB -----------------
mongoose.connect("mongodb://localhost:27017/WikiDB", { useNewUrlParser: true });
// -----------------------------------------
// ---------------- SCHEMAS ------------------
const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    }
});
// -----------------------------------------
// ---------------- MODEL ------------------
const Article = mongoose.model("Article", articleSchema);
// -----------------------------------------
// ----------------- ROUTE -------------------
app.get("/", function(req, res){
    res.render("pages/home");
});
// -----------------------------------------
// ------------- ARTICLES REST --------------
app.route("/articles")
    .get((req, res) => {
        Article.find({}, function(err, articlesFounded){
            if(!err){
                res.send(articlesFounded);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(err){
                res.send(err);
            } else {
                res.send("Successfully article created.")
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, function(err, articles){
            if(err){
                res.send(err)
            } else {
                res.send("It successfully deleted all articles.")
            }
        });
    });
// -----------------------------------------
// ------------- SINGLE ARTICLE REST --------------
app.route("/articles/:article")
    .get((req, res) => {
        Article.findOne({title: req.params.article}, function(err, articleFounded){
            if(err){
                res.send(err);
            } else if(articleFounded) {
                res.send(articleFounded);
            } else {
                res.send("There's not article with that name.")
            }
        });
    })
    .put((req, res) => {
        Article.replaceOne(
            {
                title: req.params.article
            }, 
            req.body
            , 
            function(err){
                if(err){
                    res.send(err);
                } else {
                    res.send("Article successfully updated.");
                }
            }
        );
    })
    .patch((req, res) => {
        Article.updateOne(
            {
                title: req.params.article
            },
            req.body
            ,
            function(err){
                if(err){
                    res.send(err)
                } else {
                    res.send("Article successfully updated.");
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne(
            {
                title: req.params.article
            },
            function(err, article){
                if(err){
                    res.send(err);
                } else if(article) {
                    res.send("Article delete successfully.");
                    console.log(article);
                } else {
                    res.send("The article wasn't founded.");
                    console.log(article);
                }
            }
        );
    });
// -----------------------------------------
// ---------------- PORTS ------------------
app.listen(process.env.PORT || port, () => {
    console.log("Listening on port 3000");
});
// -----------------------------------------
