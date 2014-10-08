angular
    .module('the-answer')
    .controller('carouselCtrl', function ($scope, $http, $q) {
        $scope.myInterval = 5000;
        var slides = $scope.slides = [];
        $scope.addSlide = function() {
            slides.push(
                {image: 'gif/waste-of-money.jpg',
                text: 'I know half of my marketing budget is wasted - I just don\'t know which half.',
                desc: '--John Wanamaker 1912'},
                {image: 'gif/Big-Data.jpg',
                    text: 'Are you confused at data?',
                    desc: 'If not, you should.'},
                {image: 'gif/Babies_on_computer.jpg',
                    text: 'WOW',
                    desc: 'I don\'t know how it happended, but it happened!!!'}
            );
        };
        $scope.addSlide();
    });

