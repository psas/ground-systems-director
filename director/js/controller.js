var gsdApp = angular.module('gsdApp', []);


gsdApp.controller('GroundSystemsCtrl', function ($scope) {
    $scope.boxes = [
        {'name': "LTC"},
        {'name': "Telemetry Server"},
        {'name': "Trackmaster"},
        {'name': "Ground Master Controller"},
    ];
});
