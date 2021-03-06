// /applications/AD-Capital/metric-data?
//metric-path=Overall%20Application%20Performance%7CNormal%20Average%20Response%20Time%20(ms)&
// time-range-type=BETWEEN_TIMES
// &start-time=1492636402624
// &end-time=1492641802624&rollup=false&output=json
// [{
//   "metricName": "BTM|Application Summary|Average Response Time (ms)",
//   "metricId": 31699,
//   "metricPath": "Overall Application Performance|Average Response Time (ms)",
//   "frequency": "ONE_MIN",
//   "metricValues":   [
//         {
//       "occurrences": 0,
//       "current": 8,
//       "min": 2,
//       "max": 50437,
//       "startTimeInMillis": 1492661820000,
//       "useRange": true,
//       "count": 55,
//       "sum": 190908,
//       "value": 3471,
//       "standardDeviation": 0
//     },

let args = process.argv.slice(2);
let showFuture = false;
if(args.length) {
	console.log("\n\nnow accelerating to 88 miles an hour....");
	console.log("POWER CYCLE REACHING 1.21 GIGAWATTS!!!!!\n\n");
	showFuture = true;
}


const http = require('http')
const port = 8000
var fs = require('fs')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../util/demo.db');

var url = require('url');

let globalStartTime = 0;


var testMetrics = null
let metrics_file = "demo-metrics";

fs.readFile(metrics_file, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    testMetrics = data;
});

const requestHandler = (request, response) => {

	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;

	if (url_parts.pathname.match('test-metrics')) {
	    response.end(testMetrics);
	}
	else {
	  	let metricPath = query["metric-path"];
		let originalMetricPath = metricPath;
	  	if(showFuture)
	  		metricPath += "_FUTURE";

	  	let startTime = parseInt(query["start-time"]);
	  	let endTime = parseInt(query["end-time"]);
	  	if (globalStartTime == 0) {
	  		globalStartTime = endTime;
	  	}
	  	startTime = -( startTime - globalStartTime);
	  	endTime = -( endTime - globalStartTime);
//	  	console.log("querying",startTime,endTime,metricPath);
	   db.all(`SELECT (${globalStartTime} - timestamp) as 'startTimeInMillis', (value) AS 'value' from metrics WHERE metricpath = "${metricPath}" AND timestamp < ${startTime} AND timestamp > ${endTime}`, function(err, rows) {
	   		if(err) {
	   			console.log("err is",err);
	   			response.end("");
	   			return;
	   		}
	   		let restResponse = [{
				  "metricName": originalMetricPath,
				  "metricId": 31699,
				  "metricPath": originalMetricPath,
				  "frequency": "ONE_MIN",
				  "metricValues": rows.map(r => {return {startTimeInMillis:r.startTimeInMillis,value:r.value}}),
			}];
			response.end(JSON.stringify(restResponse));
	    });

	}

}


db.serialize(function() {
	const server = http.createServer(requestHandler)

	server.listen(port, (err) => {
	  if (err) {
	    return console.log('something bad happened', err)
	  }

	  console.log(`server is listening on ${port}`)
	})

});
