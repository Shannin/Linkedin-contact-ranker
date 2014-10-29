'use strict';

angular.module('contactRanker')

.controller('MainViewController', ['$scope', '$window', 'Linkedin', function ($scope, $window, Linkedin) {
    $scope.user = {
        profile: {},
        connections: [],
    };

    $scope.rankings = 'top';

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

    $scope.openUserProfile = function (user) {
        if (user.profileUrl) {
            $window.open(user.profileUrl, '_blank');
        }
    };

    init();
}])

.filter('significantConnections', function () {
    // This is the ranking algo
    var calculateRank = function (connection) {
        return 1;
    }

    return function (connections, rankings, limit) {
        var processed = connections.map(function (connection) {
            connection.rank = calculateRank(connection);
            return connection;
        });

        var length = processed.length >= limit ? limit : processed.length;

        if (rankings === 'bottom') {
            var section = processed.splice(processed.length - length, length);
            section.reverse();
            return section;
        } else {
            return processed.slice(0, length);
        }
    }
});
