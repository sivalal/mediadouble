'use strict';
mdlDirectTvApp.factory('AppgridService', ['$http', '$rootScope', 'configuration', 'Sessions', function($http, $rootScope, configuration, Sessions) {
    var AppgridService = {
        GetPackagesWidth: function(packageList) { //this function will return details of current package
            var packageCount = packageList.length;
            var packageWidth = {};
            if (packageCount == 1) {
                packageWidth['container_width'] = 35;
                packageWidth['item_class_in_modal'] = "col-md-12 col-sm-12 col-xs-12";
                packageWidth['item_class_in_home'] = "col-md-12 col-sm-12 col-xs-12 onePackage";
            } else if (packageCount % 2 === 0) {
                packageWidth['container_width'] = 55;
                packageWidth['item_class_in_modal'] = "col-md-6 col-sm-6 col-xs-12";
                packageWidth['item_class_in_home'] = "col-md-6 col-sm-6 col-xs-12";
            } else if (packageCount % 3 === 0) {
                packageWidth['container_width'] = 80;
                packageWidth['item_class_in_modal'] = "col-md-4 col-sm-6 col-xs-12";
                packageWidth['item_class_in_home'] = "col-md-4 col-sm-6 col-xs-12";
            } else {
                packageWidth['container_width'] = 80;
                packageWidth['item_class_in_modal'] = "col-md-4 col-sm-6 col-xs-12";
                packageWidth['item_class_in_home'] = "col-md-12 col-sm-6 col-xs-12";
            }
            return packageWidth;
        },
        SetFooterInSession: function(packageList) { //this function will return details of current package
            $rootScope.packageList = packageList;
        },
        GetFooterInSession: function() { //this function will return details of current package
            return $rootScope.packageList;
        },
        emailNotification: function() {
            var promise = $http.get(configuration.server_url + '/live/email_notification?email=' + $rootScope.emailId + '&username=' + $rootScope.firstName + '&lang=' + Sessions.getLanguage()).then(function(response, headers) {
                return response.data;
            });
            return promise;
        }
    }
    return AppgridService;
}]);