'use strict';
jQuery("html,body").animate({
    scrollTop: 0
}, 1000);
//disable all console.log
var consoleHolder = window.console;

function debug(bool) {
    var console;
    if (!bool) {
        consoleHolder = window.console;
        console = {};
        console.log = function(){};
        window.console = console;
    } else {
        console = consoleHolder;
    }
}

function restartHtml5VideoPlayback(event) {
    console.log('restarting Html5VideoPlayback');
    console.log(e);
}
//important
var enablePopoverOnTouch = false; //used to enable popover on touch devices.
//global function to trigger angular function using pure javascript.
var signUpTrigger = function() {
    if (document.getElementById('signupERT')) {
        var signupScope = angular.element(document.getElementById('signupERT')).scope();
        signupScope.signupModal(1);
    }
};
// global function to close video popover player
function NewclosePopUpVideoPlayer() {
    jQuery('#menu').show();
    jQuery('body').css('overflow', 'scroll');
    console.log("inside closePopUpVideoPlayer function");
    var Angscope = angular.element(document.getElementById('partialContainerIDD')).scope();
    console.log(Angscope['sizzle-video-popup']);
    if (Angscope['sizzle-video-popup'] !== null && typeof Angscope['sizzle-video-popup'] !== 'undefined') {
        Angscope['sizzle-video-popup'].destroy();
        console.log("inside if");
        console.log(Angscope['sizzle-video-popup']);
        jQuery('#sizzle-video-popup-overlay').hide();
        console.log("after hide");
        jQuery('#sizzle-message').show();
        jQuery('#popUpPlayBtnMob').show();
        jQuery("#scrollAnchor").show();
        if (Angscope['sizzle-video'] !== null && typeof Angscope['sizzle-video'] !== 'undefined') Angscope['sizzle-video'].play();
    }
}
//global function to trigger reminder in live pafe
var reminderTrigger = function(elementNode) {
    var trackId = elementNode.getAttribute('data-track');
    var segmentId = elementNode.getAttribute('date-segment');
    var reminderScope = angular.element(document.getElementById('trackContainer')).scope();
    // var reminderDiv   = 'reminder_button_'+segmentId;
    // reminderScope.reminderDiv = false;
    // reminderScope.setReminder(trackId, segmentId);
};
var watchListTrigger = function(elem, asset_id) {
    if (document.getElementById('menu')) {
        //elem.style.display = "none";
        var watchListScope = angular.element(document.getElementById('menu')).scope();
        watchListScope.addWatchList(asset_id, "SLP");
    }
};
var openDeleteWatchlistDialogTrigger = function(elem, asset_id) {
    if (document.getElementById('menu')) {
        //elem.style.display = "none";
        var watchListScope = angular.element(document.getElementById('menu')).scope();
        watchListScope.openDeleteWatchlistDialog(elem, asset_id);
    }
};
// set resume playhead position on click ---------------
var setResumePlayheadPosition = function(url, titleId, playhead) {
    if (document.getElementById('menu')) {
        var resumePlayHeadScope = angular.element(document.getElementById('menu')).scope();
        resumePlayHeadScope.openPlayheadResumeDialog(url, titleId, playhead);
    }
};
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
var ua = navigator.userAgent;
var checker = {
    iphone: ua.match(/(iPhone|iPod|iPad)/),
    blackberry: ua.match(/BlackBerry/),
    android: ua.match(/Android/)
};

function findDeviceLink(allDevices, device) {
    for (var i = 0; i < allDevices.length; i++) {
        var obj = allDevices[i];
        for (var key in obj) {
            if (key === device) {
                // console.log(obj[key]);
                // break;
                return obj[key];
            }
        }
    }
}

function getBrowser() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        //return 'IE '+(tem[1]||'');
        return 'MSIE';
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) {
            return 'Opera';
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return M[0];
};

function getBrowserVersion() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        //return 'IE '+(tem[1]||'');
        return (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) {
            return tem[1];
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return M[1];
};

