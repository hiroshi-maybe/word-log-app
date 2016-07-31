var express = require('express'),
    mysql = require('mysql'),
    Q = require('q'),
    response = require('./response'),
    util = require('./util'),
    bodyParser = require('body-parser');

var app = express(),
    connection = mysql.createConnection({
      host     : '127.0.0.1',
      user     : 'root',
      password : 'root',
      database : 'word_log'
    }),
    _query = function() {
      var deferred = Q.defer(),
          args = util.toArray(arguments);
      connection.query.apply(connection, args.concat(function(err, result) {
	if (err) { deferred.reject(err); return; }
	deferred.resolve(result);
      }));
      return deferred.promise;
    };

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
    res.send(response.success(rows));
  });
});

// Get word detail
app.get('/word/r', function(req, res) {
  var wid = req.param('word_id');
  Q.all([
    _query('SELECT * FROM word WHERE id = ?', wid),
    _query('SELECT * FROM reference WHERE word_id = ?', wid)
  ]).spread(function(w, refs) {
    var word = w.shift().word,
        resources = util.unique(util.pluck(refs, "resource_id"));
    _query('SELECT * FROM resource WHERE id IN (?)', resources).done(function(resources) {
      var resources = util.toHash(resources, "id");
      resources = refs.reduce(function(resources, ref) {
	var resource = resources[ref.resource_id];
	if (resource.references == null) {
	  resource.references = [];
	}
	resource.references.push(ref);
	return resources;
      }, resources);
      res.send(response.success({
	word : word,
	resources : resources
      }));
    });
  });
});

// Post word
app.post('/word', function(req, res) {
  var word     = req.param('word', "").trim(),
      resource = req.param('resource', "").trim(),
      snip     = req.param('snip', "").trim(),
      practice = req.param('example', "").trim();

  if (word.length<1 || resource.length<1) {
    res.send(response.error("Word and Resource required"));
  }

  Q.all([
    selectOrInsertWord(word),
    selectOrInsertResource(resource)
  ]).spread(function(wid, rid) {
    _query('INSERT INTO `reference` SET ?', {
      word_id     : wid,
      resource_id : rid,
      snippet     : snip,
      practice    : practice
    }, function(err, result) {
      id = result.insertId;
      res.send(response.success(id));
    });
  });
});

var selectOrInsertWord = function(word) {
  return _query('SELECT * FROM word where word = ?', [word])
  .then(function(_word) {
    return (_word.length>0 && Q(_word.shift().id))
     || _query('INSERT INTO `word` SET ?', { word : word }).then(function(result) {
	  // New word inserted
	  return result.insertId;
	});
  });
};
var selectOrInsertResource = function(resource) {
  return  _query('SELECT * FROM resource where name = ?', [resource])
  .then(function(_resource) {
    return (_resource.length>0 && Q(_resource.shift().id))
     || _query('INSERT INTO `resource` SET ?', { name : resource }).then(function(result) {
	  // New resource inserted
	  return result.insertId;
	});
  });
};

app.listen(80);