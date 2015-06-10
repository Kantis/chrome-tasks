'use strict';

var chromeTasks = angular.module('chromeTasks', ['googleApi']);


chromeTasks.controller('MainController', ['tasksApi', '$scope', function (tasksApi, $scope) {
	$scope.tasklists = [];
	$scope.tasks = [];
	$scope.forceFocus = null;

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
			$scope.forceFocus = task.id;
		});
	}

	$scope.updateTask = function(task) {
		tasksApi.updateTask(task);
	}

	$scope.deleteTask = function(taskId) {
		var task = getTask(taskId);
		removeTask(taskId);
		tasksApi.deleteTask(taskId, $scope.selectedList).then(function (result) {
			// TODO: If delete is unsuccessful we could put the task back in the list and show an error
		});
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

	var removeTask = function (taskId) {
		$scope.tasks = _.reject($scope.tasks, function (task) {
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
}])
/* Yoinked from http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field */
.directive('focusMe', function($timeout, $parse) { 
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
      // to address @blesh's comment, set attribute value to 'false'
      // on blur event:
      // element.bind('blur', function() {
      //    scope.$apply(model.assign(scope, false));
      // });
    }
  };
});
