var proxy = require('express-http-proxy'); 
var app = require('express')();
 
app.use('/api', proxy('http://ec2-54-185-117-159.us-west-2.compute.amazonaws.com:9080/', {
  // decorateRequest: function(proxyReq, originalReq) {
  //   return proxyReq;
  // },
  // intercept: function(rsp, data, req, res, callback) {
  //   callback(null, data);
  // }
  // forwardPath: function(req, res) {
  // 	console.log("proxying",require('url').parse(req.url).path);
  //   return require('url').parse(req.url).path;
  // }
}));

app.listen(8000, function () {
  console.log('proxy listening on port 8000')
})
