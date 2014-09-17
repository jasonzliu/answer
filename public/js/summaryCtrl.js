angular
    .module('the-answer')
    .controller('summaryCtrl', function ($scope, $http) {

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 460 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        $scope.barType = "media_type";

        $scope.onBar = function () {
            d3.select('#bar').selectAll("svg").remove();
            d3.select('#pie').selectAll("svg").remove();
            $http
                .get('summary/bar/' + $scope.barType)
                .then(function (result) {

                    function map(barType){
                        if (barType == "media_type"){
                            result.data.splice(3, 1);
                            return _.map(result.data, function (d) {
                                return {
                                    name: d.media_code,
                                    budget: (Number(d.budget.replace(/,/g, '')) / 1000000).toFixed(2),
                                    ttl_sales: (Number(d.ttl_sales.replace(/,/g, '')))
                                }
                            });
                        }
                        if (barType == "product_type"){
                            result.data.splice(0, 1);
                            return _.map(result.data, function (d) {
                                return {
                                    name: d.product_code,
                                    budget: (Number(d.budget.replace(/,/g, '')) / 1000000).toFixed(2),
                                    ttl_sales: (Number(d.ttl_sales.replace(/,/g, '')))
                                }
                            });
                        }

                        if (barType == "program_type"){
                            result.data.splice(1, 1);
                            result.data.splice(9, 1);
                            return _.map(result.data, function (d) {
                                return {
                                    name: d.program,
                                    budget: (Number(d.budget.replace(/,/g, '')) / 1000000).toFixed(2),
                                    ttl_sales: (Number(d.ttl_sales.replace(/,/g, '')))
                                }
                            });
                        }

                        if (barType == "region"){
                            //result.data.splice(1, 1);
                            return _.map(result.data, function (d) {
                                return {
                                    name: d.region_code,
                                    budget: (Number(d.budget.replace(/,/g, '')) / 100000000).toFixed(2),
                                    ttl_sales: (Number(d.ttl_sales.replace(/,/g, '')))
                                }
                            });
                        }
                    }

                    var data  = map($scope.barType);

                    var budgets = _.map(data, function(d){
                       return {
                           name: d.name,
                           value: d.budget
                       }
                    });

                    var sales = _.map(data, function(d){
                        return {
                            name: d.name,
                            value: d.ttl_sales
                        }
                    });

                    addBarChart(budgets, 'Budget ($ in million)', 'bar1');
                    addBarChart(sales, 'Sales', 'bar2');

                    function addBarChart(data, yname, classname){
                        var x = d3.scale.ordinal()
                            .rangeRoundBands([0, width], 0.2);

                        var y = d3.scale.linear()
                            .range([height, 0]);

                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom");

                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient("left");

                        var svg = d3.select("#bar").append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                        x.domain(data.map(function (d) {
                            return d.name;
                        }));

                        y.domain([0, d3.max(data, function (d) {
                            return d.value;
                        })]);


                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        svg.append("g")
                            .attr("class", "y axis")
                            .call(yAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text(yname);


                        var sel = svg.selectAll("." + classname)
                            .data(data).enter();

                        sel.append("rect")
                            .attr("class", classname)
                            .attr("x", function (d) {
                                return x(d.name);
                            })
                            .attr("width", x.rangeBand())
                            .attr("y", function (d) {
                                return y(d.value);
                            })
                            .attr("height", function (d) {
                                return height - y(d.value);
                            });


                        sel.append("text")
                            .attr("x", function (d) {
                                return x(d.name);
                            })
                            .attr("y", function (d) {
                                return y(d.value);
                            })
                            .text(function (d) {
                                return d.value
                            });
                    }


                });

            $http.get('summary/pie/' + $scope.barType)
                .then(function(result){

                    function map(){
                        var total = _.reduce(result.data, function(sum, d){return sum + d.count}, 0);
                        var arr = _.map(result.data, function (d) {
                            return {
                                name: d.media_code || d.product_code || d.program || d.region_code,
                                count: d.count,
                                percent: d.count / total
                            }
                        });

                        _.remove(arr, function(d){return d.percent < 0.05});
                        total = _.reduce(arr, function(sum, d){return sum + d.count}, 0);
                        _.forEach(arr, function(d){d.percent = (d.count*100/total).toFixed(0) + '%' });
                        return arr;
                    }
                    var w = 300;
                    var h = 300;
                    var r = h/2;
                    var color = d3.scale.category20c();

                    var data = map();

                    var vis = d3.select('#pie').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
                    var pie = d3.layout.pie().value(function(d){return d.count;});

// declare an arc generator function
                    var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
                    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
                    arcs.append("svg:path")
                        .attr("fill", function(d, i){
                            return color(i);
                        })
                        .attr("d", function (d) {
                            // log the result of the arc generator to show how cool it is :)
                            console.log(arc(d));
                            return arc(d);
                        });

// add the text
                    arcs.append("svg:text").attr("transform", function(d){
                        d.innerRadius = 0;
                        d.outerRadius = r;
                        return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
                            return data[i].name + '  '+ data[i].percent;}
                    );


                });
        };

        $http
            .get('summary/time_series_line')
            .then(function (result) {

                var budgets = _.map(result.data, function(d){
                    return {
                        week: d.report_week,
                        value: Number(d.ttl_budget.replace(/,/g, ''))/1000000
                        //value: (Number(d.ttl_sales.replace(/,/g, '')))
                    };
                });

                var sales = _.map(result.data, function(d){
                    return {
                        week: d.report_week,
                        //value: Number(d.ttl_budget.replace(/,/g, ''))/1000000
                        value: (Number(d.ttl_sales.replace(/,/g, '')))
                    };
                });

                addTimeLine(budgets, 'Budget ($ in million)', 'line1');

                addTimeLine(sales, 'Sales', 'line2');

                function addTimeLine(data, yname, classname){

                    var x = d3.scale.linear()
                        .range([0, width]);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var color = d3.scale.category10();

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    var line = d3.svg.line()
                        .interpolate("basis")
                        .x(function(d) { return x(d.week); })
                        .y(function(d) { return y(d.value); });

                    var svg = d3.select("#line").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



                    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "week"; }));

                    var values = color.domain().map(function(name) {
                        return {
                            name: name,
                            values: data.map(function(d) {
                                return {week: d.week, value: +d[name]};
                            })
                        };
                    });

                    //x.domain(d3.extent(data, function(d) { return d.week; }));

                    x.domain([
                        d3.min(values, function(c) { return d3.min(c.values, function(v) { return v.week; }); }),
                        d3.max(values, function(c) { return d3.max(c.values, function(v) { return v.week; }); })
                    ]);

                    y.domain([
                        d3.min(values, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
                        d3.max(values, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
                    ]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("transform", "rotate(0)")
                        .attr("x", 515)
                        .attr("y", 15)
                        .attr("dx", ".11em")
                        .style("text-anchor", "end")
                        .text("week");

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(yname);

                    var value = svg.selectAll(".value")
                        .data(values)
                        .enter().append("g")
                        .attr("class", "value");

                    value.append("path")
                        .attr("class", classname)
                        .attr("d", function(d) { return line(d.values); })
                        .style("stroke", function(d) { return color(d.name); });

                    value.append("text")
                        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                        .attr("transform", function(d) { return "translate(" + x(d.value.week) + "," + y(d.value.value) + ")"; })
                        .attr("x", 3)
                        .attr("dy", ".35em");
                }
            });

        $scope.onBar();

    });

