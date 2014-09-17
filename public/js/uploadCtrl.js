angular
    .module('the-answer')
    .controller('uploadCtrl', function ($scope, $http, $q, ngProgress, $timeout) {
        $scope.upload = function(){
//$scope.current = 10;
            ngProgress.start();
            $timeout(function() {
                ngProgress.complete();
                $scope.uploaded = true;
            }, 3000);
        };

        function com(){
            ngProgress.complete()
        }

    });

