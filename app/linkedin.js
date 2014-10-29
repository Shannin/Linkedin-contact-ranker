'use strict'

angular.module('contactRanker')

.service('Linkedin', ['$http', function ($http) {
    var authQueue = [];

    var singleton = {
        user: null,
    };

    singleton.getProfile = function (callback, error) {
        if (!IN.API) {
            authQueue.push([callback, error]);
            return;
        }

        IN.API.Profile("me")
            .fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl" ])
            .result(function(result) {
                singleton.user = result;

                if (callback) {
                    callback(result);
                }
            })
            .error(function(err) {
                console.error("Linkedin error...");

                if (error) {
                    error(err);
                }
            });
    };

    IN.Event.on(IN, "auth", function() {
        singleton.getProfile(function () {
            angular.forEach(authQueue, function (obj) {
                singleton.getProfile(obj[0], obj[1]);
            });
        });
    });

    return singleton;
}]);
