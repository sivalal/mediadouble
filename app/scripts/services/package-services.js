'use strict';
mdlDirectTvApp.factory('PackageService', ['$http', function($http) {
    var PackageService = {
        PackageDetails: function() { //this function will return details of current package
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('').then(function(response, headers) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        BillingHistory: function() { //this function will return billing history of current user
            var promise = $http.get('').then(function(response, headers) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        UpdateBillingAddress: function(data) { //this function will update users billing address
            var promise = $http.get('', data).then(function(response, headers) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        UpdatePaymentMethod: function(data) { //this function will update users payment method
            var promise = $http.get('', data).then(function(response, headers) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    }
}]);