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

app.post('/opt', function(req, res){
    rio.sourceAndEval("R/opt_total.R", {
        entryPoint: "getOptimal",
        data: {
            total: [500000]
        },
        callback: function(err, data){
            if (!err) {
                data = JSON.parse(data);
                /*console.log(data.paras);
                console.log(data.decomp_sales);
                console.log("Optimal total is " + data.total_sales);*/
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(JSON.stringify(data));
            } else {
                /*console.log("Optimization failed");
                console.log(err);*/
                res.writeHead(500);
                res.end(JSON.stringify(err));
            }
        }
    });
});

//http.createServer(app).listen(7777, '127.0.0.1');
http.createServer(app).listen(7777, '100.79.164.6');
//rio.enableDebug(true);
//rio.enableRecordMode(true, {fileName: 'dump.bin'});
//rio.enablePlaybackMode(true, {fileName: 'dump.bin'});
//rio.evaluate("pi / 2 * 2");
/*
rio.sourceAndEval("R/opt_total.R", {
    entryPoint: "getOptimal",
    data: {
        total: [500000]
    },
    callback: function(err, data){
        if (!err) {
            data = JSON.parse(data);
            console.log(data.paras);
            console.log(data.decomp_sales);
            console.log("Optimal total is " + data.total_sales);
        } else {
            console.log("Optimization failed");
            console.log(err);
        }
    }
});*/
