'use strict';
// Declare app level module which depends on filters, and services
var mdlDirectTvApp = angular.module('directTvApp', ['ngRoute', 'ui.bootstrap', 'slidenav', 'ui.utils', 'ngSanitize', 'pascalprecht.translate', 'ui.bootstrap.typeahead', 'angularPayments', 'ngCookies', 'services.config', 'angularSpinner', 'infinite-scroll', 'ngTouch', 'rt.debounce', 'djds4rce.angular-socialshare']);
mdlDirectTvApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/views/customainpage1.html',
        controller: 'CustomainpageCtrl',
        subscriptionStatus: false
    }).
    when('/loggedinSubscriber', {
        templateUrl: '/views/loggedinSubscriber/loggedinSubscriber.html',
        controller: 'LoggedinSubscriberCtrl',
        subscriptionStatus: false
    }).
    when('/updateError', {
        templateUrl: '/views/customainpage.html',
        controller: 'CustomainpageCtrl',
        subscriptionStatus: false
    }).
    when('/tvShow', {
        templateUrl: 'views/tvshow.html',
        controller: 'TVSingleAssetCtrl',
        subscriptionStatus: true
    }).
    when('/movie', {
        templateUrl: '/views/movieshow.html',
        controller: 'MovieSingleAssetCtrl',
        subscriptionStatus: true
    }).
    when('/channels', {
        templateUrl: 'views/channel_list.html',
        controller: 'ChannelsCtrl',
        subscriptionStatus: true
    }).
    when('/programs', {
        templateUrl: 'views/channel_programs.html',
        controller: 'ProgramsCtrl',
        subscriptionStatus: true
    }).
    when('/liveListOld', {
        templateUrl: 'views/live_list.html',
        controller: 'LiveCtrl',
        subscriptionStatus: true
    }).
    when('/liveList', {
        templateUrl: 'views/live_list_1.html',
        controller: 'LiveNewCtrl',
        subscriptionStatus: true
    }).
    when('/liveShow', {
        templateUrl: 'views/live.html',
        controller: 'LiveAssetCtrl',
        subscriptionStatus: true
    }).
    when('/promotions', {
        templateUrl: 'views/promotions.html',
        controller: 'PromotionsCtrl',
        subscriptionStatus: true
    }).
    when('/promotions-visitor', {
        templateUrl: 'views/visit_promotions.html',
        controller: 'PromotionsCtrl',
        subscriptionStatus: true
    }).
    when('/content', {
        templateUrl: 'views/customiframe.html',
        controller: 'IframeCtrl',
        subscriptionStatus: false
    }).
    when('/notcookie', {
        templateUrl: 'views/cookie.html',
        controller: 'thirdpartyCtrl',
        subscriptionStatus: false
    }).
    when('/requireCookie', {
        templateUrl: 'views/cookie.html',
        controller: 'thirdpartyCtrl',
        subscriptionStatus: false
    }).
    when('/aboutUs', {
        templateUrl: 'views/aboutUs.html',
        subscriptionStatus: false
    }).
    when('/termsOfUse', {
        templateUrl: 'views/termsOfUse.html',
        subscriptionStatus: false
    }).
    when('/privacyPolicy', {
        templateUrl: 'views/privacyPolicy.html',
        subscriptionStatus: false
    }).
    when('/systemRequirements', {
        templateUrl: 'views/systemRequirements.html',
        subscriptionStatus: false
    }).
    when('/sitemap', {
        templateUrl: 'views/sitemap.html',
        controller: 'SitemapCtrl',
        subscriptionStatus: false
    }).
    when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl',
        subscriptionStatus: false
    }).
    when('/back', {
        templateUrl: 'views/home.html',
        controller: 'RightNowCtrl',
        subscriptionStatus: false
    }).
    when('/page', {
        templateUrl: '/views/customainpage1.html',
        controller: 'CustomainpageCtrl',
        subscriptionStatus: true
    }).
    when('/page/:pageid', {
        templateUrl: '/views/customainpage1.html',
        controller: 'CustomainpageCtrl',
        subscriptionStatus: true
    }).
    when('/gpage/:pagetype/:source/:grouptype', {
        templateUrl: '/views/group.html',
        controller: 'GenreCtrl',
        subscriptionStatus: true
    }).
    when('/filter', {
        templateUrl: '/views/group.html',
        controller: 'GroupCtrl',
        subscriptionStatus: true
    }).
    when('/filter/:pagetype', {
        templateUrl: '/views/group.html',
        controller: 'GroupCtrl',
        subscriptionStatus: true
    }).
    when('/filterpage', {
        templateUrl: '/views/filterpage.html',
        controller: 'FilterPageCtrl',
        subscriptionStatus: true
    }).
    when('/filterpage/:pageid', {
        templateUrl: '/views/filterpage.html',
        controller: 'FilterPageCtrl',
        subscriptionStatus: true
    }).
    when('/signup', {
        redirectTo: '/selectPackage',
        subscriptionStatus: false
    }).
    when('/resetpwd', {
        templateUrl: '/views/signin/resetPassword.html',
        controller: 'resetPasswordCtrl',
        subscriptionStatus: false
    }).
    when('/login', {
        templateUrl: '/views/signin/signin.html',
        controller: 'LoginCtrl',
        subscriptionStatus: false
    }).
    when('/forgotPassword', {
        templateUrl: '/views/signin/forgotPassword.html',
        controller: 'forgotPasswordCtrl',
        subscriptionStatus: false
    }).
    when('/forgotMail', {
        templateUrl: '/views/signin/forgotMail.html',
        controller: 'forgotMailCtrl',
        subscriptionStatus: false
    }).
    when('/health', {
        templateUrl: '/health.html',
        subscriptionStatus: false
    }).
    when('/home', {
        redirectTo: '/',
        subscriptionStatus: true
    }).
    when('/notfound', {
        templateUrl: '/thirdpartycookie.html',
        subscriptionStatus: true
    }).
    when('/selectPackage', {
        templateUrl: '/views/signup/selectPackage.html',
        controller: 'SelectPackageCtrl',
        subscriptionStatus: false
    }).
    when('/createAccount', {
        templateUrl: '/views/signup/createAccount.html',
        controller: 'CreateAccountCtrl',
        subscriptionStatus: false
    }).
    when('/finalCheckout', {
        templateUrl: '/views/signup/finalCheckout.html',
        controller: 'FinalCheckoutCtrl',
        subscriptionStatus: false
    }).
    when('/signupSuccess', {
        templateUrl: '/views/signup/confirmSignup.html',
        controller: 'ConfirmSignupCtrl',
        subscriptionStatus: false
    }).
    when('/updatePaymentSuccess', {
        templateUrl: '/views/signup/confirmUpdatePayment.html',
        controller: 'ConfirmUpdatePaymentCtrl',
        subscriptionStatus: false
    }).
    when('/signupError', {
        templateUrl: '/views/signup/signupPaymentError.html',
        controller: 'signupPaymentErrorCtrl',
        subscriptionStatus: false
    }).
    when('/updatePaymentError', {
        templateUrl: '/views/signup/updatePaymentError.html',
        controller: 'updatePaymentErrorCtrl',
        subscriptionStatus: false
    }).
    when('/cancelAccount', {
        templateUrl: '/views/cancelSubscription/cancelSubscription.html',
        controller: 'CancelSubscriptionCtrl',
        subscriptionStatus: true
    }).
    when('/cancelledAccountConfirmation', {
            templateUrl: '/views/cancelSubscription/cancelledSubscriptionConfirmation.html',
            controller: 'cancelledSubscriptionConfirmationCtrl',
            subscriptionStatus: false
        }).
        //Desktop Manage Account
    when('/manageAccount', {
            templateUrl: '/views/account/manageAccount.html',
            controller: 'ManageAccountCtrl',
            subscriptionStatus: true
        }).
        //Mobile manage Account
    when('/m.manageAccount', {
        templateUrl: '/views/m.manageAccount/manageAccount.html',
        controller: 'MobileLoggedInSubscriberHomeCtrl',
        subscriptionStatus: true
    }).
    when('/m.personalInformation', {
        templateUrl: '/views/m.manageAccount/personalInformation.html',
        controller: 'MobileLoggedInSubscriberHomeCtrl',
        subscriptionStatus: true
    }).
    when('/m.billingInformation', {
        templateUrl: '/views/m.manageAccount/billingInformation.html',
        controller: 'MobileLoggedInSubscriberHomeCtrl',
        subscriptionStatus: true
    }).
    when('/m.subscriptionDetails', {
        templateUrl: '/views/m.manageAccount/subscriptionDetails.html',
        controller: 'MobileLoggedInSubscriberHomeCtrl',
        subscriptionStatus: true
    }).
    when('/m.profileSettings', {
            templateUrl: '/views/m.manageAccount/profileSettings.html',
            controller: 'MobileLoggedInSubscriberHomeCtrl',
            subscriptionStatus: true
        }).
        //Billing History
    when('/billingHistory', {
        templateUrl: '/views/account/billingHistory.html',
        controller: 'BillingHistoryCtrl',
        subscriptionStatus: true
    }).
    when('/search', {
        templateUrl: '/views/search/search.html',
        controller: 'NewSearchCtrl',
        subscriptionStatus: true
    }).
    when('/noSearchResult', {
        templateUrl: '/views/search/noSearchResult.html',
        controller: 'NoSearchResultCtrl',
        subscriptionStatus: true
    }).
    when('/welcome', {
        templateUrl: '/views/signup/welcome.html',
        controller: 'WelcomeCtrl',
        subscriptionStatus: true
    }).
    when('/loggedinSubscriber', {
        templateUrl: '/views/loggedinSubscriber/loggedinSubscriber.html',
        controller: 'LoggedinSubscriberCtrl',
        subscriptionStatus: true
    }).
    when('/m.welcome', {
        templateUrl: '/views/signup/m.welcome.html',
        controller: 'LoggedinSubscriberCtrl',
        subscriptionStatus: true
    }).
    otherwise({
        templateUrl: '/404.html'
    });
    // $locationProvider.html5Mode(true);
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]).config(['$translateProvider', 'configuration', function($translateProvider, configuration) {
    // Make changes to this section to change the location on language file
    $translateProvider.useStaticFilesLoader({
        prefix: configuration.server_url + '/lang/',
        suffix: ''
    });
    // $translateProvider.fallbackLanguage('en');
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.useLocalStorage();
    $translateProvider.useCookieStorage();
}]);
// AngularJS form field is dirty and invalid when page loads on IE10 only
mdlDirectTvApp.config(['$provide', function($provide) {
    $provide.decorator('$sniffer', ['$delegate', function($sniffer) {
        var msie = parseInt((/msie (\d+)/.exec(angular.lowercase(navigator.userAgent)) || [])[1], 10);
        var _hasEvent = $sniffer.hasEvent;
        $sniffer.hasEvent = function(event) {
            if (event === 'input' && msie === 10) {
                return false;
            }
            _hasEvent.call(this, event);
        };
        return $sniffer;
    }]);
}]);
mdlDirectTvApp.directive('bsPopover', function() {
    return function(scope, element, attrs) {
        element.find('a[rel=popover]').popover({
            placement: 'top',
            trigger: 'hover',
            html: 'true'
        });
    };
});