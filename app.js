//----- Mongoose and Models
var mongoose = require('mongoose');
var SomeModel = require("./models/primer");
var BreakfastModel = require("./models/breakfast");
var AwesomeModel = require('./models/awesome');
var AthleteModel = require('./models/athelete');
var AuthorModel = require('./models/author');
var StoryModel = require('./models/story');
//-----

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { isReadable } = require('stream');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// ----- mongo connection
const mongoDB = "mongodb://127.0.0.1:27017/mongoose-primer?tls=false";
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));

db.once('open', function() {
    console.log("[+] Connection Successful!");

    var model1 = new SomeModel({
        a_name: "Wes",
        a_value: 666
    });

    var model2 = new BreakfastModel({
        eggs: 7,
        drink: "Coffee"
    });

    var awesome_instance = new AwesomeModel({
        name: "awesome"
    });

    model1.save(function(err, model) {
        if(err) return console.error(err);
        console.log(model.a_name + " saved to collection.");
    });

    model2.save(function(err, model) {
        if(err) return console.error(err);
        console.log(model.fullbreakfast);
    });

    //Commenting to test update()
    // awesome_instance.save((err, model) => {
    //     if(err) return console.error(err);
    //     console.log(model.name);
    // });

    // Update above entry
    // ! NOT UPDATING CREATING NEW ENTRY
    // awesome_instance.name = "New cool name";
    // awesome_instance.save((err, result) => {
    //     if (err) console.error(err);
    //     console.log(result.name);
    // })

    // AwesomeModel.create({name: "create"}, function(err, awesome_instance){
    //     if (err) return console.lerr(err);
    //     console.log(awesome_instance.name);
    // });

    // AthleteModel.create({
    //     name: "Kimbo Slice",
    //     age: "58",
    //     sport: "Street Fighter",
    //     team: "American Top Team",
    // }, (err, athlete_instance) => {
    //     console.log(athlete_instance);
    // });

    // --- Related Documents
    // const authorStephenKing = new AuthorModel({name: "Stephen King"});
    // authorStephenKing.save((err) => {
    //     if(err) console.log(err);

    //     // Anne is saved at this point, create a story
    //     const story = new StoryModel({
    //         title: "The Shining",
    //         // Assign the _id from the author.
    //         author: authorStephenKing._id,
    //     });

    //     story.save((err) => {
    //         if (err) console.log(error);
    //         console.log("[+] Author and Story Successful!");
    //     });
    // });

    // const authorAnneReice = new AuthorModel({name: "Anne Rice"});
    // authorAnneReice.save((err) => {
    //     if (err) console.log(err);

    //     const story = new StoryModel({
    //         title: "The Vampire Lestat",
    //         author: authorAnneReice._id,
    //     });

    //     story.save((err, results) => {
    //         if (err) console.log(err);
    //         console.log(results)
    //     });
    // });

});

// Searching for and returning data.
// AwesomeModel.find({name:"New cool name"}, "__id",(err, results) => {
//     if(err) console.error(err);
//     console.log(results);
// });

// No callback method
// const query = AthleteModel.find({team: "American Top Team"}); // Find Bas
// query.select("name age"); // Get athlete name and age field data
// query.limit(2); // Setting a limit on the number of entries
// query.sort({age:1}); // Sorting by age, ascending
// query.exec((err, results) => {  // Using exec to execute the query after its been built up
//     if(err) console.log(err);
//     console.log(results);
// });
// -----

// START AT POPULATE()
StoryModel.findOne({title: "The Shining"})
    .populate("author")
    .exec((err, results) => {
        if (err) console.log(err);
        console.log(results.author.name);
    });

AuthorModel.findOne({name: "Anne Rice"})
    .exec((err, author_results) => {
        StoryModel.find({author: author_results._id})
        .exec((err, story_results) => {
            if(err) console.log(`Story reults erorr: ${err}`);
            for (let stories in story_results) {
                console.log(`${story_results[stories].title}`);
            }
        });
    });


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
