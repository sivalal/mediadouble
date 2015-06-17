'use strict';
/*
 * Profile Settings Controller
 */
mdlDirectTvApp.controller('profileSettingsCtrl', ['$scope', '$parse', '$modal', 'dateFilter', '$http', 'AccountService', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', 'Gigya',
    function($scope, $parse, $modal, dateFilter, $http, AccountService, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, Gigya) {
        $scope.show = false;
        $scope.isProcessSuccess = false;
        $scope.ajaxProfileUserInfoSpinner = false;
        $scope.newObject = {};
        /**
         *
         * On click get user related information in account membership page
         */
        $rootScope.getAccountDetails = function() {
            //get user details
            Authentication.getFullUserRelatedData($rootScope.userid).then(function(userData) {
                console.log("User data");
                console.log(userData);
                if (userData.errorStatus == 0 && userData.statusCode == 200) {
                    var appgridUserNotifications = $scope.manageNotificationEmails;
                    if (isOldUser(userData, appgridUserNotifications)) {
                        var userNotifications = getNotificationStatusForOldUsers(userData.data.newsletter, userData, appgridUserNotifications);
                        var gigyaUserData = getGigyaUserData(userNotifications);
                        console.log("userNotifications");
                        console.log(userNotifications);
                        $scope.updateGiyaNotificationForOldUsers(gigyaUserData);
                        //update the gigya user account
                    } else {
                        var userNotifications = getNotificationStatusForOldUsers(null, userData, appgridUserNotifications);
                        $scope.newObject = userNotifications;
                    }
                }
            });
        };
        /*Appgid Asset Watch*/
        $rootScope.$watch('appGridMetadata', function(newValue, oldValue) {
            if (newValue !== '') {
                $scope.manageNotificationEmails = $rootScope.appGridMetadata.gigya['profile_settings'];
                $scope.connectDevicesURL = $rootScope.appGridMetadata.gigya['connect_devices'];
                $scope.disableAllNotiMessages = $rootScope.appGridMetadata.gigya['disable_all_notif'];
                console.log($scope.disableAllNotiMessages);
                $rootScope.getAccountDetails();
                console.log($scope.manageNotificationEmails);
            }
        });
        //    function getUserMailNotifications(appgridNotificationEmails,userHasNotification){
        //        var notifications=[];
        //        var totalUserNotifications=userHasNotification.length;
        //        for(var i=0;i<totalUserNotifications;i++){
        //            var isExistNotif=getNotification(appgridNotificationEmails,userHasNotification[i]);
        //            if(isExistNotif==null){
        //                return notifications;
        //            }
        //            if(userHasNotification[i]==isExistNotif['gigya_custom_key']){
        //                notifications.push(isExistNotif);
        //            }
        //        }
        //        return notifications;
        //    };
        $scope.manageAlertMessage = function(message) {
            $('.alertMsg').html(message[$rootScope.CurrentLang]);
            $('.alertMsg').show();
            setTimeout(function() {
                $('.alertMsg').fadeOut("slow", function() {
                    $('.alertMsg').hide();
                });
            }, 3000);
        };
        //    function getNotification(appgridNotificationEmails,key_notif){
        //        var notif=null;
        //        for(var i=0;i<appgridNotificationEmails.length;i++){
        //            if(appgridNotificationEmails[i]['gigya_custom_key']===key_notif){
        //                notif=appgridNotificationEmails[i];
        //                return notif;
        //            }
        //        }
        //        return notif;
        //    };
        //    function jsonObjectToArray(jsonObject){
        //        var keys=Object.keys(jsonObject);
        //        var jsonToArray=[];
        //        var keyLength=keys.length;
        //        for(var k=0;k<keyLength;k++){
        //            var key=keys[k];
        //            var singleObject={};
        //            singleObject[key]=jsonObject[key];
        //            jsonToArray.push(singleObject);
        //        }
        //        console.log(jsonToArray);
        //        return jsonToArray;
        //    };
        //    function userNotificationStatus(userNotifications,gigyaUserNotifications){
        //        var notifStatusObject={};
        //        for(var i=0;i<gigyaUserNotifications.length;i++){
        //            if(typeof userNotifications[i]=='undefined'){
        //                return notifStatusObject;
        //            }
        //            var gigya_custom_key=userNotifications[i].gigya_custom_key;
        //            if(gigyaUserNotifications[i][gigya_custom_key]== userNotifications[i].gigya_custom_false_value){
        //                notifStatusObject[gigya_custom_key]=userNotifications[i].gigya_custom_false_value;
        //            }else if(gigyaUserNotifications[i][gigya_custom_key]== userNotifications[i].gigya_custom_true_value){
        //                notifStatusObject[gigya_custom_key]=userNotifications[i].gigya_custom_true_value;
        //            }
        //        }
        //        return notifStatusObject;
        //    };
        $scope.disableAllNotif = function() {
            for (var i = 0; i < $scope.userNotifications.length; i++) {
                var gigya_custom_key = $scope.userNotifications[i].gigya_custom_key;
                $scope.newObject[gigya_custom_key] = $scope.userNotifications[i].gigya_custom_false_value;
            }
            $scope.updateGiyaNotification();
        };
        $scope.updateGiyaNotification = function(notifObj) {
            console.log("notif obj");
            console.log(notifObj);
            var userData = {
                UID: $rootScope.userid,
                notificationKey: "profile_settings",
                notification: JSON.stringify($scope.newObject),
                type: "notification",
                action: 'setInfo'
            };
            $scope.ajaxProfileUserInfoSpinner = true;
            AccountService.SetAccountInfo(userData).then(function(response) {
                response = response.data;
                if (response.errorStatus == 0 && response.statusCode == 200) {
                    console.log("status");
                    console.log(response);
                    $scope.setNotificationMessages(notifObj);
                    $scope.manageAlertMessage($scope.notificationSuccessMsg, 'success');
                } else {
                    $scope.setGigyaErrorNotificationMessages(notifObj);
                    console.log("not status");
                    console.log(response);
                    $scope.manageAlertMessage($scope.notificationErrorMsg, 'error');
                }
                $scope.ajaxProfileUserInfoSpinner = false;
            });
        };
        $scope.manageAlertMessage = function(message, status) {
            $('.alertMsg').html(message[$rootScope.CurrentLang]);
            if (status == 'success') {
                $('.alertMsg').removeClass('informationError');
                $('.alertMsg').addClass('informationSuccess');
            } else if (status == 'error') {
                $('.alertMsg').removeClass('informationSuccess');
                $('.alertMsg').addClass('informationError');
            }
            $('.alertMsg').show();
            setTimeout(function() {
                $('.alertMsg').fadeOut("slow", function() {
                    $('.alertMsg').hide();
                });
            }, 3000);
        };
        // disableAll,notification
        $scope.setGigyaErrorNotificationMessages = function(notifObject) {
            if (typeof notifObject === 'undefined') {
                $scope.notificationErrorMsg = $scope.disableAllNotiMessages.gigya_error_disable_all;
            } else {
                $scope.notificationErrorMsg = notifObject.gigya_error_message;
            }
        };
        $scope.setNotificationMessages = function(notifObject) {
            if (typeof notifObject === 'undefined') {
                $scope.notificationSuccessMsg = $scope.disableAllNotiMessages.disable_all_notif_success;
            } else {
                var gigya_custom_key = notifObject.gigya_custom_key;
                var notifObjectStatus = $scope.newObject[gigya_custom_key];
                if (notifObject.gigya_custom_true_value === notifObjectStatus) {
                    //subscribed emails;
                    $scope.notificationSuccessMsg = notifObject.notif_success_msg;
                } else {
                    //unsubscribed emails
                    $scope.notificationSuccessMsg = notifObject.notif_error_msg;
                }
            }
        };
        $scope.show = false;
        $scope.toggleShow = function() {
            if ($scope.show) {
                $scope.show = false;
            } else {
                $scope.show = true;
            }
        };

        function isOldUser(userData, appgridUserNotifications) {
            var profileSettings = (typeof userData.data.profile_settings != 'undefined') ? parseAppgridData(userData.data.profile_settings) : [];
            var user_notifications = Object.keys(profileSettings);
            //appgrid notifications and the user notification should be same. if not equal, 
            //should need to update in users gigya account
            if (typeof userData.data.newsletter != 'undefined' && appgridUserNotifications.length != user_notifications.length) {
                return true;
            }
            return false;
        };

        function getNotificationStatusForOldUsers(isNewsLetter, userData, appgridUserNotifications) {
            var userProfileSettings = (typeof userData.data.profile_settings != 'undefined') ? parseAppgridData(userData.data.profile_settings) : [];
            var notifStatusObject = {};
            for (var i = 0; i < appgridUserNotifications.length; i++) {
                var ckey = appgridUserNotifications[i].gigya_custom_key;
                //old user with no profile settings key (very old user)
                if (typeof userData.data.profile_settings == 'undefined') {
                    if (appgridUserNotifications[i].gigya_custom_key.toLowerCase().indexOf('newsletter') > -1 && isNewsLetter) {
                        notifStatusObject[ckey] = appgridUserNotifications[i].gigya_custom_true_value;
                    } else if (appgridUserNotifications[i].gigya_custom_key.toLowerCase().indexOf('newsletter') > -1 && !isNewsLetter) {
                        notifStatusObject[ckey] = appgridUserNotifications[i].gigya_custom_false_value;
                    } else {
                        notifStatusObject[ckey] = appgridUserNotifications[i].gigya_custom_false_value;
                    }
                } else {
                    if (userProfileSettings[ckey] == appgridUserNotifications[i].gigya_custom_false_value) {
                        notifStatusObject[ckey] = appgridUserNotifications[i].gigya_custom_false_value;
                    } else if (userProfileSettings[ckey] == appgridUserNotifications[i].gigya_custom_true_value) {
                        notifStatusObject[ckey] = appgridUserNotifications[i].gigya_custom_true_value;
                    } else {
                        notifStatusObject[ckey] = appgridUserNotifications[i].gigya_custom_false_value;
                    }
                }
            }
            return notifStatusObject;
        };

        function getGigyaUserData(newobj) {
            var userData = {
                UID: $rootScope.userid,
                notificationKey: "profile_settings",
                notification: JSON.stringify(newobj),
                type: "notification",
                action: 'setInfo'
            };
            return userData;
        };
        $scope.updateGiyaNotificationForOldUsers = function(userData) {
            console.log("update notif");
            console.log(userData);
            var notifStatus = parseAppgridData(userData.notification);
            console.log(notifStatus);
            AccountService.SetAccountInfo(userData).then(function(response) {
                response = response.data;
                if (response.errorStatus == 0 && response.statusCode == 200) {
                    $scope.newObject = notifStatus;
                    console.log($scope.newObject);
                } else {}
            });
        };
    }
]);