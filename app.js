//----- Mongoose and Models
var mongoose = require("mongoose");

var AuthorModel = require("./models/author");
var BookModel = require("./models/book");
var BookInstanceModel = require("./models/bookinstance");
//-----

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { isReadable } = require("stream");

//const author = require('./models/author');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

// ----- mongo connection
const mongoDB =
    "mongodb+srv://brandon:terminal@cluster0.btl9b9w.mongodb.net/new_library?retryWrites=true&w=majority";
mongoose
    .connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        () => {
            console.log("Connection Successful!");
        },
        (err) => {
            console.log(err);
        }
    );


// BookInstance Test
    // BookModel.findOne({title: "Interview With a Vampire"})
    //     .exec((err, book_results) => {
    //         if (err) return console.log(err);
    //         console.log(book_results);
    //         const book_instance_model = new BookInstanceModel({
    //             book: book_results._id,
    //             imprint: "Penguin Book",
    //             status: "Loaned",
    //             due_back: Date.now,
    //         });
    //         book_instance_model.save((err) => {
    //             if(err) console.log(err);
    //         });
    //     }
    // );

    // const book_instance_model = new BookInstanceModel({
    //     book: "Interview with a Vampire",
    //     imprint: "Penguin Book",
    //     status: "Loaned",
    //     due_back: "Oct 31, 2023",
    // });
    // book_instance_model.save((err) => {
    //     if(err) console.log(err);
    // });

//  Book Model Test
// AuthorModel.findOne({ name: "Anne Rice" })
//     .exec((err, author_results) => {
//         const book_model = new BookModel({
//             title: "Interview With a Vampire",
//             author: author_results._id,
//             summary: "Lorem ipsum dolor nurit",
//             isbn: 098123098123,
//         });
//         book_model.save((err) => {
//             if(err) console.log(err);
//         });
//     });



app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
