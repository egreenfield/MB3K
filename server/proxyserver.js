var proxy = require('express-http-proxy'); 
var app = require('express')();
var fs = require('fs')

var controller = "ec2-23-20-138-216.compute-1.amazonaws.com:8090"
var https = false;
var metrics_file = "test-metrics-amod";
if (true) { /* OAFLAG */
    controller = "oa.saas.appdynamics.com";
    https = true;
    metrics_file = "test-metrics-oa";
}

app.use('/api/events', proxy('http://ec2-54-185-117-159.us-west-2.compute.amazonaws.com:9080', {
  // decorateRequest: function(proxyReq, originalReq) {
  //   return proxyReq;
  // },
  // intercept: function(rsp, data, req, res, callback) {
  //   callback(null, data);
  // }
  forwardPath: function(req, res) {
  	console.log("proxying",require('url').parse(req.url).path);
    let url = "/events" + require('url').parse(req.url).path;
    console.log("proxied to",url)
    return url;
  }
}));

app.use('/api/metrics', proxy(controller, {
    https:https,
  // decorateRequest: function(proxyReq, originalReq) {
  //   return proxyReq;
  // },
  intercept: function(rsp, data, req, res, callback) {
     console.log("response is ",data);
     callback(null, data);
   },

  forwardPath: function(req, res) {
   console.log("proxying",require('url').parse(req.url).path);
    console.log("proxying",require('url').parse(req.url).path);
    let url = "/controller/rest" + require('url').parse(req.url).path;
    console.log("proxied to",controller + url)
    return  url;
  }
}));

app.get('/api/test-metrics', function(req, res) {
    res.send(testMetrics);
});

var testMetrics = null
fs.readFile(metrics_file, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    testMetrics = data;
});

app.listen(8000, function () {
  console.log('proxy listening on port 8000')
})
