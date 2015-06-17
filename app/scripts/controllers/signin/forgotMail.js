mdlDirectTvApp.controller('forgotMailCtrl', ['$scope', '$http', 'AccountService', 'SocialService', 'Authentication', 'Sessions', '$rootScope', '$route', 'configuration', '$location', '$filter', 'Vindicia', '$window', 'analyticsService',
    function($scope, $http, AccountService, SocialService, Authentication, Sessions, $rootScope, $route, configuration, $location, $filter, Vindicia, $window, analyticsService) {
        analyticsService.TrackCustomPageLoad('login:forgot email');
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        $rootScope.loginModalDisplay = true;
        $rootScope.setMenuBackgroundColorWithLogo();
        $scope.showMailScreen = true;
        $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
            if (newValue != '') {
                $scope.gigyaFrgtPswd = $rootScope.gigyaParamList.forgot_password;
            }
        });
        $scope.selectMailid = function(mailId) {
            if (mailId) {
                $rootScope.selectedMailID = mailId;
                $location.path("/login");
            }
        };
        $scope.showUserMailIds = function() {
            $scope.showFoundMailScreen = true;
            $scope.showMailScreen = false;
        };
        $scope.findHelp = function() {
            $scope.validEndTextExist = true;
            $scope.mailErrorContainer = true;
            $scope.findMailErrorMessageStart = 'TXT_FIND_EMAIL_NODETAILS_NOTE1';
            $scope.findMailErrorMessageLink = 'TXT_FIND_EMAIL_NODETAILS_CUSTLINK';
            $scope.findMailErrorMessageEnd = 'TXT_FIND_EMAIL_NODETAILS_NOTE2';
        };
        $scope.noEmailsFound = function() {
            $scope.validEndTextExist = false;
            $scope.mailErrorContainer = true;
            $scope.findMailErrorMessageStart = 'TXT_FIND_EMAIL_NODETAILS_UNABLE_VERIFICATION';
            $scope.findMailErrorMessageLink = 'TXT_FIND_EMAIL_NODETAILS_CUSTLINK';
        }
    }
]);