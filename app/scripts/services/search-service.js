'use strict';
mdlDirectTvApp.factory('SearchService', ['$http', 'configuration', 'Sessions', '$rootScope', function($http, configuration, Sessions, $rootScope) {
    var SearchService = {
        GetSearchResult: function(searchText) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(configuration.server_url + '/search?q=' + searchText).then(function(response, headers) {
                // The then function here is an opportunity to modify the response
                console.log("in search-");
                console.log(headers);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        GetSearchResultByTermAndType: function(searchText, type) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(configuration.server_url + '/searchApi/searchByType?q=' + searchText + '&type=' + type).
            success(function(data, status, headers, config) {
                return data;
            }).
            error(function(data, status, headers, config) {
                console.log("Term search for " + type + " has failed--------");
                var json = {
                    "code": status,
                    "data": data
                };
                return json;
            });
            // Return the promise to the controller
            return promise;
        },
        SeeMore: function(searchText, category) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(configuration.server_url + '/search/seemore?q=' + searchText + '&category=' + category).then(function(response, headers) {
                // The then function here is an opportunity to modify the response
                console.log("in search-");
                console.log(headers);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        getAssetDescription: function(titleArr) {
            var promise = '';
            if (titleArr.length > 0) {
                for (var i = 0; i < titleArr.length; i++) {
                    promise = $http.get(configuration.server_url + '/search/searchDetailDescription?titleId=' + titleArr[i]).then(function(response, headers) {
                        return response.data;
                    });
                }
            } else {
                promise = $http().then(response, headers);
            }
            return promise;
        },
        GetTrackContent: function() {
            var promise = $http.get(configuration.server_url + '/live/getTrack').then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        GetTrackSegmentsContent: function(date, startTime, endTime) {
            var promise = $http.get(configuration.server_url + '/live/getTrackSegments?date=' + date + '&startTime=' + startTime + '&endTime=' + endTime).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        GetEpisodeListBySeriesId: function(SeriesID, SeasonID) {
            var promise = $http.get(configuration.server_url + '/tv/getEpisodesBySeasonID?series_id=' + SeriesID + '&show_type=Episode,Season&order=asc&season_number=' + SeasonID).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        EpisodeExecutBGCalls: function(seasonResponse) {
            for (var i = 0; i < seasonResponse.length; i++) {
                $http.get(configuration.server_url + '/search/GetSearchMiniContent?contentId=' + seasonResponse[i].id + '&position=' + i).
                success(function(data, status, headers, config) {
                    if (data.imagePath && data.position) {
                        var imagePath = $rootScope.updateimagePath(data.imagePath);
                        seasonResponse[data.position].imagePath = imagePath;
                    }
                });
            }
        }
    };
    return SearchService;
}]);