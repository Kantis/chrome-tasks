var GoogleApiAuth = angular.module("googleAuth", []);

GoogleApiAuth.factory('authApi', function authApi($q) {
	var google = new OAuth2('google', {
		client_id: '905563626701-f9r6u9lkoj5luvqfcrjfuc52mqk3045t.apps.googleusercontent.com',
		client_secret: 'kpCpIOwIZykGtM6IC0eUSJTA',
		api_scope: 'https://www.googleapis.com/auth/tasks'
	});
	
	var getAccessToken = function() {
		return $q(function (resolve, reject) {
			google.authorize(function() {
				resolve(google.getAccessToken());
			});
		});
	};
	
	return {
		getAccessToken: getAccessToken
	};
});