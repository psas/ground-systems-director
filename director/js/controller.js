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
angular.module("gsdApp.controllers").controller('gsdCtrl', ['$rootScope', '$scope','$websocket', '$interval', function ($rootScope, $scope, $websocket, $interval) {

    //  Machines we know about, and their locations on the network
    var machines =  [
        //{'name': "LTC", 'connect': "ws://ltc.psas.ground:8000"},
        {'name': "Telemetry Server", 'connect': "ws://telem.psas.ground:8000"},
        {'name': "Trackmaster", 'connect': "ws://localhost:5600"},
        {'name': "Ground Master Controller", 'connect': "ws://localhost:8000"},
    ];

    // place initial list into the scope
    $scope.machines = machines;

    var data = [];
    var t = new Date();
    for (var i = 300; i >= 0; i--) {
        var x = new Date(t.getTime() - i * 1000);
        data.push([x, 100.0, null]);
    }
    var g = new Dygraph(document.getElementById("div_g"), data, {
        drawPoints: false,
        showRoller: false,
        fillGraph: true,
        includeZero: true,
        interactionModel: {},
        ylabel: "CPU [%]",
        valueRange: [0.0, 100.1],
        labels: ['Time', 'disconnected', 'CPU'],
        axes: {
            'x': {
                drawGrid: true
            }
        },
        series : {
            'disconnected': {
                color: '#cccccc',
                strokeWidth: 0
            },
            'CPU': {
                color: '#0000ff',
                strokeWidth: 1
            }
        }
    });

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
        machine.ws.$$config.reconnect = false;
        

        /* WEBSOCKET EVENTS: */
        // OPEN
        machine.ws.$on('$open', proxy(function () {
            console.log('connect to '+this.name);

            $rootScope.$apply(proxy(function() {
                this.connected = true;
            }, this));

            // HEARTBEAT
            this.ws.$emit('heartbeat');
            this.heartbeat = $interval(proxy(function () {
                this.ws.$emit('heartbeat');
            }, this), 1000);
        }, machine));

        // CLOSE
        machine.ws.$on('$close', proxy(function () {
            console.log(this.name+' disconnect');

            // Kill heartbeat if we loose connection.
            $interval.cancel(this.heartbeat);
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

        // Start
        machine.start = proxy(function(name) {
            console.log(this.name+" start ("+name+")");
            this.ws.$emit('start', name);
        }, machine);

        // Stop
        machine.stop = proxy(function(name) {
            console.log(this.name+" stop ("+name+")");
            this.ws.$emit('stop', name);
        }, machine);

        // Restart
        machine.restart = proxy(function(name) {
            console.log(this.name+" restart ("+name+")");
            this.ws.$emit('restart', name);
        }, machine);

        /* Command Handlers */
        // HEARTBEAT
        machine.ws.$on('heartbeat', proxy(function (data) {
            console.log('got list from '+this.name);
            console.log(data);
            $rootScope.$apply(proxy(function() {
                this.services = data.services;
            }, this));
        }, machine));
    }

}]);
