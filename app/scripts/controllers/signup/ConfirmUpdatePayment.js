'use strict';
/*
 * Confirm Update Payment page
 */
mdlDirectTvApp.controller('ConfirmUpdatePaymentCtrl', ['$scope', '$modal', 'dateFilter', '$http', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', '$log', '$routeParams', 'Gigya', 'GoogleTagManagerService',
    function($scope, $modal, dateFilter, $http, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, $log, $routeParams, Gigya, GoogleTagManagerService) {
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
        var subscriptionIdPerUser = Sessions.getCookie('subscription_id_' + userId);
        $rootScope.billingAddressOfUser = !!billingAddressPerUser ? JSON.parse(billingAddressPerUser) : '';
        $scope.clearSignupCookieDetails = function() {
            Sessions.setCookie('auth_id', '', -1);
            Sessions.setCookie('billing_address_' + userId, '', -1);
            Sessions.setCookie('subscription_id_' + userId, '', -1);
            $location.path("/");
        };
        $scope.onSuccessRedirectToAccountPageBasedonDevice = function() {
            $scope.clearSignupCookieDetails();
            if (isMobile.any()) {
                $location.path('/m.manageAccount').search('');
            } else {
                $location.path('/manageAccount').search('');
            }
        };
        if (!!authID && !!paymentMethodBasedSessionID && (authID == paymentMethodBasedSessionID) && ($scope.routePath == '/updatePaymentSuccess')) {
            $scope.ajaxConfirmPaymentSpinner = true;
            // 3. Confirm payment method
            Vindicia.confirmPaymentMethod(paymentMethodBasedSessionID, paymentMethod).then(function(confirmDetails) {
                var confirmDetailsContent = confirmDetails.responseContent;
                if (confirmDetails.responseStatus == 200 || confirmDetailsContent.status.http_code == 200) {
                    var paymentMethodID = confirmDetailsContent.payment_method.id;
                    // 4. [PUT] /subscriptions/{subscription_id}/payment‐method to set the new payment method for the subscription
                    Vindicia.assignPaymentMethodToSubscription(paymentMethodID, subscriptionIdPerUser).then(function(assignPaymentMethodDetails) {
                        var assignPaymentMethodDetailsContent = assignPaymentMethodDetails.responseContent;
                        if (assignPaymentMethodDetails.responseStatus == 200 || assignPaymentMethodDetailsContent.status.http_code == 200) {
                            // Track signup complete
                            GoogleTagManagerService.push({
                                event: 'virtualPageView',
                                virtualUrl: "/signupSuccessful"
                            });
                            //omniture call
                            analyticsService.TrackCustomPageLoad('signup:success');
                            $rootScope.enableSucessAlertMessage("TXT_PAYMENT_INFORMATION_SUCCESS_UPDATE");
                            $rootScope.entitlementCheck();
                            $scope.onSuccessRedirectToAccountPageBasedonDevice();
                        } else {
                            $scope.ajaxConfirmPaymentSpinner = false;
                            if (assignPaymentMethodDetails.responseStatus == 500 || typeof assignPaymentMethodDetailsContent == "string") {
                                $rootScope.enableErrorAlertMessage((typeof assignPaymentMethodDetailsContent != 'undefined') ? assignPaymentMethodDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG');
                            } else {
                                $rootScope.enableErrorAlertMessage((typeof assignPaymentMethodDetailsContent.status != 'undefined') ? assignPaymentMethodDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                            }
                            $scope.onSuccessRedirectToAccountPageBasedonDevice();
                        }
                    });
                } else {
                    $scope.ajaxConfirmPaymentSpinner = false;
                    if (confirmDetails.responseStatus == 500 || typeof confirmDetailsContent == "string") {
                        $rootScope.enableErrorAlertMessage((typeof confirmDetailsContent != 'undefined') ? confirmDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG');
                    } else {
                        $rootScope.enableErrorAlertMessage((typeof confirmDetailsContent.status != 'undefined') ? confirmDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                    }
                    $scope.onSuccessRedirectToAccountPageBasedonDevice();
                }
            });
        } else {
            $scope.clearSignupCookieDetails();
        }
    }
]);