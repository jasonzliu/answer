angular
    .module('the-answer')
    .controller('uploadCtrl', function ($scope, $http, $q, $timeout) {
        $scope.upload = function(){
            $scope.progress = 0;
            var countUp = function() {
                $scope.progress += 5;
                $scope.uploaded = $scope.progress >=100;
                if (!$scope.uploaded) {
                    $timeout(countUp, 300);
                }
            };
            if (!$scope.uploaded){
                $timeout(countUp, 300);
            }
        };
        $scope.closeAlert = function(){
            $scope.uploaded = false;
        };
    });

