'use strict';

var GoogleApi = angular.module('googleApi', ['googleAuth']); 

GoogleApi.factory('tasksApi', ['$q', '$http', 'authApi', function ($q, $http, authApi) {
	var endpointBase = 'https://www.googleapis.com/tasks/v1';

	var getTasks = function(taskList) {
		return $q(function (resolve, reject) {
			authApi.getAccessToken().then(function (result) {
				$http.defaults.headers.common.Authorization = 'OAuth ' + result;
				$http.get(endpointBase + '/lists/' + taskList + '/tasks').then(
					function (result) {
						resolve(result);
					});
			});
		});
	};

	var getTaskLists = function() {
		return $q(function (resolve, reject) {
			authApi.getAccessToken().then(function (result) {
				$http.defaults.headers.common.Authorization = 'OAuth ' + result;
				$http.get(endpointBase + '/users/@me/lists').then(
					function (result) {
						resolve(result);
					});
			});
		});
	};

	var updateTask = function(task) {
		authApi.getAccessToken().then(function (result) {
			$http.defaults.headers.common.Authorization = 'OAuth ' + result;
			$http.put(task.selfLink, task);
		});
	};

	var updateTaskList = function (tasklist) {
		authApi.getAccessToken().then(function (result) {
			$http.defaults.headers.common.Authorization = 'OAuth ' + result;
			$http.put(tasklist.selfLink, tasklist);
		});
	};

	var createTaskList = function(tasklist) {
		return $q(function (resolve, reject) {
			authApi.getAccessToken().then(function (result) {
				$http.defaults.headers.common.Authorization = 'OAuth ' + result;
				$http.post(endpointBase + '/users/@me/lists', tasklist).then(function (result) {
					resolve(result);
				});
			});
		});
	}

	var createTask = function(task, tasklistId) {
		return $q(function (resolve, reject) {
			authApi.getAccessToken().then(function (result) {
				$http.defaults.headers.common.Authorization = 'OAuth ' + result;
				$http.post(endpointBase + '/lists/' + tasklistId + '/tasks', task).then(function (result) {
					resolve(result);
				});
			});
		});
	};

	var deleteTask = function(taskId, tasklistId) {
		return $q(function (resolve, reject) {
			authApi.getAccessToken().then(function (result) {
				$http.defaults.headers.common.Authorization = 'OAuth ' + result;
				$http.delete(endpointBase + '/lists/' + tasklistId + '/tasks/' + taskId).then(function (result) {
					resolve(result);
				});
			});
		});
	};

	var deleteTaskList = function (tasklistId) {
		authApi.getAccessToken().then(function (result) {
			$http.defaults.headers.common.Authorization = 'OAuth ' + result;
			$http.delete(endpointBase + '/users/@me/lists/' + tasklistId);
		});
	}

	var clearList = function(tasklistId) {
		return $q(function (resolve, reject) {
			authApi.getAccessToken().then(function (result) {
				$http.defaults.headers.common.Authorization = 'OAuth ' + result;
				$http.post(endpointBase + '/lists/' + tasklistId + '/clear').then(function (result) {
					resolve(result);
				});
			});
		});
	};
	
	return {
		getTaskLists: getTaskLists,
		getTasks:  getTasks,
		updateTask: updateTask,
		createTask: createTask,
		deleteTask: deleteTask,
		clearList: clearList,
		createTaskList: createTaskList,
		updateTaskList: updateTaskList,
		deleteTaskList: deleteTaskList
	};
}]);