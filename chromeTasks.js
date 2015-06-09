'use strict';

var chromeTasks = angular.module('chromeTasks', ['googleApi']);


chromeTasks.controller('MainController', ['tasksApi', '$scope', function (tasksApi, $scope) {
	$scope.tasklists = [];
	$scope.tasks = [];

	var init = function() {
		tasksApi.getTaskLists().then(
			function (result) {
				$scope.tasklists =  result.data.items;
				$scope.selectedList = result.data.items[0].id;

				getTasksForList($scope.selectedList);
			});
	}

	$scope.selectList = function (selectedList) {
		$scope.selectedList = selectedList;
		getTasksForList(selectedList);
	}

	$scope.isListSelected = function(tasklistId) {
		return $scope.selectedList == tasklistId;
	}

	$scope.toggleCompleted = function(taskId) {
		var task = getTask(taskId);

		if (task.status == 'needsAction') {
			task.status = 'completed';
		}
		else {
			task.status = 'needsAction';
			delete task.completed;
		}

		$scope.updateTask(task);
	}

	$scope.newTask = function() {
		var task = generateEmptyTask();

		tasksApi.createTask(task, $scope.selectedList).then(function (result) {
			task = result.data;
			$scope.tasks.unshift(task);
		});
	}

	$scope.updateTask = function(task) {
		console.log('hello');
		tasksApi.updateTask(task);
	}

	var generateEmptyTask = function() {
		return {
			"kind": "tasks#task",
			"title": "New task",
			"status": "needsAction"
		}
	}

	var getTask = function (taskId) {
		return _.find($scope.tasks, function (task) {
			return task.id == taskId;
		});
	}

	var getTasksForList = function(taskList) {
		tasksApi.getTasks($scope.selectedList).then(
			function (result) {
				console.log(result);
				$scope.tasks = result.data.items;
			});
	}

	init();
}]);
