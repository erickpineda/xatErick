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