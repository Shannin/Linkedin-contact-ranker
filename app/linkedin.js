'use strict'

angular.module('contactRanker')

.service('Linkedin', ['$http', function ($http) {
    var authQueue = [];
    var singleton = {};

    singleton.getProfile = function (callback, error) {
        if (!IN.API) {
            authQueue.push([callback, error]);
            return;
        }

        IN.API.Profile("me")
            .fields([ "firstName", "lastName", "industry", "location", "pictureUrl", ])
            .result(function(result) {
                var user = null;
                if (result.values.length > 0) {
                    user = cleanUserProfile(result.values[0]);
                }

                if (callback) {
                    callback(user);
                }
            })
            .error(function(err) {
                console.error("Linkedin error...");

                if (error) {
                    error(err);
                }
            });
    };

    singleton.getConnections = function (callback, error) {
        IN.API.Connections("me")
            .result(function (result) {
                var connections = [];
                angular.forEach(result.values, function (connection) {
                    var c = cleanUserProfile(connection);
                    if (c) {
                        connections.push(c);
                    }
                });

                if (callback) {
                    callback(connections);
                }
            })
            .error(function(err) {
                console.error("Linkedin error...");

                if (error) {
                    error(err);
                }
            });
    };

    var cleanUserProfile = function (user) {
        if (user.id === 'private') {
            return null;
        }

        return {
            name: user.firstName + " " + user.lastName,
            pictureUrl: user.pictureUrl,
            industry: user.industry,
            location: user.location.name,
        }
    }

    IN.Event.on(IN, "auth", function() {
        singleton.getProfile(function () {
            angular.forEach(authQueue, function (obj) {
                singleton.getProfile(obj[0], obj[1]);
            });
        });
    });

    return singleton;
}]);
