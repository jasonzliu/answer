var http = require('http');
var express = require('express');
var sqlApi = require('./server/sqlapi.js');
var path = require('path');
var multipart = require('connect-multiparty');
var _ = require('lodash');

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

app.post('/upload', function(req, res){
    var data = _.pick(req.body, 'type')
        , uploadPath = path.join(process.cwd(), 'uploads')
        , file = req.files.file;

    console.log(file.name); //original name (ie: sunset.png)
    console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
    console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
    require('fs').unlink(file.path);
    res.end();
});

http.createServer(app).listen(process.env.PORT, '172.17.113.157');

