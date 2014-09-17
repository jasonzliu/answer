angular.module('the-answer').constant('_', _).constant('d3', d3);

angular
    .module('the-answer')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
        //
        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "./partials/home.html"
            })
            .state('register', {
                url: "/register",
                templateUrl: "./partials/register.html"
            })
            .state('forget', {
                url: "/forget",
                templateUrl: "./partials/forget.html"
            })
            .state('login', {
                url: "/login",
                templateUrl: "./partials/login.html"
            })
            .state('upload', {
                url: "/upload",
                templateUrl: "./partials/upload.html",
                controller: 'uploadCtrl'
            })
            .state('summary', {
                url: "/summary",
                templateUrl: "./partials/summary.html",
                controller: 'summaryCtrl'
            })
            .state('kpi', {
                url: "/kpi",
                templateUrl: "./partials/kpi.html",
                controller: 'kpiCtrl'
            })
            .state('about', {
                url: "/about",
                templateUrl: "./partials/about.html"
            })
            .state('contact', {
                url: "/contact",
                templateUrl: "./partials/contact.html"
            })
            .state('faq', {
                url: "/faq",
                templateUrl: "./partials/faq.html"
            })
            .state('support', {
                url: "/support",
                templateUrl: "./partials/support.html"
            })
            .state('emailtemplate', {
                url: "/emailtemplate",
                templateUrl: "./partials/emailtemplate.html",
                controller: 'emailTemplateCtrl'
            });
    });