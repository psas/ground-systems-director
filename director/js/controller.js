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

/* "Empty" data to push into the charts on pageload. 5 minutes of null */
var default_disconnect_data = [];
var t = new Date();
for (var i = 30; i >= 0; i--) {
    var x = new Date(t.getTime() - i * 10000);
    default_disconnect_data.push([x, 100.0, null]);
}


/**
 * Main Controller
 */
angular.module("gsdApp.controllers").controller('gsdCtrl', ['$rootScope', '$scope','$websocket', '$interval', function ($rootScope, $scope, $websocket, $interval) {

    //  Machines we know about, and their locations on the network
    var machines =  [
        {'name': "Ground Master Controller",
         'connect': "ws://localhost:8675",
         'cpu': default_disconnect_data.slice(0),
         'ram': default_disconnect_data.slice(0)
        }
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
        machine.ws.$$config.reconnect = true;


        /* WEBSOCKET EVENTS: */
        // OPEN
        machine.ws.$on('$open', proxy(function () {
            console.log('connect to '+this.name);

            $rootScope.$apply(proxy(function() {
                this.connected = true;
            }, this));
        }, machine));

        // CLOSE
        machine.ws.$on('$close', proxy(function () {
            if (this.connected) {
                console.log(this.name+" disconnected!");
                $rootScope.$apply(proxy(function() {
                    this.connected = false;
                }, this));
            }
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



        /* Response Handlers */
        // HEARTBEAT
        machine.ws.$on('heartbeat', proxy(function (data) {
            $rootScope.$apply(proxy(function() {
                this.services = data.services;
                var t = new Date();
                this.cpu.push([t, null, data.cpu]);
                this.ram.push([t, null, data.ram]);
            }, this));
        }, machine));
    }
}]).
directive('chartCpu', function($compile) {
    function link (scope, element, attrs) {
        scope.machine.cpu_chart = new Dygraph(element[0], scope.machine.cpu, {
            drawPoints: false,
            showRoller: false,
            fillGraph: true,
            includeZero: true,
            axisLabelFontSize: 9,
            gridLineColor: '#444444',
            gridLinePattern: [2,7],
            interactionModel: {},
            ylabel: "CPU [%]",
            valueRange: [0.0, 100.1],
            labels: ['Time', 'disconnected', 'CPU'],
            axes: {
                'x': {
                    drawGrid: true
                },
                'y': {
                    pixelsPerLabel: 20
                }
            },
            series : {
                'disconnected': {
                    color: '#cccccc',
                    strokeWidth: 0
                },
                'CPU': {
                    color: '#2980B9',
                    strokeWidth: 1
                }
            }
        });
        scope.$watch('machine.cpu.length', function(newValue, oldValue, scope) {
            t = new Date();
            scope.machine.cpu_chart.updateOptions( {
                dateWindow: [ t - 300000, t ],
                'file': scope.machine.cpu
            });
        });
    }
    return {
      link: link
    }
}).
directive('chartRam', function($compile) {
    function link (scope, element, attrs) {
        scope.machine.ram_chart = new Dygraph(element[0], scope.machine.ram, {
            drawPoints: false,
            showRoller: false,
            fillGraph: true,
            includeZero: true,
            axisLabelFontSize: 9,
            gridLineColor: '#444444',
            gridLinePattern: [2,7],
            interactionModel: {},
            ylabel: "RAM [%]",
            valueRange: [0.0, 100.1],
            labels: ['Time', 'disconnected', 'RAM'],
            axes: {
                'x': {
                    drawGrid: true
                },
                'y': {
                    pixelsPerLabel: 20
                }
            },
            series : {
                'disconnected': {
                    color: '#cccccc',
                    strokeWidth: 0
                },
                'RAM': {
                    color: '#27AE60',
                    strokeWidth: 1
                }
            }
        });
        scope.$watch('machine.ram.length', function(newValue, oldValue, scope) {
            t = new Date();
            scope.machine.ram_chart.updateOptions( {
                dateWindow: [ t - 300000, t ],
                'file': scope.machine.ram
            });
        });
    }
    return {
      link: link
    }
});
