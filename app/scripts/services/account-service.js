'use strict';
mdlDirectTvApp.factory('AccountService', ['$http', '$rootScope', 'configuration', 'Sessions', function($http, $rootScope, configuration, Sessions) {
    var AccountService = {
        Registration: function(regData) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(configuration.server_url + '/gigya', regData).then(function(response) {
                // The then function here is an opportunity to modify the response
                console.log(response.data);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        Login: function(loginData) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(configuration.server_url + '/gigya', loginData).then(function(response) {
                // The then function here is an opportunity to modify the response
                console.log(response.data);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        CheckUniqeEmail: function(emailID) {
            // $http returns a promise, which has a then function, which also returns a promise
            var formData = {
                params: {
                    email: emailID,
                    action: 'checkUniqueEmail'
                }
            };
            var promise = $http.get(configuration.server_url + '/gigya', formData).then(function(response) {
                // The then function here is an opportunity to modify the response
                console.log(response.data);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        ResetPassword: function(emailID) {
            // $http returns a promise, which has a then function, which also returns a promise
            var formData = {
                params: {
                    email: emailID,
                    action: 'resetPassword'
                }
            };
            var promise = $http.get(configuration.server_url + '/gigya', formData).then(function(response) {
                // The then function here is an opportunity to modify the response
                console.log(response.data);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        SetAccountInfo: function(userData) {
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/gigya/post_handler',
                data: userData,
                dataType: 'json'
            }).then(function(response) {
                return response;
            }, function(response) {
                console.log("onGigyaAccountInfoFetched: Failed with " + response.status + ". Body: " + response.errorMessage);
                // failed
            });
            // Return the promise to the controller
            return promise;
        },
        checkEntitilementIDExistInLongSeachCall: function(titleId) {
            var formData = {
                accessToken: Sessions.getCookie('accessToken'),
                titleID: titleId
            };
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/search/check_user_subscription_for_video_play',
                data: seacrhData,
                dataType: 'json'
            }).then(function(response) {
                console.log(response);
                return response;
            }, function(response) {
                console.log("Error in entitlement check");
                // failed
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return AccountService;
}]);