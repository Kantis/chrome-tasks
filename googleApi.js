'use strict';

var GoogleApi = angular.module('googleApi', ['googleAuth']); 

GoogleApi.factory('tasksApi', ['$q', '$http', 'authApi', function ($q, $http, authApi) {
	var endpointBase = 'https://www.googleapis.com/tasks/v1';

	var getTasks = function() {
		return ["Do this then that", "Do something else"]
	};

	var getTaskLists = function() {
		return $q(function (resolve, reject) {
			authApi.getAccessToken().then(function (result) {
				$http.defaults.headers.common.Authorization = 'OAuth ' + result
				$http.get(endpointBase + '/users/@me/lists').then(
					function (result) {
						resolve(result);
					});
			});
		})
	}
	
	return {
		getTaskLists: getTaskLists,
		getTasks:  getTasks
	};
}]);