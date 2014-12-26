'use strict';

angular.module("gsdApp.controllers").controller('gsdCtrl', function ($scope, $websocket) {

    var machines =  [
        //{'name': "LTC", 'connect': "ws://ltc.psas.ground:8000"},
        //{'name': "Telemetry Server", 'connect': "ws://telem.psas.ground:8000"},
        //{'name': "Trackmaster", 'connect': "ws://tm3k.psas.ground:8000"},
        {'name': "Ground Master Controller", 'connect': "ws://localhost:8000"},
    ];

    $scope.machines = machines;

    var ws = $websocket.$new('ws://localhost:8000');
    ws.$on('$open', function () {
        console.log('Oh my gosh, websocket is really open! Fukken awesome!');
        
        ws.$emit('list');
    });

    ws.$on('list', function (data) {
        console.log('The websocket server has sent the following data:');
        console.log(data);
    });

});
