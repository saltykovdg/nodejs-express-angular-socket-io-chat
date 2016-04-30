'use strict';

var chatApp = angular.module('chatApp', ['ngRoute', 'ngCookies']);

chatApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13 && event.ctrlKey === true) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});

chatApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '/view/chat',
            controller: ChatController
        }).
        when('/chat/:userId', {
            templateUrl: '/view/chat-user',
            controller: UserChatController
        }).
        when('/login', {
            templateUrl: '/view/login',
            controller: LoginController
        }).
        otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
}]);