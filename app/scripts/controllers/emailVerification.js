'use strict';
/* Email Verification Controllers */
mdlDirectTvApp.controller('emailVerificationCtrl', ['analyticsService', '$scope', '$rootScope', 'Gigya', '$filter',
    function(analyticsService, $scope, $rootScope, Gigya, $filter) {
        //Unique email check
        $scope.userMastheadEmail = "";
        var emailInputValue, emailValueAfterValidation;
        $scope.checkEmailExist = function(playerValue) {
            if (emailInputValue !== $scope.userMastheadEmail) $scope.mastheadForm.userMastheadEmail.$setValidity('email', true);
            if ((emailInputValue == $scope.userMastheadEmail) && emailValueAfterValidation) $scope.mastheadForm.userMastheadEmail.$setValidity('email', false);
            if (($scope.mastheadForm.userMastheadEmail.$valid) && (emailInputValue !== $scope.userMastheadEmail)) {
                emailInputValue = $scope.userMastheadEmail;
                $scope.emailCheckSpinner = true;
                var data = {
                    action: 'emailExist',
                    email: $scope.userMastheadEmail
                };
                Gigya.postHandler(data).then(function(response) {
                    $scope.emailCheckSpinner = false;
                    if (response.errorStatus == 0 && response.statusCode == 200) {
                        if (!response.isAvailable) {
                            console.log("email id exist------");
                            emailValueAfterValidation = $scope.userMastheadEmail;
                            $scope.mastheadForm.userMastheadEmail.$setValidity('email', false);
                            // If User then he should be taken to login page with their email address pre-populated
                            $rootScope.selectedMailID = $scope.userMastheadEmail = emailInputValue;
                            $rootScope.loginModal(1);
                        } else {
                            console.log("email id not found------");
                            $rootScope.packageObjList = null;
                            $rootScope.emailIdFromHomePage = $scope.userMastheadEmail;
                            $scope.mastheadForm.userMastheadEmail.$setValidity('email', true);
                            if (playerValue == false) {
                                $rootScope.closePopUpVideoPlayer();
                                console.log("Enter the dragon");
                            }
                            $rootScope.signupModal(1);
                        }
                    }
                });
            } else {
                $scope.submitted = true;
            }
        };
        //remove validation message on key press
        $scope.removeValidationMessage = function() {
            $scope.mastheadForm.userMastheadEmail.$setValidity('email', true);
        };
    }
]);