// =========== REQUIRE MODULES ==============
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('express-flash')
const port = 5000;

var session = require('express-session');
var path = require('path');

// =========== Use =================
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Points to the angular file to server the index.html
app.use(express.static(__dirname + '/public/dist/public'));

// =========== LISTEN PORT ===========
app.listen(port, function () {
    console.log("You are listening on port 5000")
})
// =========== MONGOOSE CONNECTION ===========
// Here is where you can change the database information
// from the name to the collections 

mongoose.connect('mongodb://localhost/authors');
var AuthorSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name must contain at least 3 characters"], minlength: 1 },
}, { timestamps: true });

const Author = mongoose.model('Author', AuthorSchema)
mongoose.Promise = global.Promise;

// =========== ROUTES ===========

app.get('/authors', function (req, res) {
    console.log("this is the server file")
    Author.find({}, (err, author) => {
        res.json({ message: "Retrieved all authors", author })
    })
})

app.get('/authors/:id', (req, res) => {
    console.log("Get one author: ",req.params.id)
    Author.findOne({ _id: req.params.id }, (err, author) => {
        if (err) {
            console.log("Error message", err)
            res.json(err)
        } else {
            res.json({ message: "Successfully retrieved one Author", author })
        }
    })
})

app.post('/authors', (req, res) => {
    console.log(req.body)
    Author.create({name: req.body.name}, (err, author) => {
        if(err){
            console.log("Error message", err)
        }else{
            res.json({message: "Successfully create a new author", author})
        }
    })
})
// edit route
app.put('/authors/:id/edit', (req, res) => {
    console.log("in edit route server.js======================")
    console.log("NAME: " , req.body.name)
    console.log("ID: " , req.params.id)
    Author.findOneAndUpdate({_id: req.params.id}, {$set: {name: req.body.name}}, (err, author) =>{
        res.json({message: "Author has been updated successfully", author: author})
    })
})

app.delete('/authors/delete/:id', (req, res) => {
    console.log("Deleting this author with id: ", req.params.id)
    Author.findByIdAndRemove({_id: req.params.id}, (err, author) => {
        res.json({message: "Deleted author",author})
    })
})

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});