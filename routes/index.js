var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET buses */
router.get('/getBuses', function(req, res, next) {
	var connection = mysql.createConnection({
		host: "us-cdbr-azure-west-a.cloudapp.net",
		user: "b8e1294bdd60a3",
		password: "b04229ab",
		database: "madisonmetro"
	});
	
	console.log("Get buses");
	
	var lon = req.query.lon;
	lon = lon.substring(0, lon.length - 2) + "%%";
	var lat = req.query.lat;
	lat = lat.substring(0, lat.length - 2) + "%%";
	
	var date = new Date();
	var hour = date.getHours();
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
	var currentTime = hour + ":" + min + ":" + sec;
	
	var addedMinutes = 30;
	
	var datePlusMinutes = new Date(date.getTime() + addedMinutes*60000);
	var hourAddedMinutes = datePlusMinutes.getHours();
    var minAddedMinutes  = datePlusMinutes.getMinutes();
    minAddedMinutes = (minAddedMinutes < 10 ? "0" : "") + minAddedMinutes;
    var secAddedMinutes  = datePlusMinutes.getSeconds();
    secAddedMinutes = (secAddedMinutes < 10 ? "0" : "") + secAddedMinutes;
	var timeAddedMinutes = hourAddedMinutes + ":" + minAddedMinutes + ":" + secAddedMinutes;
	
	console.log(currentTime + " " + timeAddedMinutes);
			
	var results = connection.query('SELECT t.route_short_name, st.arrival_time FROM trips t INNER JOIN stop_times st ON t.trip_id = st.trip_id INNER JOIN stops s ON st.stop_id = s.stop_id WHERE s.stop_lon LIKE ? AND s.stop_lat LIKE ? AND st.arrival_time BETWEEN TIME(?) AND TIME(?) ORDER BY st.arrival_time asc LIMIT 7;', [lon, lat, currentTime, timeAddedMinutes], function(err, rows, fields) {

		if (err) {
			console.log(err.stack);

		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(rows));
		}
		
	});
	
	connection.end()
});


module.exports = router;
