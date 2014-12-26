'use strict';

var proxy = function(fn, context) {
  return function() {
    return fn.apply(context, arguments);
  };
};


angular.module("gsdApp.controllers").controller('gsdCtrl', ['$rootScope', '$scope','$websocket', function ($rootScope, $scope, $websocket) {

    var machines =  [
        //{'name': "LTC", 'connect': "ws://ltc.psas.ground:8000"},
        //{'name': "Telemetry Server", 'connect': "ws://telem.psas.ground:8000"},
        {'name': "Trackmaster", 'connect': "ws://localhost:5600"},
        {'name': "Ground Master Controller", 'connect': "ws://localhost:8000"},
    ];

    $scope.machines = machines;


    for (var i=0; i<machines.length; i++) {
        var machine = $scope.machines[i];
        machine.ws = $websocket.$new(machine.connect);
        machine.ws.$on('$open', proxy(function () {
            console.log('connect to '+this.name);
            this.ws.$emit('list');
        }, machine));

        machine.ws.$on('list', proxy(function (data) {
            console.log('got list from '+this.name);
            $rootScope.$apply(proxy(function() {
                this.services = data;
            }, this));
        }, machine));

    }

}]);
