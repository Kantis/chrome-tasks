'use strict';

var chromeTasks = angular.module('chromeTasks', ['googleApi']);


chromeTasks.controller('MainController', ['tasksApi', '$scope', function (tasksApi, $scope) {
	$scope.tasklists = [];
	$scope.tasks = [];
	$scope.forceFocus = null;
	$scope.tasklistBeingEdited = null;
	$scope.showDiv = false;

	var init = function() {
		tasksApi.getTaskLists().then(
			function (result) {
				$scope.tasklists =  result.data.items;
				console.log(result);
				$scope.selectedList = result.data.items[0].id;

				getTasksForList($scope.selectedList);
			});
	}

	$scope.selectList = function (selectedList, $event) {
		$scope.selectedList = selectedList;
		getTasksForList(selectedList);
		console.log($event);
		$event.preventDefault();
		return;
	}

	$scope.isListSelected = function(tasklistId) {
		return $scope.selectedList == tasklistId;
	}

	$scope.editTaskList = function (tasklistId) {
		$scope.tasklistBeingEdited = tasklistId;
		$scope.forceFocus = tasklistId;
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

	$scope.newTasklist = function() {
		var tasklist = generateNewTaskList();
		$scope.tasklists.unshift(tasklist);
		$scope.tasklistBeingEdited = tasklist.id;
		$scope.forceFocus = tasklist.id;
	}

	$scope.saveTaskListAndSelect = function(tasklist) {
		if (tasklist.id === 'temp') {
			delete tasklist.id;
			tasksApi.createTaskList(tasklist).then(function (result) {
				tasklist.id = result.data.id;
				tasklist.selfLink = result.data.selfLink;
				tasklist.updated = result.data.updated;
			});
		} else {
			tasksApi.updateTaskList(tasklist);
		}
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

	$scope.clearList = function() {
		tasksApi.clearList($scope.selectedList);
		clearCompletedTasks();
	}

	$scope.removeFocusOnEnter = function($event) {
		if ($event.keyIdentifier === "Enter")
			removeFocus();
	}

	var removeFocus = function() {
		document.activeElement.blur();
	}

	var generateEmptyTask = function() {
		return {
			"kind": "tasks#task",
			"title": "New task",
			"status": "needsAction"
		};
	}

	var generateNewTaskList = function() {
		return {
			"kind": "tasks#taskList",
			"title": "New tasklist",
			"id": "temp"
		};
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
				$scope.tasks = result.data.items;
			});
	}

	var clearCompletedTasks = function() {
		$scope.tasks = _.reject($scope.tasks, function (task) {
			return task.status == 'completed';
		});
	};

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
          	var e = element[0];
            e.focus(); 
            e.setSelectionRange(0, e.value.length);
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
