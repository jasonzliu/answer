angular
    .module('the-answer')
    .controller('geoCtrl', function ($scope, $http, $q) {
        function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
            return "<h4>"+n+"</h4><table style='width: 200px;'>"+
                "<tr><td>Budget: $"+(d.budget)+" million</td></tr>"+
                "<tr><td>Sales: $"+(d.sales)+" million</td></tr>"+
                "</table>";
        }

        var sampleData ={};	/* Sample random data. */
        ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
            "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
            "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
            "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
            "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
            .forEach(function(d){
                //sampleData[d]={budget:Math.round(100*Math.random()), sales:Math.round(100*Math.random()), color:d3.interpolate("#ffffcc", "#800026")(Math.random())};
                sampleData[d]={budget:Math.round(100*Math.random()), sales:Math.round(100*Math.random()), color:"hsl(" + Math.random() * 360 + ",70%,60%)"};
            });

        /* draw states on id #statesvg */
        uStates.draw("#statesvg", sampleData, tooltipHtml);
    });

