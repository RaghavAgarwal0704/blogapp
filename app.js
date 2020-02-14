var express = require('express');
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/blogapp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var blog = mongoose.model('blog', blogSchema);
app.get('/', function(req, res) {
    res.redirect('/blogs');
});
app.get('/blogs', function(req, res) {
    blog.find({}, function(err, blog) {
        if (err) {
            console.log('error');
        } else {
            res.render('index', { blog: blog })
        }
    });
});
app.get('/blogs/new', function(req, res) {
    res.render("new");
});
app.post('/blogs', function(req, res) {
    blog.create(req.body.blog, function(err, data) {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});
app.get('/blogs/:id', function(req, res) {
    blog.findById(req.params.id, function(err, data) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: data });
        }
    });
});
app.get('/blogs/:id/edit', function(req, res) {
    blog.findById(req.params.id, function(err, data) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', { blog: data });
        }
    });
});
app.put('/blogs/:id', function(req, res) {
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, data) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});
app.delete('/blogs/:id', function(req, res) {
    blog.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});
app.listen(5340, function() {
    console.log("server running successfully");
});