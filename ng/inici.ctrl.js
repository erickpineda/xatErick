angular.module('xatApp').controller('IniciController', function($scope, SocketSrv) {
    $scope.$on('connected', function() {
        $scope.connected = true;
    });
    $scope.$on('nick', function() {
        $scope.nick = SocketSrv.getNick();
    });
});