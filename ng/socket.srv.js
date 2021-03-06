angular.module('xatApp').factory('SocketSrv', function($rootScope) {
    var socket = io().connect();
    socket.on('connect', function(s) {
        $rootScope.$broadcast('connected');
        $rootScope.$apply(); //This tells AngularJS that it needs to check the state of the application and update the templates
    });
    var nick;
    return {
        user: function(name) {
            //socket.emit('newUser', name);
            socket.emit('newUser', {
                codi: 0,
                user: name,
                message: 'Hola'
            });
            $rootScope.$broadcast('newUserOk');
            nick = name;
            $rootScope.$broadcast('nick');
            console.log(nick);
            this.auth = true;
        },
        getNick: function() {
            return nick;
        },
        disconnect: function(callback) {
            socket.disconnec();
            $rootScope.$apply(function() {
                callback.apply(socket);
            });
            this.auth = false;
        },
        sendMessage: function(msg) {
            console.log("funcionando");
            socket.emit('prova');
            socket.emit('message', {
                codi: 1,
                user: nick,
                message: msg
            });
        },
        getMessage: function(callback) {
            socket.on('message', function(m) {
                console.log(m);
                $rootScope.$apply(function() {
                    callback(m);
                });
            });
        },
        connected: function() {
            return socket.connected;
        },
        auth: false
    };
});