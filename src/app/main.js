var express = require('express'),
    mysql = require('mysql'),
    Q = require('Q'),
    response = require('./response'),
    bodyParser = require('body-parser');

var app = express(),
    connection = mysql.createConnection({
      host     : '127.0.0.1',
      user     : 'root',
      password : 'root',
      database : 'word_log'
    }),
    _query = Q.denodeify(connection.query.bind(connection));

// MySQL connection
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('MySQL connected as id ' + connection.threadId);
});

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser());

// Get word list
app.get('/word/list', function(req, res) {
  _query('SELECT * FROM word ORDER BY id DESC LIMIT 50').done(function(rows) {
//console.log(rows);
    res.send(response.success(rows));
  });
});
// Post word
app.post('/word', function(req, res) {
  var word = req.param('word'),
      ref = req.param('ref'),
      snip = req.param('snip'),
      practice = req.param('example');

  connection.query('SELECT * FROM word where word = ?', [word], function(err, result) {
    var id;
    if (result.length>0) {
      id = result.shift().id;
    } else {
        connection.query('INSERT INTO `word` SET ?', { word : word }, function(err, result) {
	  id = result.insertId;
	});
    }

/*
        connection.query('INSERT INTO `reference` SET ?', { word : word }, function(err, result) {
	  id = result.insertId;
	});
*/
    //res.send(response.success(results));
  });
});


app.listen(8080);