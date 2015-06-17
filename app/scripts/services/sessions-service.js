'use strict';
mdlDirectTvApp.factory('Sessions', ['$http', '$rootScope', function($http, $rootScope) {
    //  $cookieStore.put('loggedin', true);
    var Sessions = {
        SetLogin: function(userid, emailId, firstName, lastName, provider, expiration) {
            Sessions.setCookie('loggedin', true, expiration);
            var username = firstName + ' ' + lastName;
            if (userid) Sessions.setCookie('userid', userid, expiration);
            if (emailId) Sessions.setCookie('emailId', emailId, expiration);
            if (firstName) Sessions.setCookie('firstName', firstName, expiration);
            if (lastName) Sessions.setCookie('lastName', lastName, expiration);
            if (username) Sessions.setCookie('username', username, expiration);
            if (provider) Sessions.setCookie('provider', provider, expiration);
            Sessions.setCookie('liveReminderNotification', true, expiration);
            Sessions.setCookie('enableThirdParty', true, expiration);
            $rootScope.isLoggedIn = true;
            $rootScope.userid = userid;
            $rootScope.emailId = emailId;
            $rootScope.firstName = firstName;
            $rootScope.lastName = lastName;
            $rootScope.provider = provider;
            $rootScope.username = username;
        },
        Logout: function() {
            Sessions.setCookie('billing_address_' + $rootScope.userid, '', -1);
            Sessions.setCookie('package_list_' + $rootScope.userid, '', -1);
            localStorage.removeItem('package_list_' + $rootScope.userid);
            Sessions.setCookie('loggedin', '', false);
            Sessions.setCookie('userid', '', -1);
            Sessions.setCookie('firstName', '', -1);
            Sessions.setCookie('lastName', '', -1);
            Sessions.setCookie('provider', '', -1);
            Sessions.setCookie('signupPackageId', '', -1);
            Sessions.setCookie('accessToken', '', -1);
            Sessions.setCookie('adminAction', '', -1);
            Sessions.setCookie('adminIndex', '', -1);
            Sessions.setCookie('transSessionId', '', -1);
            Sessions.setCookie('liveReminderNotification', '', -1);
            Sessions.setCookie('subscriptionStatus', '', -1);
            Sessions.setCookie('username', '', -1);
            Sessions.setCookie('isAccountCreatedInVindicia', '', -1);
            Sessions.setCookie('auth_id', '', -1);
            Sessions.setCookie('emailId', '', -1);
            Sessions.setCookie('subscriptionStatus', '', -1);
            $rootScope.isLoggedIn = false;
            $rootScope.userid = $rootScope.emailId = $rootScope.firstName = $rootScope.lastName = $rootScope.packages = $rootScope.provider = $rootScope.signupPackageId = $rootScope.accessToken = $rootScope.adminAction = $rootScope.adminIndex = $rootScope.globalWatchlistIds = $rootScope.socialProviders = undefined;
        },
        isLoggedIn: function() {
            var x = Sessions.getCookie('loggedin');
            return x;
        },
        setLanguage: function(lang) {
            Sessions.setCookie('current_language', lang, Sessions.setExpiryForCookie());
            $rootScope.CurrentLang = lang;
            $rootScope.ajaxLangSpinner = false;
            return true;
        },
        getLanguage: function() {
            $rootScope.CurrentLang = $rootScope.empty(Sessions.getCookie('current_language')) ? "en_US" : Sessions.getCookie('current_language');
            return $rootScope.CurrentLang;
        },
        GetUserData: function() {
            if (typeof Sessions.getCookie('loggedin') != 'undefined') $rootScope.isLoggedIn = Sessions.getCookie('loggedin');
            if (typeof Sessions.getCookie('userid') != 'undefined') $rootScope.userid = Sessions.getCookie('userid');
            if (typeof Sessions.getCookie('emailId') != 'undefined') $rootScope.emailId = Sessions.getCookie('emailId');
            if (typeof Sessions.getCookie('firstName') != 'undefined') $rootScope.firstName = Sessions.getCookie('firstName');
            if (typeof Sessions.getCookie('lastName') != 'undefined') $rootScope.lastName = Sessions.getCookie('lastName');
            if (typeof Sessions.getCookie('provider') != 'undefined') $rootScope.provider = Sessions.getCookie('provider');
        },
        setRememberme: function(value) {
            Sessions.setCookie('isRememberme', value);
        },
        setExpiryForCookie: function() {
            var cookieValue = Sessions.getCookie('isRememberme');
            var expiry = (cookieValue == 'true') ? (365 * 25) : 0;
            return expiry;
        },
        setCookie: function(name, value, expires, path, domain, secure) {
            var cookieStr = name + "&*=*&" + value + "; ";
            if (expires) {
                expires = Sessions.setExpiration(expires);
                cookieStr += "expires=" + expires + "; ";
            }
            if (path) {
                cookieStr += "path=" + path + "; ";
            }
            if (domain) {
                cookieStr += "domain=" + domain + "; ";
            }
            if (secure) {
                cookieStr += "secure; ";
            }
            document.cookie = cookieStr;
        },
        setExpiration: function(cookieLife) {
            var today = new Date();
            var expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000);
            return expr.toGMTString();
        },
        getCookie: function(value) {
            var cName = "";
            var pCOOKIES = new Array();
            pCOOKIES = document.cookie.split('; ');
            for (var bb = 0; bb < pCOOKIES.length; bb++) {
                var NmeVal = new Array();
                NmeVal = pCOOKIES[bb].split('&*=*&');
                if (NmeVal[0] == value) {
                    cName = NmeVal[1];
                }
            }
            return cName;
        }
    };
    return Sessions;
}]);