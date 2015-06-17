/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
/*
 * SINGLE ASSET SERVICES
 *
 */
mdlDirectTvApp.factory('SingleAssetService', ['$http', 'Sessions', '$rootScope', 'configuration', function($http, Sessions, $rootScope, configuration) {
    var SingleAssetService = {
        getMetadata: function(isContinuousPlayback, titleIdOrEmbedCode) {
            var url = (isContinuousPlayback === true) ? '/singleasset/getSigleAssetMetadata?embed_code=' + titleIdOrEmbedCode : '/singleasset/getSigleAssetMetadata?titleId=' + titleIdOrEmbedCode;
            var promise = $http.get(configuration.server_url + url).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getEpisodesAndSeasonList: function(series_id) {
            var url = '/singleasset/getEpisodelist?series_id=' + series_id;
            var promise = $http.get(configuration.server_url + url).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getEpisodeListOfaSeason: function(series_id, season_id) {
            var url = '/singleasset/getOPTEpisodelist?series_id=' + series_id + '&season_id=' + season_id;
            var promise = $http.get(configuration.server_url + url).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getEpisodeListOnlyOfaSeason: function(series_id, season_id) {
            var url = '/singleasset/getOPTEpisodelistOnly?series_id=' + series_id + '&season_id=' + season_id;
            var promise = $http.get(configuration.server_url + url).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getSimilarItemsList: function(embed_code, queryOption) {
            var url = '/singleasset/getSimilarAssets?embed_code=' + embed_code + '&assetType=' + queryOption;
            var promise = $http.get(configuration.server_url + url).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getPlayerOpt: function(token) {
            //review transaction to display errors and then confirm
            var promise = $http.get(configuration.server_url + '/getopt').then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getDiscoveryItems: function(queryOption) {
            //var path=(JSON.parse(queryOption)).path;
            var url = "/singleasset/getDiscoveryAssetsShort?" + (JSON.parse(queryOption)).path;
            var promise = $http.get(configuration.server_url + url).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getMiniSearchItems: function(queryOption) {
                var url = "/searchApi/railShortCall?queryoptions=" + queryOption;
                var promise = $http.get(configuration.server_url + url).then(function(response, headers) {
                    return response.data;
                });
                return promise;
            }
            ///searchApi/railShortCall?
    };
    return SingleAssetService;
}]);