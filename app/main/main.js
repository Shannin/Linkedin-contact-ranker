'use strict';

angular.module('contactRanker')

.controller('MainViewController', ['$scope', 'Linkedin', function ($scope, Linkedin) {
	$scope.user = {};

	Linkedin.getProfile(function (user) {
		$scope.user = user;
	}, function (error) {
		console.log(error);
	});

}]);