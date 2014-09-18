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
            function mapBar(barType) {
                if (barType == "media_type") {
                    return [
                        {"name": "BI", "budget": "30.16", "ttl_sales": 4848},
                        {"name": "CA", "budget": "51.26", "ttl_sales": 4980},
                        {"name": "CID", "budget": "30.40", "ttl_sales": 52000},
                        {"name": "DT", "budget": "58.19", "ttl_sales": 80000},
                        {"name": "EM", "budget": "21.34", "ttl_sales": 7650},
                        {"name": "MAG", "budget": "14.97", "ttl_sales": 120000},
                        {"name": "MS", "budget": "15.27", "ttl_sales": 14519},
                        {"name": "OE", "budget": "40.70", "ttl_sales": 5887},
                        {"name": "PBF", "budget": "32.11", "ttl_sales": 3450},
                        {"name": "RA", "budget": "17.53", "ttl_sales": 35000},
                        {"name": "RAL", "budget": "21.93", "ttl_sales": 4129},
                        {"name": "TV", "budget": "32.32", "ttl_sales": 70000}
                    ];
                }
                if (barType == "product_type") {
                    return [
                        {"name": "CING", "budget": "38.69", "ttl_sales": 1377},
                        {"name": "DISH", "budget": "56.67", "ttl_sales": 2342},
                        {"name": "DSL", "budget": "58.58", "ttl_sales": 18836},
                        {"name": "LD", "budget": "25.94", "ttl_sales": 1750},
                        {"name": "OTH", "budget": "16.09", "ttl_sales": 12980},
                        {"name": "UVAQ", "budget": "67.73", "ttl_sales": 6050},
                        {"name": "UVMM", "budget": "41.22", "ttl_sales": 7440},
                        {"name": "UVSL", "budget": "63.77", "ttl_sales": 1411}
                    ];
                }

                if (barType == "program_type") {
                    return [
                        {"name": "ACC", "budget": "17.08", "ttl_sales": 12000},
                        {"name": "CING", "budget": "28.31", "ttl_sales": 1358},
                        {"name": "DISH", "budget": "49.74", "ttl_sales": 1079},
                        {"name": "Diversity", "budget": "27.91", "ttl_sales": 5810},
                        {"name": "DSL", "budget": "45.88", "ttl_sales": 14544},
                        {"name": "Movers", "budget": "33.23", "ttl_sales": 20250},
                        {"name": "UVAQ", "budget": "67.73", "ttl_sales": 6050},
                        {"name": "UVMM", "budget": "41.22", "ttl_sales": 40000},
                        {"name": "UVSL", "budget": "33.77", "ttl_sales": 1411}
                    ];
                }

                if (barType == "region") {
                    return [
                        {"name": "MW", "budget": "30.71", "ttl_sales": 18516},
                        {"name": "NATL", "budget": "10.15", "ttl_sales": 12980},
                        {"name": "SE", "budget": "24.01", "ttl_sales": 16000},
                        {"name": "SNET", "budget": "20.29", "ttl_sales": 5000},
                        {"name": "SW", "budget": "13.17", "ttl_sales": 13599},
                        {"name": "W", "budget": "21.95", "ttl_sales": 27736}
                    ];
                }
            }

            var data = mapBar($scope.barType);

            var budgets = _.map(data, function (d) {
                return {
                    name: d.name,
                    value: d.budget
                }
            });

            var sales = _.map(data, function (d) {
                return {
                    name: d.name,
                    value: d.ttl_sales
                }
            });

            addBarChart(budgets, 'Budget ($ in million)', 'bar1');
            addBarChart(sales, 'Sales', 'bar2');

            function addBarChart(data, yname, classname) {
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

            function mapPie(barType) {
                if (barType == 'media_type')
                    return [
                        {"name": "DM", "count": 2869, "percent": "63%"},
                        {"name": "DT", "count": 400, "percent": "9%"},
                        {"name": "PBF", "count": 479, "percent": "11%"},
                        {"name": "RA", "count": 415, "percent": "9%"},
                        {"name": "TV", "count": 391, "percent": "9%"}
                    ];
                if (barType == 'product_type')
                    return [
                        {"name": "BUND", "count": 2301, "percent": "44%"},
                        {"name": "DISH", "count": 447, "percent": "9%"},
                        {"name": "DSL", "count": 954, "percent": "18%"},
                        {"name": "UVAQ", "count": 1546, "percent": "29%"}
                    ];
                if (barType == 'program_type')
                    return [
                        {"name": "ACC", "count": 606, "percent": "11%"},
                        {"name": "BUND", "count": 1239, "percent": "23%"},
                        {"name": "DISH", "count": 324, "percent": "6%"},
                        {"name": "Diversity", "count": 521, "percent": "10%"},
                        {"name": "DSL", "count": 666, "percent": "12%"},
                        {"name": "Movers", "count": 485, "percent": "9%"},
                        {"name": "UVAQ", "count": 1546, "percent": "29%"}
                    ];
                if (barType == 'region')
                    return [
                        {"name": "MW", "count": 1162, "percent": "20%"},
                        {"name": "NATL", "count": 704, "percent": "12%"},
                        {"name": "SE", "count": 942, "percent": "16%"},
                        {"name": "SNET", "count": 720, "percent": "12%"},
                        {"name": "SW", "count": 1218, "percent": "21%"},
                        {"name": "W", "count": 1127, "percent": "19%"}
                    ];
            }


            var w = 300;
            var h = 300;
            var r = h / 2;
            var color = d3.scale.category20c();

            var data = mapPie($scope.barType);

            var vis = d3.select('#pie').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
            var pie = d3.layout.pie().value(function (d) {
                return d.count;
            });

// declare an arc generator function
            var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
            var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
            arcs.append("svg:path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", function (d) {
                    // log the result of the arc generator to show how cool it is :)
                    console.log(arc(d));
                    return arc(d);
                });

// add the text
            arcs.append("svg:text").attr("transform", function (d) {
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";
            }).attr("text-anchor", "middle").text(function (d, i) {
                    return data[i].name + '  ' + data[i].percent;
                }
            );


        }

        var budgets = [
            {"week": 1, "value": 0.480667},
            {"week": 2, "value": 0.480667},
            {"week": 3, "value": 0.480667},
            {"week": 4, "value": 8.217382},
            {"week": 5, "value": 9.267254},
            {"week": 6, "value": 12.355092},
            {"week": 7, "value": 14.323316},
            {"week": 8, "value": 19.642847},
            {"week": 9, "value": 19.485895},
            {"week": 10, "value": 22.126781},
            {"week": 11, "value": 24.777467},
            {"week": 12, "value": 27.202007},
            {"week": 13, "value": 30.683126},
            {"week": 14, "value": 31.133291},
            {"week": 15, "value": 33.484659},
            {"week": 16, "value": 36.096725},
            {"week": 17, "value": 40.20436},
            {"week": 18, "value": 31.010171},
            {"week": 19, "value": 34.859894},
            {"week": 20, "value": 47.767914},
            {"week": 21, "value": 54.284705},
            {"week": 22, "value": 54.763808},
            {"week": 23, "value": 63.231349},
            {"week": 24, "value": 21.775743},
            {"week": 25, "value": 72.876676},
            {"week": 26, "value": 82.472866},
            {"week": 27, "value": 90.717866},
            {"week": 28, "value": 117.310948},
            {"week": 29, "value": 133.860528},
            {"week": 30, "value": 147.063045},
            {"week": 31, "value": 45.674854}
        ];
        var sales = [
            {"week": 1, "value": 9},
            {"week": 2, "value": 34},
            {"week": 3, "value": 59},
            {"week": 4, "value": 81},
            {"week": 5, "value": 107},
            {"week": 6, "value": 125},
            {"week": 7, "value": 140},
            {"week": 8, "value": 155},
            {"week": 9, "value": 178},
            {"week": 10, "value": 200},
            {"week": 11, "value": 218},
            {"week": 12, "value": 234},
            {"week": 13, "value": 259},
            {"week": 14, "value": 288},
            {"week": 15, "value": 312},
            {"week": 16, "value": 333},
            {"week": 17, "value": 346},
            {"week": 18, "value": 374},
            {"week": 19, "value": 467},
            {"week": 20, "value": 556},
            {"week": 21, "value": 655},
            {"week": 22, "value": 792},
            {"week": 23, "value": 1047},
            {"week": 24, "value": 1706},
            {"week": 25, "value": 3341},
            {"week": 26, "value": 5026},
            {"week": 27, "value": 6378},
            {"week": 28, "value": 8204},
            {"week": 29, "value": 10804},
            {"week": 30, "value": 13735},
            {"week": 31, "value": 16673}
        ];
        addTimeLine(budgets, 'Budget ($ in million)', 'line1');
        addTimeLine(sales, 'Sales', 'line2');
        function addTimeLine(data, yname, classname) {

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
                .x(function (d) {
                    return x(d.week);
                })
                .y(function (d) {
                    return y(d.value);
                });

            var svg = d3.select("#line").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            color.domain(d3.keys(data[0]).filter(function (key) {
                return key !== "week";
            }));

            var values = color.domain().map(function (name) {
                return {
                    name: name,
                    values: data.map(function (d) {
                        return {week: d.week, value: +d[name]};
                    })
                };
            });

            //x.domain(d3.extent(data, function(d) { return d.week; }));

            x.domain([
                d3.min(values, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.week;
                    });
                }),
                d3.max(values, function (c) {
                    return d3.max(c.values, function (v) {
                        return v.week;
                    });
                })
            ]);

            y.domain([
                d3.min(values, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.value;
                    });
                }),
                d3.max(values, function (c) {
                    return d3.max(c.values, function (v) {
                        return v.value;
                    });
                })
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
                .attr("d", function (d) {
                    return line(d.values);
                })
                .style("stroke", function (d) {
                    return color(d.name);
                });

            value.append("text")
                .datum(function (d) {
                    return {name: d.name, value: d.values[d.values.length - 1]};
                })
                .attr("transform", function (d) {
                    return "translate(" + x(d.value.week) + "," + y(d.value.value) + ")";
                })
                .attr("x", 3)
                .attr("dy", ".35em");
        }

        $scope.onBar();

    });

