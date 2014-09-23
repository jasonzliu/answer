angular
    .module('the-answer')
    .controller('expressCtrl', function ($scope, $http) {
        function formatNumber(value, n, x) {
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
            return value.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
        };
        function svg1() {
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 650 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

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

            var svg = d3.select("#svg1").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("SALES ($ in million)");

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
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 650 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

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
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

        svg1();
        svg2();
    });

