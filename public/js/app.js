var app = angular.module('myApp', []);

app.controller('MessageListController', function ($scope) {
    var messageList = this;
    messageList.messages = [];

    messageList.sendMessage = function () {
        if (messageList.author && messageList.text) {
            var data = {
                author: messageList.author,
                text: messageList.text
            };
            socket.emit('chat message', data);
            messageList.text = '';
        }
    };

    var socket = io();
    socket.on('chat message', function (data) {
        messageList.messages.unshift(data);
        $scope.$apply();
    });
});