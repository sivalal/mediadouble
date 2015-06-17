'use strict';
/* Login Controller */
//controller for the content inside model template of login
mdlDirectTvApp.controller('LoginCtrl', ['$scope', '$http', 'AccountService', 'SocialService', 'Authentication', 'Sessions', 'Gigya', '$rootScope', '$route', 'configuration', '$location', '$filter', 'Vindicia', '$window', 'analyticsService',
    function($scope, $http, AccountService, SocialService, Authentication, Sessions, Gigya, $rootScope, $route, configuration, $location, $filter, Vindicia, $window, analyticsService) {
        $rootScope.RedirectIfCookieNotSet();
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        //destroy sizzle player
        if (!!$rootScope['sizzle-video']) {
            $rootScope['sizzle-video'].destroy();
        }
        $rootScope.loginModalDisplay = true;
        $rootScope.setMenuBackgroundColorWithLogo();
        $scope.uLoginEmail = ($rootScope.selectedMailID) ? $rootScope.selectedMailID : '';
        console.log("email id--------------");
        console.log($scope.uLoginEmail);
        $scope.closeLoginAlert = function() {
            $scope.login_error = false;
        };
        $scope.forgotEmail = function() {
            $location.path("/forgotMail");
        };
        $scope.gotoSignUp = function() {
            $location.path("/selectPackage");
        };
        $scope.closeSocialLoginAlert = function() {
            $scope.social_error = false;
        };
        $scope.uRememberme = true;
        $scope.cancelAndRedirectWithClearUrl = function() {
            if (isMobile.any()) {
                $location.path('/mobileloggedInSubscriberHome').search('');
            } else {
                $location.path('/').search('');
            }
        };
        var setLoginAndToken = function(USER) {
            Sessions.SetLogin(USER.UID, USER.profile.email, USER.profile.firstName, USER.profile.lastName, USER.loginProvider, Sessions.setExpiryForCookie());
        };
        /**************submit native login credentials starts***************************/
        $scope.login_error = false;
        $scope.loginEmailCheck = $scope.loginPasswordCheck = false;
        var USER;
        $scope.submitLogin = function() {
            $rootScope.closeErrorMessageAlert();
            if ($scope.loginForm.$valid) {
                $scope.isLinksDisabled = true;
                $scope.ajaxSpinner = true;
                $scope.login_error = false;
                //cookie expiration ---------------
                var cookieExpiration = Sessions.setExpiryForCookie();
                var data = {
                    email: $scope.uLoginEmail,
                    password: $scope.uLoginPassword,
                    rememberme: $scope.uRememberme,
                    action: 'login'
                };
                Gigya.postHandler(data).then(function(response) {
                    USER = response;
                    if (USER.errorStatus == 0 && USER.statusCode == 200) {
                        Sessions.setCookie('subscriptionStatus', false, cookieExpiration);
                        //get access token
                        Authentication.getAccountToken(USER).then(function(tokenResponse) {
                            if (tokenResponse.success) {
                                //cookie expiration ---------------
                                Sessions.setRememberme($scope.uRememberme);
                                USER.profile.email = USER.profile.email ? USER.profile.email : '';
                                USER.profile.firstName = USER.profile.firstName ? USER.profile.firstName : '';
                                Sessions.setCookie('userid', USER.UID, cookieExpiration);
                                Sessions.setCookie('emailId', USER.profile.email, cookieExpiration);
                                Sessions.setCookie('firstName', USER.profile.firstName, cookieExpiration);
                                setLoginAndToken(USER);
                                $rootScope.emailId = USER.profile.email;
                                $rootScope.firstName = USER.profile.firstName;
                                $rootScope.userid = USER.UID;
                                $rootScope.isPrevSubscriber = true;
                                //check user has subscription
                                Vindicia.getUserPackageDetailsByPurchase().then(function(userpackage) {
                                    //analytics Track user login
                                    analyticsService.TrackUserLogin();
                                    var userpackageContent = userpackage.responseContent;
                                    if (userpackage.responseStatus == 200 && userpackageContent.status.http_code == 200) {
                                        $scope.ajaxSpinner = false;
                                        if (userpackageContent.subscriptionStatus) {
                                            //The selected time is less than 30 days from now
                                            var expiryDate = userpackageContent.basicPackExpiryDate;
                                            var expiryTimestamp = new Date(expiryDate).getTime();
                                            var dayBeforeExpiration = expiryTimestamp - (24 * 60 * 60 * 1000);
                                            var currentTimestamp = new Date().getTime();
                                            var timestamp = currentTimestamp + (30 * 24 * 60 * 60 * 1000);
                                            if (userpackageContent.subscriptionStatus == "Active") {
                                                $rootScope.generateOptAndSetCookie(false);
                                            } else if ((userpackageContent.subscriptionStatus == "Cancelled") || (userpackageContent.subscriptionStatus == "Suspended")) {
                                                // check if expiry crossed timestamp
                                                if (expiryTimestamp > currentTimestamp) {
                                                    // only show warning if there's less than 24h before account expires
                                                    if (currentTimestamp > dayBeforeExpiration) {
                                                        $rootScope.openExpirationDialog(expiryDate, 'alert');
                                                    } else {
                                                        $rootScope.generateOptAndSetCookie(false);
                                                    }
                                                } else {
                                                    $scope.isLinksDisabled = false;
                                                    $rootScope.openExpirationDialog(null, 'reactivate');
                                                }
                                            } else {
                                                $rootScope.signupModal(1);
                                            }
                                        } else {
                                            $rootScope.signupModal(1);
                                        }
                                    } else {
                                        $scope.ajaxSpinner = false;
                                        $rootScope.enableErrorAlertMessage('GENERIC_ERROR');
                                    }
                                });
                            } else {
                                $scope.ajaxSpinner = false;
                                $scope.isLinksDisabled = false;
                                $scope.login_error = true;
                                $rootScope.enableErrorAlertMessage('GENERIC_ERROR');
                            }
                        });
                    } else {
                        $scope.ajaxSpinner = false;
                        $scope.isLinksDisabled = false;
                        $scope.login_error = true;
                        $scope.errorLoginMessage = USER.errorCode ? USER.errorCode.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                });
            } else {
                if ($scope.loginForm.uLoginEmail.$invalid) $scope.loginEmailCheck = true;
                if ($scope.loginForm.uLoginPassword.$invalid) $scope.loginPasswordCheck = true;
            }
        };
        /**
         * As per the requirement , at a time user should have only
         * one main package.
         *
         * @param {type} subscribedPacks
         * @param {type} appgridPackages
         * @returns {unresolved}
         */
        function getUserMainPackage(subscribedPacks, appgridPackages) {
            var userMainPacakge = null;
            var allAppgridPackageType = $filter('filter')(appgridPackages, {
                type: 'package'
            });
            for (var i = 0; i < allAppgridPackageType.length; i++) {
                var appgridPackage = allAppgridPackageType[i];
                for (var k = 0; k < subscribedPacks.length; k++) {
                    var subscribedPackageId = subscribedPacks[k]['product'].id;
                    if (subscribedPackageId.indexOf(appgridPackage.id) > -1) {
                        userMainPacakge = subscribedPacks[k];
                        return userMainPacakge;
                    }
                }
            }
            return userMainPacakge;
        };
        /**************submit native login credentials stops***************************/
        /**************submit social login credentials starts***************************/
        var USER;
        $scope.social_error = false;
        $scope.linkAccount = function(provider) {
            $scope.social_error = false;
            gigya.socialize.addEventHandlers({
                onLogin: onGigyaLogin,
                onLogout: onGigyaLogout
            });
            var params = {
                provider: provider,
                callback: onSocialLogin
            };
            gigya.socialize.login(params);
        };
        // Bind to Gigya login/logout global events
        var onGigyaLogin = function(user) {
            USER = user;
            USER["userProvider"] = "social";
        };
        var onGigyaLogout = function() {
            USER = undefined;
            Sessions.Logout();
        };
        var onSocialLogin = function(user) {
            jQuery(".social-login").trigger("click");
            var userData = user;
            //cookie expiration ---------------
            var cookieExpiration = Sessions.setExpiryForCookie();
            $scope.ajaxSocialSpinner = true;
            if (userData.status != "FAIL") {
                var provider = $rootScope.checkItemExistInArray(userData.user.providers, "site");
                if (provider) {
                    Authentication.getFullUserRelatedData(userData.UID).then(function(USER) {
                        Sessions.setCookie('subscriptionStatus', false, cookieExpiration);
                        //get access token
                        Authentication.getAccountToken(USER).then(function(tokenResponse) {
                            if (tokenResponse.success) {
                                USER.profile.email = USER.profile.email ? USER.profile.email : '';
                                USER.profile.firstName = USER.profile.firstName ? USER.profile.firstName : '';
                                Sessions.setCookie('userid', USER.UID, cookieExpiration);
                                Sessions.setCookie('emailId', USER.profile.email, cookieExpiration);
                                Sessions.setCookie('firstName', USER.profile.firstName, cookieExpiration);
                                setLoginAndToken(USER);
                                $rootScope.emailId = USER.profile.email;
                                $rootScope.firstName = USER.profile.firstName;
                                $rootScope.userid = USER.UID;
                                $rootScope.isPrevSubscriber = true;
                                //check user has subscription
                                Vindicia.getUserPackageDetailsByPurchase().then(function(userpackage) {
                                    //analytics Track user login
                                    analyticsService.TrackUserLogin();
                                    var userpackageContent = userpackage.responseContent;
                                    if (userpackage.responseStatus == 200 && userpackageContent.status.http_code == 200) {
                                        $scope.ajaxSocialSpinner = false;
                                        if (userpackageContent.subscriptionStatus) {
                                            //The selected time is less than 30 days from now
                                            var expiryDate = userpackageContent.basicPackExpiryDate;
                                            var expiryTimestamp = new Date(expiryDate).getTime();
                                            var currentTimestamp = new Date().getTime();
                                            var timestamp = currentTimestamp + (30 * 24 * 60 * 60 * 1000);
                                            if (userpackageContent.subscriptionStatus == "Active") {
                                                $rootScope.generateOptAndSetCookie(false);
                                            } else if ((userpackageContent.subscriptionStatus == "Cancelled") || (userpackageContent.subscriptionStatus == "Suspended")) {
                                                // check if expiry crossed timestamp
                                                if (expiryTimestamp > currentTimestamp) {
                                                    // only show warning if there's less than 24h before account expires
                                                    if (currentTimestamp > dayBeforeExpiration) {
                                                        $rootScope.openExpirationDialog(expiryDate, 'alert');
                                                    } else {
                                                        $rootScope.generateOptAndSetCookie(false);
                                                    }
                                                } else {
                                                    $scope.isLinksDisabled = false;
                                                    $rootScope.openExpirationDialog(null, 'reactivate');
                                                }
                                            } else {
                                                $rootScope.signupModal(1);
                                            }
                                        } else {
                                            $rootScope.signupModal(1);
                                        }
                                    } else {
                                        $scope.ajaxSocialSpinner = false;
                                        $rootScope.enableErrorAlertMessage('GENERIC_ERROR');
                                    }
                                });
                            } else {
                                $scope.ajaxSocialSpinner = false;
                                $scope.social_error = true;
                                $rootScope.enableErrorAlertMessage('GENERIC_ERROR');
                            }
                        });
                    });
                } else {
                    $rootScope.signupModal(1);
                }
            } else {
                $scope.ajaxSocialSpinner = false;
                $scope.social_error = true;
                $scope.errorSocialMessage = userData.statusMessage ? userData.statusMessage : 'LOGIN_FAILED_MSG';
            }
        }
    }
]);