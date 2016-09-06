var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var passport = require('passport');
var passportLocal = require('passport-local');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession( { 
  secret: 'jfdoignrDF', 
  resave: false,
  saveUninitialized: false
} ));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username, password, done){
  done(null, { id: 'row[0].id', username: 'row[0].name' } )
  // db.all('SELECT * FROM users WHERE name = "' + username + '" AND password = "' + password + '"', function(err, row) {
  //   done(null, { id: 'row[0].id', username: 'row[0].name' } )
  //   // if(err !== null) {
  //   //   // next(err);
  //   //   done(null, null);
  //   // }
  //   // else {
  //   //   // console.log(row);
  //   //   // res.render('movies.jade', {movies: row});
  //   //   done(null, { id: 'row[0].id', username: 'row[0].name' } )
  //   // }
  // });
}));

passport.serializeUser(function(user, done){
  // done(user.id);
  done(user.id);
});

passport.deserializeUser(function(id, done){
  done({ id: id });
  // db.all('SELECT * FROM users WHERE id = ' + id , function(err, row) {
  //   if(err !== null) {
  //   }
  //   else {
  //     done(null, { id: row.id, username: row.name } )
  //   }
  // });
});


// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Express',
  	isAuthenticated: req.isAuthenticated(),
  	user: req.user 
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login_create', passport.authenticate('local'), function(req, res, next) {
  res.redirect('/sample');
});

router.get('/sample', function(req, res, next) {
  res.render('sample', {
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});



router.post('/signup_create', function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  db.all('INSERT INTO users (name, password) VALUES (?, ?)', data.name, data.password, function(err, row) {
  	if(err){
            console.log("Error Selecting : %s ",err );
            return;
    }
    res.redirect('/movies/new');
  });
});

module.exports = router;

// io.on('connection', function(socket){
//   console.log('a user connected');
// });

// http.listen(8080, function(){
//   console.log('listening on *:8080');
// });
