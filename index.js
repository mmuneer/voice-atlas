var express = require('express');
var app = express();
var fs = require('fs');

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/topics', function(request, response) {
  response.setHeader('Content-Type', 'application/json');	
  readJSONFile('views/pages/trends.json', function (err, json) {
  	if(err) { throw err; }
  	response.json(json);
  });
	
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


