'use strict';
/**
 * GoogleTagManagerService
 */
mdlDirectTvApp.service('GoogleTagManagerService', ['$window',
    function($window) {
        this.push = function(data) {
            try {
                // window.dataLayer should be defined by Google Tag Manager
                // https://developers.google.com/tag-manager/reference
                $window.dataLayer.push(data);
            } catch (e) {}
        };
    }
]);