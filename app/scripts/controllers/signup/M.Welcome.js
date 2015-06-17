'use strict';
/*
 * loggedin Subscriber page
 * on signup completion on mobile
 */
mdlDirectTvApp.controller('LoggedinSubscriberCtrl', ['$scope', '$modal', 'Gigya', '$timeout', '$http', 'AccountService', 'SocialService', '$rootScope', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore',
    function($scope, $modal, Gigya, $timeout, $http, AccountService, SocialService, $rootScope, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore) {
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        $scope.GotoManageAccount = function() {
            $location.url('/manageAccount'); //redirect to account management
        };
        var uat = navigator.userAgent;
        var checkert = {
            iphone: uat.match(/(iPhone|iPod|iPad)/),
            blackberry: uat.match(/BlackBerry/),
            android: uat.match(/Android/)
        };
        $scope.DownLoadAppLink = function() {
            if (isMobile.any()) {
                //touch enabled device.
                console.log("Touch enabled Device");
                if (checkert.android) {
                    console.log("android");
                    window.location.href = $rootScope.androidLink[$rootScope.CurrentLang];
                } else if (checkert.iphone) {
                    console.log("ios");
                    window.location.href = $rootScope.iosLink[$rootScope.CurrentLang];
                }
            } else {
                console.log("Not a touch enabled Device");
            }
        };
    }
]);