'use strict';
/*
 * Personal Information Controller
 */
mdlDirectTvApp.controller('personalInformationCtrl', ['$scope', '$parse', '$timeout', '$log', '$modal', 'dateFilter', '$http', 'AccountService', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', 'Gigya',
    function($scope, $parse, $timeout, $log, $modal, dateFilter, $http, AccountService, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, Gigya) {
        /**********Display Initial Container***************/
        $scope.nameInitialContainer = true;
        $scope.emailInitialContainer = true;
        $scope.passwordInitialContainer = true;
        $scope.userInformation = {
            "firstName": $rootScope.firstName,
            "lastName": $rootScope.lastName,
            "emailId": $rootScope.emailId
        };
        $scope.enableNameInputFields = function() {
            $scope.originalUserInformation = angular.copy($scope.userInformation);
            $scope.nameInitialContainer = $scope.submitted = false;
            $scope.nameInputFields = $scope.isPersonalInfoInputEdit = true;
        };
        $scope.enableEmailInputFields = function() {
            $scope.originalUserInformation = angular.copy($scope.userInformation);
            $scope.emailInitialContainer = false;
            $scope.emailInputFields = $scope.isPersonalInfoInputEdit = true;
        };
        $scope.enablePasswordInputFields = function() {
            $scope.passwordInitialContainer = false;
            $scope.passwordInputFields = $scope.isPersonalInfoInputEdit = true;
        };
        $scope.cancelPersonalInfo = function(isRetrieveOriginalInformation) {
            if (isRetrieveOriginalInformation) {
                angular.copy($scope.originalUserInformation, $scope.userInformation);
            }
            $scope.nameInitialContainer = $scope.emailInitialContainer = $scope.passwordInitialContainer = true;
            $scope.nameInputFields = $scope.emailInputFields = $scope.passwordInputFields = $scope.isPersonalInfoInputEdit = $scope.submitted = false;
            $scope.userFirstname = $scope.userLastname = $scope.userEmail = $scope.userCurrentPassword = $scope.userNewPassword = $scope.userConfirmPassword = '';
        };
        $scope.savePersonalInfo = function() {
            $scope.submitted = false;
            $rootScope.informationSuccessContainer = false;
            $rootScope.informationErrorContainer = false;
            $scope.ajaxPersonalInfoSpinner = true;
            var userData;
            if ($scope.nameInputFields && $scope.personalInfoForm.userFirstname.$valid && $scope.personalInfoForm.userLastname.$valid) {
                userData = {
                    UID: $rootScope.userid,
                    firstName: $scope.userInformation.firstName,
                    lastName: $scope.userInformation.lastName,
                    type: "username",
                    action: 'setInfo'
                };
            } else if ($scope.emailInputFields && $scope.personalInfoForm.userEmail.$valid) {
                userData = {
                    UID: $rootScope.userid,
                    removeLoginEmails: $rootScope.emailId,
                    addLoginEmails: $scope.userInformation.emailId,
                    type: "email",
                    action: 'setInfo'
                };
            } else if ($scope.passwordInputFields && $scope.personalInfoForm.userCurrentPassword.$valid && $scope.personalInfoForm.userNewPassword.$valid && $scope.personalInfoForm.userConfirmPassword.$valid) {
                userData = {
                    UID: $rootScope.userid,
                    password: $scope.userCurrentPassword,
                    newPassword: $scope.userConfirmPassword,
                    type: "password",
                    action: 'setInfo'
                };
            } else {
                $log.warn("Provided information are not valid");
                $scope.submitted = true;
                $scope.ajaxPersonalInfoSpinner = false;
            }
            if (!!userData && !!userData.UID) {
                AccountService.SetAccountInfo(userData).then(function(response) {
                    response = response.data;
                    $scope.ajaxPersonalInfoSpinner = false;
                    if (response.errorStatus == 0 && response.statusCode == 200) {
                        if ($scope.nameInputFields) {
                            if ($scope.userInformation.firstName) Sessions.setCookie('firstName', $scope.userInformation.firstName, Sessions.setExpiryForCookie());
                            if ($scope.userInformation.lastName) Sessions.setCookie('lastName', $scope.userInformation.lastName, Sessions.setExpiryForCookie());
                            console.log($scope.userInformation);
                            $rootScope.firstName = $scope.userInformation.firstName;
                            $rootScope.lastName = $scope.userInformation.lastName;
                        } else if ($scope.emailInputFields) {
                            if ($scope.userInformation.emailId) Sessions.setCookie('emailId', $scope.userInformation.emailId, Sessions.setExpiryForCookie());
                            console.log($scope.userInformation);
                            $rootScope.emailId = $scope.userInformation.emailId;
                        } else if ($scope.passwordInputFields) {
                            $log.info("User password has been changed. Please logout from the site!");
                        }
                        $rootScope.enableSucessAlertMessage('TXT_SUCCESS_MSG_ON_ACCOUNT_UPDATION');
                        $scope.cancelPersonalInfo();
                    } else {
                        $rootScope.enableErrorAlertMessage('TRANSACTION_FAILED_MSG');
                    }
                });
            } else {
                $log.warn("User is not in logged-in state");
            }
        };
    }
]);