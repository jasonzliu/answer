var _=require('lodash');

var sqlApi = function() {};
var Sequelize = require('sequelize')
    , sequelize = new Sequelize('mysql://jason:demo2demo@127.0.0.1:3306/answer', {
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

module.exports = sqlApi;