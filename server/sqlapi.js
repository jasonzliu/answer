var _=require('lodash');
var path = require('path');
var fs = require('fs');
var q = require('q');

var sqlApi = function() {};
var Sequelize = require('sequelize')
    , sequelize = new Sequelize('mysql://jasonzliu@172.17.113.157:3306/c9', {
        dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
        port: 3306 // or 5432 (for postgres)
    });

sequelize
    .authenticate()
    .complete(function (err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    });

var sql = {
    summary: {
        pie: {
            campaign_type: 'select campaign_type,count(id)  as count from tbl_campaign group by campaign_type;',
            media_type: 'select media_code,count(id)  as count  from tbl_campaign group by media_code;',
            product_type: 'select product_code,count(id) as count from tbl_campaign group by product_code;',
            program_type: 'select program,count(id) as count from tbl_campaign group by program;',
            region: 'select region_code,count(id) as count from tbl_campaign group by region_code;'
        },
        bar: {
            campaign_type: 'select campaign_type,format(sum(ttd_budget) ,0) as budget,format(sum(ctd_dir_sales_ts_totalstrat+ctd_mc_sales_totalstrat) ,0) as ttl_sales from tbl_campaign group by campaign_type;',
            media_type: 'select media_code,format(sum(ttd_budget) ,0) as budget,format(sum(ctd_dir_sales_ts_totalstrat+ctd_mc_sales_totalstrat) ,0) as ttl_sales from tbl_campaign group by media_code;',
            product_type: 'select product_code,format(sum(ttd_budget) ,0) as budget,format(sum(ctd_dir_sales_ts_totalstrat+ctd_mc_sales_totalstrat) ,0) as ttl_sales from tbl_campaign group by product_code;',
            program_type: 'select program,format(sum(ttd_budget) ,0) as budget,format(sum(ctd_dir_sales_ts_totalstrat+ctd_mc_sales_totalstrat) ,0) as ttl_sales from tbl_campaign group by program;',
            region: 'select region_code,format(sum(ttd_budget),0) as budget,format(sum(ctd_dir_sales_ts_totalstrat+ctd_mc_sales_totalstrat), 0) as ttl_sales from tbl_campaign group by region_code;'
        },
        time_series_line: 'select report_year, report_week,format(sum(ttd_budget) ,0) as ttl_budget,format(sum(ctd_dir_sales_ts_totalstrat+ctd_mc_sales_totalstrat),0) as ttl_sales from tbl_campaign group by report_year, report_week order by report_year,report_week;'
    },
    kpi: {
        cost_per_sale: 'select format (sum(ttd_budget)/sum(ctd_dir_sales_ts_totalstrat+ctd_mc_sales_totalstrat),0) as value from tbl_campaign where end_date_traditional between (start_date) and (end_date_traditional) and campaign_type="general" and program="movers" and media_type="mass" and region_code="w" and product_code="bund";',
        cost_per_call: 'select format (sum(ttd_budget)/sum(ctd_dir_calls+ctd_mc_calls),0) as value from tbl_campaign where end_date_traditional between (start_date) and (end_date_traditional) and campaign_type="general" and program="movers" and media_type="mass" and region_code="w" and product_code="bund";',
        cost_per_click: 'select format((ttd_budget)/sum(ctd_dir_clicks+ctd_mc_clicks),0) as value from tbl_campaign where end_date_traditional between (start_date) and (end_date_traditional) and campaign_type="general" and program="movers" and media_type="mass" and region_code="w" and product_code="bund";',
        quantity_per_sale: 'select format (sum(ctd_quantity)/sum(ctd_dir_sales_ts_totalstrat+ctd_mc_sales_totalstrat),0) as value from tbl_campaign where end_date_traditional between (start_date) and (end_date_traditional) and campaign_type="general" and program="movers" and media_type="mass" and region_code="w" and product_code="bund";',
        quantity_per_call: 'select format (sum(ctd_quantity)/sum(ctd_dir_calls+ctd_mc_calls),0) as value from tbl_campaign where end_date_traditional between (start_date) and (end_date_traditional) and campaign_type="general" and program="movers" and media_type="mass" and region_code="w" and product_code="bund";',
        quantity_per_click: 'select format(sum(ctd_quantity)/sum(ctd_dir_clicks+ctd_mc_clicks),0) as value from tbl_campaign where end_date_traditional between (start_date) and (end_date_traditional) and campaign_type="general" and program="movers" and media_type="mass" and region_code="w" and product_code="bund";'
    }
};

sqlApi.prototype.runsql = function(req, res) {
    var arr = _.compact(req.url.split('/'));
    var str = sql;
    _.forEach(arr, function(item){
        if (str)
            str = str[item];
    });
    if (str && typeof(str) == 'string'){
        sequelize.query(str)
            .success(function (data) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                //console.log(myTableRows)
                res.end(JSON.stringify(data));
            });
    }else{
        res.end();
    }
};

