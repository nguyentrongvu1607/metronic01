var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
require('./passport')(passport);
var bearerToken = require('express-bearer-token');

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://vutrong123:subin123@cluster0-0dhe1.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB,{useNewUrlParser:true});
var db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error:'));
db.on('error', console.error.bind(console,'connection error:'));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var auth = require('./routes/auth')(passport);
var user = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'secret',
  saveUninitialized:false,
  resave:false
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(bearerToken({
//   headerKey: 'bearer',
//   reqKey: req.token,
// }));

// const request = require('request');
//   request({headers:{'authorization': 'bearer'+ req.token},rejectUnauthorized: false}, (err,res)=>{
//     if(err) {
//       console.error(err);
//     } else {
//       console.log(res.body);
//     }
//   });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

db.once('open', function(){
  console.log('db opened')
  app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', auth);
app.use('/user', passport.authenticate('jwt', {session: false}), user);
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
