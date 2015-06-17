'use strict';
mdlDirectTvApp.factory('WatchListService', ['$http', 'Sessions', '$rootScope', 'configuration', function($http, Sessions, $rootScope, configuration) {
    var WatchListService = {
        Add: function(title_id) { //this function will add an item to watch list
            var promise = $http.get(configuration.server_url + '/watchlist/create?title_id=' + title_id).then(function(response, headers) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        GetNewlist: function() { //this function will return items from watch list
            var promise = $http.get(configuration.server_url + '/watchlist/get_new_list').then(function(response, headers) {
                response = response.data;
                if (response.length > 0) {
                    angular.forEach(response, function(value, key) {
                        response[key].imagePath = $rootScope.updateimagePath(value.imagePath);
                    });
                }
                return response;
            });
            return promise;
        },
        Getlist: function() { //this function will return items from watch list
            var promise = $http.get(configuration.server_url + '/watchlist/get_list').then(function(response, headers) {
                response = response.data;
                return response;
            });
            return promise;
        },
        GetAllIds: function() { //this function will return items from watch list
            var promise = $http.get(configuration.server_url + '/watchlist/getAllWatchlistIds').then(function(response, headers) {
                response = response.data;
                return response;
            });
            return promise;
        },
        playAll: function() { //this function will return items from watch list
            var promise = $http.get(configuration.server_url + '/watchlist/getPlayList').then(function(response, headers) {
                response = response.data;
                return response;
            });
            return promise;
        },
        ExecutBGCalls: function() { //this function will return items from watch list
            for (var i = 0; i < $rootScope.watchlistList.length; i++) {
                $http.get(configuration.server_url + '/search/GetSearchMiniContent?contentId=' + $rootScope.watchlistList[i].id + '&position=' + i).
                success(function(data, status, headers, config) {
                    if (data.imagePath && data.position) {
                        var imagePath = $rootScope.updateimagePath(data.imagePath);
                        $rootScope.watchlistList[data.position].imagePath = imagePath;
                    }
                });
            }
        },
        CheckItemExists: function(itemID) { //this function will return items from watch list
            var promise = $http.get(configuration.server_url + '/watchlist/CheckItemInWatchList?title_id=' + itemID).
            then(function(response, headers) {
                console.log("watch list resp");
                return response.data;
            });
            return promise;
        },
        CheckItemExists_BG: function(itemID, position) { //this function will return items from watch list
            var promise = $http.get(configuration.server_url + '/watchlist/CheckItemInWatchList?title_id=' + itemID + '&position=' + position).
            then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        DeleteItem: function(title_id, type) {
            var promise = $http.get(configuration.server_url + '/watchlist/delete_list?type=' + type + '&title_id=' + title_id).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        DeleteAllItem: function(type) {
            var promise = $http.get(configuration.server_url + '/watchlist/delete_list?type=' + type).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getAllSimilarItemsInSAP: function(embed_code) {
            var promise = $http.get(configuration.server_url + '/watchlist/get_similar_items_in_sap?embed_code=' + embed_code).then(function(response, headers) {
                console.log(response);
                console.log("watch list resp");
                return response.data;
            });
            return promise;
        },
        GetEpisodeListBySeasonId: function(seriesData) {
            //call to transaction with promocode and package id and initialize a transaction
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/watchlist/get_episode_list',
                data: seriesData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                console.log("error in get episode list--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return WatchListService;
}]);