sqlApi.prototype.upload = function(req, res){
    var data = _.pick(req.body, 'type')
        , uploadPath = path.join(process.cwd(), 'uploads')
        , file = req.files.file;

    console.log(file.name); //original name (ie: sunset.png)
    console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
    console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)

    fs.readFile(file.path, function(err, data){
       if (err){
           res.writeHead(500);
           res.end();
       }else{
           var content = data.toString();
           var records = _.compact(content.split('\r\n'));
           var i,j,temparray,chunk = 3;
           var done = false;
           var wrong = false;

           for (i=0,j=records.length; i<j; i+=chunk) {
               temparray = records.slice(i,i+chunk);
               var arr = [];
               _.forEach(temparray, function(record){
                   var columns = record.split(',');
                   _.forEach(columns, function(col){
                       if (col = '') col = '0'
                   });

                   var sql = "\r\nINSERT INTO tbl_campaign(id,campaign_type,media_code,media_type,product_code,program,region_code,report_year,report_week,start_date,end_date_traditional,ttd_budget,ctd_dir_sales_ts_totalstrat,ctd_mc_sales_totalstrat,ctd_quantity,ctd_dir_calls,ctd_mc_calls,ctd_dir_clicks,ctd_mc_clicks) VALUES ("
                       + columns[0] + ",'" + columns[1] + "','" + columns[2] + "','" + columns[3] + "','" + columns[4] + "','" + columns[5]
                       + "','" + columns[6] + "'," + columns[7]+ "," + columns[8] + ",'" + columns[9] + "','" + columns[10] + "'," + columns[11] + "," + columns[12]
                       + ",'" + columns[13] + "'," + columns[14]+ "," + columns[15] + "," + columns[16] + "," + columns[17] + "," + columns[18] +");";
                   //console.log(sql);
                   arr.push(sequelize.query(sql));
               });
               q.all(arr)
                   //sequelize.query(sql )
                   .then(function (data) {
                   })
                   .catch(function(err){
                       wrong = true;
                       console.log('Wrong!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                       console.log(err);
                   });
           }

           res.writeHead(200);
           res.end();
           /*var str = '47697,General,MS,Mass,OTH,Movers,NATL,2008,31,2008-01-01,2008-12-22,0,1069,0,0,20621,0,0,0';
           var str1 = '47698,General,MS,Mass,OTH,Movers,NATL,2008,31,2008-01-01,2008-12-22,0,1069,0,0,20621,0,0,0';
           var arr = str.split(',');
           var arr1 = str1.split(',');
           var sql = "\r\nINSERT INTO tbl_campaign(id,campaign_type,media_code,media_type,product_code,program,region_code,report_year,report_week,start_date,end_date_traditional,ttd_budget,ctd_dir_sales_ts_totalstrat,ctd_mc_sales_totalstrat,ctd_quantity,ctd_dir_calls,ctd_mc_calls,ctd_dir_clicks,ctd_mc_clicks) VALUES ("
               + arr[0] + ",'" + arr[1] + "','" + arr[2] + "','" + arr[3] + "','" + arr[4] + "','" + arr[5] + "','" + arr[6] + "'," + arr[7]
               + "," + arr[8] + ",'" + arr[9] + "','" + arr[10] + "'," + arr[11] + "," + arr[12] + ",'" + arr[13] + "'," + arr[14]
               + "," + arr[15] + "," + arr[16] + "," + arr[17] + "," + arr[18] +");";
           arr = arr1;
           var sql1 = "\r\nINSERT INTO tbl_campaign(id,campaign_type,media_code,media_type,product_code,program,region_code,report_year,report_week,start_date,end_date_traditional,ttd_budget,ctd_dir_sales_ts_totalstrat,ctd_mc_sales_totalstrat,ctd_quantity,ctd_dir_calls,ctd_mc_calls,ctd_dir_clicks,ctd_mc_clicks) VALUES ("
               + arr[0] + ",'" + arr[1] + "','" + arr[2] + "','" + arr[3] + "','" + arr[4] + "','" + arr[5] + "','" + arr[6] + "'," + arr[7]
               + "," + arr[8] + ",'" + arr[9] + "','" + arr[10] + "'," + arr[11] + "," + arr[12] + ",'" + arr[13] + "'," + arr[14]
               + "," + arr[15] + "," + arr[16] + "," + arr[17] + "," + arr[18] +");";
           q.all([sequelize.query(sql), sequelize.query(sql1)])
               //sequelize.query(sql )
               .then(function (data) {
                   res.writeHead(200);
                   res.end();
                   fs.unlink(file.path);
               })
               .catch(function(err){
                   res.writeHead(500);
                   res.end();
               });*/
       }
    });





};

module.exports = sqlApi;