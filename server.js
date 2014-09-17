var http = require('http');
var express = require('express');
var sqlApi = require('./server/sqlapi.js');
var path = require('path');
var multipart = require('connect-multiparty');

console.log('Server running at http://'+ process.env.IP + ':'+process.env.PORT);

/*http.createServer(function (req, res) {
    var arr = _.compact(req.url.split('/'));
    var str = sql;
    _.forEach(arr, function(item){
        if (str)
            str = str[item];
    });
    if (str && typeof(str) == 'string'){
        sequelize.query(str)
            .success(function (myTableRows) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                //console.log(myTableRows)
                res.end(JSON.stringify(myTableRows));
            });
    }else{
        res.end();
    }
}).listen(7777, '127.0.0.1');*/
var api = new sqlApi();
var app = express();

app.use(multipart({
    uploadDir: 'upload'
}));
console.log("\n-------------the answer-------------\n");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
// register api routes
app.get('*', api.runsql);

app.post('/upload', api.upload);

http.createServer(app).listen(process.env.PORT, '172.17.113.157');

