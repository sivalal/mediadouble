'use strict';
/*
 * Create account page
 */
mdlDirectTvApp.controller('CreateAccountCtrl', ['$scope', '$modal', 'dateFilter', '$http', 'AccountService', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', 'Gigya', '$timeout',
    function($scope, $modal, dateFilter, $http, AccountService, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, Gigya, $timeout) {
        Sessions.setRememberme(true);
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        //destroy sizzle player
        if (!!$rootScope['sizzle-video']) {
            $rootScope['sizzle-video'].destroy();
        }
        //route path
        $scope.routePath = $location.path();
        //prepopulate email
        if (!!$rootScope.emailIdFromHomePage) {
            $scope.userEmail = $rootScope.emailIdFromHomePage;
            $scope.validEmail = true;
            $timeout(function() {
                $scope.signupForm.userEmail.$dirty = true;
            }, 0);
        }
        //default value of newsletter
        $scope.isNewsletterEnabled = "true";
        //omniture call
        analyticsService.TrackCustomPageLoad('signup:user info');
        //hide main menu
        jQuery('#menu').hide();
        //check signup route info
        if (typeof $rootScope.signupRouteInfo !== "undefined") {
            if ($rootScope.signupRouteInfo.selectPackage == false) {
                $location.url("/selectPackage");
            }
        }
        //user logged in state
        if ((typeof Sessions.getCookie('userid') != 'undefined') && Sessions.getCookie('userid')) {
            $location.url("/selectPackage");
        }
        var profileSettings = {};
        $rootScope.$watch("gigyaParamList", function(newValue, oldValue) {
            if (newValue == 'undefined' || typeof newValue == 'undefined') {
                return true; // packageList not updated yet
            }
            var newsletterObj = $filter('filter')(newValue.profile_settings, {
                id: 'newsletter'
            });
            $scope.newsletterObj = !!newsletterObj[0] ? newsletterObj[0] : '';
            $scope.isNewsletterEnabled = $scope.newsletterObj.status ? 'true' : 'false';
            angular.forEach(newValue.profile_settings, function(value, key) {
                if (value["isNotificationActive"]) {
                    var newKey = value.gigya_custom_key;
                    profileSettings[value.gigya_custom_key] = (value.status == true) ? value.gigya_custom_true_value : value.gigya_custom_false_value;
                }
            });
        });
        // watch newsletter checkbox
        $scope.$watch("isNewsletterEnabled", function(newValue, oldValue) {
            if (!!$rootScope.gigyaParamList) {
                var newsletterObj = $filter('filter')($rootScope.gigyaParamList.profile_settings, {
                    id: 'newsletter'
                });
                profileSettings.isNewsletter = (newValue === "true") ? newsletterObj[0].gigya_custom_true_value : newsletterObj[0].gigya_custom_false_value;
            }
        });
        //signup configuration
        $rootScope.$watch("signupConfiguration", function(newValue, oldValue) {
            if (newValue !== 'undefined') {
                if (typeof $rootScope.signupConfiguration != 'undefined') {
                    $scope.signupConfiguration = $rootScope.signupConfiguration;
                    var createAccountDetails = $filter('filter')($rootScope.signupConfiguration.signup_page, {
                        id: 'createAccount'
                    });
                    $scope.createAccountDetails = createAccountDetails[0];
                    if (typeof createAccountDetails[0].buttons !== 'undefined') {
                        var buttonConfig = $filter('filter')(createAccountDetails[0].buttons, {
                            id: 'main_button'
                        });
                        $scope.buttonConfig = buttonConfig[0];
                    } else {
                        $log.error("createAccountButton id missing from appgrid signup configuration");
                    }
                }
            }
        });
        //Unique email check
        var emailInputValue, emailValueAfterValidation;
        $scope.checkEmailExist = function() {
            console.log(emailInputValue);
            console.log($scope.userEmail);
            $scope.closeErrorMessageAlert();
            if (!$rootScope.empty($rootScope.emailIdFromHomePage) && ($rootScope.emailIdFromHomePage == $scope.userEmail)) return;
            if (emailInputValue !== $scope.userEmail) {
                $scope.signupForm.userEmail.$setValidity('email', true);
                $scope.validEmail = false;
            }
            // if((emailInputValue == $scope.userEmail) && emailValueAfterValidation) $scope.signupForm.userEmail.$setValidity('email', false); 
            if (($scope.signupForm.userEmail.$valid) && (emailInputValue !== $scope.userEmail) && ($rootScope.emailIdFromHomePage != $scope.userEmail)) {
                emailInputValue = $scope.userEmail;
                $scope.emailCheckSpinner = true;
                var data = {
                    action: 'emailExist',
                    email: $scope.userEmail
                };
                Gigya.postHandler(data).then(function(response) {
                    $scope.emailCheckSpinner = false;
                    if (response.errorStatus == 0 && response.statusCode == 200) {
                        if (response.isAvailable || (response.isAvailable == 'true')) {
                            $scope.signupForm.userEmail.$setValidity('email', true);
                            $scope.validEmail = true;
                        } else {
                            $rootScope.selectedMailID = emailValueAfterValidation = $scope.userEmail;
                            $scope.signupForm.userEmail.$setValidity('email', false);
                        }
                    } else {
                        $rootScope.enableErrorAlertMessage(response.errorCode ? response.errorCode.toString() : 'TRANSACTION_FAILED_MSG');
                    }
                });
            }
        };
        //remove validation message on key press
        $scope.removeValidationMessage = function() {
            $scope.signupForm.userEmail.$setValidity('email', true);
        };
        var USER;
        $scope.setTokenAndRedirecttoBillingPage = function(USER) {
            //get Account token
            Authentication.getAccountToken(USER).then(function(tokenResponse) {
                $scope.ajaxRegisterFormSpinner = false;
                if (tokenResponse.success) {
                    USER.profile.email = USER.profile.email ? USER.profile.email : '';
                    USER.profile.firstName = USER.profile.firstName ? USER.profile.firstName : '';
                    USER.profile.lastName = USER.profile.lastName ? USER.profile.lastName : '';
                    Sessions.SetLogin(USER.UID, USER.profile.email, USER.profile.firstName, USER.profile.lastName, USER.loginProvider, Sessions.setExpiryForCookie());
                    Sessions.setCookie('subscriptionStatus', false, Sessions.setExpiryForCookie());
                    if (typeof $rootScope.signupRouteInfo.createAccount != "undefined") {
                        $rootScope.signupRouteInfo.createAccount = true;
                    }
                    $location.url("/finalCheckout");
                } else {
                    $scope.isTokenSet = true;
                    $rootScope.enableErrorAlertMessage('TXT_INVALID_TOKEN');
                }
            });
        };
        //main registration function 
        $scope.createUserAccount = function() {
            var packageIdArray = !!$rootScope.packageObjList ? $rootScope.getAllPackageIdsFromPackageListAsArray($rootScope.packageObjList) : '';
            var errorMsg;
            if ($scope.signupForm.$valid) {
                $scope.ajaxRegisterFormSpinner = true;
                if ($scope.isTokenSet) {
                    $scope.setTokenAndRedirecttoBillingPage(USER);
                } else {
                    var notificationValue = {};
                    var data = {
                        email: $scope.userEmail,
                        password: $scope.userPassword,
                        firstName: $scope.userFirstname,
                        lastName: $scope.userLastname,
                        notificationKey: 'profile_settings',
                        notificationValue: JSON.stringify(profileSettings),
                        packageIdArray: packageIdArray,
                        action: 'nativeRegister'
                    };
                    Gigya.postHandler(data).then(function(USER) {
                        if (USER.errorStatus == 0 && USER.statusCode == 200) {
                            $scope.setTokenAndRedirecttoBillingPage(USER);
                        } else {
                            $scope.ajaxRegisterFormSpinner = false;
                            if (!USER.validationErrors) {
                                errorMsg = USER.errorCode.toString();
                            } else {
                                errorMsg = USER.validationErrors[0].errorCode.toString();
                            }
                            $rootScope.enableErrorAlertMessage(USER.errorCode ? errorMsg : 'TRANSACTION_FAILED_MSG');
                        }
                    });
                }
            } else {
                $scope.submitted = true;
            }
        };
    }
]);