angular
    .module('the-answer')
    .controller('kpiCtrl', function ($scope, $http, $q) {

        var gauges = [];
        $scope.campaignType = "";
        $scope.mediaType = "";
        $scope.region = "";
        $scope.product = "";
        $scope.program = "";
        $scope.type = "Complete";
        
        function createGauge(name, label, value)
        {
            var ran1 = Math.floor((Math.random() * 30) + 15);
            var ran2 = Math.floor((Math.random() * 30) + 15);
            var min = Math.round ((value - value * ran1 /100 ) /100) * 100;
            var max = Math.round ((value + value * ran2 /100 ) /100) * 100;
            var config =
            {
                size: 200,
                label: label,
                min: min ,
                max: max,
                minorTicks: 5
            };

            var range = config.max - config.min;
            config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
            config.redZones = [{ from: config.min + range*0.9, to: config.max }];

            gauges[name] = new Gauge(name + "GaugeContainer", config);
            gauges[name].render();
        }

        function updateGauge(name, value)
        {
            gauges[name].redraw(value);
        }

        function getRandomValue(gauge)
        {
            var overflow = 0; //10;
            return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
        }

        $scope.dtTo = new Date();
        $scope.dtFrom =new Date(new Date().setDate($scope.dtTo.getDate()-30));

        $scope.query = function(){
            /*console.log($scope.campaignType);
            console.log($scope.program);
            console.log($scope.mediaType);
            console.log($scope.region);
            console.log($scope.product);*/
            d3.selectAll("svg").remove();
            var arr1 = [$http.get('kpi/cost_per_sale'), $http.get('kpi/cost_per_call'), $http.get('kpi/cost_per_click')];
            $q.all(arr1)
                .then(function(result){
                    var cost_per_sale = Number(result[0].data[0].value.replace(/,/g, ''));
                    var cost_per_call = Number(result[1].data[0].value.replace(/,/g, ''));
                    var cost_per_click = Number(result[2].data[0].value.replace(/,/g, ''));
                    createGauge("cost_per_sale", "Cost Per Sale", cost_per_sale);
                    createGauge("cost_per_call", "Cost Per Call", cost_per_call);
                    createGauge("cost_per_click", "Cost Per Click", cost_per_click);
                    updateGauge("cost_per_sale", cost_per_sale);
                    updateGauge("cost_per_call", cost_per_call);
                    updateGauge("cost_per_click", cost_per_click);
                });

            var arr2 = [$http.get('kpi/quantity_per_sale'), $http.get('kpi/quantity_per_call'), $http.get('kpi/quantity_per_click')];
            $q.all(arr2)
                .then(function(result){
                    var quantity_per_sale = Number(result[0].data[0].value.replace(/,/g, ''));
                    var quantity_per_call = Number(result[1].data[0].value.replace(/,/g, ''));
                    var quantity_per_click = Number(result[2].data[0].value.replace(/,/g, ''));
                    
                    createGauge("quantity_per_sale", "Quantity Per Sale", quantity_per_sale);
                    createGauge("quantity_per_call", "Quantity Per Call", quantity_per_call);
                    createGauge("quantity_per_click", "Quantity Per Click", quantity_per_click);
                    updateGauge("quantity_per_sale", quantity_per_sale);
                    updateGauge("quantity_per_call", quantity_per_call);
                    updateGauge("quantity_per_click", quantity_per_click);
                });

        };

    });

