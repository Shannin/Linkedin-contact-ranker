'use strict';

angular.module('contactRanker')

.controller('MainViewController', ['$scope', 'Linkedin', function ($scope, Linkedin) {
    $scope.user = {
        profile: {},
        connections: [],
    };

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
}])

.filter('significantConnections', function () {
    // This is the ranking algo
    var calculateRank = function (connection) {
        return 1;
    }

    return function (connections, order, limit) {
        var processed = connections.map(function (connection) {
            connection.rank = calculateRank(connection);
            return connection;
        });

        var length = processed.length >= limit ? limit : processed.length;

        if (order === 'bottom') {
            var section = processed.splice(processed.length - length, length);
            section.reverse();
            return section;
        } else {
            return processed.slice(0, length);
        }
    }
});
