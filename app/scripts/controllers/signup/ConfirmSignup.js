'use strict';
/*
 * Confirm Signup page
 */
mdlDirectTvApp.controller('ConfirmSignupCtrl', ['$scope', '$modal', 'dateFilter', '$http', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', '$log', '$routeParams', 'Gigya', 'GoogleTagManagerService',
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
        var packageListPerUser = localStorage.getItem('package_list_' + userId);
        var promocodePerUser = Sessions.getCookie('promocode_' + userId);
        $rootScope.billingAddress = !!billingAddressPerUser ? JSON.parse(billingAddressPerUser) : '';
        $rootScope.packageObjList = !!packageListPerUser ? JSON.parse(packageListPerUser) : '';
        var vid;
        var products = [];
        var basicPackEnabledForFreeTrial = false;
        if (!!$rootScope.packageObjList) {
            angular.forEach($rootScope.packageObjList, function(value, key) {
                if (!!value.id && value.packageSelection) {
                    if (value.type == "package" && value.is_free_trial_enabled) {
                        if (value.is_free_trial_enabled) {
                            basicPackEnabledForFreeTrial = true;
                        }
                    }
                    products[key] = {};
                    products[key]["id"] = value.id;
                    products[key]["id_returning_customer"] = value.id_returning_customer;
                    products[key]["is_free_trial_enabled"] = value.is_free_trial_enabled;
                    products[key]["promo_code_id"] = (value.type == "package" && !!promocodePerUser) ? promocodePerUser : value.promo_code_id;
                    products[key]["type"] = value.type;
                }
            });
        }
        $scope.openModalForFraudPreventation = function(paymentMethodId, hasUsedFreeTrial) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/fraudPreventationDialog.html',
                controller: CommonModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    paymentMethodId: paymentMethodId,
                    hasUsedFreeTrial: hasUsedFreeTrial
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        $scope.onSignupSuccessTriggerEmailNotificationAndGenerateToken = function() {
            //send nofication email
            Gigya.emailNotification().then(function(response) {
                $log.log("Welcome email send to mail");
            });
            //set subscription status to true on successful completion of signup
            Sessions.setCookie('subscriptionStatus', true, Sessions.setExpiryForCookie());
            Sessions.setCookie('isAccountCreatedInVindicia', '', -1);
            $scope.clearSignupCookieDetails();
            //opt generation for player 
            $rootScope.generateOptAndSetCookie(true);
        };
        $scope.clearSignupCookieDetails = function() {
            Sessions.setCookie('auth_id', '', -1);
            // Sessions.setCookie('package_list_'+userId, '', -1);
            localStorage.removeItem('package_list_' + userId);
            Sessions.setCookie('billing_address_' + userId, '', -1);
            $location.url("/");
        };
        //5. Confirm the Payment
        if (!!authID && !!paymentMethodBasedSessionID && (authID == paymentMethodBasedSessionID) && ($scope.routePath == '/signupSuccess')) {
            //get the product list
            $rootScope.ajaxConfirmPaymentSpinner = true;
            $rootScope.$on('authTokenSet', function(event, data) {
                console.log(data); // 'Data to send'
                console.log("token in confirm page");
                Vindicia.confirmPaymentMethod(paymentMethodBasedSessionID, paymentMethod).then(function(confirmDetails) {
                    var confirmDetailsContent = confirmDetails.responseContent;
                    if (confirmDetails.responseStatus == 200 || confirmDetailsContent.status.http_code == 200) {
                        vid = (paymentMethod == 'CreditCard') ? confirmDetailsContent.payment_method.credit_card.vid : confirmDetailsContent.payment_method.vid;
                        //check if main package is enabled for free trial, if not, don't store vid in gigya
                        if (basicPackEnabledForFreeTrial) {
                            // 6. Query Gigya to see if the VID is already used by another user.
                            if (!!confirmDetailsContent.payment_method && !!confirmDetailsContent.payment_method.vid) {
                                var data = {
                                    vid: vid,
                                    action: 'searchAccount'
                                };
                                Gigya.postHandler(data).then(function(userData) {
                                    if (userData.errorStatus == 0 && userData.statusCode == 200) {
                                        if (userData.totalCount > 0) {
                                            $rootScope.ajaxConfirmPaymentSpinner = false;
                                            //open fraud preventation modal
                                            $scope.openModalForFraudPreventation(confirmDetailsContent.payment_method.id, true);
                                        } else {
                                            // 7. Create a subscription
                                            $rootScope.createSubscription(confirmDetailsContent.payment_method.id, false);
                                        }
                                    } else {
                                        $log.error("No VID found in gigya");
                                        $rootScope.enableErrorAlertMessage('TXT_ISSUE_WITH_API_RESPONSE');
                                        $location.url("/finalCheckout");
                                    }
                                });
                            } else {
                                $log.error("VID is returned as empty/undefined from Vindicia");
                                $rootScope.enableErrorAlertMessage('TXT_ISSUE_WITH_API_RESPONSE');
                                $location.url("/finalCheckout");
                            }
                        } else {
                            // 7. Create a subscription
                            $rootScope.createSubscription(confirmDetailsContent.payment_method.id, false);
                        }
                    } else {
                        GoogleTagManagerService.push({
                            event: 'virtualPageView',
                            virtualUrl: "/signupFailure"
                        });
                        //omniture call
                        analyticsService.TrackCustomPageLoad('signup:failure');
                        $rootScope.ajaxConfirmPaymentSpinner = false;
                        if (confirmDetails.responseStatus == 500 || typeof confirmDetailsContent == "string") {
                            $rootScope.enableErrorAlertMessage((typeof confirmDetailsContent != 'undefined') ? confirmDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG');
                        } else {
                            $rootScope.enableErrorAlertMessage((typeof confirmDetailsContent.status != 'undefined') ? confirmDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                        }
                        $location.url("/finalCheckout");
                    }
                });
            });
        } else {
            $scope.clearSignupCookieDetails();
        }
        $rootScope.createSubscription = function(paymentMethodId, hasUsedFreeTrial) {
            var subData = {
                paymentMethod: paymentMethodId,
                products: JSON.stringify(products),
                hasUsedFreeTrial: hasUsedFreeTrial
            };
            Vindicia.createSubscription(subData).then(function(subscriptionDetails) {
                var subscriptionDetailsContent = subscriptionDetails.responseContent;
                if (subscriptionDetails.responseStatus == 200 || subscriptionDetailsContent.status.http_code == 200) {
                    // Track signup complete
                    GoogleTagManagerService.push({
                        event: 'virtualPageView',
                        virtualUrl: "/signupSuccessful"
                    });
                    //omniture call
                    analyticsService.TrackCustomPageLoad('signup:success');
                    //8. Add the VID to the users Gigya profile if the user used a promo_code and set "has_used_free_trial" to true
                    if (!hasUsedFreeTrial && basicPackEnabledForFreeTrial) {
                        var userData = {
                            UID: userId,
                            vid: vid,
                            type: "setVindiciaId",
                            action: 'setInfo'
                        };
                        Gigya.postHandler(userData).then(function(response) {
                            if (response.errorStatus == 0 && response.statusCode == 200) {
                                $scope.onSignupSuccessTriggerEmailNotificationAndGenerateToken();
                            } else {
                                $log.error("Unable to store VID in gigya");
                            }
                        });
                    } else {
                        $scope.onSignupSuccessTriggerEmailNotificationAndGenerateToken();
                    }
                } else {
                    GoogleTagManagerService.push({
                        event: 'virtualPageView',
                        virtualUrl: "/signupFailure"
                    });
                    //omniture call
                    analyticsService.TrackCustomPageLoad('signup:failure');
                    if (subscriptionDetails.responseStatus == 500 || typeof subscriptionDetailsContent == "string") {
                        $rootScope.enableErrorAlertMessage((typeof subscriptionDetailsContent != 'undefined') ? subscriptionDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG');
                    } else {
                        $rootScope.enableErrorAlertMessage((typeof subscriptionDetailsContent.status != 'undefined') ? subscriptionDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                    }
                    $location.url("/finalCheckout");
                }
            });
        };
    }
]);