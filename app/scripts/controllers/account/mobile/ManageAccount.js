/*
 * mobileLoggedInSubscriberHome
 */
mdlDirectTvApp.controller('MobileLoggedInSubscriberHomeCtrl', ['$scope', '$modal', 'Gigya', '$timeout', '$http', 'AccountService', 'SocialService', '$rootScope', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore',
    function($scope, $modal, Gigya, $timeout, $http, AccountService, SocialService, $rootScope, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore) {
        console.log("inside mobileLoggedInSubscriberHomeCtrl");
        $scope.GotoRoute = function(route) {
            $location.path(route).search(''); //redirect to account management
        };
        if (isMobile.any()) {
            jQuery('#mobileCollapsingMenu').hide();
            jQuery('#helpSear').hide();
            jQuery('#menuDesktop').hide();
            jQuery('#adminBtn').hide();
        }
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