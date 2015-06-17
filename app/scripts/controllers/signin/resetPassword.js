/*Controller for reset password.*/
mdlDirectTvApp.controller('resetPasswordCtrl', ['$scope', '$timeout', '$http', 'AccountService', 'SocialService', 'Authentication', 'Sessions', '$rootScope', '$route', 'configuration', '$location', '$filter', 'Vindicia', '$window', 'analyticsService',
    function($scope, $timeout, $http, AccountService, SocialService, Authentication, Sessions, $rootScope, $route, configuration, $location, $filter, Vindicia, $window, analyticsService) {
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        $rootScope.loginModalDisplay = true;
        $rootScope.setMenuBackgroundColorWithLogo();
        /************** reset password starts**************************/
        $scope.emailSubmit = true;
        $scope.onSubmitButtonClick = function() {
            $scope.ajaxResetPasswordSpinner = true;
            $scope.reset_pwd_error = false;
            if ((typeof $scope.uNewPassword == "undefined") || (typeof $scope.uConfirmPassword == "undefined")) {
                $scope.errorResetPwdMessage = 'Please fill in both new and re-enter password fields.';
                $scope.reset_pwd_error = true;
            } else if (($scope.uNewPassword.length < 8) || ($scope.uConfirmPassword.length < 8)) {
                $scope.errorResetPwdMessage = 'Password must be 8 characters long';
                $scope.reset_pwd_error = true;
            } else if ($scope.uNewPassword != $scope.uConfirmPassword) {
                $scope.errorResetPwdMessage = 'Passwords do not match.';
                $scope.reset_pwd_error = true;
            } else {
                $scope.resetPassword();
            }
            $scope.ajaxResetPasswordSpinner = false;
        };
        var resetPasswordCallback = function(response) {
            jQuery("#button1").trigger("click");
            var errorCode = response['errorCode'];
            if (errorCode != 0) {
                var errorDetails = response["errorDetails"]; // "Reset password link invalid, please send resetPassword again to receive new reset link.",
                var errorMessage = response["errorMessage"]; // "Invalid parameter value",
                var statusCode = Math.round(errorCode / 1000);
                var statusReason = (errorDetails != null && errorDetails.length > 0) ? errorDetails : errorMessage;
                var errorResetPwdMessage = 'Request error: ' + statusReason + '(error code:' + statusCode + ')';
                $scope.ajaxResetPasswordSpinner = false;
                $rootScope.enableErrorAlertMessage(errorResetPwdMessage);
            } else {
                $scope.ajaxResetPasswordSpinner = false;
                $rootScope.enableSucessAlertMessage('TEXT_SUCCESSFULL_RESET_PASSWORD');
                $location.path("/login").search('');
            }
        };
        $scope.resetPassword = function() {
            var pwrt = $rootScope.getParameterByName('pwrt');
            if (!$rootScope.empty(pwrt)) {
                gigya.accounts.resetPassword({
                    passwordResetToken: $rootScope.getParameterByName('pwrt'),
                    newPassword: $scope.uNewPassword,
                    callback: resetPasswordCallback
                });
            }
        };
        /**************submit reset password stops**************************/
    }
]);