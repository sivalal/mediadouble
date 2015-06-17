'use strict';
/*
 * cancel account page
 */
mdlDirectTvApp.controller('cancelledSubscriptionConfirmationCtrl', ['$scope', '$modal', '$http', 'AccountService', 'SocialService', '$rootScope', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore',
    function($scope, $modal, $http, AccountService, SocialService, $rootScope, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore) {
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        $scope.cancelled_account_confirmationObj = null;
        //gigya param watch
        $rootScope.$watch("gigyaParamList", function(newValue) {
            if (typeof newValue == 'undefined' || newValue == '') {
                return null; // gigyaParamList not updated yet
            }
            $scope.cancelled_account_confirmationObj = $rootScope.
            gigyaParamList.
            cancel_account.cancelled_account_confirmation;
            console.log("cancelled_account_confirmationObj");
            console.log($scope.cancelled_account_confirmationObj);
            analyticsService.TrackCustomPageLoad("account:cancelledConfrimation");
        });
        $scope.GotoManageAccount = function() {
            $location.url('/manageAccount'); //redirect to account management
        }
    }
]);