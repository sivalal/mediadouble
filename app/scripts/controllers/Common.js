'use strict';
/* Common function defined here */
mdlDirectTvApp.run(['$rootScope', '$q', 'WatchListService', 'Vindicia', '$interval', 'slidenav', '$modal', '$translate', '$http', '$route', 'SocialService', '$window', 'Sessions', 'Authentication', '$sce', 'configuration', '$location', 'XDRService', 'AppgridService', '$filter', 'CookieService', '$FB', '$log', '$timeout', 'GoogleTagManagerService',
    function($rootScope, $q, WatchListService, Vindicia, $interval, slidenav, $modal, $translate, $http, $route, SocialService, $window, Sessions, Authentication, $sce, configuration, $location, XDRService, AppgridService, $filter, CookieService, $FB, $log, $timeout, GoogleTagManagerService) {
        /*Aborts the $http request*/
        var canceler = $q.defer();

        //to restore the cookie values
        Sessions.GetUserData();
        $rootScope.isLoggedIn = Sessions.isLoggedIn();
        $rootScope.routePath = $location.path();
        // Call Google Tag Manager everytime the page is changed or a modal is opened / navigated
        $rootScope.$on('$viewContentLoaded', function() {
            var path = $location.path(),
                absUrl = $location.absUrl(),
                virtualUrl = (path === '/') ? path : absUrl.substring(absUrl.indexOf(path));
            GoogleTagManagerService.push({
                event: 'virtualPageView',
                virtualUrl: virtualUrl
            });
        });
        $rootScope.checkPackagesSubscribedOrNot = function() {

            $rootScope.userSubscribedPackages = [];
            $rootScope.userUnSubscribedPackages = [];
            //console.log($rootScope.userProductList);
            $rootScope.$watch("userProductList", function(newValue, oldValue) {
                if (newValue == 'undefined' || typeof newValue == 'undefined') {
                    return true; // packageList not updated yet
                }
                console.log("subscribedPacks");
                var subscribedPacks = $rootScope.userProductList;
                console.log(subscribedPacks);
                if (!!$rootScope.packageObjList) {
                    for (var i = 0; i < $rootScope.packageObjList.length; i++) {
                        var isSub = false;
                        if (subscribedPacks.indexOf($rootScope.packageObjList[i].id) > -1) {
                            $rootScope.packageObjList[i].isSubscribed = true;
                            $rootScope.packageObjList[i].newPackageSelection = $rootScope.packageObjList[i].packageSelection = true;
                            $rootScope.userSubscribedPackages.push($rootScope.packageObjList[i]);
                        } else {
                            $rootScope.packageObjList[i].isSubscribed = false;
                            $rootScope.userUnSubscribedPackages.push($rootScope.packageObjList[i]);
                        }
                    }
                }
                console.log("userProductList");
                console.log($rootScope.userProductList);
                $rootScope.packagesReady = $rootScope.userProductList;
            });
        };
        $rootScope.$watch('[packageListNEW,userProductList]', function(newValue, oldValue) {
            if ((newValue[0] == 'undefined' || typeof newValue[0] == 'undefined') && (newValue[1] == 'undefined' || typeof newValue[1] == 'undefined')) {
                return true; // packageList not updated yet
            }
            //check packageObjList already defined
            if ($rootScope.empty($rootScope.packageObjList)) {
                for (var i in newValue[0]) {
                    if (newValue[0][i].checkbox_status == "checked") {
                        newValue[0][i].packageSelection = newValue[0][i].newPackageSelection = true;
                    } else {
                        newValue[0][i].packageSelection = newValue[0][i].packageSelection = false;
                    }
                }
                $rootScope.packageObjList = newValue[0];
                $rootScope.checkPackagesSubscribedOrNot();

            }
        }, true);
        $rootScope.$watch("appInfo", function(val) {
            if (!!val && !!val.fb_id) {
                var fb_id = !!val.fb_id ? val.fb_id : '';
                if (!!fb_id) {
                    $FB.init(fb_id);
                }
            }
        });
        $rootScope.isMobileScreen = function() {
            if (isMobile.any()) {
                return true;
            } else {
                return false;
            }
            console.log("isMobileSize");
            console.log("$rootScope.subscriptionStatus");
            console.log($rootScope.subscriptionStatus);
        };
        //check user subscription status
        $rootScope.subscriptionStatus = Sessions.getCookie('subscriptionStatus');
        $rootScope.GetsubscriptionStatus = function() {
            console.log("subscriptionstatus==>");
            console.log(Sessions.getCookie("subscriptionStatus"));
            return (Sessions.getCookie("subscriptionStatus") != "true") ? false : true;
        };
        // //To Chech whether to call the instant people call in search page
        // $rootScope.doInstantCall = true;
        $rootScope.subscriptionStatus = $rootScope.GetsubscriptionStatus();
        $rootScope.ShowLogoutForNonSubscribedLoginUser = $rootScope.isLoggedIn && ($rootScope.subscriptionStatus == false);
        /////////////////////////Generate Account Token///////////////////////////////
        if (Sessions.getCookie("subscriptionStatus") && Sessions.getCookie("loggedin")) {
            //set Account token and generate every 5 mins
            Authentication.GetUserAccountToken();
        }
        $rootScope.entitlementCheck = function(isInitial) {
            //store entitlement to cookie
            Vindicia.getUserPackageDetailsByPurchase().then(function(entitlementResponse) {
                var response = entitlementResponse.responseContent;
                if (entitlementResponse.responseStatus == 200 || (response.status && response.status.http_code == 200)) {
                    $rootScope.getUserPackageDetailsByPurchaseResp = response;
                    $rootScope.userSubscriptionStatus = response.subscriptionStatus;
                    $rootScope.userProductList = response.cookieProductList;
                    $rootScope.userTierList = response.cookieEntitlements;
                    $rootScope.productObj = response.productObj;
                    $rootScope.basicExpDate = $filter('date')(new Date(response.basicPackExpiryDate), 'MMMM d, y');
                    var basicExpDate = moment(new Date(response.basicPackExpiryDate)).format("YYYY-MM-DD DD"); //Putting DD just to parse by dateDifference()
                    $rootScope.basicPackDaysRemaining = $rootScope.dateDifference(basicExpDate);
                    if (response.subscriptionStatus = "Active") {
                        $rootScope.nextBillingDate = $filter('date')(new Date(response.nextBillingDate), 'MMMM d, y'); //Next Billing date
                        $rootScope.basicPackAmount = response.totalPrice;
                    }
                    console.log("user product list cookie");
                    console.log($rootScope.userProductList);
                    console.log("user tier list");
                    console.log($rootScope.userTierList);
                    console.log("user productObj");
                    console.log($rootScope.productObj);
                    var deletedPackIds = [];
                    for (var i in $rootScope.productObj) {
                        deletedPackIds.push($rootScope.productObj[i].id);
                    }
                    $rootScope.addExpiryDate(deletedPackIds);
                    if (isInitial == true) {
                        checkSubscriptions();
                    }
                } else {
                    if (entitlementResponse.responseStatus == 500 || typeof response == "string") {
                        $rootScope.enableErrorAlertMessage((typeof response != 'undefined') ? entitlementResponse.responseStatus.toString() : 'TRANSACTION_FAILED_MSG');
                    } else {
                        $rootScope.enableErrorAlertMessage((typeof response.status != 'undefined') ? response.status.code.toString() : 'TRANSACTION_FAILED_MSG');
                    }
                }
            });
            //gets list of items in wathclist
            WatchListService.GetAllIds().then(function(response, status) {
                if ((response != null) && (typeof response != "string")) {
                    $rootScope.parseWatchlistAndStoreIdsInVariable(response);
                }
            });
        };
        $rootScope.dateDifference = function(expDate) {
            var expDate = (expDate.split(" "))[0].split("-");
            var momentExpDate = moment([parseInt(expDate[0]), parseInt(expDate[1]) - 1, parseInt(expDate[2])]);
            var currDate = moment().format();
            currDate = (currDate.split("T"))[0].split("-");
            console.log(parseInt(currDate[0]) + ' ' + parseInt(currDate[1]) - 1 + ' ' + parseInt(currDate[2]));
            var momentCurrDate = moment([parseInt(currDate[0]), parseInt(currDate[1]) - 1, parseInt(currDate[2])]);
            console.log(parseInt(expDate[0]) + ' ' + parseInt(expDate[1]) - 1 + ' ' + parseInt(expDate[2]));
            var dayDifference = momentExpDate.diff(momentCurrDate, 'days');
            return dayDifference;
        };
        $rootScope.forgotPassword = function() {
            $location.path("/forgotPassword");
        };
        $rootScope.addExpiryDate = function(deletedIDs) {
            $rootScope.$watch("packageObjList", function(newValue, oldValue) {
                if (newValue == 'undefined' || typeof newValue == 'undefined' || newValue == '') {
                    return true; // packageList not updated yet
                }
                for (var i in $rootScope.packageObjList) {
                    //set users basicPackageId
                    if ($rootScope.packageObjList[i].type == 'package') {
                        if (deletedIDs.indexOf($rootScope.packageObjList[i].id) > -1) {
                            $rootScope.basicPackageId = $rootScope.packageObjList[i].id;
                        } else if (deletedIDs.indexOf($rootScope.packageObjList[i].id_returning_customer) > -1) {
                            $rootScope.basicPackageId = $rootScope.packageObjList[i].id_returning_customer;
                        }
                    }
                    if (deletedIDs.indexOf($rootScope.packageObjList[i].id) > -1) {
                        var removingObj = $filter('filter')($rootScope.productObj, {
                            id: $rootScope.packageObjList[i].id
                        });
                        console.log('removingObj');
                        console.log(removingObj[0]);
                        if ($rootScope.packageObjList[i].type == 'package') {
                            if ($rootScope.packageObjList[i].is_free_trial_enabled == true) {
                                $rootScope.showTrialText = true;
                                $rootScope.freeTrialDays = $rootScope.packageObjList[i].free_days;
                            }
                        } else {
                            if (removingObj[0].ExpireDate != "0001-01-01 12:00:00" && removingObj[0].ExpireDate != null) {
                                var dayDifference = $rootScope.dateDifference(removingObj[0].ExpireDate);
                                $rootScope.packageObjList[i].expirationDuration = dayDifference;
                                $rootScope.packageObjList[i].showExpiration = true;
                                $rootScope.packageObjList[i].billing_plan.is_show_description = false;
                            }
                        }
                    }
                }
            });
        };

        function checkSubscriptions() {
            //3600000
            setInterval(function() {
                var products = $rootScope.productObj;
                for (var i = 0; i < products.length; i++) {
                    var subscriptionDate = new Date(products.ActualExpireDate);
                    var currentDate = new Date();
                    if (subscriptionDate < currentDate) {
                        //make purchase call
                        $rootScope.entitlementCheck(false);
                    }
                    console.log("trigger check sub");
                }
            }, 600000);
        };

        $rootScope.onLogoClick = function() {
            if ($rootScope.routePath == '/notcookie') {
                $rootScope.cookieSpinner = false;
                $rootScope.cookieLogOut();
            } else {
                $rootScope.showHideMenuElementsBasedOnLoggedinStatus();
                if (!isMobile.any()) {
                    jQuery("html,body").animate({
                        scrollTop: 0
                    }, 1000);
                    $location.path('/').search('');
                } else {
                    $location.path('/m.manageAccount').search('');
                }
            }
        };
        $rootScope.redirectToHome = function() {
            window.location.replace('/');
        };

        /*Hide menu based on user status and route*/
        $rootScope.showHideMenuElementsBasedOnLoggedinStatus = function() {
            $rootScope.ShowLogoutForNonSubscribedLoginUser = $rootScope.isLoggedIn && ($rootScope.subscriptionStatus == false);
            if ((Sessions.getCookie("subscriptionStatus") != "true") && ($rootScope.routePath == '/')) {
                $rootScope.loginModalDisplay = false;
                jQuery('#menu').css('background', 'transparent');
                (!$rootScope.isMobileScreen()) ? jQuery('#logo').hide(): jQuery('#logo').show();
                jQuery('#main-nav-container').removeClass('navbar-fixed-top').css('position', 'absolute').css('width', '100%');
                jQuery('#menuDesktop').hide();
                jQuery('#helpSear').hide();
                jQuery('#logDrop').hide();
                jQuery('#adminBtn').hide();
                jQuery('#mobButtonContainer').hide();
                jQuery('#mobileCollapsingMenu').hide();
                jQuery('#language-onoffswitch-label').removeClass("onoffswitch-label-blue");
                jQuery('#language-onoffswitch-switch').removeClass("onoffswitch-switch-blue");
            }
            if (isMobile.any() && ($rootScope.routePath == '/') && Sessions.getCookie("subscriptionStatus")) {
                $rootScope.setMenuBackgroundColorWithLogo();
                $location.path('/m.manageAccount').search('');
            }
        };
        $rootScope.setMenuBackgroundColorWithLogo = function() {
            jQuery('#menu').show();
            jQuery('#logo').show();
            jQuery('#menu').css('background', '#34ace0');
            jQuery('#language-onoffswitch-label').addClass("onoffswitch-label-blue");
            jQuery('#language-onoffswitch-switch').addClass("onoffswitch-switch-blue");
            jQuery('#menuDesktop').hide();
            jQuery('#helpSear').hide();
            jQuery('#mobButtonContainer').hide();
            jQuery('#mobileCollapsingMenu').hide();
            jQuery('#logDrop').hide();
            jQuery('#adminBtn').hide();
        };
        $rootScope.setMenuBackgroundTransparentWithoutLogo = function() {
            jQuery('#menu').css('background', 'transparent');
            jQuery('#language-onoffswitch-label').removeClass("onoffswitch-label-blue");
            jQuery('#language-onoffswitch-switch').removeClass("onoffswitch-switch-blue");
            (!$rootScope.isMobileScreen()) ? jQuery('#logo').hide(): jQuery('#logo').show();
        };

        $rootScope.$on('authTokenSet', function(event, data) {
            if (Sessions.getCookie("subscriptionStatus")) {
                $rootScope.entitlementCheck(true);
            }
        });
        $rootScope.$on("$routeChangeStart", function(event, next, current) {
            var isLoggedInCookieValue = Sessions.getCookie("loggedin");
            if (typeof isLoggedInCookieValue == 'undefined' || isLoggedInCookieValue != 'true') {
                $rootScope.isLoggedIn = false;
            } else if (isLoggedInCookieValue == 'true') {
                $rootScope.isLoggedIn = true;
            }
            console.log("----next object-------");
            console.log(next);

            if (next && next.$$route) {
                $rootScope.showHideMenuElementsBasedOnLoggedinStatus();
                if (next.$$route.subscriptionStatus) {
                    console.log("hello");
                    if (!$rootScope.isLoggedIn || !Sessions.getCookie("subscriptionStatus")) {
                        //   require subscriptionStatus to be true
                        console.log("user subscriptionStatus true for :");
                        var curUrl = next.$$route.originalPath;
                        console.log(curUrl);
                        console.log("redirecting to visitor home")
                        window.location.replace('/');
                    }
                }
            }
            
            $rootScope.subscriptionStatus = $rootScope.GetsubscriptionStatus();
        });
        // Call Google Tag Manager everytime the page is changed or a modal is opened / navigated
        /*  $rootScope.$on('$viewContentLoaded', function() {
        var path = $location.path(),
            absUrl = $location.absUrl(),
            virtualUrl = (path === '/') ? path : absUrl.substring(absUrl.indexOf(path));
        GoogleTagManagerService.push({ event: 'virtualPageView', virtualUrl: virtualUrl });
    });
*/
        //hide white container on filter page
        jQuery(".partialContainer").removeClass("removeSecondContainer");
        /*Hiding Admin section*/
        if ($rootScope.isLoggedIn && Sessions.getCookie("subscriptionStatus") == "true") {
            jQuery("#navig").show();
            jQuery("#contentOver").show();
        } else {
            jQuery("#navig").hide();
            jQuery("#contentOver").hide();
        }
        $rootScope.showHideMenuElementsBasedOnLoggedinStatus();
        if ((Sessions.getCookie("subscriptionStatus") != "true") && ($rootScope.routePath == '/')) {
            jQuery(document).scroll(function() {
                if (jQuery('#scrollAnchor').length) {
                    if (jQuery(this).scrollTop() >= jQuery('#scrollAnchor').position().top) {
                        $rootScope.setMenuBackgroundColorWithLogo();
                        $rootScope.isScrollTop = true;
                    } else {
                        $rootScope.setMenuBackgroundTransparentWithoutLogo();
                        $rootScope.isScrollTop = false;
                    }
                }
            });
        }
        ///////////////NOTIFICATION MESSAGE//////////////////
        $rootScope.enableSucessAlertMessage = function(message, optionalCondition) {
            $rootScope.informationSuccessContainer = true;
            $rootScope.informationSuccessMessage = message;
            $timeout(function() {
                $rootScope.informationSuccessContainer = false;
                $rootScope.packageAddSuccessTxt = false;
            }, 50000);
        };
        $rootScope.enableErrorAlertMessage = function(message) {
            $rootScope.informationErrorContainer = true;
            $rootScope.informationErrorMessage = message;
            $timeout(function() {
                $rootScope.informationErrorContainer = false;
                $rootScope.packageAddErrorTxt = false;
            }, 50000);
        };
        $rootScope.closeSuccessMessageAlert = function() {
            $rootScope.informationSuccessContainer = false;
        };
        $rootScope.closeErrorMessageAlert = function() {
            $rootScope.informationErrorContainer = false;
        };
        //for a design issue topfix
        jQuery('.secondarySmallContainer,secondaryTopMenuContainer').on('change', function() {
            if (jQuery('.secondarySmallContainer,secondaryTopMenuContainer').is(":visible")) {
                jQuery('.st-site').addClass('topfix');
            } else {
                jQuery('.st-site').removeClass('topfix');
            }
        });
        //  old  <!-- ng-if="rail.usergroup=='all' || (rail.usergroup=='visitor' && accessToken=='') || (rail.usergroup=='subscribed' && accessToken!='')||(rail.usergroup!='visitor' && rail.usergroup!='all' && rail.usergroup!='subscribed')" -->
        $rootScope.railDisplayFilter = function(rail) {
                return (typeof rail.enabled == 'undefined') || (rail.enabled == 'true' && (typeof rail.authRequired == 'undefined')) || (rail.enabled == 'true' && (rail.authRequired == 'false')) || (rail.enabled == 'true' && (rail.authRequired == 'true' && $rootScope.isLoggedIn == 'true'));
            }
            /////////////////////////////GLOBAL VARIABLE SET FOR STORING THE WATCHLIST IDS START///////////////////////////////
        $rootScope.parseWatchlistAndStoreIdsInVariable = function(watchlistContent) {
            var watchlistObj = [];
            angular.forEach(watchlistContent, function(value, key) {
                watchlistObj.push(value);
            });
            $rootScope.globalWatchlistIds = watchlistObj;
        };
        $rootScope.checkTitleIDExistInGlobalWatchlistIds = function(titleId) {
            if ($rootScope.isLoggedIn) {
                //                  if(typeof $rootScope.globalWatchlistIds!=='undefined' && $rootScope.globalWatchlistIds !=null &&
                //                  typeof $rootScope.globalWatchlistIds.length!=='undefined' )
                if (typeof $rootScope.globalWatchlistIds !== 'undefined' && $rootScope.globalWatchlistIds == null) {
                    return false;
                } else if (typeof $rootScope.globalWatchlistIds !== 'undefined' && $rootScope.globalWatchlistIds != null && typeof $rootScope.globalWatchlistIds.length !== 'undefined') {
                    for (var i = 0; i < $rootScope.globalWatchlistIds.length; i++) {
                        if ($rootScope.globalWatchlistIds[i] == titleId) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        };
        $rootScope.checkTitleExistInGlobalWatchlistIds = $rootScope.checkTitleIDExistInGlobalWatchlistIds;
        $rootScope.$watch("globalWatchlistIds", function(newVal) {
            if ($rootScope.isLoggedIn) {
                if (typeof newVal !== 'undefined' && newVal == null) {
                    $rootScope.showWatchlistButton = true;
                } else if (typeof newVal !== 'undefined' && typeof newVal.length !== 'undefined') {
                    $rootScope.showWatchlistButton = true;
                }
            } else {
                $rootScope.showWatchlistButton = false;
            }
        });
        /*
         * GetWatchListItemWithCallback
         * @param {type} titleId
         * @param {type} callback -> a function to be executed on knowing if titleId exists in watchlist
         * callback gets a boolean (true if in watchlist ,false if not in watchlist)
         * @returns {undefined}
         */
        $rootScope.GetWatchListItemWithCallback = function(titleId, callback) {
                if ($rootScope.isLoggedIn) {
                    if (typeof $rootScope.globalWatchlistIds !== 'undefined' && $rootScope.globalWatchlistIds != null && typeof $rootScope.globalWatchlistIds.length !== 'undefined') {
                        callback($rootScope.checkTitleIDExistInGlobalWatchlistIds(titleId));
                    } else {
                        WatchListService.Getlist().then(function(response) {
                            if (response != null) {
                                $rootScope.parseWatchlistAndStoreIdsInVariable(response);
                                callback($rootScope.checkTitleIDExistInGlobalWatchlistIds(titleId));
                            }
                        });
                    }
                } //end of if is loggin
            }
            /////////////////////////////GLOBAL VARIABLE SET FOR STORING THE WATCHLIST IDS STOP///////////////////////////////
            //get getPageDetails  of a pageId
        $rootScope.getPageDetails = function(pageId) {
            var pageDetails = null;
            //console.log('pages---->');
            //console.log($rootScope.appGridMetadata['pagesjson']);
            if (typeof $rootScope.appGridMetadata['pages'] !== 'undefined') {
                var pages = parseAppgridData($rootScope.appGridMetadata['pages']); // (JSON.parse($rootScope.appGridMetadata['pagesjson']));//$rootScope.appGridMetadata['pages'];
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].id === pageId) {
                        pageDetails = pages[i];
                        break;
                    }
                }
            } //end of typeof $rootScope.appGridMetadata['pagesjson']
            return pageDetails;
        }
        $rootScope.getSingleAssetBaseUrl = function(TitleTypeId) {
                if (_.contains([1, 3], TitleTypeId)) {
                    return "/movie";
                } else if (_.contains([2, 4, 5, 6], TitleTypeId)) {
                    return "/tvShow";
                } else {
                    return null;
                }
            }
            //end of set back button url by listening to url change
        $rootScope.getParameterByName = function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
        //set back button url by listening to url change
        $rootScope.backurl = function() {
            window.history.back();
        };
        $rootScope.listToMatrix = function(list, elementsPerSubArray) {
                var matrix = [],
                    i, k;
                if (list) {
                    for (i = 0, k = -1; i < list.length; i++) {
                        if (i % elementsPerSubArray === 0) {
                            k++;
                            matrix[k] = [];
                        }
                        matrix[k].push(list[i]);
                    }
                }
                return matrix;
            }
            ///////////////////SIGNUP////////////////////////////////////////////////
        $rootScope.billingAmountBasedOnFreePlanFilter = function(packageItem, freeBillingPlan) {
            var billingPlanPricing = $filter('filter')(packageItem.pricing[0].billing_plan.periods, {
                free: freeBillingPlan
            });
            var billingPlanPricingArray = {};
            billingPlanPricingArray['price_symbol'] = '$';
            billingPlanPricingArray['price_amount'] = billingPlanPricing[0].price_amount;
            billingPlanPricingArray['price_currency'] = billingPlanPricing[0].price_currency;
            return billingPlanPricingArray;
        }
        $rootScope.packageSelectedFromHome = function(packageItem) {
            $rootScope.nextBillingAmountForSelectedPackage = $rootScope.billingAmountBasedOnFreePlanFilter(packageItem, false);
            $rootScope.signupPackageId = packageItem.id;
            $rootScope.signupModal(2);
        };
        ///////////////////SIGNUP////////////////////////////////////////////////
        /////////////////////ADMIN MENU//////////////////////////////////////////
        $rootScope.openNav = function(selectedIndex, selectedAction) {
            if ((typeof Sessions.getCookie('loggedin') != 'undefined') && (Sessions.getCookie('loggedin') != 'false') && (Sessions.getCookie('loggedin') != 'null') && (Sessions.getCookie('loggedin') == 'true' || Sessions.getCookie('loggedin') == true)) {
                jQuery('.st-vertical-menu-container').show();
                $rootScope.subContentStyle = {
                    "width": ""
                };
                $rootScope.selectedAction = selectedAction;
                $rootScope.selectedIndex = selectedIndex;
                console.log($rootScope.asideMenu);
                // $rootScope.templateName = $rootScope.asideMenu[selectedIndex].path;
                $rootScope.itemClicked(selectedIndex, selectedAction);
                // $rootScope.entitlementCheck();
                slidenav.open();
            }
        };
        /////////////////////ADMIN MENU//////////////////////////////////////////
        $rootScope.empty = function(data) {
                if (typeof(data) == 'undefined' || data === null || data === '') {
                    return true;
                } else {
                    return false;
                }
            }
            //zipcode validation based on country------
        $rootScope.regex = /\d{5}-\d{4}$|^\d{5}$/;
        $rootScope.validate = function(regex) {
            if (typeof regex != 'undefined') {
                var regexObj = new RegExp(regex);
                $rootScope.regex = regexObj;
            }
            return $rootScope.regex;
        };
        //check item exist in array
        $rootScope.checkItemExistInArray = function(array, item) {
            if (array.indexOf(item) == -1) {
                return false;
            } else {
                return true;
            }
        }
        $rootScope.checkIfItemExistInArrayAndReturnObject = function(array, key, value) {
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i][key] == value) {
                        return array[i];
                    }
                };
                return null;
            }
        };
        //return package ids
        $rootScope.getAllPackageIdsFromPackageListAsArray = function(packageObjList) {
            var packageIdArray = [];
            if(packageObjList) {
                angular.forEach(packageObjList, function(value, key) {
                    if(value.packageSelection) {
                        packageIdArray.push(value.id);
                    }
                });
            }
            return packageIdArray;
        };
        //signup object to store route information
        $rootScope.signupRouteInfo = {
            "selectPackage": false,
            "createAccount": false,
            "finalCheckout": true
        };
        //prevent page scroll on dropdown panel scroll
        jQuery('.searchDropScroll').bind('mousewheel DOMMouseScroll', function(e) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        });
    }
]);