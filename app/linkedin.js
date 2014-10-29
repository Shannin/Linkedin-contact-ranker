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
            .fields('first-name', 'last-name', 'industry', 'location', 'picture-url', 'num-connections')
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
            .fields('first-name', 'last-name', 'num-connections', 'industry', 'location', 'picture-url', 'public-profile-url')
            .result(function (result) {
                var connections = [];
                angular.forEach(result.values, function (connection) {
                    console.log(connection);
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

        var ret = {
            name: user.firstName + " " + user.lastName,
            industry: user.industry,
            pictureUrl: user.pictureUrl,
        }

        if (user.location) {
            ret.location = user.location.name;
        }

        if (user.publicProfileUrl) {
            ret.profileUrl = user.publicProfileUrl;
        }

        if (user.numConnections) {
            ret.numConnections = user.numConnections;
        }

        return ret;
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
