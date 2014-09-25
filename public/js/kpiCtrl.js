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
            return parseInt(min - overflow + (max - min + overflow * 2) *  Math.random());
        }

        var cps = [2187,2199,2769,2541,2189,2568,2939,2398,2467,2397,2295,2698,2203,2595,2242,2553,2024,2231,2455,2399,2146,2450,2713,2213,2901,2959,2928,2413,2648,2516,2244,2575,2954,2872,2017,2538,2396,2272,2164,2328,2875,2042,2729,2966,2860,2422,2251,2530,2795,2959,2516,2159,2905,2028,2746,2315,2770,2452,2737,2289,2188,2665,2342,2630,2249,2987,2262,2110,2554,2828,2455,2450,2744,2382,2438,2856,2593,2678,2774,2865,2896,2316,2426,2292,2270,2411,2078,2608,2294,2051,2280,2489,2568,2515,2454,2695,2864,2655,2506,2915,2852,2631,2207,2509,2112,2492,2764,2820,2607,2412,2026,2750,2577,2784,2960,2011,2574,2832,2723,2180,2306,2143,2246,2982,2010,2720,2512,2368,2458,2171,2446,2224,2278,2205,2228,2579,2966,2765,2478,2461,2771,2312,2227,2053,2528,2895,2687,2942,2768,2326,2269,2821,2579,2396,2347,2366,2262,2001,2556,2118,2670,2964,2285,2007,2459,2400,2966,2113,2778,2308,2573,2688,2537,2724,2140,2729,2954,2158,2026,2681,2566,2189,2838,2609,2268,2225,2616,2002,2020,2139,2484,2946,2487,2585,2411,2531,2298,2799,2399,2176];
        var cpc = [261,258,202,291,260,270,292,258,294,257,228,258,285,216,227,298,261,211,247,233,206,202,239,253,299,259,238,229,297,223,244,212,238,270,265,204,200,230,228,233,286,206,201,290,272,238,245,272,250,205,245,203,278,241,228,201,294,240,253,204,206,220,243,254,244,208,213,209,223,255,217,232,253,244,264,223,246,240,218,212,234,239,279,248,238,243,295,285,257,289,243,233,278,291,208,287,215,236,237,296,283,205,251,267,251,279,224,201,239,263,227,280,225,249,216,206,282,209,217,235,253,222,202,230,238,218,220,246,264,262,258,298,283,247,269,282,253,262,250,282,244,247,212,282,217,213,264,243,220,287,288,200,275,247,276,262,273,247,209,244,215,210,243,241,269,221,268,216,221,207,217,221,264,268,225,213,217,272,208,278,269,212,247,286,224,262,291,227,293,230,278,260,251,226,254,269,233,261,220,263];
        var cpcl = [89,87,59,96,8,2,12,17,54,21,68,50,45,60,50,58,47,13,97,58,28,99,38,35,13,33,47,97,9,4,80,28,99,11,51,79,30,55,79,35,51,20,62,59,46,10,21,26,58,65,27,34,33,17,7,98,8,24,5,99,45,44,99,40,33,18,31,89,32,57,74,5,74,70,21,39,94,42,47,47,8,73,78,87,96,41,33,90,40,44,78,43,16,35,25,48,82,40,33,69,4,37,40,67,49,1,77,87,72,73,11,74,28,6,35,68,48,6,90,42,25,10,48,23,47,42,44,20,74,51,79,87,49,29,37,62,14,58,82,29,59,44,49,89,68,82,73,67,71,69,6,28,45,92,46,18,79,81,66,98,7,16,59,36,36,50,20,11,89,78,89,84,93,8,24,16,8,18,15,70,27,90,30,81,77,88,20,61,44,87,25,41,97,37,47,42,58,91,79,60];
        var qps = [8135,7026,7528,7153,7733,8766,9467,7586,7946,7287,7035,6479,7172,6899,5553,7191,6212,6451,6219,8531,5547,7546,8533,8049,9967,8499,6331,7644,8610,8749,6035,6290,6788,9283,8756,5523,7500,9085,9370,5060,7413,9295,6213,9210,6195,5655,7069,7796,6151,6334,7945,9310,5926,7203,8370,9099,6114,8859,5945,8180,6941,5483,9240,7179,5973,5471,9102,9915,7540,6980,6418,7042,7607,9253,8775,8958,9515,6853,7554,7991,9825,9548,9860,9123,7775,9131,9731,8840,8143,7842,6517,8805,6844,9346,6411,9853,6390,9258,7699,9921,7838,9807,7578,5891,8525,5669,7768,8371,8696,5395,9030,9638,6103,7062,8126,6158,6335,7149,9458,6988,8906,7780,9473,6748,8428,9812,5221,8076,9963,8821,8926,5370,7368,5837,8826,9721,9044,9115,9599,6569,6846,5853,8689,8863,7627,7786,6717,7755,8644,5274,6317,7815,7559,7806,6925,6340,8960,8726,8083,5686,8640,5159,6648,8587,7249,9914,6317,5524,6800,8383,6621,7275,7788,8317,6758,6697,8912,8541,5356,7180,5577,8728,6590,7195,5943,6607,6259,7136,7915,9846,6307,5501,9701,5821,9645,6059,9145,5889,8400,6759];
        var qpc = [1175,1042,1496,1372,1362,1352,1282,1424,1386,1239,1384,1046,1039,1161,1282,1246,1378,1028,1019,1238,1262,1429,1441,1205,1211,1011,1419,1268,1404,1069,1374,1111,1151,1322,1379,1174,1490,1283,1264,1382,1310,1116,1433,1366,1452,1145,1496,1320,1249,1102,1150,1264,1122,1019,1451,1297,1123,1243,1460,1361,1375,1376,1211,1333,1001,1172,1304,1377,1265,1213,1025,1401,1285,1231,1132,1024,1226,1236,1495,1465,1119,1259,1403,1360,1138,1328,1119,1064,1245,1492,1233,1370,1224,1288,1376,1176,1455,1391,1382,1002,1245,1258,1097,1121,1073,1063,1145,1070,1305,1337,1450,1070,1157,1289,1092,1146,1113,1358,1022,1051,1147,1325,1322,1353,1123,1220,1078,1174,1407,1215,1084,1245,1414,1423,1281,1257,1304,1240,1480,1220,1409,1024,1054,1247,1023,1135,1264,1070,1306,1397,1095,1094,1111,1035,1403,1272,1180,1130,1204,1123,1329,1115,1135,1420,1053,1371,1229,1391,1270,1027,1046,1020,1414,1200,1257,1134,1112,1329,1296,1491,1270,1047,1305,1109,1437,1196,1383,1177,1409,1043,1499,1191,1035,1322,1161,1129,1389,1030,1060,1004];
        var qpcl = [10805,10180,13633,11838,13450,10418,14276,12828,11285,13917,13507,14822,13631,11287,14631,12098,13024,10469,12649,11005,10014,13806,12513,13623,11759,13884,14583,13358,13509,14459,10391,12342,14048,14797,14833,12165,12042,11852,11192,10003,11368,10457,13671,13216,12905,13395,13276,13841,13114,11423,11123,14216,14478,12253,13335,11847,11583,10210,10119,13828,11597,14973,12950,11690,13236,11932,10631,10138,11917,10032,11271,13842,14728,14435,14692,14791,12418,14807,10581,11144,11711,12423,14834,13578,13756,10292,10250,14313,14304,11232,13113,14880,11855,11561,11761,12049,10272,13258,14868,11431,12155,10442,14628,12215,12075,10170,10232,13943,13777,12099,10595,14443,10411,13648,13655,11636,12467,12716,13800,13983,12391,12079,13603,11133,14776,13306,13001,12153,10717,14934,13177,11225,13442,13905,12632,13994,14180,11386,11707,13702,14678,10748,10281,14388,13131,10964,10799,14348,13645,12337,12864,11322,12443,11413,14645,10672,12642,14366,12155,13435,13120,10133,12041,12159,10079,10890,11627,10288,14294,13419,13950,10962,10583,12761,14803,14654,12567,12610,10373,11070,10724,14820,13861,11558,13779,12772,13355,10168,12805,13984,14129,14651,13294,13550,10858,13205,11132,14513,12372,13062];

        /*function init(){
            for (var i = 0; i<200; i++){
                cps.push(getRandomValue(2000,3000));
                cpc.push(getRandomValue(200,300));
                cpcl.push(getRandomValue(0,100));
                qps.push(getRandomValue(5000,10000));
                qpc.push(getRandomValue(1000,1500));
                qpcl.push(getRandomValue(10000,15000));
            }
        }

        init();*/
        $scope.dtTo = new Date();
        $scope.dtFrom =new Date(new Date().setDate($scope.dtTo.getDate()-30));
        $scope.campaignType = 1;
        $scope.program = 4;
        $scope.mediaType = 16;
        $scope.region = 19;
        $scope.product = 26;

        createGauge("cost_per_sale", "Cost Per Sale", 2000, 3000);
        createGauge("cost_per_call", "Cost Per Call", 200, 300);
        createGauge("cost_per_click", "Cost Per Click", 0, 100);
        createGauge("quantity_per_sale", "Quantity Per Sale", 5000, 10000);
        createGauge("quantity_per_call", "Quantity Per Call", 1000, 1500);
        createGauge("quantity_per_click", "Quantity Per Click", 10000, 15000);

        $scope.query = function(){
            var index = Number($scope.campaignType) + Number($scope.program) + Number($scope.mediaType) + Number($scope.region) + Number($scope.product);
            updateGauge("cost_per_sale", cps[index]);
            updateGauge("cost_per_call", cpc[index]);
            updateGauge("cost_per_click", cpcl[index]);
            updateGauge("quantity_per_sale", qps[index]);
            updateGauge("quantity_per_call", qpc[index]);
            updateGauge("quantity_per_click", qpcl[index]);
        };

    });

