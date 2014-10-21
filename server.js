var http = require('http');
var express = require('express');
var path = require('path');
var rio = require('rio');

console.log('Server running at http://127.0.0.1:7777/');
var app = express();

console.log("\n-------------the answer-------------\n");

app.use(express.static(path.join(__dirname, 'public')));
// register api routes
app.get('*', function(req, res){res.end();});

//http.createServer(app).listen(7777, '127.0.0.1');
http.createServer(app).listen(7777, '100.79.164.6');
//rio.enableDebug(true);
//rio.enableRecordMode(true, {fileName: 'dump.bin'});
//rio.enablePlaybackMode(true, {fileName: 'dump.bin'});

rio.evaluate("pi / 2 * 2", options);
rio.evaluate("c(1, 2)", options);
rio.evaluate("as.character('Hello World')", options);
rio.evaluate("c('a', 'b')", options);
rio.evaluate("Sys.sleep(5); 11", options);
