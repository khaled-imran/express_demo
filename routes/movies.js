var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  db.all('SELECT * FROM movies ORDER BY title', function(err, row) {
    if(err !== null) {
      // Express handles errors via its next function.
      // It will call the next operation layer (middleware),
      // which is by default one that handles errors.
      next(err);
    }
    else {
      console.log(row);
	  res.render('movies.jade', {movies: row});
      //res.render('movies.jade', {movies: row}, function(err, html) {
      //  res.send(200, html);
      //});
    }
  });

});

router.get('/new', function(req, res, next) {
	
  res.render('new_movie.jade');	
  

});

router.get('/edit/:id', function(req, res, next) {
	db.all('SELECT * FROM movies WHERE id = ?', req.params.id , function(err, row) {
  	if(err){
            console.log("Error Selecting : %s ",err );
            return;
    }
    form_info = {
    	id: req.params.id,
    	title: row[0].title,
    	url: row[0].url
    }
    res.render('edit_movie.jade', form_info);
  });	
});


router.post('/create', function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  db.all('INSERT INTO movies (title, url) VALUES (?, ?)', data.title, data.url, function(err, row) {
  	if(err){
            console.log("Error Selecting : %s ",err );
            return;
    }
    res.redirect('/movies');
  });
});

router.post('/update/:id', function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  db.all('UPDATE movies SET title = ?, url = ? WHERE id = ? ', data.title, data.url, req.params.id, function(err, row) {
  	if(err){
            console.log("Error Selecting : %s ",err );
            return;
    }
    res.redirect('/movies');
  });
});

router.get('/:id', function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  db.all('SELECT * FROM movies WHERE id = ?', req.params.id, function(err, row) {
  	console.log('row');
  	console.log(row);
  	if(err){
            console.log("Error Selecting : %s ",err );
            return;
    }
    page_info = {
    	id: req.params.id,
    	title: row[0].title,
    	url: row[0].url
    }
    res.render('show_movie.jade', page_info);
  });
});

module.exports = router;
