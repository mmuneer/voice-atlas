var express = require('express');
var app = express();
var fs = require('fs');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'XVeOiSKroRQWoxwjfT2AZiB3y',
  consumer_secret: '5QI6xRvJskj4ZhMXhBQUpifdH1dVm3FI86rtFuqMIQ3fyPWzqC',
  access_token_key: '256557909-adLCnuUx9m40lCoeOgVApauEfAAAmloLQK0s0JUT',
  access_token_secret: 'Fpc7kAMV5TlMB5jMRhlFcMQDRZ5jexKDaj2MQ6lTTGi8N'
});



function geoCodeByLatLng(lat, lng, resp) {
	var params = { lat: lat, long: lng };
	client.get('geo/search', params, function(error, tweets, response) {
  	  if (!error) {
  	  	var places = tweets.result.places;
        resp.json(places);
      }
      else {
  	    console.log(error);
        resp.json(error);
      }
    });
}

// GET https://api.twitter.com/1.1/trends/available.json
function geoCodesByTrend(resp) {
	params = {}
	client.get('trends/available', params, function(error, trends, response) {
		if(!error) {
			resp.json(trends);
		}
		else {
  	    console.log(error);
        resp.json(error);
       }
	});
}

// GET https://api.twitter.com/1.1/trends/place.json?id=1
function trends(place_id, resp) {
	params = {id: place_id}
	client.get('trends/place', params, function(error, trends, response) {
		if(!error) {
			resp.json(trends);
		}
		else {
  	    console.log(error);
  	    resp.json(error);
  		}
	});
}

// GET https://api.twitter.com/1.1/trends/closest.json?lat=37.781157&long=-122.400612831116
function get_closest_trends(lat, lng, resp) {
  var params = { lat: lat, long: lng };
  client.get('trends/closest', params, function(error, places, response) {
      if (!error) {
        resp.json(places);
      }
      else {
        console.log(error);
        resp.json(error);
      }
    });
}

// GET https://api.twitter.com/1.1/geo/id/df51dec6f4ee2b2c.json
function getLatLng(place_id, resp) {
	params = {}
	client.get('geo/id/${place_id}', params, function(error, trends, response) {
		if(!error) {
			resp.json(trends);
		}
		else {
  	    console.log(error);
        resp.json(error);
  		}
	});
}




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

app.get('/static_topics', function(request, response) {
  response.setHeader('Content-Type', 'application/json');	
  readJSONFile('views/pages/trends.json', function (err, json) {
  	if(err) { throw err; }
  	response.json(json);
  });
	
});

// GET https://api.twitter.com/1.1/trends/place.json?id=1
app.get('/trends', function(request, response) {
	response.setHeader('Content-Type', 'application/json');
	trends(request.query.place_id, response);
});

// GET https://api.twitter.com/1.1/geo/search.json?lat=37.7821120598956&long=122.400612831116
app.get('/geo_code', function(request, response) {
  response.setHeader('Content-Type', 'application/json');
  geoCodeByLatLng(request.query.lat, request.query.lng, response);
  
});

// GET https://api.twitter.com/1.1/trends/closest.json?lat=37.781157&long=-122.400612831116
app.get('/closest_trends', function(request, response) {
  response.setHeader('Content-Type', 'application/json');
  get_closest_trends(request.query.lat, request.query.lng, response);
});

// GET https://api.twitter.com/1.1/trends/available.json
app.get('/geo_codes_by_trend', function(request, response) {
	response.setHeader('Content-Type', 'application/json');
	geoCodesByTrend(response);
});

// GET https://api.twitter.com/1.1/geo/id/df51dec6f4ee2b2c.json
app.get('/get_lat_lng', function(request, response) {
	response.setHeader('Content-Type', 'application/json');
	getLatLng(request.place_id, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




