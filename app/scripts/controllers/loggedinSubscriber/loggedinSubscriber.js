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
        /* In mobile, show top bar*/
        if (isMobile.any()) {
            $rootScope.setMenuBackgroundColorWithLogo();
        }
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
        $rootScope.$watch("[userSubscribedPackages,packagesReady]", function(val) {
            console.log("#*#---#*# object structure");
            console.log(val);
            if ((val[0] == '' || val[0] == 'undefined') || (val[1] == 'undefined' || val[1] == false)) {
                //userSubscribedPackages has to be objectsArray,
                //packagesReady has to be true
                return null;
            }
            console.log("userSubscribedPackagesObj:--->");
            console.log($rootScope.userSubscribedPackages);
            var PromoCOde = ""; //tobe set
            analyticsService.TrackSignup($rootScope.userSubscribedPackages, PromoCOde);
        }, true);
    }
]);