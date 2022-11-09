//----- Mongoose and Models
var mongoose = require('mongoose');
var SomeModel = require("./models/primer");
//-----

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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

    model1.save(function(err, model) {
        if(err) return console.error(err);
        console.log(model.a_name + " saved to collection.");
    });
});
// -----



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