function parseAppgridData(appgridResponse) {
    var parsedData = null;
    if (typeof appgridResponse == 'object') {
        parsedData = appgridResponse;
    } else {
        try {
            parsedData = JSON.parse(appgridResponse);
        } catch (err) {
            console.log("Appgrid Parsing Error");
            console.log(err);
        }
    }
    return parsedData;
}
//global variables
var browser = getBrowser();
var browserVersion = parseInt(getBrowserVersion());
/* Main Menu Controller */
mdlDirectTvApp.controller('mainController', ['$scope', 'dateFilter', 'SingleAssetService', 'WatchListService', '$interval', 'slidenav', '$modal', '$translate', '$http', '$rootScope', '$route', 'SocialService', '$window', 'Sessions', 'Authentication', '$sce', 'configuration', '$location', 'XDRService', 'AppgridService', '$filter', 'CookieService', 'Vindicia', 'debounce', 'NewSearchDataService', '$timeout',
    function mainController($scope, dateFilter, SingleAssetService, WatchListService, $interval, slidenav, $modal, $translate, $http, $rootScope, $route, SocialService, $window, Sessions, Authentication, $sce, configuration, $location, XDRService, AppgridService, $filter, CookieService, Vindicia, debounce, NewSearchDataService, $timeout) {
        $scope.languageSwitchModal = function() {
            $scope.opts = {
                /* dialogFade: false */
                keyboard: false,
                templateUrl: '/views/modal/language_select_content.html',
                controller: LanguageModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    msg: "language modal"
                });
            };
            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function() {}, function() {
                //on cancel button press
            });
        };
        $scope.setDefaultLangFromAppgrid = function(CurrentLang) {
            $translate.use(CurrentLang);
            if (CurrentLang == "en_US") {
                $rootScope.isCheckboxCheckedForCurrentLang = true;
                $rootScope.isCheckboxCheckedForCurrentLangAccManag = true;
            } else if (CurrentLang == "es_ES") {
                $rootScope.isCheckboxCheckedForCurrentLang = false;
                $rootScope.isCheckboxCheckedForCurrentLangAccManag = false;
            }
        };
        $scope.recommendedContents = function(noSearchobj, imageShackBase) {
            var noResSerchOnj = noSearchobj.no_result.rail_item;
            var queryoption = noResSerchOnj.query_option;
            var query_type = noResSerchOnj.query_type;
            if (query_type == 'search') {
                SingleAssetService.getMiniSearchItems(queryoption).then(function(response) {
                    $scope.recommendedAssets = addImageShackBaseAndFindAssetType(response.thumblistCarouselOneArr, imageShackBase);
                    console.log($scope.recommendedAssets);
                });
            } else if (query_type == 'discovery') {
                SingleAssetService.getDiscoveryItems(queryoption).then(function(response) {
                    $scope.recommendedAssets = addImageShackBaseAndFindAssetType(response.thumblistCarouselOneArr, imageShackBase);
                    console.log($scope.recommendedAssets);
                });
            }
            console.log($scope.recommendedAssets);
        };

        function addImageShackBaseAndFindAssetType(assets, imageShackBase) {
            if (typeof assets != 'undefined') {
                for (var i = 0; i < assets.length; i++) {
                    assets[i].newImagePath = imageShackBase + assets[i]['imagePath'];
                    if (assets[i].source == 'tvShow') {
                        assets[i].assetUrl = '/' + assets[i].source + '?titleId=' + assets[i].titleId;
                    } else {
                        assets[i].assetUrl = '/' + assets[i].source + '?titleId=' + assets[i].titleId;
                    }
                    assets[i].title_showname = assets[i].title_showname + " (" + assets[i].Year + ")";
                }
            }
            return assets;
        }
        //function to disable cookie
        function checkCookie() {
            var cookieEnabled = (navigator.cookieEnabled) ? true : false;
            document.cookie = "testcookie";
            cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
            return cookieEnabled;
        };
        //default language
        if (!$rootScope.empty(configuration.default_language)) {
            $rootScope.CurrentLang = configuration.default_language;
        } else {
            $rootScope.CurrentLang = "en_US";
        }
        //$scope.setDefaultLangFromAppgrid($rootScope.CurrentLang);
        //appgrid call get asset to show site logo.
        $rootScope.showlogo = false; //"images/logo.png";
        $rootScope.appgridAssets = '';
        //get all appgrid metadata in one call and store it to $rootScope.appGridMetadata
        var metadataCallurl = configuration.server_url + '/appgrid';
        //package loader---------------------
        $rootScope.ajaxPackageSpinner = true;
        //package loader---------------------
        $rootScope.appGridMetadata = '';
        $rootScope.isAppgridLoaded = true; //to disable login button
        $http({
            method: 'Get',
            url: metadataCallurl
        }).success(function(metadata, status, headers, config) {
            //hide menu elements based on user status
            var pageName = ($scope.pagename == 'home' && !userIsLoggedin()) ? 'home_visitor' : $scope.pagename;
            var parsedVersion = parseAppgridData(metadata.version); //JSON.parse(metadata.version);
            //disable all console.log
            if (!$rootScope.empty(parsedVersion)) {
                debug(parsedVersion.disableConsoleLog);
            }
            var appInfoObj = parseAppgridData(metadata.app_info); //JSON.parse(metadata.app_info);
            var defaultLanguage = appInfoObj.default_language;
            //set default language from
            if ($rootScope.empty(Sessions.getCookie('current_language'))) {
                if ($rootScope.empty(defaultLanguage)) {
                    Sessions.setLanguage(configuration.default_language);
                } else {
                    Sessions.setLanguage(defaultLanguage);
                }
            } else {
                Sessions.setLanguage(Sessions.getCookie('current_language'));
            }
            $rootScope.CurrentLang = Sessions.getLanguage();
            $scope.setDefaultLangFromAppgrid($rootScope.CurrentLang);
            //get ip range status
            $scope.ipRangeStatus = parsedVersion.isIpRangeRequired;
            var parsedGateways = parseAppgridData(metadata.gateways); //JSON.parse(metadata.gateways);
            //Add invisible Goolge plus tag in the footer.
            jQuery("#google_plus").html(appInfoObj.google_plus_tag);
            //browser compatibility check
            browser = $rootScope.empty(browser) ? '' : browser;
            browser = $rootScope.empty(browser) ? '' : browser;
            browserVersion = $rootScope.empty(browserVersion) ? '' : browserVersion;
            var Iscompatible = $scope.isBrowserCompatibleApp(appInfoObj.browsers);
            if (!Iscompatible) {
                $scope.signupBrowserCompatibilityMessage();
            }
            /* load socialize.js with apikey
             * @param {String} gigyakey
             *
             */
            function LoadSocializeScriptAndMetaTags(gigyakey) {
                //load socialize script file
                if (typeof parsedGateways.gigya_cdn == 'undefined') {
                    console.log("cannot load gigya_cdn, it's missing from appgrid");
                } else {
                    var socializeurl = parsedGateways.gigya_cdn + "/JS/gigya.js?apikey=" + gigyakey;
                    jQuery.getScript(socializeurl, function(data, textStatus, jqxhr) {
                        $rootScope.socializeScriptReceived = true;
                    });
                }
                //load title & meta tag
                var meta_tags = appInfoObj.meta_tags;
                for (var key in meta_tags) {
                    jQuery('head').prepend('<meta name="' + key + '" content="' + meta_tags[key] + '">');
                };
                jQuery('head').prepend('<title>' + appInfoObj.title + '</title>');
            }
            LoadSocializeScriptAndMetaTags(configuration.gigya_api_key);
            //for popover translation logic
            $rootScope.msgObj = JSON.parse(metadata.messages);
            var BTN_ADD_TO_PLAYLISTObj = $filter('filter')($rootScope.msgObj, {
                id: 'BTN_ADD_TO_PLAYLIST'
            });
            var TXT_WATCh_CLIP_VISITORSObj = $filter('filter')($rootScope.msgObj, {
                id: 'TXT_WATCh_CLIP_VISITORS'
            });
            var TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNTObj = $filter('filter')($rootScope.msgObj, {
                id: 'TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNT'
            });
            $rootScope.BTN_ADD_TO_PLAYLISTObj = BTN_ADD_TO_PLAYLISTObj[0];
            $rootScope.TXT_WATCh_CLIP_VISITORSObj = TXT_WATCh_CLIP_VISITORSObj[0];
            $rootScope.TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNTObj = TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNTObj[0];
            //for popover translation logic
            $rootScope.appGridMetadata = metadata;
            $rootScope.enableTwitterSharing = parsedVersion.enableTwitterSharing;
            $rootScope.enableFacebookSharing = parsedVersion.enableFacebookSharing;
            $rootScope.enableTwitter = parsedVersion.enableTwitter;
            $rootScope.enableFacebook = parsedVersion.enableFacebook;
            $rootScope.enableSocialLogin = parsedVersion.enableSocialLogin;
            $rootScope.enableSocialLinking = parsedVersion.enableSocialLinking;
            $rootScope.enableCancelPackagePromoPage = parsedVersion.enableCancelPackagePromoPage;
            $rootScope.storeLink = parsedVersion.storeLink;
            $rootScope.gateWays = parsedGateways;
            $rootScope.iosLink = $rootScope.storeLink.ios; //findDeviceLink($rootScope.storeLink,'ios');
            $rootScope.androidLink = $rootScope.storeLink.android; //findDeviceLink($rootScope.storeLink,'android');
            $scope.noSearchPageDetails = $rootScope.getPageDetails('noresultpage');
            $scope.htmlTemplate = $scope.noSearchPageDetails.search.no_result.html_template;
            console.log($scope.htmlTemplate);
            //Common Fields
            $rootScope.genericFields = parseAppgridData(metadata.common_fields); // JSON.parse(metadata.common_fields);
            //signup configuration-----------------------------------------------------
            $rootScope.signupConfiguration = parseAppgridData(metadata.signup_configuration);
            //Country list------------------------------------------------------------------------------
            //var countryList = parseAppgridData(metadata.countries);// JSON.parse(metadata.countries);
            $rootScope.countryList = parseAppgridData(metadata.countries);
            //parse packages---------------------------------------------------------------------
            $rootScope.ajaxPackageSpinner = false;
            var packageList = parseAppgridData(metadata.packages); //JSON.parse(metadata.packages);
            var packageListArray = $filter('filter')(packageList, {
                status: '!Inactive'
            });
            $rootScope.packageList = packageListArray;
            $rootScope.packageWidth = AppgridService.GetPackagesWidth(packageListArray);
            //select package ----------------------------------------------------
            var NEWpackage_list = parseAppgridData(metadata.package_list); //JSON.parse(metadata.packages);
            var NEWpackage_listArray = $filter('filter')(NEWpackage_list, {
                status: "!inactive"
            });
            console.log("****->>");
            console.log(NEWpackage_listArray);
            $rootScope.packageListNEW = NEWpackage_listArray;
            $rootScope.isAppgridLoaded = false;
            //---button config for signup flow
            //button_config
            var button_config_list = parseAppgridData(metadata.button_config);
            $rootScope.button_config_list = button_config_list;
            //
            //parse gigya custom params---------------------------------------------------------------------
            $rootScope.gigyaParamList = parseAppgridData(metadata.gigya) //JSON.parse(metadata.gigya);
                //parse app info---------------------------------------------------------------------
            $rootScope.appInfo = parseAppgridData(metadata.app_info); //JSON.parse(metadata.app_info);
            //parse error codes---------------------------------------------------------------------
            $rootScope.errorCodes = JSON.parse(metadata.errorcode);
            //parse payment information---------------------------------------------------------------------
            $rootScope.paymentInfo = parseAppgridData(metadata.payment_info); //JSON.parse(metadata.payment_info);
            //search information---------------------------------------------------------------------
            $rootScope.searchInfo = parseAppgridData(metadata.payment_info); //JSON.parse(metadata.payment_info);
            ////////////IMAGE SHACK BASE URL////////////////////////
            var imgbase = parsedGateways.images; //(JSON.parse(metadata['gateways'])).images;
            //var device = (JSON.parse(metadata['device']));
            var device = parseAppgridData(metadata.device); //(JSON.parse(metadata['device']));
            var dimension_large = device['webDesktop']['rail.standard'];
            var dimension = device['webDesktop']['search'];
            $rootScope.imageshackNewbase = imgbase + '/' + dimension_large + '/';
            $rootScope.imageshackSmallNewbase = imgbase + '/' + dimension + '/';
            //Recommended Api
            $scope.recommendedContents($scope.noSearchPageDetails.search, $rootScope.imageshackSmallNewbase);
            ////////////IMAGE SHACK BASE URL////////////////////////
            //https://appgrid-api.cloud.accedo.tv/plugin/geoip/location?sessionKey=a83271a6b68948bc6aec61b1603a6356a2e9542b
            //GEO BLOCKING
            $scope.appgridSessionKey = $rootScope.getAppgridCookie('appgrid_sessionKey');
            //$http.jsonp('https://appgrid-api.cloud.accedo.tv/plugin/geoip/location?sessionKey='+$scope.appgridSessionKey+'&callback=JSON_CALLBACK')

            // Hide loader
            if (document.getElementById('initLoader')) {
                document.getElementById('initLoader').style.display = 'none';
            }
            $http({
                method: 'Get',
                url: configuration.server_url + "/appgrid/region"
            }).success(function(data2, status2, headers2, config2) {
                var geoFilters = parseAppgridData($rootScope.appGridMetadata['georestriction']); //JSON.parse($rootScope.appGridMetadata['georestriction']);
                var countryCodeList = [];
                countryCodeList = geoFilters.includeList['countryCode'];
                var isCountryExist = findElement(countryCodeList, data2.countryCode, "country");
                if (typeof $scope.appgridSessionKey !== 'undefined' && $scope.appgridSessionKey !== 'null' && !isCountryExist) {
                    jQuery("#main-body-content").html("");
                    $scope.geoBlockModal();
                } else {
                    for (var k in geoFilters.excludeList) {
                        if (geoFilters.excludeList[k].countryCode == data2.countryCode) {
                            if (findElement(geoFilters.excludeList[k].regions, data2.region, "regionName")) {
                                jQuery("#main-body-content").html("");
                                $scope.geoBlockModal();
                            }
                        }
                    }
                }
            }).error(function(data2, status2, headers2, config2) {});

            function findElement(arrayElms, value, key) {
                //console.log('con='+value);
                //console.log(arrayElms);
                if (typeof arrayElms === 'undefined') {
                    return false;
                }
                for (var i = 0; i < arrayElms.length; i++) {
                    if (arrayElms[i][key] === value) {
                        return true;
                    }
                }
                return false;
            }
            //-------------------expiry years----------------------------
            var range = {};
            var expiryfilteredDate = parseInt(dateFilter(new Date(), 'yyyy'));
            var maxYear = parseInt(expiryfilteredDate) + parseInt($rootScope.genericFields.expiry_year);
            for (var i = expiryfilteredDate; i < maxYear; i++) {
                range[i] = i;
            }
            $rootScope.expiryYearValue = range;
            $scope.addPackagesSubmenu = function(firstIndex, secondIndex, isAvailBoltons) {
                //Find submenu index
                var k = firstIndex;
                if ($rootScope.menus[k] && $rootScope.menus[k].has_children == true) {
                    var j = secondIndex;
                    if ($rootScope.menus[k].children[j].has_children == true) {
                        var subArr = [];
                        if ($rootScope.menus[k].children[j].upgrade_boltons == true) {
                            $rootScope.menus[k].children[j].children = [];
                            $rootScope.menus[k].children[j].children = addPackageSubMenu();
                        }
                        if (isAvailBoltons) {
                            //$rootScope.menus[k].children[j].children.push(addPackageSubMenu(true));
                            $rootScope.initialBoltonChildren = (!$rootScope.initialBoltonChildren) ? $rootScope.menus[k].children[j].children : $rootScope.initialBoltonChildren;
                            $rootScope.menus[k].children[j].children = $.merge(addPackageSubMenu(true), $rootScope.initialBoltonChildren);
                            console.log("menu for subscribed boltons");
                            console.log($rootScope.menus[k].children[j].children);
                        }
                    }
                }
            };
            $rootScope.BoltonMenuIndex = {};
            $rootScope.subscribedBoltonMenuIndex = {};

            function addPackageSubMenu(isUserbolton) {
                var subMenuArr = [];
                if (!isUserbolton) {
                    var addonListForNavMenu = $filter('filter')($rootScope.packageObjList, {
                        type: 'addon',
                        isSubscribed: false
                    });
                } else {
                    var addonListForNavMenu = $filter('filter')($rootScope.packageObjList, {
                        type: 'addon',
                        isSubscribed: true
                    });
                }
                console.log("addonListForNavMenu==>");
                console.log(addonListForNavMenu);
                var subArrForUpgradeTo = [];
                for (var item = 0; item < addonListForNavMenu.length; item++) {
                    subArrForUpgradeTo[item] = {};
                    if (isUserbolton) {
                        subArrForUpgradeTo[item].mpath = addonListForNavMenu[item].boltonPageUrl;
                    } else {
                        subArrForUpgradeTo[item].mpath = "/manageAccount?id=" + addonListForNavMenu[item].id;
                    }
                    subArrForUpgradeTo[item].title = {};
                    subArrForUpgradeTo[item].id = addonListForNavMenu[item].id;
                    for (var lang in addonListForNavMenu[item].name) {
                        subArrForUpgradeTo[item].title[lang] = addonListForNavMenu[item].name[lang];
                    }
                    //$rootScope.menus[k].children[j].children[item] = subArrForUpgradeTo[item];
                    subMenuArr.push(subArrForUpgradeTo[item]);
                }
                return subMenuArr;
            }
            //load logo image from appgrid
            $http({
                method: 'Get',
                url: configuration.server_url + '/appgrid/appAssets'
            }).success(function(data2, status2, headers2, config2) {
                //logo-yaveo-web <- data2['logo-web']
                if (typeof data2['logo-yaveo-web'] !== 'undefined') {
                    $rootScope.appgridAssets = data2;
                    $rootScope.logoweb = data2['logo-yaveo-web'];
                    $rootScope.showlogo = true;
                    $rootScope.fallbackImageURL = $rootScope.imageshackNewbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] : '/dummy/blank_image.png');
                }
            }).error(function(data2, status2, headers2, config2) {
                $scope.message = 'Unexpected Error';
            });
            //load logo image from appgrid
            //parse menu from appgrid menu
            $rootScope.menus = parseAppgridData(metadata.menu); //(JSON.parse(metadata['menu'])).menu;
            $rootScope.$watch("packagesReady", function(newValue, oldValue) {
                if (newValue == 'undefined' || typeof newValue == 'undefined') {
                    return true; // packageList not updated yet
                }
                if ($rootScope.userSubscriptionStatus == "Active") {
                    $scope.addPackagesSubmenu($rootScope.BoltonMenuIndex.firstIndex, $rootScope.BoltonMenuIndex.secondIndex);
                    $scope.addPackagesSubmenu($rootScope.subscribedBoltonMenuIndex.firstIndex, $rootScope.subscribedBoltonMenuIndex.secondIndex, true);
                }
            }); //end of menu package watch
            if (typeof $rootScope.menus != 'undefined') {
                for (var k = 0; k < $rootScope.menus.length; k++) {
                    /////////////////////////////////////////////////
                    if (typeof $rootScope.menus[k].actionID == 'undefined') {
                        $rootScope.menus[k].mpath = 'null';
                    } else
                    if ($rootScope.menus[k].action == 'custom') {
                        $rootScope.menus[k].mpath = "/" + "page?pageid=" + $rootScope.menus[k].actionID;
                    } else if ($rootScope.menus[k].action == 'filter') {
                        $rootScope.menus[k].mpath = "/" + "filterpage?pageid=" + $rootScope.menus[k].actionID;
                    } else if ($rootScope.menus[k].action == 'link') {
                        $rootScope.menus[k].mpath = $rootScope.menus[k].actionID;
                    } else if ($rootScope.menus[k].action == 'null') {
                        $rootScope.menus[k].mpath = 'null';
                    } else {
                        $rootScope.menus[k].mpath = "/" + $rootScope.menus[k].actionID;
                    }
                    /////////////////////////////////////////////////
                    if ($rootScope.menus[k].has_children == true) {
                        for (var j = 0; j < $rootScope.menus[k].children.length; j++) {
                            /////////////////////////////////////////////////
                            if (typeof $rootScope.menus[k].children[j].actionID == 'undefined') {
                                $rootScope.menus[k].children[j].mpath = 'null';
                            } else
                            if ($rootScope.menus[k].children[j].action == 'custom') {
                                $rootScope.menus[k].children[j].mpath = "/" + "page?pageid=" + $rootScope.menus[k].children[j].actionID;
                            } else if ($rootScope.menus[k].children[j].action == 'filter') {
                                $rootScope.menus[k].children[j].mpath = "/" + "filterpage?pageid=" + $rootScope.menus[k].children[j].actionID;
                            } else if ($rootScope.menus[k].children[j].action == 'link') {
                                $rootScope.menus[k].children[j].mpath = $rootScope.menus[k].children[j].actionID;
                            } else {
                                $rootScope.menus[k].children[j].mpath = "/" + $rootScope.menus[k].children[j].actionID;
                            }
                            if ($rootScope.menus[k].children[j].has_children == true) {
                                var subArr = [];
                                $scope.addonArr = [];
                                subArr = $rootScope.menus[k].children[j].children;
                                if ($rootScope.menus[k].children[j].upgrade_boltons == true) {
                                    $rootScope.menus[k].children[j].children = [];
                                    $rootScope.BoltonMenuIndex.firstIndex = k;
                                    $rootScope.BoltonMenuIndex.secondIndex = j;
                                } else {
                                    for (var a = 0; a < subArr.length; a++) {
                                        /////////////////////////////////////////////////
                                        if (typeof subArr[a].action_id == 'undefined') {
                                            subArr[a].mpath = 'null';
                                        } else
                                        if (subArr[a].action == 'custom') {
                                            subArr[a].mpath = "/" + "page?pageid=" + subArr[a].action_id;
                                        } else if (subArr[a].action == 'filter') {
                                            subArr[a].mpath = "/" + "filterpage?pageid=" + subArr[a].action_id;
                                        } else if (subArr[a].action == 'link') {
                                            subArr[a].mpath = subArr[a].action_id;
                                        } else {
                                            subArr[a].mpath = "/" + subArr[a].action_id;
                                        }
                                        /////////////////////////////////////////////////
                                        $rootScope.menus[k].children[j].children[a] = subArr[a];
                                    } //end of for(var a = 0; a < subArr.length; a++)
                                    if ($rootScope.menus[k].children[j].user_bolton == true) {
                                        $rootScope.subscribedBoltonMenuIndex.firstIndex = k;
                                        $rootScope.subscribedBoltonMenuIndex.secondIndex = j;
                                    }
                                } //end of $rootScope.menus[k].children[j].upgrade_boltons == true
                            } else {
                                $rootScope.menus[k].children[j].children = null;
                            }
                            /////////////////////////////////////////////////
                        } //end of for(var j=0;j<$rootScope.menus[k].children.length;j++)
                    } else {
                        $rootScope.menus[k].children = null;
                    } //end of if($rootScope.menus[k].children !=null)
                } // for(var k=0;k<$rootScope.menus.length;k++)
            } //end of  if(typeof $rootScope.menus!='undefined')
            //update $rootScope.menus to include 'mpath' for custom pages.
            console.log("test menu");
            console.log($rootScope.menus);
        }).error(function(data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
        ///////////////////Eenable third part cookie only after login///////////////////////////////
        $scope.checkThirdPartyEnabled = function(tpcUrl) {
            var iframe = document.getElementById("cookieUrl");
            iframe.onload = function() {
                iframe.contentWindow.postMessage('hello child, this is parent', '*');
            };
            iframe.src = tpcUrl;
            //iframe.src = "https://b091462921713d3c55184ced1914d5f611df3934-www.googledrive.com/host/0B4IGm0TG9QPAWURxVmZwNEJsSG8?configUrl="+configuration.server_url;
        };
        $rootScope.$watch('appgridAssets', function(newValue, oldValue) {
            if (newValue != '') {
                var appAssets = $rootScope.appgridAssets;
                var tpcUrl = appAssets.third_party_cookie;
                if ((typeof Sessions.getCookie('enableThirdParty') != 'undefined' && Sessions.getCookie('enableThirdParty') != 'null' && (Sessions.getCookie('enableThirdParty') == true || Sessions.getCookie('enableThirdParty') == 'true'))) {
                    Sessions.setCookie('enableThirdParty', '', false);
                    $scope.checkThirdPartyEnabled(tpcUrl);
                }
                if (typeof $rootScope.allBrowsers != 'undefined') {
                    for (var i = 0; i < $rootScope.allBrowsers.length; i++) {
                        $rootScope.allBrowsers[i].image_url = $rootScope.appgridAssets[$rootScope.allBrowsers[i].image_id];
                    }
                    console.log($rootScope.allBrowsers);
                }
                $rootScope.getLangTranslationObj = function(key, msgObj) {
                    var dummyObj = {};
                    dummyObj.en_US = "";
                    dummyObj.es_ES = "";
                    if (typeof msgObj == 'undefined') {
                        return dummyObj;
                    }
                    var TranslationObjList = $filter('filter')(msgObj, {
                        id: key
                    });
                    if (typeof TranslationObjList == 'undefined') {
                        return dummyObj;
                    }
                    return ((typeof TranslationObjList[0] !== 'undefined') ? TranslationObjList[0] : dummyObj);
                };
                $rootScope.aslCompiler = function(tempTxt) {
                    var searchKeyStart = /#@/ig;
                    var searchKeyEnd = /@#/ig;
                    tempTxt["en_US"] = tempTxt["en_US"].replace(searchKeyStart, "<");
                    tempTxt["en_US"] = tempTxt["en_US"].replace(searchKeyEnd, ">");
                    tempTxt["es_ES"] = tempTxt["es_ES"].replace(searchKeyStart, "<");
                    tempTxt["es_ES"] = tempTxt["es_ES"].replace(searchKeyEnd, ">");
                    return tempTxt;
                };
                $rootScope.timeCompiler = function(tempTxt, expiryTime) {
                    var searchKey = "/#/timestamp/#/";
                    tempTxt["en_US"] = tempTxt["en_US"].replace(searchKey, expiryTime);
                    tempTxt["es_ES"] = tempTxt["es_ES"].replace(searchKey, expiryTime);
                    return tempTxt;
                };
                $rootScope.$watch('appGridMetadata', function(newAppgridValue, oldAppgridValue) {
                    if (newAppgridValue != '') {
                        //footer list------------------------------------------------------------------------------
                        var footerList = parseAppgridData($rootScope.appGridMetadata.footer); //JSON.parse($rootScope.appGridMetadata.footer);
                        var tempFooterDisclaimerTxt = footerList.disclaimer_txt;
                        $rootScope.footerDisclaimerTxt = $rootScope.aslCompiler(tempFooterDisclaimerTxt);
                        //------------------------------------------------
                        var sizzleVideoSignUpLink = $rootScope.getLangTranslationObj('SIZZLEVIDEO_TXT_LINK', $rootScope.msgObj);
                        $rootScope.sizzleVideoSignUpLink = $rootScope.aslCompiler(sizzleVideoSignUpLink);
                        //----------------------------------
                        var activeFooterList = $filter('filter')(footerList.footer, {
                            isActive: '!false'
                        });
                        $rootScope.footerNavListNewArray = '';
                        $rootScope.footerNavListNewArray = processMenuList(activeFooterList);
                        $rootScope.footerNavListArray = $filter('filter')(footerList.footer, {
                            isActive: '!false'
                        });
                        $rootScope.privacyPolicy = $filter('filter')($rootScope.footerNavListNewArray, {
                            id: 'PRIVACY_POLICY'
                        });
                        $rootScope.toc = $filter('filter')($rootScope.footerNavListNewArray, {
                            id: 'toc'
                        });
                        $rootScope.help = $filter('filter')($rootScope.footerNavListNewArray, {
                            id: 'help'
                        });
                        $rootScope.copyRight = footerList.copyRight;
                    }
                });
            }
        }, true);
        $rootScope.RailInitialLoadItemCount = 4;
        $rootScope.RailOnScrollItemCount = 4;
        ///////////////////Eenable third part cookie only after login///////////////////////////////
        $rootScope.getAppgridCookie = function(name) {
                var re = new RegExp(name + "=([^;]+)");
                var value = re.exec(document.cookie);
                return (value != null) ? unescape(value[1]) : null;
            }
            ///////////////////SEARCH RELATED///////////////////////////////
        $scope.searchTerm = '';
        $scope.searchPlaceholder = 'TXT_SEARCH_INITIAL_PLACEHOLDER';
        var triggerSearchApiWithDelay = debounce(2000, function() {
            $rootScope.searchApiResult = {};
            var searchPageDetails = $rootScope.getPageDetails("search");
            if (!!searchPageDetails) {
                var searchOptions = searchPageDetails.search;
                var allVODSearchItems = $filter('filter')(searchOptions.search_tab, {
                    id: 'all'
                });
                //vod search result
                if (!!$scope.searchTerm && !!allVODSearchItems[0] && !!allVODSearchItems[0].query_option) {
                    var queryOptions = JSON.parse(allVODSearchItems[0].query_option);
                    queryOptions.query = $scope.searchTerm;
                    NewSearchDataService.getSearchResultByMiniCall(queryOptions, $scope.searchTerm).then(function(response) {
                        response = response.data;
                        if (!!response) {
                            $scope.loadingVODSpinner = false;
                            $rootScope.searchApiResult.searchTerm = $scope.searchTerm;
                            $rootScope.searchApiResult.all = response;
                            $rootScope.searchApiResult.all.title = allVODSearchItems[0].title;
                            NewSearchDataService.setSearchText($scope.searchTerm);
                        }
                    }, function(response) { // optional
                    });
                }
                //people search result
                if (!!$scope.searchTerm) {
                    NewSearchDataService.getSearchResultByTermAndType($scope.searchTerm, "people").then(function(response) {
                        response = response.data;
                        if (!!response) {
                            $rootScope.searchApiResult.people = response;
                            $scope.loadingPeopleSpinner = false;
                        }
                    }, function(response) { // optional
                    });
                }
                //Search Result Iteration
                $rootScope.$watch("searchApiResult", function(newValue, oldValue) {
                    if (typeof newValue.people == 'undefined' || typeof newValue.all == 'undefined') {
                        return true;
                    }
                    //save search result
                    NewSearchDataService.setLastVideoSearchResult($rootScope.searchApiResult);
                    if (newValue.all.NumOfResults == 0 && newValue.people.NumOfResults == 0) {
                        $scope.showSearchResult = false;
                        $scope.showNoSearchResult = true;
                        return true;
                    }
                    $scope.showSearchResult = true;
                    var newVodLimitBasedOnPeopleSearchResult;
                    if (newValue.people.NumOfResults > searchOptions.dropdown_panel.people_max_limt) {
                        newValue.people.link = $rootScope.$eval("searchApiResult.people.link | limitTo:" + searchOptions.dropdown_panel.people_max_limt);
                        newVodLimitBasedOnPeopleSearchResult = searchOptions.dropdown_panel.vod_max_limit;
                    } else {
                        newVodLimitBasedOnPeopleSearchResult = (newValue.people.NumOfResults == 1) ? (searchOptions.dropdown_panel.max_limit - 1) : searchOptions.dropdown_panel.max_limit;
                    }
                    if (!!newVodLimitBasedOnPeopleSearchResult && !!newValue.all) {
                        newValue.all.assets = $rootScope.$eval("searchApiResult.all.assets | limitTo:" + newVodLimitBasedOnPeopleSearchResult);
                    }
                }, true);
            }
        });
        $scope.onChangeGetsearchResult = function() {
            $scope.loadingVODSpinner = $scope.loadingPeopleSpinner = false;
            $scope.showSearchResult = $scope.showNoSearchResult = $scope.showSearchHint = false;
            if (!!$scope.searchTerm.length && $scope.searchTerm.length > 2) {
                $scope.showCloseButtonOnInputField = true;
                $scope.showSearchHint = false;
                $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
                    if (newValue == 'undefined' || typeof newValue == 'undefined') {
                        return true; // packageList not updated yet
                    }
                    $scope.loadingVODSpinner = $scope.loadingPeopleSpinner = true;
                    triggerSearchApiWithDelay();
                });
            } else {
                $scope.showSearchHint = true;
                $scope.showCloseButtonOnInputField = false;
            }
        };
        $scope.closeSearchInput = function() {
            triggerSearchApiWithDelay.cancel();
            $scope.searchTerm = '';
            $scope.showSearchResult = $scope.showSearchHint = $scope.showCloseButtonOnInputField = $scope.loadingPeopleSpinner = $scope.loadingVODSpinner = false;
        };
        $scope.onFocus = function() {
            $scope.focused = true;
            $scope.searchPlaceholder = 'TXT_SEARCH_PLACEHOLDER';
            if (!!$scope.searchTerm.length && $scope.searchTerm.length > 1) {
                $scope.showSearchHint = false;
                if (!!$rootScope.searchApiResult) {
                    if ($rootScope.searchApiResult.all && $rootScope.searchApiResult.all.NumOfResults > 0 && $rootScope.searchApiResult.people.NumOfResults > 0) {
                        $scope.showSearchResult = true;
                        $scope.showNoSearchResult = false;
                    } else {
                        $scope.showSearchResult = false;
                        $scope.showNoSearchResult = true;
                    }
                } else {
                    if ($scope.searchTerm.length > 2) $scope.onChangeGetsearchResult();
                }
            } else {
                $scope.showSearchResult = $scope.showNoSearchResult = false;
                $scope.showSearchHint = true;
                $scope.savedSearchTerms = NewSearchDataService.getLastTwoSearchTerms();
            }
        };
        $scope.onRemoveHintValue = function(value) {
            NewSearchDataService.removeValueFromSavedSearchTerms($scope.savedSearchTerms, value);
        };
        $scope.setHintTextAsSearchTerm = function(value) {
            $scope.searchTerm = value;
            $timeout(function() {
                $("#searchTerm").focus();
                $scope.hintTextSelected = true;
            }, 250);
        };
        $scope.goToSearchDetailPage = function(type, peopleName) {
            if ($scope.showNoSearchResult && !$scope.showSearchResult) {
                $location.path('/noSearchResult').search({
                    vod: $scope.searchTerm
                });
            } else if (!$scope.showNoSearchResult && $scope.showSearchResult) {
                if (type == "vod") {
                    $location.path('/search').search({
                        vod: $scope.searchTerm
                    });
                } else if (type == "people") {
                    $location.path('/search').search({
                        vod: $scope.searchTerm,
                        people: peopleName
                    });
                }
            }
            $scope.showSearchResult = $scope.showNoSearchResult = $scope.showSearchHint = false;
        };
        ///////////////////////////////////////////////////////
        // function getCookie(name){
        //     var re = new RegExp(name + "=([^;]+)");
        //     var value = re.exec(document.cookie);
        //     return (value != null) ? unescape(value[1]) : null;
        // }
        //Footer List
        function processMenuList(menuList) {
            var menuItems = [];
            if (typeof menuList != 'undefined') {
                for (var k = 0; k < menuList.length; k++) {
                    /////////////////////////////////////////////////
                    //"&lang="+$rootScope.CurrentLang
                    var item = {};
                    if (menuList[k].action === "iframe_link") {
                        item.mpath = '/' + "content?page_id=" + menuList[k].id;
                        //console.log($rootScope.appgridAssets.menuList[k].actionID);
                        var tempUrlsObj = {};
                        if (typeof menuList[k].actionID !== 'undefined' && menuList[k].actionID !== '') {
                            tempUrlsObj.en_US = (typeof $rootScope.appgridAssets[menuList[k].actionID.en_US] !== 'undefined' && $rootScope.appgridAssets[menuList[k].actionID.en_US] != '') ? $rootScope.appgridAssets[menuList[k].actionID.en_US] : '';
                        } else {
                            tempUrlsObj.en_US = '';
                        }
                        if (typeof menuList[k].actionID !== 'undefined' && menuList[k].actionID !== '') {
                            tempUrlsObj.es_ES = (typeof $rootScope.appgridAssets[menuList[k].actionID.es_ES] !== 'undefined' && $rootScope.appgridAssets[menuList[k].actionID.es_ES] != '') ? $rootScope.appgridAssets[menuList[k].actionID.es_ES] : '';
                        } else {
                            tempUrlsObj.es_ES = '';
                        }
                        //tempUrlsObj.es_ES=(typeof menuList[k].actionID!=='undefined' && menuList[k].actionID !=='')? $rootScope.appgridAssets[menuList[k].actionID.es_ES]:'';
                        item.externalUrls = tempUrlsObj;
                    } else if (menuList[k].action == 'custom') {
                        item.mpath = "/" + "page?pageid=" + menuList[k].actionID;
                    } else if (menuList[k].action == 'filter') {
                        item.mpath = "/" + "filterpage?pageid=" + menuList[k].actionID;
                    } else if (menuList[k].action == 'link') {
                        item.mpath = menuList[k].actionID;
                    } else if (menuList[k].action == 'page') {
                        item.mpath = menuList[k].actionID;
                    } else {
                        item.mpath = "/" + menuList[k].actionID;
                    }
                    // orderObjectBy
                    item.priority = (menuList[k].priority !== '') ? menuList[k].priority : '';
                    item.type = (menuList[k].action !== '') ? menuList[k].action : '';
                    item.title = (menuList[k].title !== '') ? menuList[k].title : '';
                    item.id = menuList[k].id;
                    menuItems.push(item);
                } // for(var k=0;k<$rootScope.menus.length;k++)
                return menuItems;
            } //end of  if(typeof $rootScope.menus!='undefined')
        }
        // var language = $scope.getParameterByName('currentLang');
        // var uid = $scope.getParameterByName('uid');
        // if (language) {
        //     $translate.use(language);
        //     Sessions.setLanguage(language);
        // }
        $scope.StopBannerAutoScroll = function() {
            if (document.getElementById("showcaseID")) {
                angular.element(document.getElementById('showcaseID')).scope().myInterval = 2500000;
            }
        };
        $scope.RestartBannerAutoScroll = function() {
            if (document.getElementById("showcaseID")) {
                angular.element(document.getElementById('showcaseID')).scope().myInterval = 5000;
            }
        };
        //show search modal
        $scope.searchModal = function() {
            if (typeof $rootScope.ooyalaMainPlayer !== 'undefined' && $rootScope.ooyalaMainPlayer !== 'null' && $rootScope.ooyalaMainPlayer !== null) {
                $rootScope.ooyalaMainPlayer.pause();
            }
            if (!$rootScope.ModalOpenInProgress) {
                $rootScope.ModalOpenInProgress = true;
                $scope.StopBannerAutoScroll();
                $scope.opts = {
                    /* dialogFade: false */
                    keyboard: true,
                    templateUrl: '/views/modal/search_content.html',
                    controller: SignUpModalICtrl,
                    backdrop: 'static', //to make the backdrop static
                    resolve: {} // empty storage
                };
                $scope.opts.resolve.item = function() {
                    return ({
                        name: $scope.name
                    }); // pass name to Dialog
                };
                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function() {}, function() {
                    //on cancel button press
                    $scope.RestartBannerAutoScroll();
                });
            }
        };
        $rootScope.maintenance_msg = "";
        var checkAppgridAppStatus = function() {
            $http({
                method: 'Get',
                url: configuration.server_url + '/appgrid/status'
            }).success(function(data, status, headers, config) {
                if (data.status === 'maintenance') {
                    $rootScope.maintenance_msg = (typeof data.message != 'undefined' ? data.message : "");
                    //show maintanence model
                    $scope.maintainanceModal();
                }
            }).error(function(data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        };
        $interval.cancel(stopcheckAppgridAppStatus);
        $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
            if (newValue && newValue !== "") {
                checkAppgridAppStatus();
            }
        });
        var stopcheckAppgridAppStatus = $interval(checkAppgridAppStatus, 300000); //call every 5 minute
        //show maintainance modal
        $scope.maintainanceModal = function() {
            $scope.StopBannerAutoScroll();
            $scope.opts = {
                /* dialogFade: false */
                keyboard: true,
                templateUrl: '/views/modal/message_modal.html',
                controller: SignUpModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.item = function() {
                return ({
                    name: $scope.name
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function() {}, function() {
                //on cancel button press
                $scope.maintainanceModal();
            });
        };
        $scope.isCollapsed = true;
        ////////////////////////////////////CURRENT LANGUAGE//////////////
        $rootScope.ChangeLangSwitch = function(lang) {
            $scope.openLanguageDialog(lang);
        };
        $rootScope.change_lang = function() {
            var lang = ($rootScope.CurrentLang == 'en_US') ? 'es_ES' : 'en_US';
            $scope.openLanguageDialog(lang);
        };
        $scope.openLanguageDialog = function(lang) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/languageSwitchDialog.html',
                controller: LanguageModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    lang: lang
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        ////////////////////////////////////CURRENT LANGUAGE//////////////
        /////////////WATCHLIST START////////////////////////////////////////////////////////////////////////////
        $rootScope.addWatchList = function(asset_id, page) {
            $scope.openWatchlistDialog(asset_id, page);
        };
        $scope.openWatchlistDialog = function(asset_id, page) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/infoDialog.html',
                controller: WatchListModalInstanceCtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    assetId: asset_id,
                    page: page
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        /////////////WATCHLIST END////////////////////////////////////////////////////////////////////////////
        //////////////////////////PAYMENTSWITCH//////////////////////////////////////////
        $rootScope.openPaymentSwitchDialog = function(paymentSwitchStatus) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/paymentSwitchDialog.html',
                controller: LanguageModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    paymentSwitchStatus: paymentSwitchStatus
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        //////////////////////////PAYMENTSWITCH//////////////////////////////////////////
        //////////////////////////////PLAYER SCROLL TOP START//////////////////////////////////////////////////////
        $scope.scrollTop = function() {
            jQuery(document).ready(function($) {
                $("html, body").animate({
                    scrollTop: 0
                }, "slow");
            });
        };
        //////////////////////////////PLAYER SCROLL TOP STOP //////////////////////////////////////////////////////
        //////////////////////////////MOBILE LOGIN MODAL START //////////////////////////////////////////////////////
        $scope.loginM = function() {
            $rootScope.loginModal(1);
        };
        $rootScope.RedirectIfCookieNotSet = function() {
            if (!checkCookie()) {
                $location.path("/requireCookie");
                return;
            }
        };
        $rootScope.loginModal = function() {
            $rootScope.RedirectIfCookieNotSet();
            $location.path("/login");
        };
        //show login modal
        // $rootScope.loginModal = function (startIndex) {
        //     console.log(startIndex);
        //     $rootScope.initialLoginIndex = startIndex;
        //     if(!checkCookie()) {
        //         $location.path("/requireCookie");
        //         return;
        //     }
        //     if (isMobile.any()) {
        //         //touch enabled device.
        //         var appmsg = $filter('translate')('TEXT_OPEN_UP_APP');
        //         var retVal = confirm(appmsg);
        //         if(checker.android) {
        //           if( retVal == true ){
        //             $window.location.href = $rootScope.androidLink[$rootScope.CurrentLang];
        //           }
        //         } else if(checker.iphone) {
        //           if( retVal == true ){
        //             $window.location.href =$rootScope.iosLink[$rootScope.CurrentLang];
        //           }
        //         }
        //     } else {
        //         if (!$rootScope.ModalOpenInProgress) {
        //             $scope.StopBannerAutoScroll();
        //             //this is for testing purpose only
        //             $scope.opts = {
        //                 /* dialogFade: false */
        //                 keyboard: true,
        //                 templateUrl: '/views/signup/loginAccount.html',
        //                 controller: LoginModalICtrl,
        //                 backdrop: 'static', //to make the backdrop static
        //                 resolve: {} // empty storage
        //             };
        //             $scope.opts.resolve.item = function () {
        //                 return ({
        //                     name: $scope.name
        //                 }); // pass name to Dialog
        //             };
        //             var modalInstance = $modal.open($scope.opts);
        //             modalInstance.result.then(function () {}, function () {
        //                 //on cancel button press
        //                 $scope.RestartBannerAutoScroll();
        //             });
        //         }
        //     }
        // };
        //////////////////////////////MOBILE LOGIN MODAL START //////////////////////////////////////////////////////
        //show signup modal starts---------------------------------------------
        var showSignupModal = function() {
            if (!$rootScope.ModalOpenInProgress) {
                $scope.StopBannerAutoScroll();
                $scope.opts = {
                    /* dialogFade: false */
                    keyboard: true,
                    templateUrl: '/views/modal/sign_up_content.html',
                    controller: SignUpModalICtrl,
                    backdrop: 'static', //to make the backdrop static
                    resolve: {} // empty storage
                };
                $scope.opts.resolve.item = function() {
                    return ({
                        name: $scope.name
                    }); // pass name to Dialog
                };
                var modalInstance = $modal.open($scope.opts);
                modalInstance.opened.then(function() {
                    if (Modernizr.touch) {
                        jQuery(".partialContainer").hide();
                    }
                });
                modalInstance.result.then(function() {}, function() {
                    //on cancel button press
                    $scope.RestartBannerAutoScroll();
                    if (Modernizr.touch) {
                        jQuery(".partialContainer").show();
                    }
                });
            }
        };
        $rootScope.signupModal = function(startIndex) {
            $rootScope.RedirectIfCookieNotSet();
            $rootScope.initialIndex = startIndex;
            if ($scope.ipRangeStatus) {
                Authentication.checkIfUserIpWithinSpecificRange().then(function(ipRangeResponse) {
                    if (ipRangeResponse && ipRangeResponse.isExist) {
                        $location.path('/selectPackage');
                        //showSignupModal();
                    } else {
                        $scope.signupBlockingDialog();
                    }
                });
            } else {
                $location.path('/selectPackage');
                //showSignupModal();
            }
        };
        $scope.testSignupModal = function(startIndex) {
            $rootScope.initialIndex = startIndex;
            showSignupModal();
        };
        //show signup modal ends---------------------------------------------
        $scope.signupBrowserCompatibilityMessage = function() {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/browserCompactibilityDialog.html',
                controller: LanguageModalICtrl,
                backdrop: 'static', //to make the backdrop static
                windowClass: 'browserCompBg',
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    name: 'browser compactibility'
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function() {}, function() {
                console.log("close!");
                $scope.RestartBannerAutoScroll();
            });
            modalInstance.opened.then(function() {
                console.log("OPENED!");
                $scope.StopBannerAutoScroll();
            });
        };
        $scope.isBrowserCompatibleApp = function(browsers) {
            $rootScope.allBrowsers = browsers;
            console.log("browser name ===================================" + browser);
            console.log("browser version ================================" + browserVersion);
            var isCompatible = true;
            var browserObject = $rootScope.checkIfItemExistInArrayAndReturnObject(browsers, "id", browser);
            if (!angular.isUndefinedOrNull(browserObject)) {
                isCompatible = $scope.isBrowserCompatibleVersion(browserObject, browserVersion);
            } else {
                isCompatible = false;
            }
            return isCompatible;
        };
        angular.isUndefinedOrNull = function(val) {
            return angular.isUndefined(val) || val === null;
        };
        $scope.isBrowserCompatibleVersion = function(browser, currentBrowserVersion) {
            var isCompatible = true;
            var browserVersion = browser.browser_version_greater;
            var excludeBrowserVersions = $scope.getSigleDimensionArray(browser.exclude_browser_version, "version");
            // excludeBrowserVersions.push(36);
            //check if current browser version is excluded in appgrid browser list.
            if ($rootScope.checkItemExistInArray(excludeBrowserVersions, currentBrowserVersion)) {
                isCompatible = false;
                //check if the current browser is less than appgrid browser version
            } else if (currentBrowserVersion < browserVersion) {
                isCompatible = false;
            }
            return isCompatible;
        };
        $scope.getSigleDimensionArray = function(arrayObjects, key) {
            var listArray = [];
            angular.forEach(arrayObjects, function(value, k) {
                if (value[key] != 0) {
                    listArray.push(value[key]);
                }
            });
            return listArray;
        };
        $scope.signupBlockingDialog = function() {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/signupBlockingDialog.html',
                controller: LanguageModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    name: 'signup_blocking'
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        //show search modal
        $scope.MessageModal = function() {
            $scope.opts = {
                /* dialogFade: false */
                keyboard: true,
                templateUrl: '/views/modal/message_modal.html',
                controller: SignUpModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.item = function() {
                return ({
                    name: $scope.name
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function() {}, function() {
                //on cancel button press
            });
        };
        //route to account manage page
        $scope.routeToAccountPage = function() {
            $location.path('/manageAccount').search('');
        };
        //log off from gigya
        $rootScope.ajaxLogoutSpinner = false;
        $rootScope.logOut = function() {
            $rootScope.ajaxLogoutSpinner = true;
            var formData = {
                action: 'logoff',
                UID: Sessions.getCookie('userid'),
                provider: Sessions.getCookie('provider'),
                cookie_list: 'entitlement_list'
            };
            $http({
                method: 'POST',
                url: configuration.server_url + '/gigya/post_handler',
                data: formData,
                dataType: 'json'
            }).then(function(response) {
                response = response.data;
                $rootScope.ajaxLogoutSpinner = false;
                jQuery('#signupERT').hide();
                jQuery('#login').hide();
                jQuery('#helpSear').hide();
                jQuery('#languageSwitchContainer').hide();
                $scope.clearPlayerCookie();
                $rootScope.embededUrlToken = "";
            }, function(response) { // optional
                console.log('logoff failed---------------');
            });
        };
        $scope.clearPlayerCookie = function() {
            $http({
                method: 'POST',
                url: configuration.server_url + '/tv/clearPlayerAuthCookie',
                dataType: 'json',
            }).then(function(response) {
                //{"cookieUrl":"https:\/\/player.ooyala.com\/sas\/revoke_embed_token\/R3ZHExOjHcfMbqoMxpYBE7PbDEyB"}
                $rootScope.cookieUrl = response.cookieUrl;
                var cookieUrl = response.data.cookieUrl;
                Sessions.Logout();
                var iframe = document.getElementById("tempIframe");
                iframe.onload = function() {
                    $window.location.href = '/';
                }
                iframe.src = cookieUrl;
            });
        };
        //opt generation for player
        $rootScope.generateOptAndSetCookieWithoutRedirection = function(showOnBoardingPage) {
                Vindicia.getPlayerOpt().then(function(optResponse) {
                    var iframe = document.getElementById("embedTokenUrl");
                    iframe.onload = function() {
                        Sessions.setCookie('subscriptionStatus', true, Sessions.setExpiryForCookie());
                        $rootScope.subscriptionStatus = $rootScope.GetsubscriptionStatus();
                    }
                    iframe.src = optResponse.embbdedUrl;
                });
            }
            //opt generation for player
        $rootScope.generateOptAndSetCookie = function(showOnBoardingPage) {
            Vindicia.getPlayerOpt().then(function(optResponse) {
                var iframe = document.getElementById("embedTokenUrl");
                iframe.onload = function() {
                    var redirectRoute;
                    if (showOnBoardingPage) {
                        if (isMobile.any()) {
                            redirectRoute = '/m.welcome';
                        } else {
                            redirectRoute = '/welcome';
                        }
                    } else {
                        if (isMobile.any()) {
                            redirectRoute = '/m.manageAccount';
                        } else {
                            Sessions.setCookie('subscriptionStatus', true, Sessions.setExpiryForCookie());
                            redirectRoute = '/';
                        }
                    }
                    window.location.replace(redirectRoute);
                }
                iframe.src = optResponse.embbdedUrl;
            });
        }
        $scope.collapsingMenu = function() {
            //  console.log(window.innerWidth);
            if (window.innerWidth < 768) $scope.isCollapsed = !$scope.isCollapsed
            jQuery("#collapsibleMob>ul>li>span.openMenu").removeClass("openMenu");
        };
        // $scope.openSubMenu = function(){
        //     jQuery('#collasible').find('ul').removeClass("navOpen");
        //     if (element.next("ul").is(":hidden")) {
        //         element.next("ul").removeClass("navClose");
        //         element.next("ul").addClass("navOpen");
        //     }
        // };
        $rootScope.chooseSignUpOrLogin = function() {
            $scope.chooseDialog();
        };
        /////////////////////////////////SESSION ID STARTS////////////////////////
        var sessionId = $rootScope.getParameterByName('session_id');
        var vindiciaVid = $rootScope.getParameterByName('vindicia_vid');
        if (vindiciaVid && ($location.path() == '/')) {
            if (!$rootScope.empty(Sessions.getCookie('loggedin')) && !$rootScope.empty(Sessions.getCookie('userid')) && !$rootScope.empty(Sessions.getCookie('adminAction')) && !$rootScope.empty(Sessions.getCookie('adminIndex'))) {
                $scope.testSignupModal(6);
            } else {
                $scope.testSignupModal(5);
            }
        }
        if (sessionId && ($location.path() == '/')) {
            var transactionNewSessionId = (typeof Sessions.getCookie('transSessionId') != 'undefined') ? Sessions.getCookie('transSessionId') : null;
            if ((sessionId == transactionNewSessionId) && (transactionNewSessionId)) {
                $scope.testSignupModal(4);
            } else {
                $location.url($location.path());
            }
        }
        // if((sessionId || vindiciaVid) && ($location.path() == '/signupError')) {
        //     $scope.testSignupModal(3);
        // }
        if ((sessionId || vindiciaVid) && ($location.path() == '/updateError')) {
            $location.path('/').search('');
        }
        // if($location.path() == '/signup') {
        //   $scope.testSignupModal(1);
        // }
        if ($location.path() == '/resetpwd') {
            var pwrt = $rootScope.getParameterByName('pwrt');
            if ($rootScope.empty(pwrt)) {
                $location.path('/').search('');
            }
        }
        /////////////////////////////////SESSION ID ENDS////////////////////////
        
        //////////////////////////////PLAYHEAD STARTS///////////////////////////////////////
        $rootScope.openPlayheadResumeDialog = function(url, titleId, playhead) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/playheadResumeDialog.html',
                controller: WatchListModalInstanceCtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    url: url,
                    titleId: titleId,
                    playhead: playhead
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        //////////////////////////////PLAYHEAD STOPS///////////////////////////////////////
        ////////////////////GET BLANK APPGRID IMAGE/////////////////////
        $rootScope.updateimagePath = function(currentImgPath) {
            var newImgPath = '';
            if (currentImgPath && currentImgPath.indexOf('dummy/blank_image.png') === -1) {
                newImgPath = $rootScope.imageshackNewbase + currentImgPath;
            } else {
                newImgPath = $rootScope.imageshackNewbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] : '/dummy/blank_image.png');
            }
            return newImgPath;
        }
        $rootScope.updateSmallImagePath = function(currentImgPath) {
                var newImgPath = '';
                if (currentImgPath && currentImgPath.indexOf('dummy/blank_image.png') === -1) {
                    newImgPath = $rootScope.imageshackSmallNewbase + currentImgPath;
                } else {
                    newImgPath = $rootScope.imageshackSmallNewbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] : '/dummy/blank_image.png');
                }
                return newImgPath;
            }
            ////////////////////GET BLANK APPGRID IMAGE/////////////////////
            //////////////////////////////EXPIRATION MODAL STARTS///////////////////////////////////////
        $rootScope.openExpirationDialog = function(expirationTimestamp, subscriptionStatus) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/previousSubscriberPopupModal.html',
                controller: LanguageModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    expirationTimestamp: expirationTimestamp,
                    subscriptionStatus: subscriptionStatus
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        //////////////////////////////EXPIRATION MODAL STOPS///////////////////////////////////////
        /////////////////////////////WATCHLIST DELETE STARTS//////////////////////////////////
        $rootScope.openDeleteWatchlistDialog = function(index, id, list) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/infoWatchlistItemDeleteBoxDialog.html',
                controller: WatchListDeleteModalInstanceCtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    index: index,
                    id: id,
                    list: list
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        $rootScope.openDeleteAllWatchlistDialog = function() {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/infoWatchlistDeleteAllBoxDialog.html',
                controller: WatchListDeleteModalInstanceCtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return; // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        /////////////////////////////WATCHLIST DELETE STOPS//////////////////////////////////
        $scope.chooseDialog = function() {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/modal/chooseSignUpOrLogin.html',
                controller: chooseSignUpOrLoginModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    lang: ""
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        $scope.geoBlockModal = function() {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/modal/geoBlock_modal.html',
                controller: geoBlockModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    lang: ""
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        ////////////////
        $scope.helpPage = function(action) {
            switch (action) {
                case "login":
                    // if (document.getElementById('login')) {
                    //     setTimeout(function () {
                    //         jQuery("#login").trigger("click");
                    //         //window.location=location.protocol + "//" + location.hostname;
                    //     }, 1000);
                    // }
                    $rootScope.loginModal(1);
                    break;
                case "signup":
                    // if (document.getElementById('signupERT')) {
                    //     setTimeout(function () {
                    //         jQuery("#signupERT").trigger("click");
                    //     }, 1000);
                    // }
                    $rootScope.signupModal(1);
                    break;
                case "logout":
                    // if (document.getElementById('logout')) {
                    //     setTimeout(function () {
                    //         //sjQuery("#logout").trigger("click");
                    //         if ($rootScope.userid) {
                    //             jQuery("#logout").trigger("click");
                    //         }
                    //     }, 1000);
                    // }
                    $rootScope.logOut();
                    break;
                case "search":
                    setTimeout(function() {
                        $scope.searchModal();
                    }, 1000);
                    break;
                case "admin":
                    $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
                        if (newValue != '') {
                            if (typeof $rootScope.appGridMetadata['useradmin'] !== 'undefined') {
                                $rootScope.openNav(0, "continue_watching");
                            }
                        }
                    });
                    break;
            }
        };
        var action = $scope.getParameterByName('action');
        if (!$rootScope.empty(action)) {
            $scope.helpPage(action);
        }
    }
]);
var chooseSignUpOrLoginModalICtrl = ['$scope', '$modalInstance', 'items', '$rootScope', 'Sessions', '$translate',
    function($scope, $modalInstance, items, $rootScope, Sessions, $translate) {
        $scope.chooseSignUp = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.signupModal(1);
        }
        $scope.chooseLogin = function() {
            $modalInstance.dismiss('cancel');
            if (!isMobile.any()) {
                $rootScope.loginModal(1);
            }
        }
        $scope.cancelWithUrlParams = function() {
            $modalInstance.dismiss('cancel');
        };
    }
];
var geoBlockModalICtrl = ['$scope', '$modalInstance', 'items', '$rootScope', 'Sessions', '$translate',
    function($scope, $modalInstance, items, $rootScope, Sessions, $translate) {}
];
mdlDirectTvApp.controller("mobileStoreBannerController", ["$scope", 'slidenav', "$modal", "$translate", "$http", "$rootScope", '$window',
    function($scope, slidenav, $modal, $translate, $http, $rootScope, $window) {
        if (jQuery('.mobileStoreBanner').is(":visible")) {
            // console.log("visible");
            //jQuery('#menu').css("top","106px");
            //jQuery('.partialContainer').css("margin-top","107px");
        } else {
            // console.log("not visible");
        }
        $scope.appStoreClose = function() {
            //   console.log("close add banner");
            jQuery('.mobileStoreBanner').hide();
            $rootScope.navmenuStyle = {
                "top": "0px"
            };
            $rootScope.partialContainerStyle = {
                "margin-top": "0px"
            };
            //jQuery('#menu').css("top","0px");
            // jQuery('.partialContainer').css("margin-top","0px");
        }
    }
]);
var LanguageModalICtrl = ['$scope', '$modalInstance', 'items', '$rootScope', 'Sessions', '$translate', 'slidenav', '$window',
    function($scope, $modalInstance, items, $rootScope, Sessions, $translate, slidenav, $window) {
        if (!!items.expirationTimestamp) {
            $rootScope.$watch("msgObj", function(newValue, oldValue) {
                if (!!newValue) {
                    $scope.translateText = $rootScope.getLangTranslationObj('TXT_ACCOUNT_EXPIRY_WITHIN_CURRENT_DATE', $rootScope.msgObj);
                    $scope.txtForaccountWithInExpiryDate = $rootScope.timeCompiler($scope.translateText, items.expirationTimestamp);
                }
            });
        }
        $scope.subscriptionStatus = items.subscriptionStatus;
        $scope.paymentSwitchStatus = items.paymentSwitchStatus;
        $scope.paymentSwitchErrorAction = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.openNav(Sessions.getCookie('adminIndex'), Sessions.getCookie('adminAction'));
        };
        $scope.languageChooseAction = function(chLang) {
            $translate.use(chLang);
            Sessions.setCookie('current_language', chLang, Sessions.setExpiryForCookie());
            $rootScope.CurrentLang = chLang;
            $modalInstance.dismiss('cancel');
        };
        $scope.languageSwitchAction = function() {
            $translate.use(items.lang);
            Sessions.setCookie('current_language', items.lang, Sessions.setExpiryForCookie());
            // Sessions.setLanguage(items.lang);
            $rootScope.CurrentLang = items.lang;
            if (typeof $rootScope.ooyalaMainPlayer !== 'undefined' && $rootScope.ooyalaMainPlayer !== null) {
                var currentlang = Sessions.getLanguage();
                if (typeof currentlang != 'undefined') {
                    var lang;
                    if (currentlang === 'en_US') {
                        lang = 'en';
                    } else if (currentlang === 'es_ES') {
                        lang = 'es';
                    }
                    //YaVeoErrores.setLanguage(lang);
                } else {
                    //YaVeoErrores.setLanguage('en');
                }
            }
            if (items.lang == "en_US") {
                jQuery('#isCheckboxCheckedForCurrentLang').prop('checked', true);
                jQuery('#isCheckboxCheckedForCurrentLangAccManag').prop('checked', true);
            } else if (items.lang == "es_ES") {
                jQuery('#isCheckboxCheckedForCurrentLang').prop('checked', false);
                jQuery('#isCheckboxCheckedForCurrentLangAccManag').prop('checked', false);
            }
            $modalInstance.dismiss('cancel');
        };
        $scope.cancelLanguageSwitchAction = function() {
            if (items.lang == "en_US") {
                jQuery('#isCheckboxCheckedForCurrentLang').prop('checked', false);
                jQuery('#isCheckboxCheckedForCurrentLangAccManag').prop('checked', false);
            } else if (items.lang == "es_ES") {
                jQuery('#isCheckboxCheckedForCurrentLang').prop('checked', true);
                jQuery('#isCheckboxCheckedForCurrentLangAccManag').prop('checked', true);
            }
            $modalInstance.dismiss('cancel');
        };
        $scope.cancelAction = function() {
            $modalInstance.dismiss('cancel');
            jQuery('#isCheckboxCheckedForCurrentLang').removeAttr('checked');
        };
        $scope.reSubscriberAction = function() {
            $rootScope.generateOptAndSetCookieWithoutRedirection();
            $rootScope.signupModal(1);
            $modalInstance.dismiss('cancel');
        };
        $scope.activeAction = function() {
            $rootScope.generateOptAndSetCookie();
            $modalInstance.dismiss('cancel');
        };
        $scope.proceedAction = function() {
            $rootScope.signupModal(1);
            $modalInstance.dismiss('cancel');
        };
        $scope.cancelSubscriptionAction = function() {
            $rootScope.redirectToHome();
            $modalInstance.dismiss('cancel');
        };
        $rootScope.genericModalClose = function() {
            $modalInstance.dismiss('cancel');
        };
    }
];
var WatchListModalInstanceCtrl = ['analyticsService', '$scope', '$modalInstance', 'items', 'WatchListService', '$rootScope', '$window', '$location',
    function(analyticsService, $scope, $modalInstance, items, WatchListService, $rootScope, $window, $location) {
        if (items.page == 'SAP') {
            $scope.confirmBoxInSAP = true;
            $scope.confirmBoxInSLP = false;
        } else if (items.page == 'SLP') {
            $scope.confirmBoxInSAP = false;
            $scope.confirmBoxInSLP = true;
        }
        $scope.cancel = true;
        $scope.checkMark = $scope.existConfirm = $scope.ajaxWatchlistInfoSpinner = false;
        $scope.message_1 = true;
        $scope.message_2 = $scope.message_3 = $scope.message_4 = false;
        $scope.tickMark = $scope.crossMark = false;
        $scope.confirmSLPAction = function() {
            $scope.ajaxWatchlistInfoSpinner = true;
            WatchListService.Add(items.assetId).then(function(data) {
                $scope.cancel = $scope.confirmBoxInSAP = $scope.confirmBoxInSLP = false;
                $scope.existConfirm = true;
                $scope.ajaxWatchlistInfoSpinner = false;
                if (data) {
                    if (data.success == true) {
                        $scope.message_2 = $scope.tickMark = true;
                        $scope.message_1 = $scope.message_3 = $scope.message_4 = false;
                        if ($rootScope.globalWatchlistIds.indexOf(items.assetId) == -1) { //push only if not in globalWatchlistIds
                            $rootScope.globalWatchlistIds.push(items.assetId);
                        }
                        analyticsService.TrackAddtoWatchList(items.assetId);
                        if ($rootScope.selectedAction == "watchlist") {
                            WatchListService.Getlist().then(function(response) {
                                if (response != null) {
                                    $rootScope.watchlistList = response;
                                    $rootScope.tvShowList = _(response.tvShow).toArray();
                                    $rootScope.movieList = response.movie;
                                    var tvListLength = $rootScope.tvShowList ? $rootScope.tvShowList.length : 0;
                                    var movieListLength = $rootScope.movieList ? $rootScope.movieList.length : 0;
                                    analyticsService.TrackWatchList(tvListLength + movieListLength);
                                }
                            });
                        }
                    } else {
                        $scope.message_4 = $scope.crossMark = true;
                        $scope.message_1 = $scope.message_2 = $scope.message_3 = false;
                    }
                } else {
                    $scope.message_4 = $scope.crossMark = true;
                    $scope.message_1 = $scope.message_2 = $scope.message_3 = false;
                }
            });
        };
        $scope.confirmSAPAction = function() {
            $scope.ajaxWatchlistInfoSpinner = true;
            WatchListService.Add(items.assetId).then(function(data) {
                $scope.ajaxWatchlistInfoSpinner = false;
                $scope.cancel = $scope.confirmBoxInSAP = $scope.confirmBoxInSLP = false;
                $scope.existConfirm = true;
                if (data) {
                    if (data.success) {
                        $scope.message_2 = $scope.tickMark = true;
                        $scope.message_1 = $scope.message_3 = $scope.message_4 = false;
                        $rootScope.showWatchlistAddBtn = false;
                        $rootScope.showWatchlistRemoveBtn = true;
                        if ($rootScope.WatchListAddition_InProgress == true) {
                            var d = new Date();
                            $rootScope.addedToWatchList = d.toString();
                        }
                        if (typeof $rootScope.globalWatchlistIds == 'undefined' || $rootScope.globalWatchlistIds == null) {
                            $rootScope.globalWatchlistIds = [];
                            $rootScope.globalWatchlistIds.push(items.assetId);
                        } else if ($rootScope.globalWatchlistIds.indexOf(items.assetId) == -1) { //push only if not in globalWatchlistIds
                            $rootScope.globalWatchlistIds.push(items.assetId);
                        }
                        if ($rootScope.selectedAction == "watchlist") {
                            WatchListService.Getlist().then(function(response) {
                                if (response != null) {
                                    $rootScope.watchlistList = response;
                                    $rootScope.tvShowList = _(response.tvShow).toArray();
                                    $rootScope.movieList = response.movie;
                                    var tvListLength = $rootScope.tvShowList ? $rootScope.tvShowList.length : 0;
                                    var movieListLength = $rootScope.movieList ? $rootScope.movieList.length : 0;
                                    analyticsService.TrackWatchList(tvListLength + movieListLength);
                                }
                            });
                        }
                        // console.log('watchlist Arr after add'+items.assetId);
                        // console.log($rootScope.globalWatchlistIds);
                        // $rootScope.$emit('globalWatchlistIds_Updated');
                    } else {
                        $scope.message_4 = $scope.crossMark = true;
                        $scope.message_1 = $scope.message_2 = $scope.message_3 = false;
                    }
                } else {
                    $scope.message_4 = $scope.crossMark = true;
                    $scope.message_1 = $scope.message_2 = $scope.message_3 = false;
                }
            });
        };
        $scope.cancelAction = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.playheadResumeCancelAction = function() {
            $modalInstance.dismiss('cancel');
            $location.path(items.url).search({
                'titleId': items.titleId
            });
        };
        $scope.playheadResumeOkAction = function() {
            $modalInstance.dismiss('cancel');
            $location.path(items.url).search({
                'titleId': items.titleId,
                'playhead_seconds': items.playhead
            });
        };
    }
];
var WatchListDeleteModalInstanceCtrl = ['$scope', '$modalInstance', 'items', 'WatchListService', 'XDRService', '$rootScope', 'analyticsService', function($scope, $modalInstance, items, WatchListService, XDRService, $rootScope, analyticsService) {
    $scope.cancel = $scope.confirm = true;
    $scope.checkMark = $scope.existConfirm = $scope.ajaxWatchlistInfoSpinner = false;
    $scope.message_1 = true;
    $scope.message_2 = $scope.message_3 = $scope.tickMark = $scope.crossMark = false;
    $scope.confirmWatchListItemDeleteAction = function() {
        var listofitem = items.list;
        $scope.ajaxWatchlistInfoSpinner = true;
        WatchListService.DeleteItem(items.id, "item").then(function(response) {
            $scope.cancel = $scope.confirm = $scope.ajaxWatchlistInfoSpinner = false;
            $scope.existConfirm = true;
            if (response) {
                if (response.success) {
                    $scope.message_2 = $scope.tickMark = true;
                    $scope.message_1 = $scope.message_3 = false;
                    if (typeof listofitem != 'undefined' && items.index != null) listofitem.splice(items.index, 1)[0];
                    var index = $rootScope.globalWatchlistIds.indexOf(items.id);
                    if (index > -1) {
                        $rootScope.globalWatchlistIds.splice(index, 1);
                    }
                    if ($rootScope.selectedAction == "watchlist") {
                        WatchListService.Getlist().then(function(response) {
                            if (response != null) {
                                $rootScope.watchlistList = response;
                                $rootScope.tvShowList = _(response.tvShow).toArray();
                                $rootScope.movieList = response.movie;
                                var tvListLength = $rootScope.tvShowList ? $rootScope.tvShowList.length : 0;
                                var movieListLength = $rootScope.movieList ? $rootScope.movieList.length : 0;
                                analyticsService.TrackWatchList(tvListLength + movieListLength);
                            }
                        });
                    }
                } else {
                    $scope.message_1 = $scope.message_2 = false;
                    $scope.message_3 = $scope.tickMark = true;
                }
            } else {
                $scope.message_1 = $scope.message_2 = false;
                $scope.message_3 = $scope.crossMark = true;
            }
        });
    };
    $scope.confirmWatchlistDeleteAllDeleteAction = function() {
        $scope.ajaxWatchlistInfoSpinner = true;
        WatchListService.DeleteAllItem("allitem").then(function(response) {
            $scope.cancel = $scope.confirm = $scope.ajaxWatchlistInfoSpinner = false;
            $scope.existConfirm = true;
            if (response) {
                if (response.success) {
                    $scope.message_2 = $scope.tickMark = true;
                    $scope.message_1 = $scope.message_3 = false;
                    delete $rootScope.watchlistList;
                    delete $rootScope.tvShowList;
                    delete $rootScope.movieList;
                    delete $rootScope.globalWatchlistIds;
                    $rootScope.globalWatchlistIds = null;
                    if ($rootScope.selectedAction == "watchlist") {
                        WatchListService.Getlist().then(function(response) {
                            if (response != null) {
                                $rootScope.watchlistList = response;
                                $rootScope.tvShowList = _(response.tvShow).toArray();
                                $rootScope.movieList = response.movie;
                                var tvListLength = $rootScope.tvShowList ? $rootScope.tvShowList.length : 0;
                                var movieListLength = $rootScope.movieList ? $rootScope.movieList.length : 0;
                                analyticsService.TrackWatchList(tvListLength + movieListLength);
                            }
                        });
                    }
                } else {
                    $scope.message_1 = $scope.message_2 = false;
                    $scope.message_3 = $scope.crossMark = true;
                }
            } else {
                $scope.message_1 = $scope.message_2 = false;
                $scope.message_3 = $scope.crossMark = true;
            }
        });
    }
    $scope.cancelAction = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.confirmXDRItemDeleteAction = function() {
        var listofitem = items.list;
        $scope.ajaxWatchlistInfoSpinner = true;
        XDRService.DeleteItem(items.embedCode, "item").then(function(response) {
            $scope.cancel = $scope.confirm = $scope.ajaxWatchlistInfoSpinner = false;
            $scope.existConfirm = true;
            if (response) {
                if (response.success == true) {
                    $scope.message_2 = $scope.tickMark = true;
                    $scope.message_1 = $scope.message_3 = false;
                    listofitem.splice(items.index, 1)[0];
                    $rootScope.$broadcast('updateXDRrail');
                } else {
                    $scope.message_1 = $scope.message_2 = false;
                    $scope.message_3 = $scope.tickMark = true;
                }
            } else {
                $scope.message_1 = $scope.message_2 = false;
                $scope.message_3 = $scope.crossMark = true;
            }
        });
    };
    $scope.confirmXDRDeleteAllAction = function() {
        $scope.ajaxWatchlistInfoSpinner = true;
        XDRService.DeleteAllItem("allitem").then(function(response) {
            $scope.cancel = $scope.confirm = $scope.ajaxWatchlistInfoSpinner = false;
            $scope.existConfirm = true;
            if (response) {
                if (response.success == true) {
                    $scope.message_2 = $scope.tickMark = true;
                    $scope.message_1 = $scope.message_3 = false;
                    delete $rootScope.continueWatchingList;
                    delete $rootScope.globalWatchlistIds;
                    $rootScope.$broadcast('updateXDRrail');
                } else {
                    $scope.message_1 = $scope.message_2 = false;
                    $scope.message_3 = $scope.crossMark = true;
                }
            } else {
                $scope.message_1 = $scope.message_2 = false;
                $scope.message_3 = $scope.crossMark = true;
            }
        });
    }
}];
var CommonModalICtrl = ['$scope', '$modalInstance', 'items', '$rootScope', 'Sessions', '$translate', 'slidenav', '$window', '$location',
    function($scope, $modalInstance, items, $rootScope, Sessions, $translate, slidenav, $window, $location) {
        $scope.proceedWithoutTrial = function() {
            $rootScope.ajaxConfirmPaymentSpinner = true;
            $rootScope.createSubscription(items.paymentMethodId, items.hasUsedFreeTrial);
            $modalInstance.dismiss('cancel');
        };
        $scope.redirectToBillingPagetoUpdatePaymentMethod = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.enableErrorAlertMessage('TXT_ENTERED_CC_HAS_BEEN_USED_BEFORE');
            $location.url("/finalCheckout");
        };
        $scope.redirectToSelectPackagePage = function() {
            $modalInstance.dismiss('cancel');
            $location.url("/selectPackage");
        };
        $scope.redirectToHomePage = function() {
            $modalInstance.dismiss('cancel');
            $location.url("/");
        };
    }
];