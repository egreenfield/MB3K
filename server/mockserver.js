// /applications/AD-Capital/metric-data?
//metric-path=Overall%20Application%20Performance%7CNormal%20Average%20Response%20Time%20(ms)&
// time-range-type=BETWEEN_TIMES
// &start-time=1492636402624
// &end-time=1492641802624&rollup=false&output=json

const http = require('http')  
const port = 8000
var fs = require('fs')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../util/demo');

var url = require('url');

let globalStartTime = 0;


var testMetrics = null
let metrics_file = "test-metrics-amod";

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
	  	console.log("request is",JSON.stringify(query));
	  	let metricPath = query["metric-path"];
	  	let startTime = parseInt(query["start-time"]);
	  	let endTime = parseInt(query["end-time"]);
	  	if (globalStartTime == 0) {
	  		globalStartTime = startTime;
	  	}
	  	startTime = globalStartTime - startTime;
	  	endTime = globalStartTime - endTime;
	  	console.log("querying",startTime,endTime);
	  //  db.all("SELECT * from cpu_total", function(err, row) {
	  //  		if(err)
	  //  			console.log("err is",err);
	  //  		else
	  //  			console.log("response is",row);
			// response.end(JSON.stringify(row));
	  //   });
	  response.end("");

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

