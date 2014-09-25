var http = require('http');
var express = require('express');
var path = require('path');

console.log('Server running at http://127.0.0.1:7777/');
var app = express();

console.log("\n-------------the answer-------------\n");

app.use(express.static(path.join(__dirname, 'public')));
// register api routes
app.get('*', function(req, res){res.end();});

//http.createServer(app).listen(7777, '127.0.0.1');
http.createServer(app).listen(7777, '10.102.242.79');

