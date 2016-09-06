var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var passport = require('passport');
var passportLocal = require('passport-local');

var layout = require('express-layout');

var routes = require('./routes/index');
var movies = require('./routes/movies');

var app = express();

app.use(layout());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession( { 
  secret: 'jfdoignrDF', 
  resave: false,
  saveUninitialized: false
} ));

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new passportLocal.Strategy(function(username, password, done){
//   done(null, { id: 'row.id', username: 'row.name' } )
//   // done(null, { } )
//   // db.all('SELECT * FROM users WHERE name = "' + username + '" AND password = "' + password + '"', function(err, row) {
//   //   if(err !== null) {
//   //     // next(err);
//   //     done(null, null);
//   //   }
//   //   else {
//   //     // console.log(row);
//   //     // res.render('movies.jade', {movies: row});
//   //     done(null, { id: 'row.id', username: 'row.name' } )
//   //   }
//   // });
// }));
//
// passport.serializeUser(function(user, done){
//   done(user.id);
// });
//
// passport.deserializeUser(function(id, done){
//   done({ id: id } )
//   // db.all('SELECT * FROM users WHERE id = ' + id , function(err, row) {
//   //   done({ id: row.id } )
//   //   // if(err !== null) {
//   //   //   // next(err);
//   //   //   // done(null, null);
//   //   // }
//   //   // else {
//   //   //   // console.log(row);
//   //   //   // res.render('movies.jade', {movies: row});
//   //   //   done(null, { id: row.id, username: row.name } )
//   //   // }
//   // });
// });

sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('cozy.db');

// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='movies'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE "movies" ' +
           '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"title" VARCHAR(255), ' +
           'url VARCHAR(255));', function(err) {
      if(err !== null) {
        console.log(err);
      }
      else {
        console.log("SQL Table 'movies' initialized.");
      }
    });
  }
  else {
    console.log("SQL Table 'movies' already initialized.");
  }
});

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE "users" ' +
           '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"name" VARCHAR(255), ' +
           '"password" VARCHAR(255));', function(err) {
      if(err !== null) {
        console.log(err);
      }
      else {
        console.log("SQL Table 'users' initialized.");
      }
    });
  }
  else {
    console.log("SQL Table 'users' already initialized.");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/movies', movies);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
