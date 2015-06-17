'use strict';
mdlDirectTvApp.factory('NewSearchDataService', ['$http', 'configuration', 'Sessions', '$rootScope', '$filter', function($http, configuration, Sessions, $rootScope, $filter) {
    var searchterm = "",
        separator = "#&-&@#$",
        LastVideoSearchResult = {};
    var NewSearchDataService = {
        setSearchText: SetLastTwoSearchTerms, // Set last 2 search text
        getSearchText: getSearchText, //get search text
        getLastTwoSearchTerms: getLastTwoSearchTerms, // get last 2 searched text
        removeValueFromSavedSearchTerms: removeValueFromSavedSearchTerms,
        getSearchResultByTermAndType: getSearchResultByTermAndType, // Fetch all search data from API
        setLastVideoSearchResult: setLastVideoSearchResult, // Setter to store the last search data from API
        getLastVideoSearchResult: getLastVideoSearchResult, // get the last search data from API
        getAllTitleIdsAndPositionsFromInstantCall: getAllTitleIdsAndPositionsFromInstantCall, //get All title ids of assets.
        getSearchResultByMiniCall: getSearchResultByMiniCall, //get Mini API call for all assets.
        getPeopleSearchResultByMiniCall: getPeopleSearchResultByMiniCall
    };
    return NewSearchDataService;
    /*
     * Set last 2 search text
     *
     * @param {type} term
     * @returns {undefined}
     */
    function SetLastTwoSearchTerms(term) {
        searchterm = term;
        var lastsearchtermArr = Sessions.getCookie("lastsearchtermArr");
        if (lastsearchtermArr == '') {
            Sessions.setCookie("lastsearchtermArr", term);
        } else {
            var tempTerm = lastsearchtermArr + separator + term;
            var curt = tempTerm.split(separator);
            var newCurt = curt.slice(-2);
            var newterm = newCurt.join(separator);
            Sessions.setCookie("lastsearchtermArr", newterm);
        }
    };
    /*
     * get last 2 searched text
     *
     * @returns {String}
     */
    function getLastTwoSearchTerms() {
        var lastsearchtermArr = Sessions.getCookie("lastsearchtermArr");
        if (lastsearchtermArr == '') {
            return '';
        } else {
            var tempTerm = lastsearchtermArr + separator;
            var curt = tempTerm.split(separator);
            var unique = curt.filter(function(elem, index, self) {
                if (elem !== "" && elem != null) return index == self.indexOf(elem);
            });
            return unique;
        }
    };

    function removeValueFromSavedSearchTerms(array, value) {
        var lastsearchtermArr = Sessions.getCookie("lastsearchtermArr");
        if (lastsearchtermArr == '') {
            return '';
        } else {
            var index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
            }
            var newterm = array.join(separator);
            Sessions.setCookie("lastsearchtermArr", newterm);
            return array;
        }
    };
    /*
     * get search text
     *
     * @returns {term|String}
     */
    function getSearchText() {
        return searchterm;
    };
    /*
     * Fetch all search data from API
     * Eg: /search/v1/instant/providers/75212/vod?term=mar&include=Movie
     *
     * @param {type} searchTerm
     * @param {type} contentType
     * @returns {unresolved}
     */
    function getSearchResultByTermAndType(searchTerm, contentType) {
        var promise = $http.get(configuration.server_url + '/searchApi/searchByType?q=' + searchTerm + '&type=' + contentType).
        success(function(data, status, headers, config) {
            return data;
        }).
        error(function(data, status, headers, config) {
            console.log("Term search for " + contentType + " has failed--------");
            var json = {
                "code": status,
                "data": data
            };
            return json;
        });
        return promise;
    };
    /*
     * Setter to store the last search data from API
     *
     * @param {type} searchData
     * @returns {undefined}
     */
    function setLastVideoSearchResult(searchData) {
        var lastSearchResult = Sessions.getCookie("lastSearchResult");
        if (!!lastSearchResult) {
            Sessions.setCookie("lastSearchResult", JSON.stringify(searchData));
            console.log("Sessions.getCookie()---------------------");
            var test = Sessions.getCookie("lastSearchResult");
            console.log(test);
        }
    };
    /*
     * get the last search data from API
     *
     * @returns {searchData}
     */
    function getLastVideoSearchResult() {
        var lastSearchResult = Sessions.getCookie("lastSearchResult");
        return lastSearchResult;
    };
    /*
     * get All title ids of assets.
     *
     * @param {type} searchData
     * @returns {titleIds}
     */
    function getAllTitleIdsAndPositionsFromInstantCall(searchData) {
        var titleIds = []; //array to store title ids.
        var positions = [];
        var titleIdsAndPositions = {};
        titleIdsAndPositions.titleIds = titleIds;
        titleIdsAndPositions.positions = positions;
        var allVideoAssets = searchData.vod;
        if (typeof searchData === 'undefined' || typeof allVideoAssets === 'undefined' || !angular.isArray(allVideoAssets)) {
            return titleIdsAndPositions;
        }
        var totalAssets = allVideoAssets.length;
        for (var i = 0; i < totalAssets; i++) {
            var titleId = allVideoAssets[i]['id'];
            titleIds.push(titleId);
            positions.push(i);
        }
        titleIdsAndPositions.titleIds = titleIds;
        titleIdsAndPositions.positions = positions;
        return titleIdsAndPositions;
    };
    // function replaceSearchTextWithInputValue(queryOptions, inputValue) {
    //     console.log("query Options------------");
    //     console.log(queryOptions);
    //     var queryOptions   = JSON.parse(queryOptions);
    //     queryOptions.query = inputValue;
    //     return JSON.stringify(queryOptions);
    // };
    function getSearchResultByMiniCall(query) {
        var query = JSON.stringify(query);
        var promise = $http.get(configuration.server_url + '/searchApi/getNewSearchResultsByQueryOption?query=' + query).
        success(function(data, status, headers, config) {
            return data;
        }).error(function(data, status, headers, config) {
            console.log(" Mini call has failed--------");
            var json = {
                "code": status,
                "data": data
            };
            return json;
        });
        return promise;
    };

    function getPeopleSearchResultByMiniCall(searchTerm, queryString) {
        console.log("people mini search..")
        console.log('/searchApi/GetPeopleSearchDataByMiniContentAction?q=' + queryString);
        var promise = $http.get(configuration.server_url + '/searchApi/GetPeopleSearchDataByMiniContent?q=' + queryString).
        success(function(data, status, headers, config) {
            return data;
        }).error(function(data, status, headers, config) {
            console.log(" Mini call has failed--------");
            var json = {
                "code": status,
                "data": data
            };
            return json;
        });
        return promise;
    };
}]);