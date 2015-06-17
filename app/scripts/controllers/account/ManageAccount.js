'use strict';
/*
 * Account Management Controller
 */
mdlDirectTvApp.controller('ManageAccountCtrl', ['$scope', '$parse', '$modal', 'dateFilter', '$http', 'AccountService', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', 'Gigya',
    function($scope, $parse, $modal, dateFilter, $http, AccountService, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, Gigya) {
        /* In mobile, show top bar*/
        if (isMobile.any()) {
            $rootScope.setMenuBackgroundColorWithLogo();
        } else {
            jQuery('#menu').show();
            jQuery('#menuDesktops').show();
        }
        $scope.accountManagementBillingFormSpinner = true;
        $rootScope.$watch("getUserPackageDetailsByPurchaseResp", function(newVal) {
            if (!!newVal) {
                $scope.accountManagementBillingFormSpinner = false;
            }
        });
    }
]);