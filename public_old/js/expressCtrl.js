angular
    .module('the-answer')
    .controller('expressCtrl', function ($scope, $http) {
        function formatNumber(value, n, x) {
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
            return value.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
        };
        function make_x_axis(x) {
            return d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(5)
        }
        function make_y_axis(y, direction) {
            return d3.svg.axis()
                .scale(y)
                .orient(direction ? direction: "left")
                .ticks(5)
        }
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 650 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        function svg1() {
            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1);

            var x1 = d3.scale.ordinal();

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.ordinal()
                .range(["#89B471", "#1CB42F"]);

            var xAxis = d3.svg.axis()
                .scale(x0)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(d3.format(".2s"));

            var svg = d3.select("#svg1").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(make_x_axis(x0)
                    .tickSize(-height, 0, 0)
                    .tickFormat(""))
                .call(make_y_axis(y)
                    .tickSize(-width, 0, 0)
                    .tickFormat(""));

            svg.append("text")
                .attr("dy", ".75em")
                .attr("transform","translate(-40,200) rotate(270)")
                .attr("style", "fill: rgb(0, 0, 0); ")
                .attr("class", "fwbolder")
                .text("Sales (in millions)");

            var data = [
                {
                    "State": "DEC",
                    "Dec 2010 - Jan 2012": 200,
                    "Dec 2011 - Jan 2013": 230
                },
                {
                    "State": "JAN",
                    "Dec 2010 - Jan 2012": 105,
                    "Dec 2011 - Jan 2013": 98
                },
                {
                    "State": "FEB",
                    "Dec 2010 - Jan 2012": 140,
                    "Dec 2011 - Jan 2013": 152
                },
                {
                    "State": "MAR",
                    "Dec 2010 - Jan 2012": 177,
                    "Dec 2011 - Jan 2013": 188
                },
                {
                    "State": "APR",
                    "Dec 2010 - Jan 2012": 150,
                    "Dec 2011 - Jan 2013": 155
                },
                {
                    "State": "MAY",
                    "Dec 2010 - Jan 2012": 147,
                    "Dec 2011 - Jan 2013": 147
                },
                {
                    "State": "JUN",
                    "Dec 2010 - Jan 2012": 170,
                    "Dec 2011 - Jan 2013": 173
                },
                {
                    "State": "JUL",
                    "Dec 2010 - Jan 2012": 125,
                    "Dec 2011 - Jan 2013": 125
                },
                {
                    "State": "AUG",
                    "Dec 2010 - Jan 2012": 138,
                    "Dec 2011 - Jan 2013": 0
                },
                {
                    "State": "SEP",
                    "Dec 2010 - Jan 2012": 196,
                    "Dec 2011 - Jan 2013": 0
                },
                {
                    "State": "OCT",
                    "Dec 2010 - Jan 2012": 161,
                    "Dec 2011 - Jan 2013": 0
                },
                {
                    "State": "NOV",
                    "Dec 2010 - Jan 2012": 217,
                    "Dec 2011 - Jan 2013": 0
                },
                {
                    "State": "DEC ",
                    "Dec 2010 - Jan 2012": 330,
                    "Dec 2011 - Jan 2013": 0
                },
                {
                    "State": "JAN ",
                    "Dec 2010 - Jan 2012": 97,
                    "Dec 2011 - Jan 2013": 0
                }
            ];
            var ageNames = d3.keys(data[0]).filter(function (key) {
                return key !== "State";
            });

            data.forEach(function (d) {
                d.ages = ageNames.map(function (name) {
                    return {name: name, value: +d[name]};
                });
            });

            x0.domain(data.map(function (d) {
                return d.State;
            }));
            x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
            y.domain([0, d3.max(data, function (d) {
                return d3.max(d.ages, function (d) {
                    return d.value;
                });
            })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
                /*.append("text")
                /*.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");
                .text("SALES ($ in million)");*/

            var state = svg.selectAll(".state")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function (d) {
                    return "translate(" + x0(d.State) + ",0)";
                });

            state.selectAll("rect")
                .data(function (d) {
                    return d.ages;
                })
                .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function (d) {
                    return x1(d.name);
                })
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("rx", "3")
                .attr("ry", "3")
                .attr("height", function (d) {
                    return height - y(d.value);
                })
                .style("fill", function (d) {
                    return color(d.name);
                });

            var legend = svg.selectAll(".legend")
                .data(ageNames.slice())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(" + i * 120 + ",0)";
                });

            legend.append("rect")
                .attr("x", width - 278)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 284)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });
        }
        function svg2() {
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.5);

            var y = d3.scale.linear()
                .rangeRound([height, 0]);

            var color = d3.scale.ordinal()
                .range(["#8655A5", "#61B47B", "#B43C48", "#486CB4"]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(d3.format(".0%"));

            var svg = d3.select("#svg2").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(make_x_axis(x)
                    .tickSize(-height, 0, 0)
                    .tickFormat(""))
                .call(make_y_axis(y)
                    .tickSize(-width, 0, 0)
                    .tickFormat(""));

            var data = [
                {
                    "State": "Rolling 12-Mo.",
                    "NA in current period": 4148689,
                    "RE in current period": 953347,
                    "RT from last period": 3270859,
                    "New current period": 2295089
                },
                {
                    "State": "Recent Quarter",
                    "NA in current period": 1515432,
                    "RE in current period": 715033,
                    "RT from last period": 779103,
                    "New current period": 445155
                }
            ];
            color.domain(d3.keys(data[0]).filter(function (key) {
                return key !== "State";
            }));

            data.forEach(function (d) {
                var y0 = 0;
                d.ages = color.domain().map(function (name) {
                    return {name: name, y0: y0, y1: y0 += +d[name], value: d[name]};
                });
                d.ages.forEach(function (d) {
                    d.y0 /= y0;
                    d.y1 /= y0;
                });
            });

            data.sort(function (a, b) {
                return b.ages[0].y1 - a.ages[0].y1;
            });

            x.domain(data.map(function (d) {
                return d.State;
            }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            var state = svg.selectAll(".state")
                .data(data)
                .enter().append("g")
                .attr("class", "state")
                .attr("transform", function (d) {
                    return "translate(" + x(d.State) + ",0)";
                });

            state.selectAll("rect")
                .data(function (d) {
                    return d.ages;
                })
                .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function (d) {
                    return y(d.y1);
                })
                .attr("rx", "3")
                .attr("ry", "3")
                .attr("height", function (d) {
                    return y(d.y0) - y(d.y1);
                })
                .style("fill", function (d) {
                    return color(d.name);
                });
            state.selectAll("text")
                .data(function (d) {
                    return d.ages;
                })
                .enter()
                .append("text")
                .attr("x", x.rangeBand() - 80)
                .attr("y", function (d) {
                    return y(d.y1) + 20;
                })
                .text(function(d){
                    return formatNumber(d.value);
                });

            var ageNames = d3.keys(data[0]).filter(function (key) {
                return key !== "State";
            });

            var legend = svg.selectAll(".legend")
                .data(ageNames.slice())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(" + (i * 140- 70) + ",-20)";
                });

            legend.append("rect")
                .attr("x", width - 378)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 384)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });
        }
        function svg3() {
            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], .3);

            var x1 = d3.scale.ordinal();

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.ordinal()
                .range(["#89B471", "#1CB42F", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

            var xAxis = d3.svg.axis()
                .scale(x0)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(d3.format(".2s"));

            var svg = d3.select("#svg3").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(make_x_axis(x0)
                    .tickSize(-height, 0, 0)
                    .tickFormat(""))
                .call(make_y_axis(y)
                    .tickSize(-width, 0, 0)
                    .tickFormat(""));

            svg.append("text")
                .attr("dy", ".75em")
                .attr("transform","translate(-40,200) rotate(270)")
                .attr("style", "fill: rgb(0, 0, 0); ")
                .attr("class", "fwbolder")
                .text("Index to Population Average");

            var data = [
                {
                    "State": "DM",
                    "ADS": 97,
                    "Spend/Household": 52,
                    "Transactions/Household": 54
                },
                {
                    "State": "DM + EM",
                    "ADS": 100,
                    "Spend/Household": 112,
                    "Transactions/Household": 107
                },
                {
                    "State": "DM + SMS",
                    "ADS": 85,
                    "Spend/Household": 132,
                    "Transactions/Household": 150
                },
                {
                    "State": "DM + EM + SMS",
                    "ADS": 90,
                    "Spend/Household": 200,
                    "Transactions/Household": 220
                }
            ];
            var ageNames = d3.keys(data[0]).filter(function (key) {
                return key !== "State";
            });

            data.forEach(function (d) {
                d.ages = ageNames.map(function (name) {
                    return {name: name, value: +d[name]};
                });
            });

            x0.domain(data.map(function (d) {
                return d.State;
            }));
            x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
            y.domain([0, d3.max(data, function (d) {
                return d3.max(d.ages, function (d) {
                    return d.value;
                });
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
                .style("text-anchor", "end");
            //.text("SALES ($ in million)");

            var state = svg.selectAll(".state")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function (d) {
                    return "translate(" + x0(d.State) + ",0)";
                });

            state.selectAll("rect")
                .data(function (d) {
                    return d.ages;
                })
                .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function (d) {
                    return x1(d.name);
                })
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("rx", "3")
                .attr("ry", "3")
                .attr("height", function (d) {
                    return height - y(d.value);
                })
                .style("fill", function (d) {
                    return color(d.name);
                });

            var legend = svg.selectAll(".legend")
                .data(ageNames.slice())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(" + (i * 150 - 200) + ",0)";
                });

            legend.append("rect")
                .attr("x", width - 278)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 284)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });
        }
        function svg4() {

            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.4);

            var x1 = d3.scale.ordinal();

            var y0 = d3.scale.linear()
                .range([height, 0]);

            var y1 = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.ordinal()
                .range(["D3747A", "#1CB42F"]);

            var xAxis = d3.svg.axis()
                .scale(x0)
                .orient("bottom");

            var y0Axis = d3.svg.axis()
                .scale(y0)
                .orient("left")
                .tickFormat(d3.format("%"));

            var y1Axis = d3.svg.axis()
                .scale(y1)
                .orient("right")
                .tickFormat(d3.format("%"));

            var main = d3.select("#svg4").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            main.append("defs")
                .append("marker")
                .attr("id", "markerSquare")
                .attr("markerWidth", "7")
                .attr("markerHeight", "7")
                .attr("refX", "4")
                .attr("refY", "4")
                .attr("orient", "auto")
                .append("rect")
                .attr("x", "1")
                .attr("y", "1")
                .attr("height", "8")
                .attr("width", "8")
                .attr("style", "stroke: none; fill:#000000;");


            var svg = main
                    .append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(make_x_axis(x0)
                        .tickSize(-height, 0, 0)
                        .tickFormat(""))
                    .call(make_y_axis(y0)
                        .tickSize(-width, 0, 0)
                        .tickFormat(""));



            svg.append("text")
                .attr("dy", ".75em")
                .attr("transform","translate(-40,200) rotate(270)")
                .attr("style", "fill: rgb(0, 0, 0); ")
                .attr("class", "fwbolder")
                .text("% Total Sales");

            svg.append("text")
                .attr("dy", ".75em")
                .attr("transform","translate(600,200) rotate(270)")
                .attr("style", "fill: rgb(0, 0, 0); ")
                .attr("class", "fwbolder")
                .text("PLCC");

            var data = [
                {
                    "State": "Same Quarter",
                    "Dec 2010 - Jan 2012": 0.5,
                    "xx":0.05
                },
                {
                    "State": "YTD",
                    "Dec 2010 - Jan 2012": 0.4,
                    "xx":0.07
                },
                {
                    "State": "Rolling 12-Mo.",
                    "Dec 2010 - Jan 2012": 0.62,
                    "xx":0.11
                }
            ];
            var ageNames = d3.keys(data[0]).filter(function (key) {
                return key !== "State" && key != "xx";
            });

            data.forEach(function (d) {
                d.ages = ageNames.map(function (name) {
                    return {name: name, value: +d[name]};
                });
            });

            x0.domain(data.map(function (d) {
                return d.State;
            }));
            x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
            y0.domain([0, d3.max(data, function (d) {
                return d3.max(d.ages, function (d) {
                    return d.value;
                });
            })]);
            y1.domain([0, d3.max(data, function (d) {
                return d3.max(d.ages, function (d) {
                    return d.value / 5;
                });
            })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(y0Axis);
            /*.append("text")
             /*.append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 6)
             .attr("dy", ".71em")
             .style("text-anchor", "end");
             .text("SALES ($ in million)");*/

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(580,0)")
                .call(y1Axis);

            var state = svg.selectAll(".state")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function (d) {
                    return "translate(" + x0(d.State) + ",0)";
                });

            state.selectAll("rect")
                .data(function (d) {
                    return d.ages;
                })
                .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function (d) {
                    return x1(d.name);
                })
                .attr("y", function (d) {
                    return y0(d.value);
                })
                .attr("rx", "3")
                .attr("ry", "3")
                .attr("height", function (d) {
                    return height - y0(d.value);
                })
                .style("fill", function (d) {
                    return color(d.name);
                });
            var valueline = d3.svg.line()
                .x(function(d) {return x0(d.State) + 45; })
                .y(function(d) {return y1(d.xx); });

            svg.append("path")
                .attr("class", "line")
                .attr("d", valueline(data))
                .attr("stroke-width", "6")
                .attr("stroke-linecap", "round")
                .style("stroke", "blue")
                .style("fill", "none")
                .style("marker-start", "url(#markerSquare)")
                .style("marker-mid", "url(#markerSquare)")
                .style("marker-end", "url(#markerSquare)");

            var legend = svg.selectAll(".legend")
                .data(ageNames.slice())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(" + i * 120 + ",0)";
                });

            legend.append("rect")
                .attr("x", width - 378)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 384)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text("% total sales");

            legend.append("rect")
                .attr("x", width - 278)
                .attr("y", 10)
                .attr("width", 18)
                .attr("height", 2)
                .style("fill", "blue");

            legend.append("text")
                .attr("x", width - 284)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text("PLCC");
        }

        svg1();
        svg2();
        svg3();
        svg4();
    });

