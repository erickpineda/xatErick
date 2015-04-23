angular.module('xatApp',['ngRoute']);
angular.module('xatApp').controller('IniciController', function($scope, SocketSrv) {
    $scope.$on('connected', function() {
        $scope.connected = true;
    });
    $scope.$on('nick', function() {
        $scope.nick = SocketSrv.getNick();
    });
});
angular.module('xatApp')
    .controller('NickController',function ($scope,SocketSrv,$location) {
        $scope.entrar = function(){
            console.log($scope.nick);
            SocketSrv.user($scope.nick);
        };
        $scope.$on('newUserOk', function() {
            $location.path('/xat');
        });
    });
angular.module('xatApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: 'inici.html',
                autoritzat: false
            })
            .when("/user", {
                controller: "NickController",
                templateUrl: 'user.html',
                autoritzat: false
            })
            .when("/xat", {
                controller: "XatControler",
                templateUrl: 'xat.html',
                autoritzat: true
            })
            .otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode({
                          enabled: true,
                          requireBase: false
            });
    })
    .run(function($rootScope,SocketSrv) {
        $rootScope.$on('$routeChangeStart', function(event, next) {
           if (next)
                if (!SocketSrv.auth & next.autoritzat) 
                    event.preventDefault();
        });
    });
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
angular.module('xatApp')
    .controller('XatControler', function($scope,SocketSrv) {
        $scope.missatges = [];
        $scope.contador = 0;
        
        SocketSrv.getMessage(function(m) {
            console.log($scope.missatge);
            $scope.missatges.push({'pos':$scope.contador++,'missatge':m});
            
        });
        $scope.enviar = function() {
            console.log($scope.missatge);
            SocketSrv.sendMessage($scope.missatge);
        };
    });