'use strict';
/*
 * Package selection page
 */
mdlDirectTvApp.controller('SelectPackageCtrl', ['$scope', '$modal', '$http', 'AccountService', 'SocialService', '$rootScope', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore',
    function($scope, $modal, $http, AccountService, SocialService, $rootScope, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore) {
        $rootScope.RedirectIfCookieNotSet();
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        //destroy sizzle player
        if (!!$rootScope['sizzle-video']) {
            $rootScope['sizzle-video'].destroy();
        }
        //route path
        $scope.routePath = $location.path();
        //omniture call
        analyticsService.TrackCustomPageLoad('signup:select package');
        //hide main menu
        jQuery('#menu').hide();
        $scope.ajaxPackageSpinner = true;
        $rootScope.$watch("packageListNEW", function(newValue, oldValue) {
            if (newValue == 'undefined' || typeof newValue == 'undefined') {
                return true; // packageList not updated yet
            }
            if (typeof $rootScope.signupConfiguration != 'undefined') {
                $scope.signupConfiguration = $rootScope.signupConfiguration;
                var selectPackageDetails = $filter('filter')($rootScope.signupConfiguration.signup_page, {
                    id: 'selectPackage'
                });
                $scope.selectPackageDetails = selectPackageDetails[0];
                if (typeof selectPackageDetails[0].buttons !== 'undefined') {
                    var buttonConfig = $filter('filter')(selectPackageDetails[0].buttons, {
                        id: 'main_button'
                    });
                    $scope.buttonConfig = buttonConfig[0];
                } else {
                    $log.error("selectpackageButton id missing from appgrid signup configuration");
                }
            }
            //check packageObjList already defined
            if ($rootScope.empty($rootScope.packageObjList)) {
                for (var i in newValue) {
                    if (newValue[i].checkbox_status == "checked") {
                        newValue[i].packageSelection = newValue[i].newPackageSelection = true;
                    } else {
                        newValue[i].packageSelection = newValue[i].newPackageSelection = false;
                    }
                }
                $rootScope.packageObjList = newValue;
            }
            var addonList = $filter('filter')($rootScope.packageObjList, {
                type: 'addon'
            });
            $scope.showAddAddonHeader = (addonList.length > 0) ? true : false;
            $scope.ajaxPackageSpinner = false;
        });
        $scope.updateCheckbox = function(packageObj) {
            if (packageObj.is_checkbox_editable == true) {
                packageObj.packageSelection = packageObj.newPackageSelection = !packageObj.packageSelection;
            } else {
                packageObj.newPackageSelection = packageObj.packageSelection;
            }
        };
        $scope.packageConfirmAction = function() {
            if (typeof $rootScope.signupRouteInfo.selectPackage != "undefined") {
                $rootScope.signupRouteInfo.selectPackage = true;
            }
            if ($rootScope.packageObjList.length > 0) {
                if ((typeof Sessions.getCookie('userid') != 'undefined') && Sessions.getCookie('userid')) {
                    if (typeof $rootScope.signupRouteInfo.selectPackage != "undefined") {
                        $rootScope.signupRouteInfo.createAccount = true;
                    }
                    Authentication.GetUserAccountTokenWithoutTokenGeneration();
                    $location.url("/finalCheckout");
                } else {
                    $location.url('/createAccount');
                }
            }
        };
    }
]);