mdlDirectTvApp.controller('forgotPasswordCtrl', ['$scope', '$http', 'AccountService', 'SocialService', 'Authentication', 'Sessions', '$rootScope', '$route', 'configuration', '$location', '$filter', 'Vindicia', '$window', 'analyticsService',
    function($scope, $http, AccountService, SocialService, Authentication, Sessions, $rootScope, $route, configuration, $location, $filter, Vindicia, $window, analyticsService) {
        analyticsService.TrackCustomPageLoad('login:forgot password');
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        $rootScope.loginModalDisplay = true;
        $rootScope.setMenuBackgroundColorWithLogo();
        /**************submit reset password starts**************************/
        $scope.forgotEmail = function() {
            $location.path("/forgotMail");
        };
        $scope.submitResetPwd = function(uResetEmailID) {
            $scope.reset_pwd_success = false;
            $scope.reset_pwd_error = false;
            $scope.showNoUser = false;
            $scope.ajaxResetPasswordSpinner = true;
            var formData = {
                email: uResetEmailID,
                action: 'resetPassword'
            };
            $http({
                method: 'POST',
                url: configuration.server_url + '/gigya/post_handler',
                data: formData,
                dataType: 'json'
            }).then(function(response) {
                var dataObj = response.data;
                if (dataObj.errorStatus == 0 && dataObj.statusCode == 200) {
                    $scope.ajaxResetPasswordSpinner = false;
                    $scope.uResetEmailID = '';
                    var successResetPwdMessage = 'TEXT_SUCCESS_EMAIL_SEND';
                    $rootScope.enableSucessAlertMessage(successResetPwdMessage);
                } else {
                    $scope.ajaxResetPasswordSpinner = false;
                    if (dataObj.errorCode == 403047) {
                        $scope.showNoUser = true;
                    } else {
                        var errorResetPwdMessage = (typeof dataObj.errorCode != 'undefined') ? dataObj.errorCode.toString() : 'TRANSACTION_FAILED_MSG';
                        $rootScope.enableErrorAlertMessage(errorResetPwdMessage);
                    }
                }
            }, function(response) { // optional
                // failed
            });
        };
        /**************submit reset password stops**************************/
    }
]);