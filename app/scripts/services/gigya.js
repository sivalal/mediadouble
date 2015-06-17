'use strict';
/*
 * GIGYA SERVICES
 *
 */
mdlDirectTvApp.factory('Gigya', ['$http', 'Sessions', '$rootScope', 'configuration', function($http, Sessions, $rootScope, configuration) {
    var Gigya = {
        postHandler: function(data) {
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/gigya/post_handler',
                data: data,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                console.log("gigya api call failed");
                return null;
            });
            return promise;
        },
        emailNotification: function() {
            //review transaction to display errors and then confirm
            var promise = $http.get(configuration.server_url + '/gigya/email_notification?email=' + Sessions.getCookie('emailId') + '&firstname=' + Sessions.getCookie('firstName') + '&lastname=' + Sessions.getCookie('lastname') + '&lang=' + Sessions.getLanguage()).then(function(response, headers) {
                return response.data;
            });
            return promise;
        }
    };
    return Gigya;
}]);