'use strict';

// Declare app level module which depends on views, and components
angular.module('contactRanker', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
 	$routeProvider

	.when('/', {
		templateUrl: '/main/main.html',
		controller: 'MainViewController',
	})

 	.otherwise({redirectTo: '/'});
}]);
