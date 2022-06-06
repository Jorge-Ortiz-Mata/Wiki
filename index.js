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
// ----------------- GET -------------------
app.get("/", function(req, res){
    res.render("pages/home");
})

app.get("/articles", function(req, res){
    Article.find({}, function(err, articlesFounded){
        if(!err){
            res.send(articlesFounded);
        } else {
            res.send(err);
        }
    });
});
// -----------------------------------------
// ---------------- POST ------------------
app.post("/articles", (req, res) => {
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
});
// -----------------------------------------
// ---------------- DELETE ------------------
app.delete("/articles", (req, res) => {
    Article.deleteMany({}, function(err, articles){
        if(err){
            res.send(err)
        } else {
            res.send("It successfully deleted all articles.")
        }
    });
});
// -----------------------------------------
// ---------------- PORTS ------------------
app.listen(process.env.PORT || port, () => {
    console.log("Listening on port 3000");
});
// -----------------------------------------
