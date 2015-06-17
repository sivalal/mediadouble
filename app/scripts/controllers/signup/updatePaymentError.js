'use strict';
/*
 * Signup Payment Error
 */
mdlDirectTvApp.controller('updatePaymentErrorCtrl', ['$scope', '$modal', 'dateFilter', '$http', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', '$log', '$routeParams', 'Gigya',
    function($scope, $modal, dateFilter, $http, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, $log, $routeParams, Gigya) {
        //hide all conatiners
        jQuery('#menu').hide();
        jQuery('#webFooter').hide();
        $scope.routePath = $location.path();
        var sessionId = $routeParams.session_id;
        var vindicia_vid = $routeParams.vindicia_vid;
        var paymentMethodBasedSessionID = !!sessionId ? sessionId : vindicia_vid;
        var paymentMethod = $routeParams.payment_method;
        var authID = Sessions.getCookie('auth_id');
        var userId = Sessions.getCookie('userid');
        var billingAddressPerUser = Sessions.getCookie('billing_address_' + userId);
        var packageListPerUser = localStorage.getItem('package_list_' + userId);
        $rootScope.billingAddressOfUser = !!billingAddressPerUser ? JSON.parse(billingAddressPerUser) : '';
        $rootScope.packageObjList = !!packageListPerUser ? JSON.parse(packageListPerUser) : '';
        $scope.clearSignupCookieDetails = function() {
            Sessions.setCookie('isAccountCreatedInVindicia', '', -1);
            Sessions.setCookie('auth_id', '', -1);
            // Sessions.setCookie('package_list_'+userId, '', -1);
            localStorage.removeItem('package_list_' + userId);
            Sessions.setCookie('billing_address_' + userId, '', -1);
            $location.url("/");
        };
        //5. Confirm the Payment
        if (!!authID && !!paymentMethodBasedSessionID && (authID == paymentMethodBasedSessionID) && ($scope.routePath == '/updatePaymentError')) {
            $rootScope.enableErrorAlertMessage('TXT_ISSUE_WITH_API_RESPONSE');
            $location.url("/finalCheckout");
        } else {
            $scope.clearSignupCookieDetails();
        }
    }
]);