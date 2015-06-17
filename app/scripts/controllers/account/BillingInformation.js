'use strict';
/*
 * Account Information Controller
 */
mdlDirectTvApp.controller('billingInformationCtrl', ['$scope', '$parse', '$modal', 'dateFilter', '$http', 'AccountService', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', 'Gigya',
    function($scope, $parse, $modal, dateFilter, $http, AccountService, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, Gigya) {
        $scope.tcCreditcardCheck = false;
        $scope.tcPaypalcheck = false;
        $scope.updateCountryTab = function(value) {
            $scope.paymentMethods.billing_address = $scope.paymentMethods.billing_address || {};
            $scope.paymentMethods.billing_address.country = value;
        };
        $scope.resetZipCode = function() {
            $scope.paymentMethods.billing_address = $scope.paymentMethods.billing_address || {};
            $scope.paymentMethods.billing_address.postal_code_string = null;
        };
        //display modal while switching payment
        $scope.MessageModal = function(lang) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/modal/edit_payment_information_dailog.html',
                controller: commonModalCtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            var modalInstance = $modal.open($scope.opts);
        };
        $scope.updatePaymentTab = function(value) {
            $scope.paymentName = value;
        };
        //signup configuration
        $rootScope.$watch("countryList", function(newValue, oldValue) {
            if (!!newValue) {
                $scope.USDetails = newValue[0];
                $scope.OTHERDetails = newValue[1];
            }
        });
        $scope.displayBillingDetails = true;
        $scope.displayPaymentDetails = true;
        //get user subscription detailss
        $rootScope.$watch("getUserPackageDetailsByPurchaseResp", function(newVal) {
            if (!!newVal) {
                $scope.userSubscriptionDetails = $rootScope.getUserPackageDetailsByPurchaseResp;
                $scope.paymentMethods = $scope.userSubscriptionDetails.paymentMethods;
                $scope.paymentName = $scope.paymentMethods.type;
                console.log("$scope.userSubscriptionDetails-------------");
                console.log($scope.userSubscriptionDetails);
                // Default to US if paypal
                if ($scope.paymentName === "paypal") {
                    $scope.updateCountryTab("US");
                }
            }
        });
        /////
        //zip code pattern validation based on selected district
        $scope.regExp = "^\d{5}(-\d{4})?$";
        $scope.validateZipCodePattern = function(selectedDistrict, countryCode) {
            if (!!$scope.USDetails && countryCode == $scope.USDetails.code) {
                var state = $filter('filter')($scope.USDetails.states, {
                    code: selectedDistrict
                });
                if (!!state[0].regular_expression) {
                    $scope.regExp = state[0].regular_expression;
                }
            }
            $scope.regExp = new RegExp($scope.regExp);
            return $scope.regExp;
        };
        /////
        //set default select box color
        jQuery("#vin_PaymentMethod_billingAddress_district").change(function() {
            if (jQuery(this).val() == "") jQuery(this).addClass("empty");
            else jQuery(this).removeClass("empty")
        });
        jQuery("#vin_PaymentMethod_billingAddress_district").change();
        jQuery("#vin_PaymentMethod_creditCard_expirationDate_Month").change(function() {
            if (jQuery(this).val() == "") jQuery(this).addClass("empty");
            else jQuery(this).removeClass("empty")
        });
        jQuery("#vin_PaymentMethod_creditCard_expirationDate_Month").change();
        jQuery("#vin_PaymentMethod_creditCard_expirationDate_Year").change(function() {
            if (jQuery(this).val() == "") jQuery(this).addClass("empty");
            else jQuery(this).removeClass("empty")
        });
        jQuery("#vin_PaymentMethod_creditCard_expirationDate_Year").change();
        $scope.editUserBillingInfo = function() {
            $scope.originalPaymentData = angular.copy($scope.paymentMethods);
            $scope.displayBillingDetails = false;
        };
        $scope.cancelUserBillingInfo = function() {
            angular.copy($scope.originalPaymentData, $scope.paymentMethods);
            $scope.displayBillingDetails = true;
        };
        $scope.saveUserBillingInfo = function() {
            $scope.ajaxBillingInfoSpinner = true;
            var paymentMethods = {
                "account": {
                    "payment_methods": [
                        $scope.paymentMethods
                    ]
                }
            };
            var paymentMethodDetails = {
                paymentMethod: JSON.stringify(paymentMethods)
            };
            Vindicia.updateAccount(paymentMethodDetails).then(function(updateAccountDetails) {
                $scope.ajaxBillingInfoSpinner = false;
                var updateAccountDetailsContent = updateAccountDetails.responseContent;
                if (updateAccountDetails.responseStatus == 200) {
                    if (updateAccountDetailsContent.status.code == 0) {
                        $rootScope.enableSucessAlertMessage("TXT_BILLING_INFORMATION_SUCCESS_UPDATE");
                        $scope.displayBillingDetails = true;
                    } else {
                        $rootScope.enableErrorAlertMessage((typeof updateAccountDetailsContent.status != 'undefined') ? updateAccountDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                    }
                } else {
                    if (typeof updateAccountDetailsContent == "string") {
                        $rootScope.enableErrorAlertMessage((typeof updateAccountDetailsContent != 'undefined') ? updateAccountDetailsContent : 'TRANSACTION_FAILED_MSG');
                    } else {
                        $rootScope.enableErrorAlertMessage((typeof updateAccountDetailsContent.status != 'undefined') ? updateAccountDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                    }
                }
            });
        };
        $scope.editUserPaymentInfo = function() {
            $scope.originalPaymentData = angular.copy($scope.paymentMethods);
            $scope.displayPaymentDetails = false;
            $scope.displayBillingDetails = false;
        };
        $scope.cancelUserPaymentInfo = function() {
            angular.copy($scope.originalPaymentData, $scope.paymentMethods);
            $scope.paymentName = $rootScope.getUserPackageDetailsByPurchaseResp.paymentMethods.type;
            $scope.displayPaymentDetails = true;
            $scope.displayBillingDetails = true;
        };
        $scope.paymentCreditCardMethod = function() {
            if ($scope.billingForm.$valid) {
                $scope.paymentBillingSubmitForm("CreditCard");
            } else {
                $scope.submitted = true;
            }
        };
        $scope.paymentPaypalMethod = function() {
            if ($scope.billingForm.vin_PaymentMethod_billingAddress_addr1.$valid && $scope.billingForm.vin_PaymentMethod_billingAddress_addr2.$valid && $scope.billingForm.vin_PaymentMethod_billingAddress_country.$valid && $scope.billingForm.vin_PaymentMethod_billingAddress_postalCode.$valid) {
                if ($scope.paymentMethods.billing_address.country == $scope.USDetails.code) {
                    if ($scope.billingForm.vin_PaymentMethod_billingAddress_city.$valid && $scope.billingForm.vin_PaymentMethod_billingAddress_district.$valid) {
                        $scope.paymentBillingSubmitForm("PayPal");
                    } else {
                        $scope.submitted = true;
                    }
                } else {
                    $scope.paymentBillingSubmitForm("PayPal");
                }
            } else {
                $scope.submitted = true;
            }
        };
        //trigger payment update method api
        $scope.paymentBillingSubmitForm = function(paymentName) {
            $scope.submitted = false;
            $scope.editBillingInformationSpinner = true;
            var transData = {
                paymentMethodType: paymentName,
                billingAddress: $scope.paymentMethods.billing_address,
                successUrl: "updatePaymentSuccess",
                failureUrl: "updatePaymentError",
                name: $rootScope.firstName + ' ' + $rootScope.lastName
            };
            Vindicia.createPaymentMethod(transData).then(function(paymentMethodDetails) {
                var paymentMethodDetailsContent = paymentMethodDetails.responseContent;
                if (paymentMethodDetails.responseStatus == 200 && paymentMethodDetailsContent.status.http_code == 200) {
                    if (paymentMethodDetailsContent.form_submit_url != null) {
                        // Store payment_method_id/package list/billing address
                        Sessions.setCookie('auth_id', paymentMethodDetailsContent.auth_id, Sessions.setExpiryForCookie());
                        Sessions.setCookie('billing_address_' + $rootScope.userid, JSON.stringify($scope.paymentMethods.billing_address), Sessions.setExpiryForCookie());
                        Sessions.setCookie('subscription_id_' + $rootScope.userid, $scope.userSubscriptionDetails.subscription_id, Sessions.setExpiryForCookie());
                        if (paymentName == 'CreditCard') {
                            $scope.vin_WebSession_vid = paymentMethodDetailsContent.auth_id;
                            jQuery('#billingForm').attr('action', paymentMethodDetailsContent.form_submit_url);
                            jQuery('#vin_WebSession_vid').val(paymentMethodDetailsContent.auth_id);
                            jQuery("#billingForm").submit();
                        } else if (paymentName == 'PayPal') {
                            window.location.replace(paymentMethodDetailsContent.form_submit_url);
                        }
                    } else {
                        $rootScope.enableErrorAlertMessage('TRANSACTION_WITH_EMPTY_URL');
                    }
                } else {
                    $scope.editBillingInformationSpinner = false;
                    if (paymentMethodDetails.responseStatus == 500 || typeof paymentMethodDetailsContent == "string") {
                        $rootScope.enableErrorAlertMessage((typeof paymentMethodDetailsContent != 'undefined') ? paymentMethodDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG');
                    } else {
                        $rootScope.enableErrorAlertMessage((typeof paymentMethodDetailsContent.status != 'undefined') ? paymentMethodDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                    }
                }
            });
        };
        /////
    }
]);