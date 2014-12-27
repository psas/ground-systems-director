'use strict';

/* javascipt junk to bind a useful context to callback functions */
var proxy = function(fn, context) {
  return function() {
    return fn.apply(context, arguments);
  };
};

/* Write our own filter to change true|false to UX friendly strings */
angular.module("gsdApp.controllers").filter('connected', function() {
    return function(text, length, end) {
        if (text) {
            return 'Connected';
        }
        return 'Connecting...';
    }
});


/**
 * Main Controller
 */
angular.module("gsdApp.controllers").controller('gsdCtrl', ['$rootScope', '$scope','$websocket', function ($rootScope, $scope, $websocket) {

    //  Machines we know about, and their locations on the network
    var machines =  [
        //{'name': "LTC", 'connect': "ws://ltc.psas.ground:8000"},
        {'name': "Telemetry Server", 'connect': "ws://telem.psas.ground:8000"},
        {'name': "Trackmaster", 'connect': "ws://localhost:5600"},
        {'name': "Ground Master Controller", 'connect': "ws://localhost:8000"},
    ];

    // place initial list into the scope
    $scope.machines = machines;

    /**
     * For each machine in the list, we will set up the websocket, events, and
     * callbacks to run the show.
     */
    for (var i=0; i<machines.length; i++) {

        // current machine
        var machine = $scope.machines[i];

        // default connection status
        machine.connected = false;

        // Init websocket!
        machine.ws = $websocket.$new(machine.connect);

        /* WEBSOCKET EVENTS: */
        // OPEN
        machine.ws.$on('$open', proxy(function () {
            console.log('connect to '+this.name);

            $rootScope.$apply(proxy(function() {
                this.connected = true;
            }, this));

            // on connect, send the `list` command
            this.ws.$emit('list');
        }, machine));

        // CLOSE
        machine.ws.$on('$close', proxy(function () {
            console.log(this.name+' disconnect');

            $rootScope.$apply(proxy(function() {
                this.connected = false;
            }, this));
        }, machine));

        /* Local Events (Buttons) */
        // REBOOT
        machine.reboot = proxy(function() {
            console.log("reboot");
            this.ws.$emit('reboot');
        }, machine);

        /* Command Handlers */
        // LIST
        machine.ws.$on('list', proxy(function (data) {
            console.log('got list from '+this.name);
            $rootScope.$apply(proxy(function() {
                this.services = data;
            }, this));
        }, machine));
    }

}]);
