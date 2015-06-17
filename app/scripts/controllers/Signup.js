'use strict';
/* Signup Controller */
//Instance controller for Sign Up Modal
var SignUpModalICtrl = ['$scope', '$modalInstance', '$filter', '$modal', 'item', '$rootScope', '$location', '$route', '$window', 'Sessions', 'Authentication', function($scope, $modalInstance, $filter, $modal, item, $rootScope, $location, $route, $window, Sessions, Authentication) {
    $rootScope.ModalOpenInProgress = false;
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $window.location.href = '/';
    };
    $scope.cancelWithUrlParams = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelAll = function() {
        $location.url($location.path());
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelAllAndClearCookie = function() {
        Sessions.setCookie('userid', '', -1);
        Sessions.setCookie('accessToken', '', -1);
        $location.url($location.path());
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelWithClearUrl = function() {
        $location.path('/').search('');
        $modalInstance.dismiss('cancel');
    };
    $scope.activeUserLoginModal = function() {
        $modalInstance.dismiss('cancel');
        $rootScope.loginModal(1);
    };
    $scope.signupModal = function() {
        $modalInstance.dismiss('cancel');
        $rootScope.isPrevSubscriber = true;
        Authentication.GetUserAccountTokenWithoutTokenGeneration();
        $rootScope.signupModal(1);
    };
    $scope.mobileLoginConfirm = function($msg) {
        var appmsg = $filter('translate')($msg);
        var retVal = confirm(appmsg);
        if (isMobile.Android) {
            if (retVal == true) {
                $window.location.href = $rootScope.androidLink[$rootScope.CurrentLang];
            } else {
                $scope.cancel();
            }
        } else if (isMobile.iOS) {
            if (retVal == true) {
                $window.location.href = $rootScope.iosLink[$rootScope.CurrentLang];
            } else {
                $scope.cancel();
            }
        }
    };
    $scope.handleStripe = function(status, response) {
        if (response.error) {
            // there was an error. Fix it.
        } else {
            // got stripe token, now charge it or smt
            var token;
            token = response.id
        }
    }
}];
// Used to cache user state
var USER;
//controller for the content inside model template of sign up
mdlDirectTvApp.controller('SignUpCtrl', ['$scope', '$modal', 'dateFilter', '$http', 'AccountService', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', 'GoogleTagManagerService',
    function($scope, $modal, dateFilter, $http, AccountService, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, GoogleTagManagerService) {
        //set expiration cookie value
        var cookieExpiration = Sessions.setExpiryForCookie();
        //review transaction with the session id from vindicia
        var reviewTransaction = function() {
            var subscriptionType;
            var sessionId = $scope.getParameterByName('session_id');
            $scope.ajaxReviewSpinner = true;
            $scope.sessionId = sessionId;
            var transData = {
                sessionId: sessionId,
                type: (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid'))) ? "updateSubscriptionPayment" : "subscribe"
            };
            Vindicia.reviewTransaction(transData).then(function(transReviewDetails) {
                $scope.ajaxReviewSpinner = false;
                var transReviewDetailsContent = transReviewDetails.responseContent;
                if (transReviewDetails.responseStatus == 200) {
                    if (transReviewDetailsContent.status.http_code == 200) {
                        if (transReviewDetailsContent.transaction.session.confirmation_code == 200) {
                            $rootScope.reviewDetails = transReviewDetailsContent;
                            if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                                signupNext(6, 8);
                            } else {
                                signupNext(5, 8);
                            }
                        } else {
                            if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                                signupNext(8, 8);
                            } else {
                                $location.url($location.path());
                                $rootScope.transactionError = true;
                                $rootScope.transactionErrorMessage = transReviewDetailsContent.transaction.session.confirmation_message;
                                signupNext(3, 8);
                            }
                        }
                    } else {
                        if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                            signupNext(8, 8);
                        } else {
                            $location.url($location.path());
                            $rootScope.transactionError = true;
                            $rootScope.transactionErrorMessage = (typeof transReviewDetailsContent.status != 'undefined') ? transReviewDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                            signupNext(3, 8);
                        }
                    }
                } else if (transReviewDetails.responseStatus != 500) {
                    $scope.transactionError = true;
                    $scope.transactionErrorMessage = transReviewDetails.responseStatus.toString();
                } else {
                    if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                        signupNext(8, 8);
                    } else {
                        $location.url($location.path());
                        $rootScope.transactionError = true;
                        if (typeof transReviewDetailsContent == "string") {
                            $scope.transactionErrorMessage = (typeof transReviewDetailsContent != 'undefined') ? transReviewDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                        } else {
                            $scope.transactionErrorMessage = (typeof transReviewDetailsContent.status != 'undefined') ? transReviewDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                        }
                        signupNext(3, 8);
                    }
                }
            });
        };
        var trackConversion = function() {
            GoogleTagManagerService.push({
                event: 'virtualPageView',
                virtualUrl: "/signup/checkoutcomplete"
            });
        };
        //sign up next button scope
        var signupNext = function(current_index, max_index) {
            for (var i = 1; i <= max_index; i++) {
                $scope['signup_page_' + i] = current_index == i;
            }
            if ($scope['signup_page_1'] == true) {
                analyticsService.TrackCustomPageLoad('signup:select package');
                GoogleTagManagerService.push({
                    event: 'virtualPageView',
                    virtualUrl: "/signup/selectpackage"
                });
            } else if ($scope['signup_page_2'] == true) {
                analyticsService.TrackCustomPageLoad('signup:user info');
                GoogleTagManagerService.push({
                    event: 'virtualPageView',
                    virtualUrl: "/signup/userinfo"
                });
            } else if ($scope['signup_page_3'] == true) {
                analyticsService.TrackCustomPageLoad('signup:billing info');
                GoogleTagManagerService.push({
                    event: 'virtualPageView',
                    virtualUrl: "/signup/billinginfo"
                });
                if (!$rootScope.empty(Sessions.getCookie('subscriptionPriceAmount'))) {
                    $scope.priceAmount = Sessions.getCookie('subscriptionPriceAmount');
                } else if ($rootScope.packageList && $rootScope.packageList.length > 0) {
                    var packageArray = $filter('filter')($rootScope.packageList, {
                        id: Sessions.getCookie('signupPackageId')
                    });
                    $rootScope.nextBillingAmountForSelectedPackage = $rootScope.billingAmountBasedOnFreePlanFilter(packageArray[0], false);
                    $scope.priceAmount = $rootScope.nextBillingAmountForSelectedPackage.price_amount;
                    Sessions.setCookie('subscriptionPriceAmount', $scope.priceAmount, Sessions.setExpiryForCookie());
                }
            } else if ($scope['signup_page_4'] == true) {
                Authentication.GetUserAccountTokenWithoutTokenGeneration();
                reviewTransaction();
                GoogleTagManagerService.push({
                    event: 'virtualPageView',
                    virtualUrl: "/signup/review"
                });
            } else if ($scope['signup_page_5'] == true) {
                Authentication.GetUserAccountTokenWithoutTokenGeneration();
                analyticsService.TrackCustomPageLoad('signup:checkout');
                GoogleTagManagerService.push({
                    event: 'virtualPageView',
                    virtualUrl: "/signup/checkout"
                });
                $scope.sessionId = $scope.getParameterByName('session_id');
                $scope.vindiciaVid = $scope.getParameterByName('vindicia_vid');
                $scope.priceAmount = Sessions.getCookie('subscriptionPriceAmount');
            } else if ($scope['signup_page_6'] == true) {
                Authentication.GetUserAccountTokenWithoutTokenGeneration();
                analyticsService.TrackCustomPageLoad('signup:checkout');
                GoogleTagManagerService.push({
                    event: 'virtualPageView',
                    virtualUrl: "/signup/checkout"
                });
                $scope.sessionId = $scope.getParameterByName('session_id');
                $scope.vindiciaVid = $scope.getParameterByName('vindicia_vid');
                $scope.priceAmount = Sessions.getCookie('subscriptionPriceAmount');
            }
        };
        //Onload set scope default values for content display 
        signupNext($rootScope.initialIndex, 8);
        //sign up back button scope
        $scope.signupBack = function(current_index, max_index) {
            for (var i = 1; i <= max_index; i++) {
                $scope['signup_page_' + i] = current_index == i;
            }
        };
        ////////////////PLACEHOLDER FOR SELECT FOR COUNTRY, DISTRICT, MONTH, YEAR/////////////////////////////////
        jQuery("#billingAddress_country").change(function() {
            if (jQuery(this).val() == "") jQuery(this).addClass("empty");
            else jQuery(this).removeClass("empty")
        });
        jQuery("#billingAddress_country").change();
        jQuery("#billingAddress_district").change(function() {
            if (jQuery(this).val() == "") jQuery(this).addClass("empty");
            else jQuery(this).removeClass("empty")
        });
        jQuery("#billingAddress_district").change();
        ////////////////PLACEHOLDER FOR SELECT/////////////////////////////////
        $rootScope.$watch("socializeScriptReceived", function(newValue, oldValue) {
            var currentLang = $rootScope.CurrentLang;
            //spread the world page
            if (typeof newValue !== 'undefined') {
                $rootScope.$watch("logoweb", function(newLogo, oldLogo) {
                    if (typeof newLogo !== 'undefined') {
                        SocialService.getShareButtons(configuration.server_url, $rootScope.appInfo.title, $rootScope.appInfo.description, "SAP", "dummy/icon/fb_share.png", "dummy/icon/twitter_share.png", newLogo, $rootScope.enableTwitterSharing, $rootScope.enableFacebookSharing);
                    }
                });
            }
        });
        //get progress bar---------------------------------------
        $scope.getCoveredPagePercentage = function() {
            if ($scope.signup_page_1) return 25 + '%';
            if ($scope.signup_page_2) return 50 + '%';
            if ($scope.signup_page_3) return 75 + '%';
            if ($scope.signup_page_5) return 100 + '%';
            if ($scope.signup_page_6) return 100 + '%';
            if ($scope.signup_page_7) jQuery('#listProgressbarContainer').hide();
            if ($scope.signup_page_8) jQuery('#listProgressbarContainer').hide();
        };
        ///////////////////////package button color////////////////////////////////////
        $scope.packButtonHover = function(packageId, colorCode) {
            jQuery('#package-button-' + packageId).css('background-color', colorCode);
            jQuery('#package-button-' + packageId).css('color', 'white');
        }
        $scope.packButtonLeave = function(packageId, colorCode) {
                jQuery('#package-button-' + packageId).css('background-color', '');
                jQuery('#package-button-' + packageId).css('color', colorCode);
            }
            ///////////////////////package button color////////////////////////////////////
            ////////////////////////ALERT MSG ONCLOSE EVENTS STARTS////////////////////////////////////////
        $scope.closeRegistrationErrorAlert = function() {
            $scope.registrationError = false;
        };
        $scope.closeSocialRegistrationErrorAlert = function() {
            $scope.socialRegistrationError = false;
        };
        $scope.closeReviewTransactionErrorAlert = function() {
            $scope.transactionError = false;
        };
        $scope.closePromocodeErrorAlert = function() {
            $scope.invalidPromocodeImg = false;
        };
        $scope.closeSubscriptionErrorAlert = function() {
            $scope.subscriptionError = false;
        };
        $scope.closeUsernameExistErrorAlert = function() {
            $scope.usernameExist = false;
        };
        $scope.closeReviewTransactionErrorOnPage1Alert = function() {
            $scope.transactionErrorDisplayOnPage1 = false;
        };
        $scope.closeEmailExist = function() {
            $scope.emailExist = false;
        };
        $scope.closeUsernameExist = function() {
            $scope.usernameExist = false;
        };
        $scope.closeInitTransactionErrorAlert = function() {
            $scope.initTransError = false;
        };
        $scope.closeSubscribedErrorMsgAlert = function() {
            $scope.subscribedError = false;
        };
        $scope.closeSubscribedSucessMsgAlert = function() {
            $scope.subscribedSuccess = false;
        };
        $scope.closeSubscribedSucessMsgAlert = function() {
            $scope.subscribedSuccess = false;
        };
        $scope.closeProviderExist = function() {
            $scope.providerExist = false;
        };
        ////////////////////////ALERT MSG ONCLOSE EVENTS ENDS///////////////////////////////////////////////////////////////////
        //////////////////////////////////VALIDATION STARTS//////////////////////////////////////////////////////////////
        $scope.checkCreditcardType = function(type) {
            if ((type != 'mastercard') && (type != 'visa') && (type != 'amex') && (type != 'discover')) {
                $scope.transactionError = true;
                $scope.transactionErrorMessage = 'TXT_CC_NOT_VALID_TYPE';
            } else {
                $scope.transactionError = false;
            }
        };
        //validation for email
        $scope.checkEmailExist = function(email) {
            $scope.registrationError = false;
            $scope.usernameExist = false;
            $scope.emailExist = false;
            $scope.$watch('uEmail', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.emailExist = false;
                    $scope.signupForm.uEmail.$setValidity('email', true);
                }
            });
            if ($scope.signupForm.uEmail.$valid) {
                $scope.emailCheckSpinner = true;
                var userData = {
                    action: 'emailExist',
                    email: email
                };
                $http({
                    method: 'POST',
                    url: configuration.server_url + '/gigya/post_handler',
                    data: userData,
                    dataType: 'json'
                }).then(function(response) {
                    $scope.emailCheckSpinner = false;
                    response = response.data;
                    if (response.errorStatus == 0 && response.statusCode == 200) {
                        if (!response.isAvailable) {
                            if (isMobile.any()) {
                                var appmsg = $filter('translate')('TEXT_OPEN_UP_APP_ACCOUNT_EXIST');
                                var retVal = confirm(appmsg);
                                if (checker.android) {
                                    if (retVal == true) {
                                        $scope.cancelWithUrlParams();
                                        $window.location.href = $rootScope.androidLink[$rootScope.CurrentLang];
                                    }
                                } else if (checker.iphone) {
                                    if (retVal == true) {
                                        $scope.cancelWithUrlParams();
                                        $window.location.href = $rootScope.iosLink[$rootScope.CurrentLang];
                                    }
                                }
                            } else {
                                $scope.emailExist = true;
                            }
                            $scope.signupForm.uEmail.$setValidity('email', false);
                        } else {
                            $scope.emailExist = false;
                            $scope.signupForm.uEmail.$setValidity('email', true);
                        }
                    } else {
                        $scope.registrationError = true;
                        $scope.registrationErrorMessage = response.errorCode ? response.errorCode.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                }, function(response) { // optional
                    // failed
                    console.log('email check failed---------------');
                });
            }
        };
        //validation for username
        $scope.checkUsername = function(username) {
            $scope.registrationError = false;
            $scope.usernameExist = false;
            $scope.emailExist = false;
            $scope.$watch('uName', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.usernameExist = false;
                    $scope.signupForm.uName.$setValidity('username', true);
                }
            });
            if ($scope.signupForm.uName.$valid) {
                $scope.usernameCheckSpinner = true;
                var userData = {
                    action: 'emailExist',
                    email: username
                };
                $http({
                    method: 'POST',
                    url: configuration.server_url + '/gigya/post_handler',
                    data: userData,
                    dataType: 'json'
                }).then(function(response) {
                    $scope.usernameCheckSpinner = false;
                    response = response.data;
                    if (response.errorStatus == 0 && response.statusCode == 200) {
                        if (!response.isAvailable) {
                            if (isMobile.any()) {
                                var appmsg = $filter('translate')('TEXT_OPEN_UP_APP_ACCOUNT_EXIST');
                                var retVal = confirm(appmsg);
                                if (checker.android) {
                                    if (retVal == true) {
                                        $scope.cancelWithUrlParams();
                                        $window.location.href = $rootScope.androidLink[$rootScope.CurrentLang];
                                    }
                                } else if (checker.iphone) {
                                    if (retVal == true) {
                                        $scope.cancelWithUrlParams();
                                        $window.location.href = $rootScope.iosLink[$rootScope.CurrentLang];
                                    }
                                }
                            } else {
                                $scope.usernameExist = true;
                            }
                            $scope.signupForm.uName.$setValidity('username', false);
                        } else {
                            $scope.usernameExist = false;
                            $scope.signupForm.uName.$setValidity('username', true);
                        }
                    } else {
                        $scope.registrationError = true;
                        $scope.registrationErrorMessage = response.errorCode ? response.errorCode.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                }, function(response) { // optional
                    // failed
                    console.log('username check failed---------------');
                });
            }
        };
        //activate button on click of terms and condition
        $scope.tccheck = false;
        $scope.isCheckboxChange = function() {
            $scope.tccheck = $scope.tccheck !== true;
        };
        //////////////////////////////////VALIDATION ENDS///////////////////////////////////////////////////////
        //get selected country related states
        $scope.getStates = function() {
            $scope.vin_PaymentMethod_billingAddress_postalCode = null;
            $scope.stateList = $rootScope.countryList[$scope.billingAddress_country].states;
        };
        $scope.packageSelected = function(packageItem) {
            $rootScope.nextBillingAmountForSelectedPackage = $rootScope.billingAmountBasedOnFreePlanFilter(packageItem, false);
            $scope.priceAmount = $rootScope.nextBillingAmountForSelectedPackage.price_amount;
            $rootScope.signupPackageId = packageItem.id;
            Sessions.setCookie('signupPackageId', packageItem.id, Sessions.setExpiryForCookie());
            if ($rootScope.userid && $rootScope.isPrevSubscriber) {
                signupNext(3, 8);
            } else {
                signupNext(2, 8);
            }
        };
        //////////////////////////////////////////NATIVE REGISTRATION STARTS//////////////////////////////////
        $scope.registrationProcessFunction = function() {
            var errorMsg;
            $scope.registrationError = false;
            $scope.usernameExist = false;
            $scope.emailExist = false;
            if ($scope.signupForm.$valid) {
                $scope.ajaxRegisterFormSpinner = true;
                var formData = {
                    email: $scope.uEmail,
                    password: $scope.uPassword,
                    username: $scope.uName,
                    newsletterKey: $rootScope.gigyaParamList.newsletter_key,
                    newsletterValue: $rootScope.gigyaParamList.newsletter_subscribed,
                    action: 'nativeRegister'
                };
                $http({
                    method: 'POST',
                    url: configuration.server_url + '/gigya/post_handler',
                    data: formData,
                    async: false,
                    dataType: 'json'
                }).then(function(USER) {
                    USER = USER.data;
                    if (USER.errorStatus == 0 && USER.statusCode == 200) {
                        //get Account token
                        Authentication.getAccountToken(USER).then(function(tokenResponse) {
                            $scope.ajaxRegisterFormSpinner = false;
                            if (tokenResponse.success) {
                                var cookieExpiration = Sessions.setExpiryForCookie();
                                Sessions.setCookie('userid', USER.UID, cookieExpiration);
                                Sessions.setCookie('emailId', USER.profile.email, cookieExpiration);
                                Sessions.setCookie('firstName', USER.profile.firstName, cookieExpiration);
                                $rootScope.userid = USER.UID;
                                if (typeof socialConnectionUserIds != 'undefined' && typeof socialConnectionUserIds != null && (socialConnectionUserIds.length > 0)) {
                                    // Linking native user with social credentials---------------------------------------
                                    var formData = {
                                        userIds: socialConnectionUserIds,
                                        loginID: $scope.uEmail,
                                        password: $scope.uPassword,
                                        action: 'linkAccount'
                                    };
                                    $http({
                                        method: 'POST',
                                        url: configuration.server_url + '/gigya/post_handler',
                                        data: formData,
                                        async: false,
                                        dataType: 'json'
                                    }).then(function(linkingResponse) {
                                        linkingResponse = linkingResponse.data;
                                        if (linkingResponse.errorStatus == 0 && linkingResponse.statusCode == 200) {
                                            signupNext(3, 8);
                                        } else {
                                            $scope.ajaxRegisterFormSpinner = false;
                                            $scope.registrationError = true;
                                            if (!linkingResponse.validationErrors) {
                                                errorMsg = linkingResponse.errorCode.toString();
                                            } else {
                                                errorMsg = linkingResponse.validationErrors[0].errorCode.toString();
                                            }
                                            $scope.registrationErrorMessage = linkingResponse.errorCode ? errorMsg : 'TRANSACTION_FAILED_MSG';
                                        }
                                    }, function(response) { // optional
                                        // failed
                                        console.log(' linking functionality failed---------------');
                                    });
                                } else {
                                    signupNext(3, 8);
                                }
                            } else {
                                $scope.registrationError = true;
                                $scope.registrationErrorMessage = 'TXT_INVALID_TOKEN';
                            }
                        });
                    } else {
                        $scope.ajaxRegisterFormSpinner = false;
                        $scope.registrationError = true;
                        if (!USER.validationErrors) {
                            errorMsg = USER.errorCode.toString();
                        } else {
                            errorMsg = USER.validationErrors[0].errorCode.toString();
                        }
                        $scope.registrationErrorMessage = USER.errorCode ? errorMsg : 'TRANSACTION_FAILED_MSG';
                    }
                }, function(response) { // optional
                    // failed
                    console.log('registration failed---------------');
                });
            }
        };
        //////////////////////////////////////////NATIVE REGISTRATION ENDS//////////////////////////////////////
        ////////////////////////////////////////SOCIAL REGISTRATION STARTS//////////////////////////////////////
        //email validation scope variables
        $scope.imageFacebookActive = false;
        $scope.imageTwitterActive = false;
        var socialConnectionUserIds = {};
        //register via facebook
        $scope.iconFacebookGigya = function() {
            if ($scope.facebookButtonStatus) {
                $scope.facebookButtonStatus = false;
                delete socialConnectionUserIds['facebook'];
                console.log(socialConnectionUserIds);
            } else {
                var params = {
                    provider: "facebook",
                    callback: onSocialRegistration
                };
                gigya.socialize.login(params);
            }
        };
        //register via twitter
        $scope.iconTwitterGigya = function() {
            if ($scope.twitterButtonStatus) {
                $scope.twitterButtonStatus = false;
                delete socialConnectionUserIds['twitter'];
                console.log(socialConnectionUserIds);
            } else {
                var params = {
                    provider: "twitter",
                    callback: onSocialRegistration
                };
                gigya.socialize.login(params);
            }
        };

        function onSocialRegistration(response) {
                USER = response;
                console.log(USER);
                $scope.ajaxRegisterFormSpinner = true;
                if (USER.status != "FAIL") {
                    var provider = $rootScope.checkItemExistInArray(USER.user.providers, "site");
                    $scope.socialProvider = USER.user.loginProvider + ': ';
                    if (!provider) {
                        //notify social registration
                        var formData = {
                            UID: USER.UID,
                            action: 'socialRegister'
                        };
                        $http({
                            method: 'POST',
                            url: configuration.server_url + '/gigya/post_handler',
                            data: formData,
                            async: false,
                            dataType: 'json'
                        }).then(function(notifyResponse) {
                            notifyResponse = notifyResponse.data;
                            if (notifyResponse.errorStatus == 0 && notifyResponse.statusCode == 200) {
                                $scope.ajaxRegisterFormSpinner = false;
                                //add social user ids to link to native login
                                socialConnectionUserIds[USER.user.loginProvider] = USER.UID;
                                $scope.socialConnectionProviderValue = USER.user.loginProvider;
                                if (USER.user.loginProvider == 'facebook') {
                                    $scope.facebookButtonStatus = true;
                                }
                                if (USER.user.loginProvider == 'twitter') {
                                    $scope.twitterButtonStatus = true;
                                }
                            } else {
                                $scope.ajaxRegisterFormSpinner = false;
                                $scope.socialRegistrationError = true;
                                $scope.socialRegistrationErrorMessage = notifyResponse.errorCode ? notifyResponse.errorCode.toString() : 'TRANSACTION_FAILED_MSG';
                            }
                        }, function(response) { // optional
                            // failed
                            console.log(' social registration failed---------------');
                        });
                    } else {
                        $scope.ajaxRegisterFormSpinner = false;
                        $scope.providerExist = true;
                    }
                } else {
                    $scope.ajaxRegisterFormSpinner = false;
                    $scope.socialRegistrationError = true;
                    $scope.socialRegistrationErrorMessage = USER.statusMessage ? USER.statusMessage : 'TRANSACTION_FAILED_MSG';
                }
            }
            ////////////////////////////////////////SOCIAL REGISTRATION ENDS//////////////////////////////////////
        var entryCount = 0;
        $scope.applyPromocode = function() {
            var elm = jQuery("#promoCodeId");
            elm.focus();
            elm.data("oldPromocode", elm.data("newPromocode") || "");
            elm.data("newPromocode", elm.val());
            $scope.promocodeOffer = null;
            if (!$rootScope.empty(Sessions.getCookie('subscriptionPriceAmount'))) {
                $scope.priceAmount = Sessions.getCookie('subscriptionPriceAmount');
            } else {
                $scope.priceAmount = $rootScope.nextBillingAmountForSelectedPackage.price_amount;
            }
            $scope.promoCodeForm.promocode.$setValidity('promocode', true);
            $scope.validPromocodeImg = $scope.invalidPromocodeImg = $scope.retryErrorDisplay = false;
            if ((elm.data("oldPromocode") !== elm.data("newPromocode")) && $scope.promoCodeForm.$valid) {
                $scope.ajaxPromocodeSpinner = true;
                Vindicia.validatePromocode($scope.promocode, entryCount).then(function(promocodeResponse) {
                    $scope.ajaxPromocodeSpinner = false;
                    if (promocodeResponse.responseStatus == 403 || promocodeResponse.responseStatus == 401) {
                        $scope.ajaxPaymentFormSpinner = false;
                        $scope.cancelWithUrlParams();
                        $scope.openSessionExpiryDialog();
                    } else {
                        var promocodeResponseContent = promocodeResponse.responseContent;
                        if (promocodeResponse.responseStatus == 200) {
                            if (promocodeResponseContent.status.http_code == 200) {
                                //focus promo code element
                                elm.focus();
                                $scope.focusInput = true;
                                entryCount = 0;
                                $scope.priceAmount = getDiscountAmountAfterApplyingPromocode($scope.priceAmount, promocodeResponseContent.campaign.percentage_discount);
                                $scope.validPromocodeImg = true;
                                $scope.invalidPromocodeImg = false;
                                $scope.displayPromocodeText = true;
                                $scope.promocodeOffer = $rootScope.checkIfItemExistInArrayAndReturnObject($rootScope.paymentInfo, "id", $scope.promocode);
                            } else {
                                $scope.promocode = '';
                                $scope.validPromocodeImg = false;
                                $scope.invalidPromocodeImg = true;
                                $scope.promocodeMessage = (typeof promocodeResponseContent.status != 'undefined') ? promocodeResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                                $scope.promoCodeForm.promocode.$setValidity('promocode', false);
                                entryCount++;
                            }
                        } else {
                            if (entryCount == 2) {
                                $scope.retryErrorDisplay = true;
                            }
                            $scope.promocode = '';
                            $scope.validPromocodeImg = false;
                            $scope.invalidPromocodeImg = true;
                            if (typeof promocodeResponseContent == "string") {
                                $scope.promocodeMessage = (typeof promocodeResponseContent != 'undefined') ? promocodeResponse.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                            } else {
                                $scope.promocodeMessage = (typeof promocodeResponseContent.status != 'undefined') ? promocodeResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                            }
                            $scope.promoCodeForm.promocode.$setValidity('promocode', false);
                            entryCount++;
                        }
                    }
                });
            }
        }
        $scope.enablePromocodeForm = function() {
            entryCount = 0;
            $scope.promocode = '';
            $scope.submitted = false;
            $scope.invalidPromocodeImg = false;
            $scope.retryErrorDisplay = false;
            $scope.validPromocodeImg = false;
        }
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
            //decide on payment type tab for toggling submit  button
        $scope.creditCardSubmitButton = true;
        $scope.tabIndex = function(value) {
            if (value == 'CreditCard') {
                $scope.creditCardSubmitButton = true;
            } else {
                $scope.creditCardSubmitButton = false;
            }
        }
        $scope.openSessionExpiryDialog = function() {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/sessionExpiryDialog.html',
                controller: SignUpModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.item = function() {
                return ({
                    name: $scope.name
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function() {}, function() {
                //on cancel button press
            });
        };
        $scope.paymentBillingFormSubmit = function(paymentMethodType) {
            //analytics for payment type
            analyticsService.TrackCustomPageLoad("signup:" + paymentMethodType);
            analyticsService.TrackCustomPageLoad("signup:terms");
            $scope.promocode = (typeof $scope.promocode !== "undefined") ? $scope.promocode : "";
            Sessions.setCookie('promoCode', $scope.promocode, cookieExpiration);
            $scope.transactionError = false;
            $scope.ajaxPaymentFormSpinner = true;
            var transData = {
                packages: Sessions.getCookie('signupPackageId'),
                promoCode: $scope.promocode,
                paymentMethodType: paymentMethodType,
                userId: Sessions.getCookie('userid'),
                emailId: Sessions.getCookie('emailId'),
                username: Sessions.getCookie('firstName'),
                browser: browser + ' ' + browserVersion
            };
            Vindicia.initializeTransaction(transData).then(function(transactionDetails) {
                if (transactionDetails.responseStatus == 403 || transactionDetails.responseStatus == 401) {
                    $scope.ajaxPaymentFormSpinner = false;
                    $scope.cancelWithUrlParams();
                    $scope.openSessionExpiryDialog();
                } else {
                    var transactionDetailsContent = transactionDetails.responseContent;
                    if (transactionDetails.responseStatus == 200) {
                        if (transactionDetailsContent.status.http_code == 200) {
                            if (transactionDetailsContent.transaction.session.confirmation_code == 200) {
                                var billingAddressName = jQuery('#billingAddressFirstName').val() + ' ' + jQuery('#billingAddressLastName').val();
                                if (transactionDetailsContent.transaction.session.form_submit_url != null) {
                                    if (paymentMethodType == 'CreditCard') {
                                        // $scope.ajaxPaymentFormSpinner = false;
                                        jQuery('#billingForm').attr('action', transactionDetailsContent.transaction.session.form_submit_url);
                                        //billing address name--------------------------------------------------------------
                                        jQuery('#paymentAccountName').val(Sessions.getCookie('firstName'));
                                        jQuery('#paymentBillingAddressName').val(billingAddressName);
                                        jQuery('#paymentMethodAccountName').val(billingAddressName);
                                        //set transanction in cookie--------------------------------------------------------
                                        Sessions.setCookie('transSessionId', transactionDetailsContent.transaction.session.id, Sessions.setExpiryForCookie());
                                        jQuery('#transSessionId').val(transactionDetailsContent.transaction.session.id);
                                        jQuery('#transNewProductId').val(transactionDetailsContent.transaction.new_product_id);
                                        jQuery('#accountEmail').val(Sessions.getCookie('emailId'));
                                        jQuery("#billingForm").submit();
                                    } else if (paymentMethodType == 'PayPal') {
                                        $cookieStore.put('initializeTransDetails', transactionDetailsContent);
                                        window.location.replace(transactionDetailsContent.transaction.session.form_submit_url);
                                    }
                                } else {
                                    $scope.transactionError = true;
                                    $scope.transactionErrorMessage = 'TRANSACTION_WITH_EMPTY_URL';
                                }
                            } else {
                                $scope.ajaxPaymentFormSpinner = false;
                                $scope.transactionError = true;
                                $scope.transactionErrorMessage = transactionDetailsContent.transaction.session.confirmation_message;
                            }
                        } else {
                            $scope.ajaxPaymentFormSpinner = false;
                            $scope.transactionError = true;
                            $scope.transactionErrorMessage = (typeof transactionDetailsContent.status != 'undefined') ? transactionDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                        }
                    } else if (transactionDetails.responseStatus == 500) {
                        $scope.ajaxPaymentFormSpinner = false;
                        $scope.transactionError = true;
                        $scope.transactionErrorMessage = transactionDetails.responseStatus.toString();
                    } else {
                        $scope.ajaxPaymentFormSpinner = false;
                        $scope.transactionError = true;
                        if (typeof transactionDetailsContent == "string") {
                            $scope.transactionErrorMessage = (typeof transactionDetailsContent != 'undefined') ? transactionDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                        } else {
                            $scope.transactionErrorMessage = (typeof transactionDetailsContent.status != 'undefined') ? transactionDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                        }
                    }
                }
            });
        }
        $scope.checkUserStatusAndTriggerEmailNotification = function() {
            if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                signupNext(7, 8);
            } else {
                var cookieExpiration = Sessions.setExpiryForCookie();
                $http.get(configuration.server_url + '/gigya/email_notification?email=' + Sessions.getCookie('emailId') + '&firstname=' + Sessions.getCookie('firstName') + '&lang=' + Sessions.getLanguage()).then(function(response, headers) {});
                Sessions.SetLogin(Sessions.getCookie('userid'), Sessions.getCookie('emailId'), Sessions.getCookie('firstName'), "", "site", cookieExpiration);
                //opt generation for player 
                $rootScope.generateOptAndSetCookie();
            }
        };
        //review passes then call confirm transaction
        $scope.confirmTransaction = function() {
            analyticsService.TrackSignupConfirmCheckout(Sessions.getCookie('signupPackageId'), Sessions.getCookie('promoCode'));
            var paymentMethodType = (typeof $scope.sessionId != 'undefined') ? 'CreditCard' : 'PayPal';
            var paymentId = $scope.sessionId ? $scope.sessionId : $scope.vindiciaVid;
            $scope.ajaxConfirmSpinner = true;
            var transData = {
                sessionId: paymentId,
                paymentMethodType: paymentMethodType,
                reviewResponse: (typeof $rootScope.reviewDetails != 'undefined') ? $rootScope.reviewDetails : $cookieStore.get('initializeTransDetails')
            };
            Vindicia.confirmTransaction(transData).then(function(transanctionDetails) {
                var transanctionDetailsContent = transanctionDetails.responseContent;
                if (transanctionDetails.responseStatus == 200) {
                    if (transanctionDetailsContent.status.http_code == 200) {
                        if (transanctionDetailsContent.transaction.session.confirmation_code == 200) {
                            trackConversion();
                            analyticsService.TrackCheckOutComplete(Sessions.getCookie('signupPackageId'), transanctionDetailsContent.transaction.promo_code, transanctionDetailsContent.transaction.payment_method_type);
                            $rootScope.reviewDetails = undefined;
                            Sessions.setCookie('promoCode', '', -1);
                            Sessions.setCookie('signupPackageId', '', -1);
                            $cookieStore.remove('initializeTransDetails');
                            Sessions.setCookie('subscriptionPriceAmount', '', -1);
                            if (!isMobile.any()) {
                                if (!$rootScope.empty(transanctionDetailsContent.transaction.payment_method_type) && transanctionDetailsContent.transaction.payment_method_type == "PayPal") {
                                    var paymentMethodDetails = {
                                        "account": {
                                            "email": Sessions.getCookie('emailId'),
                                            "name": Sessions.getCookie('firstName'),
                                            "payment_methods": [{
                                                "id": transanctionDetailsContent.transaction.payment_method_id,
                                                "type": transanctionDetailsContent.transaction.payment_method_type,
                                                "billing_address": {}
                                            }]
                                        }
                                    };
                                    var billingData = {
                                        paymentMethod: JSON.stringify(paymentMethodDetails)
                                    };
                                    Vindicia.updateAccount(billingData).then(function(updateAccountDetails) {
                                        // $scope.ajaxPaymentFormSpinner  = false;
                                        var updateAccountDetailsContent = updateAccountDetails.responseContent;
                                        if (updateAccountDetails.responseStatus == 200) {
                                            if (updateAccountDetailsContent.status.http_code == 200) {
                                                $scope.checkUserStatusAndTriggerEmailNotification();
                                            } else {
                                                $scope.confirmtransactionError = true;
                                                $scope.confirmtransactionErrorMessage = (typeof updateAccountDetailsContent.status != 'undefined') ? updateAccountDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                                            }
                                        } else if (updateAccountDetails.responseStatus == 500) {
                                            $scope.confirmtransactionError = true;
                                            $scope.confirmtransactionErrorMessage = updateAccountDetails.responseStatus.toString();
                                        } else {
                                            $scope.ajaxConfirmSpinner = false;
                                            $scope.confirmtransactionError = true;
                                            if (typeof updateAccountDetailsContent == "string") {
                                                $scope.confirmtransactionErrorMessage = (typeof updateAccountDetailsContent != 'undefined') ? updateAccountDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                                            } else {
                                                $scope.confirmtransactionErrorMessage = (typeof updateAccountDetailsContent.status != 'undefined') ? updateAccountDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                                            }
                                        }
                                    });
                                } else {
                                    $scope.checkUserStatusAndTriggerEmailNotification();
                                }
                            } else {
                                $scope.ajaxConfirmSpinner = false;
                                Sessions.setCookie('accessToken', '', -1);
                                $scope.mobileLoginConfirm('TEXT_OPEN_UP_APP');
                            }
                        } else {
                            if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                                signupNext(8, 8);
                            } else {
                                analyticsService.TrackSignupCheckOutUnsuccessfull(Sessions.getCookie('signupPackageId'), Sessions.getCookie('promoCode'));
                                Sessions.setCookie('promoCode', '', -1);
                                $location.url($location.path());
                                $scope.transactionError = true;
                                $scope.transactionErrorMessage = transanctionDetailsContent.transaction.session.confirmation_message;
                                signupNext(3, 8);
                            }
                        }
                    } else {
                        if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                            signupNext(8, 8);
                        } else {
                            analyticsService.TrackSignupCheckOutUnsuccessfull(Sessions.getCookie('signupPackageId'), Sessions.getCookie('promoCode'));
                            Sessions.setCookie('promoCode', '', -1);
                            $location.url($location.path());
                            $scope.transactionError = true;
                            $scope.transactionErrorMessage = (typeof transanctionDetailsContent.status != 'undefined') ? transanctionDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                            signupNext(3, 8);
                        }
                    }
                } else if (transanctionDetails.responseStatus != 500) {
                    if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                        signupNext(8, 8);
                    } else {
                        analyticsService.TrackSignupCheckOutUnsuccessfull(Sessions.getCookie('signupPackageId'), Sessions.getCookie('promoCode'));
                        Sessions.setCookie('promoCode', '', -1);
                        $location.url($location.path());
                        $scope.transactionError = true;
                        $scope.transactionErrorMessage = transanctionDetails.responseStatus.toString();
                        signupNext(3, 8);
                    }
                } else {
                    if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                        signupNext(8, 8);
                    } else {
                        analyticsService.TrackSignupCheckOutUnsuccessfull(Sessions.getCookie('signupPackageId'), Sessions.getCookie('promoCode'));
                        Sessions.setCookie('promoCode', '', -1);
                        $location.url($location.path());
                        $scope.transactionError = true;
                        if (typeof transanctionDetailsContent == "string") {
                            $scope.transactionErrorMessage = (typeof transanctionDetailsContent != 'undefined') ? transanctionDetails.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                        } else {
                            $scope.transactionErrorMessage = (typeof transanctionDetailsContent.status != 'undefined') ? transanctionDetailsContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                        }
                        signupNext(3, 8);
                    }
                }
            });
        };
        //call api for subscribe to newsletter
        $scope.subscribecheck = true;
        $scope.isSubscribeToNewsletter = function() {
            console.log($scope.subscribecheck);
            $scope.subscribecheck = $scope.subscribecheck !== true;
            console.log($scope.subscribecheck);
            $scope.ajaxSubscribeSpinner = true;
            $scope.subscribedSuccess = false;
            $scope.subscribedError = false;
            var userData = {
                UID: $rootScope.userid,
                newsletterKey: $rootScope.gigyaParamList.newsletter_key,
                newsletterValue: ($scope.subscribecheck == true) ? $rootScope.gigyaParamList.newsletter_subscribed : $rootScope.gigyaParamList.newsletter_not_subscribed,
                type: "newsletter",
                action: 'setInfo'
            };
            AccountService.SetAccountInfo(userData).then(function(setAccountResponse) {
                setAccountResponse = setAccountResponse.data;
                $scope.ajaxSubscribeSpinner = false;
                if (setAccountResponse.errorStatus == 0 && setAccountResponse.statusCode == 200) {
                    if ($scope.subscribecheck) {
                        $scope.subscribedSuccessMsg = 'TXT_ACTIVATE_NOTIFICATION';
                        $scope.subscribedSuccess = true;
                    } else {
                        $scope.subscribedErrorMsg = 'TXT_DEACTIVATE_NOTIFICATION';
                        $scope.subscribedError = true;
                    }
                } else {
                    $scope.subscribedError = true;
                    $scope.subscribedErrorMsg = 'SUBSCRIBED_ERROR_MSG';
                }
            });
        };
    }
]);