'use strict';

var chromeTasks = angular.module('chromeTasks', ['googleApi']);


chromeTasks.controller('MainController', ['tasksApi', '$scope', function (tasksApi, $scope) {
	$scope.tasklists = [];

	tasksApi.getTaskLists().then(
		function (result) {
			console.log(result);
		});
}]);
