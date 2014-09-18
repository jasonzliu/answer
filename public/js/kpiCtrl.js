angular
    .module('the-answer')
    .controller('kpiCtrl', function ($scope, $http, $q) {

        var gauges = [];
        $scope.type = "Complete";
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

        function getRandomValue(min, max)
        {
            var overflow = 0; //10;
            return min - overflow + (max - min + overflow * 2) *  Math.random();
        }

        $scope.dtTo = new Date();
        $scope.dtFrom =new Date(new Date().setDate($scope.dtTo.getDate()-30));

        createGauge("cost_per_sale", "Cost Per Sale", 2000, 3000);
        createGauge("cost_per_call", "Cost Per Call", 200, 300);
        createGauge("cost_per_click", "Cost Per Click", 0, 100);
        createGauge("quantity_per_sale", "Quantity Per Sale", 5000, 10000);
        createGauge("quantity_per_call", "Quantity Per Call", 1000, 1500);
        createGauge("quantity_per_click", "Quantity Per Click", 10000, 15000);


        $scope.query = function(){
            updateGauge("cost_per_sale", getRandomValue(2000,3000));
            updateGauge("cost_per_call", getRandomValue(200,300));
            updateGauge("cost_per_click", getRandomValue(0,100));
            updateGauge("quantity_per_sale", getRandomValue(5000,10000));
            updateGauge("quantity_per_call", getRandomValue(1000,1500));
            updateGauge("quantity_per_click", getRandomValue(10000,15000));
        };

    });

