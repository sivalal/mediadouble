'use strict';
/*
 * Final checkout page
 */
mdlDirectTvApp.controller('FinalCheckoutCtrl', ['$scope', '$modal', 'AccountService', '$rootScope', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', '$log', 'Gigya',
    function($scope, $modal, AccountService, $rootScope, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, $log, Gigya) {
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
        analyticsService.TrackCustomPageLoad('signup:billing info');
        //hide main menu
        jQuery('#menu').hide();
        if ($rootScope.empty($rootScope.billingAddress)) {
            //check signup route info
            if (typeof $rootScope.signupRouteInfo !== "undefined") {
                if (($rootScope.signupRouteInfo.selectPackage == false) || ($rootScope.signupRouteInfo.createAccount == false)) {
                    $location.url("/selectPackage");
                    return;
                }
            }
        }
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
        //calculate total package amount
        $scope.calculateTotalPackageAmount = function(discountPercentage) {
            var priceAmount;
            if (newPackageList) {
                $scope.grandTotal = $scope.fullTotal = 0;
                for (var i = 0; i < newPackageList.length; i++) {
                    priceAmount = 0;
                    if (!!newPackageList[i] && !!newPackageList[i].packageSelection) {
                        if (!!discountPercentage && newPackageList[i].type == "package") {
                            var discountAmount = parseFloat(newPackageList[i].billing_plan.price_amount) * (parseFloat(discountPercentage) / 100);
                            priceAmount = parseFloat(newPackageList[i].billing_plan.price_amount) - parseFloat(discountAmount);
                        } else {
                            priceAmount = parseFloat(newPackageList[i].billing_plan.price_amount);
                        }
                        $scope.grandTotal += priceAmount;
                    }
                }
            }
            $scope.grandTotal = $scope.grandTotal.toFixed(2);
            return;
        };
        console.log("$rootScope.packageObjList--------------in final checkouit page");
        console.log($rootScope.packageObjList);
        //new package list
        if (!$rootScope.empty($rootScope.packageObjList)) {
            var newPackageList = $filter('filter')($rootScope.packageObjList, {
                newPackageSelection: true
            });
            //get the basic package
            var mainPackageDetails = $filter('filter')($rootScope.packageObjList, {
                type: "package"
            });
            if (!!mainPackageDetails) {
                mainPackageDetails = mainPackageDetails[0];
                $scope.isCouponCode = mainPackageDetails.is_free_trial_enabled;
                if (!!mainPackageDetails.free_days) {
                    //Find 30days date after expiry
                    var date = new Date();
                    var last = new Date(date.getTime() + (mainPackageDetails.free_days * 24 * 60 * 60 * 1000));
                    var day = last.getDate();
                    var month = last.getMonth() + 1;
                    var year = last.getFullYear();
                    if (day <= 9) day = '0' + day;
                    if (month <= 9) month = '0' + month;
                    $scope.expiresDate = month + "/" + day + "/" + year;
                }
            }
            $scope.calculateTotalPackageAmount();
        }
        //get user full details to check whether user already has an account in vindicia
        $scope.getUserFullDetails = function() {
            Authentication.getFullUserRelatedData(Sessions.getCookie('userid')).then(function(userData) {
                $rootScope.userData = userData;
            });
        };
        if ($rootScope.empty($rootScope.userData)) {
            $scope.getUserFullDetails();
        }
        //signup configuration
        $rootScope.$watch("signupConfiguration", function(newValue, oldValue) {
            if (newValue !== 'undefined') {
                if (typeof $rootScope.signupConfiguration != 'undefined') {
                    $scope.signupConfiguration = $rootScope.signupConfiguration;
                    var finalCheckoutDetails = $filter('filter')($rootScope.signupConfiguration.signup_page, {
                        id: 'finalCheckout'
                    });
                    $scope.finalCheckoutDetails = finalCheckoutDetails[0];
                    if (typeof finalCheckoutDetails[0].buttons !== 'undefined') {
                        var paypalButtonConfig = $filter('filter')(finalCheckoutDetails[0].buttons, {
                            id: 'paypal_button'
                        });
                        var creditcardButtonConfig = $filter('filter')(finalCheckoutDetails[0].buttons, {
                            id: 'creditcard_button'
                        });
                        $scope.paypalButtonConfig = paypalButtonConfig[0];
                        $scope.creditcardButtonConfig = creditcardButtonConfig[0];
                        $scope.USDetails = $rootScope.countryList[0];
                        $scope.OTHERDetails = $rootScope.countryList[1];
                        if ($rootScope.empty($rootScope.billingAddress)) {
                            $scope.billing_address = {};
                            $scope.billing_address.country = $scope.USDetails.code;
                        } else {
                            jQuery("#vin_PaymentMethod_billingAddress_district").change();
                            $scope.billing_address = $rootScope.billingAddress;
                        }
                    } else {
                        $log.error("finalCheckoutButton id missing from appgrid signup configuration");
                    }
                }
            }
        });
        $scope.updateCountryTab = function(value) {
            $scope.billing_address.country = value;
            $scope.billing_address.city = null;
        };
        $scope.updatePaymentTab = function(value) {
            $scope.paymentName = value;
        };
        $scope.showCouponCodeContainer = function() {
            $scope.isCouponCode = true;
            $scope.promocodeSubmitted = false;
            $scope.couponCodeContainer = true;
        };
        $scope.addAdditionalPackage = function(packageObj) {
            packageObj.newPackageSelection = packageObj.packageSelection = true;
            newPackageList.push(packageObj);
            //reload grand total
            $scope.calculateTotalPackageAmount();
        };
        $scope.isCheckboxPaymentChange = function(packageObj) {
            packageObj.packageSelection = !packageObj.packageSelection;
            if (packageObj.billing_plan.price_amount) {
                var priceAmount = packageObj.billing_plan.price_amount;
                if (packageObj.packageSelection == false) {
                    $scope.grandTotal = parseFloat($scope.grandTotal) - parseFloat(priceAmount);
                } else {
                    $scope.grandTotal = parseFloat($scope.grandTotal) + parseFloat(priceAmount);
                }
                $scope.grandTotal = $scope.grandTotal.toFixed(2);
            }
            return;
        };
        $scope.finalCheckout = function() {
            if ($scope.billingForm.$valid) {} else {
                $scope.submitted = true;
            }
        };
        //activate button on click of terms and condition
        $scope.tcCreditcardCheck = false;
        $scope.tcPaypalcheck = false;
        $scope.isCheckboxChange = function() {
            $scope.tcPaypalcheck = $scope.tcPaypalcheck !== true;
        };
        Number.prototype.countDecimals = function() {
            if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
            return this.toString().split(".")[1].length || 0;
        }
        var getDiscountAmountAfterApplyingPromocode = function(actualAmount, percentageDiscount) {
            var total = parseFloat(actualAmount) * (parseFloat(percentageDiscount) / 100);
            var decimalCount = total.countDecimals();
            // total = (decimalCount > 1) ? total.toFixed(3) : total.toFixed(2);
            total = total.toFixed(2);
            return total;
        }
        $scope.openSessionExpiryDialog = function() {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/sessionExpiryDialog.html',
                controller: CommonModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    name: $scope.name
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        $scope.applyPromocode = function() {
            $scope.showDiscountPercentage = $scope.promocodeSubmitted = $scope.promocodeErrorContainer = false;
            $scope.promoCodeForm.promocode.$setValidity('promocode', true);
            if ($scope.promoCodeForm.$valid) {
                $scope.showValidationSpinner = true;
                $scope.isCouponCode = true;
                $scope.couponCodeContainer = false;
                Vindicia.validatePromocode($scope.promocode).then(function(promocodeResponse) {
                    var promocodeResponseContent = promocodeResponse.responseContent;
                    if (promocodeResponse.responseStatus == 403 || promocodeResponse.responseStatus == 401) {
                        $scope.showValidationSpinner = false;
                        $scope.openSessionExpiryDialog();
                    } else if (promocodeResponse.responseStatus == 200) {
                        if (promocodeResponseContent.status.http_code == 200) {
                            $scope.showDiscountPercentage = true;
                            $scope.discountPercentage = !!promocodeResponseContent.campaign.percentage_discount ? promocodeResponseContent.campaign.percentage_discount : 0;
                            $scope.discountPercentageText = !!promocodeResponseContent.campaign.percentage_discount ? promocodeResponseContent.campaign.percentage_discount + '% DISCOUNT' : '0% DISCOUNT';
                            if ($scope.discountPercentage !== 0) $scope.calculateTotalPackageAmount($scope.discountPercentage);
                            $scope.showValidationSpinner = false;
                            $scope.isCouponCode = true;
                            $scope.couponCodeContainer = false;
                            $rootScope.enableSucessAlertMessage('TXT_SUCCESS_BILLING_PROMOCODE_NOTIFICATION');
                        } else {
                            $scope.promocode = '';
                            $scope.showValidationSpinner = $scope.isCouponCode = false;
                            $scope.couponCodeContainer = true;
                            $scope.promoCodeForm.promocode.$setValidity('promocode', false);
                        }
                    } else {
                        $scope.promocode = '';
                        $scope.showValidationSpinner = $scope.isCouponCode = false;
                        $scope.couponCodeContainer = true;
                        $scope.promocodeErrorContainer = true;
                        if (typeof promocodeResponseContent == "string") {
                            $scope.promocodeErrorMessage = (typeof promocodeResponseContent != 'undefined') ? promocodeResponse.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                        } else {
                            $scope.promocodeErrorMessage = (typeof promocodeResponseContent.status != 'undefined') ? promocodeResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                        }
                        $scope.promoCodeForm.promocode.$setValidity('promocode', false);
                    }
                });
            } else {
                $scope.promocodeSubmitted = true;
            }
        };
        $scope.deleteAppliedPromocode = function() {
            $scope.promocode = '';
            $scope.showDiscountPercentage = false;
            $scope.discountPercentage = 0;
            $scope.grandTotal = grandTotal;
        };
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
        $scope.resetZipCode = function() {
            $scope.vin_PaymentMethod_billingAddress_postalCode = null;
        };
        $scope.paymentCreditCardMethod = function() {
            if ($scope.billingForm.$valid) {
                $scope.paymentBillingSubmitForm();
            } else {
                $scope.submitted = true;
            }
        };
        $scope.paymentPaypalMethod = function() {
            if ($scope.billingForm.vin_PaymentMethod_billingAddress_addr1.$valid && $scope.billingForm.vin_PaymentMethod_billingAddress_addr2.$valid && $scope.billingForm.vin_PaymentMethod_billingAddress_country.$valid && $scope.billingForm.vin_PaymentMethod_billingAddress_postalCode.$valid && $scope.billingForm.tcPaypalcheck.$valid) {
                if ($scope.billing_address.country == $scope.USDetails.code) {
                    if ($scope.billingForm.vin_PaymentMethod_billingAddress_city.$valid && $scope.billingForm.vin_PaymentMethod_billingAddress_district.$valid) {
                        $scope.paymentBillingSubmitForm();
                    } else {
                        $scope.submitted = true;
                    }
                } else {
                    $scope.paymentBillingSubmitForm();
                }
            } else {
                $scope.submitted = true;
            }
        };
        $scope.paymentBillingSubmitForm = function() {
            $scope.submitted = false;
            //analytics for payment type
            analyticsService.TrackCustomPageLoad("signup:" + $scope.paymentName);
            analyticsService.TrackCustomPageLoad("signup:terms");
            $scope.ajaxPaymentFormSpinner = true;
            if (!!$rootScope.userData && (!!$rootScope.userData.data.isAccountCreatedInVindicia || Sessions.getCookie('isAccountCreatedInVindicia'))) {
                // 2. Create payment method
                $scope.createPaymentMethod();
            } else {
                // 1. Create account in Vindicia
                var accountData = {
                    email: $rootScope.emailId,
                    billingAddress: $scope.billing_address,
                    name: $rootScope.firstName + ' ' + $rootScope.lastName
                };
                Vindicia.createAccount(accountData).then(function(accountDetails) {
                    var accountDetailsContent = accountDetails.responseContent;
                    if (accountDetails.responseStatus == 403 || accountDetails.responseStatus == 401) {
                        $scope.ajaxPaymentFormSpinner = false;
                        $scope.openSessionExpiryDialog();
                    } else if (accountDetails.responseStatus == 200 && accountDetailsContent.status.http_code == 200) {
                        // If account is successfully created then store custom value in cookie and gigya
                        var userData = {
                            UID: Sessions.getCookie('userid'),
                            type: "setAccountInVindicia",
                            isAccountCreatedInVindicia: true,
                            action: 'setInfo'
                        };
                        Gigya.postHandler(userData).then(function(response) {});
                        Sessions.setCookie('isAccountCreatedInVindicia', true, Sessions.setExpiryForCookie());
                        // 2. Create payment method
                        $scope.createPaymentMethod();
                    } else {
                        $scope.ajaxPaymentFormSpinner = false;
                        if (accountDetails.responseStatus == 500 || typeof accountDetailsContent == "string") {
                            $rootScope.enableErrorAlertMessage((typeof accountDetailsContent != 'undefined') ? accountDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG');
                        } else {
                            //fallback for old users
                            var errorCode = accountDetailsContent.status.code.toString();
                            if (errorCode == "OTT10002") {
                                // 2. Create payment method
                                $scope.createPaymentMethod();
                            } else {
                                $rootScope.enableErrorAlertMessage((typeof accountDetailsContent.status != 'undefined') ? errorCode : 'TRANSACTION_FAILED_MSG');
                            }
                        }
                    }
                });
            }
        };
        $scope.createPaymentMethod = function() {
            var transData = {
                paymentMethodType: $scope.paymentName,
                billingAddress: $scope.billing_address,
                successUrl: "signupSuccess",
                failureUrl: "signupError",
                name: $rootScope.firstName + ' ' + $rootScope.lastName
            };
            Vindicia.createPaymentMethod(transData).then(function(paymentMethodDetails) {
                var paymentMethodDetailsContent = paymentMethodDetails.responseContent;
                if (paymentMethodDetails.responseStatus == 403 || paymentMethodDetails.responseStatus == 401) {
                    $scope.ajaxPaymentFormSpinner = false;
                    $scope.openSessionExpiryDialog();
                } else if (paymentMethodDetails.responseStatus == 200 && paymentMethodDetailsContent.status.http_code == 200) {
                    if (paymentMethodDetailsContent.form_submit_url != null) {
                        // Store payment_method_id/package list/billing address
                        Sessions.setCookie('auth_id', paymentMethodDetailsContent.auth_id, Sessions.setExpiryForCookie());
                        // Sessions.setCookie('package_list_'+$rootScope.userid, JSON.stringify(newPackageList), Sessions.setExpiryForCookie());
                        localStorage.setItem('package_list_' + $rootScope.userid, JSON.stringify(newPackageList));
                        Sessions.setCookie('billing_address_' + $rootScope.userid, JSON.stringify($scope.billing_address), Sessions.setExpiryForCookie());
                        if (!!$scope.promocode) Sessions.setCookie('promocode_' + $rootScope.userid, $scope.promocode, Sessions.setExpiryForCookie());
                        if ($scope.paymentName == 'CreditCard') {
                            $scope.vin_WebSession_vid = paymentMethodDetailsContent.auth_id;
                            jQuery('#billingForm').attr('action', paymentMethodDetailsContent.form_submit_url);
                            jQuery('#vin_WebSession_vid').val(paymentMethodDetailsContent.auth_id);
                            jQuery("#billingForm").submit();
                        } else if ($scope.paymentName == 'PayPal') {
                            window.location.replace(paymentMethodDetailsContent.form_submit_url);
                        }
                    } else {
                        $rootScope.enableErrorAlertMessage('TRANSACTION_WITH_EMPTY_URL');
                    }
                } else {
                    $scope.ajaxPaymentFormSpinner = false;
                    if (paymentMethodDetails.responseStatus == 500 || typeof paymentMethodDetailsContent == "string") {
                        $rootScope.enableErrorAlertMessage((typeof paymentMethodDetailsContent != 'undefined') ? paymentMethodDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG');
                    } else {
                        $rootScope.enableErrorAlertMessage((typeof paymentMethodDetailsContent.status != 'undefined') ? paymentMethodDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                    }
                }
            });
        };
    }
]);