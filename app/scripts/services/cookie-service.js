'use strict';
mdlDirectTvApp.factory('CookieService', ['$http', 'Sessions', '$rootScope',
    function($http, Sessions, $rootScope) {
        //  $cookieStore.put('loggedin', true);
        var CookieService = {
            SaveRegionFilter: function(filter) {
                Sessions.setCookie('regionFilter', filter, Sessions.setExpiryForCookie());
            },
            GetRegionFilter: function() {
                if (typeof Sessions.getCookie('regionFilter') != 'undefined') {
                    $rootScope.SelectedRegions = Sessions.getCookie('regionFilter')
                };
            },
            SetRegionFilterStatus: function(value) {
                Sessions.setCookie('showRegionFilter', value, Sessions.setExpiryForCookie());
            },
            SaveQualityFilter: function(filter) {
                Sessions.setCookie('qualityFilter', filter, Sessions.setExpiryForCookie());
            },
            GetQualityFilter: function() {
                if (typeof Sessions.getCookie('qualityFilter') != 'undefined') {
                    $rootScope.SelectedQuality = Sessions.getCookie('qualityFilter')
                };
            },
            SetQualityFilterStatus: function(value) {
                Sessions.setCookie('showQualityFilter', value, Sessions.setExpiryForCookie());
            }
        };
        return CookieService;
    }
]);