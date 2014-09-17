angular
    .module('the-answer')
    .controller('kpiCtrl', function ($scope, $http, $q) {

        var gauges = [];

        function createGauge(name, label, min, max)
        {
            var config =
            {
                size: 200,
                label: label,
                min: undefined != min ? min : 0,
                max: undefined != max ? max : 100,
                minorTicks: 5
            };

            var range = config.max - config.min;
            config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
            config.redZones = [{ from: config.min + range*0.9, to: config.max }];

            gauges[name] = new Gauge(name + "GaugeContainer", config);
            gauges[name].render();
        }

        function createGauges(name, text)
        {
            createGauge(name + "_per_sale", text + " Per Sale", 2000, 3000);
            createGauge(name + "_per_call", text + " Per Call", 200, 300);
            createGauge(name + "_per_click", text + " Per Click", 0, 100);
            //createGauge("test", "Test", -50, 50 );
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
            d3.selectAll("svg").remove();
            var arr1 = [$http.get('kpi/cost_per_sale'), $http.get('kpi/cost_per_call'), $http.get('kpi/cost_per_click')];
            $q.all(arr1)
                .then(function(result){
                    createGauge("cost_per_sale", "Cost Per Sale", 2000, 3000);
                    createGauge("cost_per_call", "Cost Per Call", 200, 300);
                    createGauge("cost_per_click", "Cost Per Click", 0, 100);
                    updateGauge("cost_per_sale", (Number(result[0].data[0].value.replace(/,/g, ''))));
                    updateGauge("cost_per_call", (Number(result[1].data[0].value.replace(/,/g, ''))));
                    updateGauge("cost_per_click", (Number(result[2].data[0].value.replace(/,/g, ''))));
                });

            var arr2 = [$http.get('kpi/quantity_per_sale'), $http.get('kpi/quantity_per_call'), $http.get('kpi/quantity_per_click')];
            $q.all(arr2)
                .then(function(result){
                    createGauge("quantity_per_sale", "Quantity Per Sale", 5000, 10000);
                    createGauge("quantity_per_call", "Quantity Per Call", 1000, 1500);
                    createGauge("quantity_per_click", "Quantity Per Click", 10000, 15000);
                    updateGauge("quantity_per_sale", (Number(result[0].data[0].value.replace(/,/g, ''))));
                    updateGauge("quantity_per_call", (Number(result[1].data[0].value.replace(/,/g, ''))));
                    updateGauge("quantity_per_click", (Number(result[2].data[0].value.replace(/,/g, ''))));
                });

        };

    });

