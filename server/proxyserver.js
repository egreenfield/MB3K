var proxy = require('express-http-proxy'); 
var app = require('express')();
var fs = require('fs')
 
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

app.use('/api/metrics', proxy('http://ec2-23-20-138-216.compute-1.amazonaws.com:8090', {
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
    console.log("proxied to",url)
    return  url;
  }
}));

app.get('/api/test-metrics', function(req, res) {
    res.send(testMetrics);
});

var testMetrics = null
fs.readFile('test-metrics', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    testMetrics = data;
});

app.listen(8000, function () {
  console.log('proxy listening on port 8000')
})
