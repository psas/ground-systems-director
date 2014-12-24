var gsdApp = angular.module('gsdApp', []);

var connect = function (uri, $scope) {
    var WebSocket = window.WebSocket || window.MozWebSocket;
    var websocket = new WebSocket(uri);

    websocket.onopen = function(evt) {
        console.log("open");
    };
};

gsdApp.controller('GroundSystemsCtrl', function ($scope) {

    var machines =  [
        {'name': "LTC", 'connect': "ws://ltc.psas.ground:8000"},
        {'name': "Telemetry Server", 'connect': "ws://telem.psas.ground:8000"},
        {'name': "Trackmaster", 'connect': "ws://tm3k.psas.ground:8000"},
        {'name': "Ground Master Controller", 'connect': "ws://localhost:8000"},
    ];

    $scope.machines = machines;

    for(var i=0; i < machines.length; i++) {
        connect(machines[i].connect, $scope);
    }

});
