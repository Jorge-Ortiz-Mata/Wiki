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
// ---------------- PORTS ------------------
app.listen(process.env.PORT || port, () => {
    console.log("Listening on port 3000");
    Article.find({}, function(err, articles){
        console.log(articles);
    });
});
// -----------------------------------------
