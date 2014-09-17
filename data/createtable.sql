CREATE TABLE tbl_campaign(
  id INTEGER(5) NOT NULL PRIMARY KEY 
, campaign_type VARCHAR(9)
, media_code VARCHAR(3)
, media_type VARCHAR(6)
, product_code VARCHAR(4)
, program VARCHAR(9)
, region_code VARCHAR(4)
, report_year INTEGER(4)
, report_week INTEGER(2)
, start_date DATE 
, end_date_traditional DATE 
, ttd_budget NUMERIC(14,6)
, ctd_dir_sales_ts_totalstrat NUMERIC(13,9)
, ctd_mc_sales_totalstrat BIT 
, ctd_quantity NUMERIC(11,1)
, ctd_dir_calls NUMERIC(15,9)
, ctd_mc_calls NUMERIC(14,9)
, ctd_dir_clicks NUMERIC(15,8)
, ctd_mc_clicks NUMERIC(15,9)
);
