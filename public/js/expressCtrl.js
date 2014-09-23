angular
    .module('the-answer')
    .controller('expressCtrl', function ($scope, $http) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 500 - margin.left - margin.right,
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

        var svg = d3.select("#svg").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = [
            {
                "State": "DEC",
                "Dec 2010 - Jan 2012": 320,
                "Dec 2011 - Jan 2013": 330
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
            .text("SALES");

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
            .data(ageNames.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(" + i * 120 + ",0)";
            });

        legend.append("rect")
            .attr("x", width - 228)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 234)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });


    });

