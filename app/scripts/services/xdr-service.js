'use strict';
mdlDirectTvApp.factory('XDRService', ['$http', 'configuration', function($http, configuration) {
    var XDRService = {
        GetList: function() { //this function will return items from watch list
            var promise = $http.get(configuration.server_url + '/searchApi/shortrailXDRdataCall').then(function(response) {
                return response.data;
            });
            return promise;
        },
        GetItem: function(token) { //this function will return items from watch list
            var promise = $http.get(configuration.server_url + '/xdr').then(function(response) {
                return response.data;
            });
            return promise;
        },
        DeleteItem: function(embedCode, type) {
            var promise = $http.get(configuration.server_url + '/xdr/delete_list?embed_code=' + embedCode + '&type=' + type).then(function(response) {
                return response.data;
            });
            return promise;
        },
        DeleteAllItem: function(type) {
            var promise = $http.get(configuration.server_url + '/xdr/delete_list?type=' + type).then(function(response) {
                return response.data;
            });
            return promise;
        }
    };
    return XDRService;
}]);