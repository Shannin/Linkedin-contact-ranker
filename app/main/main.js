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

    $scope.connectionTaggedWith = function (connection, tag) {
        return connection.rank.tags.indexOf(tag) > -1;
    }

    init();
}])

.filter('significantConnections', function () {
    // This is the ranking algo
    var calculateRank = function (connection) {
        // Let's pretend these were calculated
        var topLocations = ["San Francisco Bay Area", "Buffalo/Niagara, New York Area"];
        var topIndustries = [
            ['Human Resources',
             'Staffing and Recruiting',
            ],
            ['Computer Software',
             'Computer Networking',
             'Consumer Electronics',
             'Electrical/Electronic Manufacturing',
             'Information Services',
             'Information Technology and Services',
             'Internet',
            ],
        ];

        // Markers for UI
        var tags = [];

        var locRanking = 0;
        angular.forEach(topLocations, function (location, $index) {
            if (connection.location === location) {
                locRanking = topLocations.length - $index;

                // Used for visually marking contact
                if ($index === 0) {
                    tags.push('location');
                }
            }
        });

        var indRanking = 1 / (topIndustries.length + 1);
        angular.forEach(topIndustries, function (industryGroup, $index) {
            if (industryGroup.indexOf(connection.industry) > -1) {
                indRanking = topIndustries.length - $index;

                if ($index === 0) {
                    tags.push('industry');
                }
            }
        });

        var connectionsRank = Math.min(connection.numConnections, 500) / 500; // 500 is typical LinkedIn max
        if (connectionsRank > .7) {
            // They have a lot of connections...
            tags.push('connected');
        }

        return {
            value: locRanking + (indRanking * .8) + (connectionsRank * indRanking * locRanking),
            tags: tags,
        };
    }

    return function (connections, rankings, limit) {
        // Calculate each connection's rank
        var processed = connections.map(function (connection) {
            connection.rank = calculateRank(connection);
            return connection;
        });

        // Sort connections based on calculated rank
        processed.sort(function (a, b) {
            var aRank = a.rank.value;
            var bRank = b.rank.value;

            if (aRank > bRank) {
                return -1;
            } else if (bRank > aRank) {
                return 1;
            } else {
                return 0;
            }
        });

        // Reverse for worst contacts
        if (rankings === 'bottom') {
            processed.reverse();
        }

        return processed.slice(0, processed.length >= limit ? limit : processed.length);
    };
});
