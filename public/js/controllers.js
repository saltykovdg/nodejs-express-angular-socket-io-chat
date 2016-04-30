/* Controllers */

function LoginController($scope, $location, $cookies) {
    var chat_user_id = $cookies.get('chat_user_id');
    var chat_username = $cookies.get('chat_username');
    if (chat_user_id && chat_username) {
        $location.path('/chat');
    } else {
        $scope.login = function () {
            $cookies.put('chat_user_id', Date.now());
            $cookies.put('chat_username', $scope.username);
            $location.path('/chat');
        };
    }
}

function ChatController($rootScope, $scope, $location, $cookies) {
    var chat_user_id = $cookies.get('chat_user_id');
    var chat_username = $cookies.get('chat_username');
    if (!chat_user_id || !chat_username) {
        $location.path('/login');
    } else {
        if (!$rootScope.socket) {
            initSocketIO($rootScope, chat_user_id, chat_username);
        }
        $rootScope.receiver_id = null;

        $scope.sendMessage = function () {
            if ($scope.text) {
                var data = {
                    author: chat_username,
                    text: $scope.text
                };
                $rootScope.socket.emit('chat message', data);
                $scope.text = '';
            }
        };
    }
}

function UserChatController($rootScope, $scope, $location, $cookies, $routeParams) {
    var chat_user_id = $cookies.get('chat_user_id');
    var chat_username = $cookies.get('chat_username');
    if (!chat_user_id || !chat_username) {
        $location.path('/login');
    } else {
        if (!$rootScope.socket) {
            initSocketIO($rootScope, chat_user_id, chat_username);
        }

        var sender_id = $rootScope.chat_user_id;
        var receiver_id = $routeParams.userId;

        delete $rootScope.userNewMessagesCount[receiver_id];
        $rootScope.receiver_id = receiver_id;
        setReceiverUserName($rootScope);

        $scope.sendMessageUser = function () {
            if ($scope.text) {
                var data = {
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                    author: $rootScope.chat_username,
                    text: $scope.text
                };
                $rootScope.socket.emit('chat message user', data);
                $scope.text = '';
            }
        };
    }
}

function initSocketIO($rootScope, chat_user_id, chat_username) {
    $rootScope.chat_user_id = chat_user_id;
    $rootScope.chat_username = chat_username;

    $rootScope.messages = [];
    $rootScope.userMessages = {};
    $rootScope.userNewMessagesCount = {};

    var socket = io();
    socket.on('chat message', function (data) {
        $rootScope.messages.unshift(data);
        $rootScope.$apply();
    });
    socket.on('clients', function (data) {
        $rootScope.clients = data;
        setReceiverUserName($rootScope);
        $rootScope.$apply();
    });
    socket.on('chat message user', function (data) {
        var receiver_id = data.receiver_id;
        if (receiver_id == chat_user_id) {
            receiver_id = data.sender_id;
        }
        if (!$rootScope.userMessages[receiver_id]) {
            $rootScope.userMessages[receiver_id] = [];
        }
        $rootScope.userMessages[receiver_id].unshift(data);

        if (!data.is_archive) {
            if ($rootScope.receiver_id != receiver_id) {
                if (!$rootScope.userNewMessagesCount[receiver_id]) {
                    $rootScope.userNewMessagesCount[receiver_id] = 1;
                } else {
                    $rootScope.userNewMessagesCount[receiver_id] += 1;
                }
            }
        }

        $rootScope.$apply();
    });
    $rootScope.socket = socket;
}

function setReceiverUserName($rootScope) {
    delete $rootScope.receiver_username;
    var clients = $rootScope.clients;
    if (clients) {
        if ($rootScope.receiver_id) {
            for (client in clients) {
                if (clients[client].id == $rootScope.receiver_id) {
                    $rootScope.receiver_username = clients[client].username;
                    break;
                }
            }
        }
    }
}