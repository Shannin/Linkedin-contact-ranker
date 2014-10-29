'use strict';

angular.module('contactRanker')

.controller('MainViewController', ['$scope', 'Linkedin', function ($scope, Linkedin) {
    $scope.user = {};

    var init = function () {
        Linkedin.getProfile(function (user) {
            Linkedin.getConnections(function(connections) {
                // $scope.$apply makes sure that the view is updated
                $scope.$apply(function () {
                    $scope.user = {
                        profile: user,
                        connections: connections,
                    };
                });
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    }


    init();
}]);
