/* Controllers */

function LoginController($scope, $http, $location, $cookies) {
    var username = $cookies.get('username');
    if (username) {
        $scope.username = username;
        $location.path('/chat');
    } else {
        $scope.login = function () {
            $cookies.put('username', $scope.username);
            $location.path('/chat');
        };
    }
}

function ChatController($scope, $http, $location, $cookies) {
    var username = $cookies.get('username');
    if (!username) {
        $location.path('/login');
    } else {
        $scope.username = username;
        $scope.messages = [];

        $scope.sendMessage = function () {
            if ($scope.text) {
                var data = {
                    author: $scope.username,
                    text: $scope.text
                };
                socket.emit('chat message', data);
                $scope.text = '';
            }
        };

        var socket = io();
        socket.on('chat message', function (data) {
            $scope.messages.unshift(data);
            $scope.$apply();
        });
        socket.on('clients', function (data) {
            $scope.clients = data;
            $scope.$apply();
        });
    }
}
