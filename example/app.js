var http = require('http');
var reRequire = require('re-require2').reRequire;

var server = http.createServer(function(req, res) {
	// we reRequire inside this function so that everytime a request comes in, './handler' gets re-required
	// if we did http.createServer( reRequire('./handler').handleRequest(req, res) ), then it wouldn't work
	reRequire('./handler').handleRequest(req, res);
});

server.listen(8080, function(){
    console.log("Server listening on: http://localhost:8080");
	console.log("Try making changes to the handleRequest function in handler.js and refresh!");
});