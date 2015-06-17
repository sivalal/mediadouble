'use strict';
mdlDirectTvApp.factory('Authentication', ['$http', 'Sessions', '$rootScope', 'configuration', '$log', function($http, Sessions, $rootScope, configuration, $log) {
    //  $cookieStore.put('loggedin', true);
    var Authentication = {
        getFullUserRelatedData: function(userId) {
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/gigya/post_handler',
                data: {
                    userId: userId,
                    action: 'userInfo'
                },
                dataType: 'json'
            }).then(function(response) {
                var userData = response.data;
                $rootScope.userData = userData;
                return userData;
            }, function(response) {
                $log.error("onGigyaAccountInfoFetched: Failed with " + response.status + ". Body: " + response.errorMessage);
                // failed
            });
            // Return the promise to the controller
            return promise;
        },
        getAccountToken: function(userData) {
            //Send gigya signature to cerberus and receive account token
            var userData = {
                UID: userData.UID,
                UIDSignature: userData.UIDSignature,
                signatureTimestamp: userData.signatureTimestamp
            };
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/onlogin/tokenGeneration',
                data: userData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                response = response.data;
                $rootScope.$broadcast('authTokenSet', 'Authentication token is set');
                $rootScope.accountToken = response.responseContent.currentAccountToken;
                Sessions.setCookie('accountToken', $rootScope.accountToken, Sessions.setExpiryForCookie());
                return response.responseContent;
            }, function(response) { // optional
                $log.error("authentication token failed--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        regeneratinAccountToken: function(userData) {
            //Send gigya signature to cerberus and receive account token
            var userData = {
                UID: userData.UID,
                UIDSignature: userData.UIDSignature,
                signatureTimestamp: userData.signatureTimestamp
            };
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/onlogin/tokenGeneration',
                data: userData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                response = response.data;
                return response.responseContent;
            }, function(response) { // optional
                $log.error("authentication token failed--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        GetUserAccountTokenWithoutTokenGeneration: function() {
            if ((typeof Sessions.getCookie('userid') != 'undefined') && Sessions.getCookie('userid')) {
                Authentication.getFullUserRelatedData($rootScope.userid).then(function(userData) {
                    if (userData != null) {
                        Authentication.getAccountToken(userData).then(function(token) {
                            if (token.success) {
                                // $log.error("Successfully generated account token");
                            }
                        });
                    }
                });
            }
        },
        GetUserAccountToken: function() {
            // Get Account Token---------------------------------------------------------------------
            if ((typeof Sessions.getCookie('userid') != 'undefined') && Sessions.getCookie('userid') && $rootScope.isLoggedIn) {
                Authentication.getFullUserRelatedData($rootScope.userid).then(function(userData) {
                    if (userData != null) {
                        Authentication.getAccountToken(userData).then(function(token) {
                            if (token.success) {
                                // $log.error("Successfully generated account token");
                            }
                        });
                    }
                });
                Authentication.generateAccountTokenEveryFiveMins();
            }
        },
        generateAccountTokenEveryFiveMins: function() {
            setInterval(function() {
                Authentication.getFullUserRelatedData($rootScope.userid).then(function(userData) {
                    if (userData != null) {
                        Authentication.regeneratinAccountToken(userData).then(function(token) {
                            if (token.success) {
                                // $log.error("Successfully generated account token");
                            }
                        });
                    }
                });
            }, 200000);
        },
        checkIfUserIpWithinSpecificRange: function() {
            var promise = $http.get(configuration.server_url + '/gigya/checkIfUserIPExist').then(function(response, headers) {
                return response.data;
            });
            return promise;
        }
    };
    return Authentication;
}]);