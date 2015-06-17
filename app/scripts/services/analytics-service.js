'use strict';
/* Omniture Service */
mdlDirectTvApp.service('analyticsService', ['configuration', '$rootScope', '$filter', 'Sessions',
    function(configuration, $rootScope, $filter, Sessions) {
        //omniture constants
        //console.log(configuration.omniture_rsid);
        var s = Reporting.getReportingObject(configuration.omniture_rsid); //s_gi(configuration.omniture_rsid); //INSERT-RSID-HERE
        s.channel = configuration.server_url;

        function SubscriberStatus() {
            if (getCookie("loggedin") == "true") {
                return "Subscriber"; //<subscriber_type> Subscriber/Non Subscribe //on page load
            } else {
                return "Non-Subscriber"; //<subscriber_type> Subscriber/Non Subscribe //on page load
            }
        }

        function getValueElseNull(value) {
            if (_.isUndefined(value) || _.isNull(value) || value == "") {
                return "null";
            } else {
                return value;
            }
        }

        function getEvar22Value(content_type) {
            console.log(content_type);
            if (_.isUndefined(content_type) || _.isNull(content_type) || content_type == "") {
                return "null";
            } else {
                var value = content_type.toUpperCase();
                if (value.indexOf("TV") != -1 || value.indexOf("EPISODE") != -1 || value.indexOf("SERIES") != -1 || value.indexOf("SEASON") != -1 || value.indexOf("SHOW") != -1) {
                    return "VOD_TV";
                } else if (value.indexOf("MOVIE") != -1) {
                    return "VOD_MOVIE";
                } else {
                    return "null";
                }
            }
        }

        function getWatchlistItemsCount() {
            if (typeof $rootScope.globalWatchlistIds !== 'undefined' && $rootScope.globalWatchlistIds != null && typeof $rootScope.globalWatchlistIds.length !== 'undefined') {
                return $rootScope.globalWatchlistIds.length;
            } else {
                return "null";
            }
        }

        function resetEvars() {
            s.pageName = "";
            s.server = "";
            s.pageType = "";
            s.events = "";
            s.eVar1 = "";
            s.prop1 = "";
            s.eVar2 = "";
            s.prop5 = "";
            s.eVar3 = "";
            s.eVar4 = "";
            s.eVar5 = "";
            s.eVar6 = "";
            s.eVar7 = "";
            s.eVar8 = "";
            s.prop9 = "";
            s.eVar10 = "";
            s.eVar11 = "";
            s.eVar12 = "";
            s.eVar13 = "";
            s.eVar14 = "";
            s.eVar15 = "";
            s.eVar16 = "";
            s.eVar17 = "";
            s.eVar18 = "";
            s.eVar19 = "";
            s.eVar20 = "";
            s.eVar21 = "";
            s.eVar22 = "";
            s.prop19 = "";
            s.eVar23 = "";
            s.eVar24 = "";
            s.eVar25 = "";
            s.eVar26 = "";
            s.eVar27 = "";
            s.eVar28 = "";
            s.eVar29 = "";
            s.eVar30 = "";
            s.eVar31 = "";
            s.eVar32 = "";
        }
        this.TrackVideoPlay = function(pipedOrginOfPlayback, movie_titleORshowname_Seasonid_Episodeid, Content_ID, propNine, videoOrlive, contentType, contentProvider, genreinfo) {
            resetEvars();
            s.pageName = pipedOrginOfPlayback;
            s.server = "";
            s.pageType = "";
            if (videoOrlive == "live") {
                s.events = "event24";
            } else {
                s.events = "event4";
            }
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop9 = getValueElseNull(propNine);
            //contentid  titleId
            s.eVar18 = getValueElseNull(Content_ID);
            s.eVar8 = getValueElseNull(movie_titleORshowname_Seasonid_Episodeid); //<movie_title | Showname_Seasonid_Episodeid>
            s.eVar4 = getValueElseNull(pipedOrginOfPlayback); //Piped origin of playback  //on video playback
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.eVar22 = getEvar22Value(contentType);
            s.eVar25 = getValueElseNull(contentProvider);
            s.eVar7 = getValueElseNull(genreinfo);
            s.eVar11 = getValueElseNull(videoOrlive);
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //packageoftheuser;   //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            console.log("-o-");
            console.log(pipedOrginOfPlayback);
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log('TrackVideoPlay');
        }; //end of TrackVideoPlay
        this.TrackVideoStart = function(pipedOrginOfPlayback, movie_titleORshowname_Seasonid_Episodeid, Content_ID, propNine, videoOrlive, contentType, contentProvider, genreinfo) {
            resetEvars();
            s.pageName = pipedOrginOfPlayback;
            s.server = "";
            s.pageType = "";
            if (videoOrlive == "live") {
                s.events = "event23";
            } else {
                s.events = "event31";
            }
            s.eVar7 = getValueElseNull(genreinfo); //optional if applicable
            s.eVar11 = getValueElseNull(videoOrlive);
            s.eVar22 = getEvar22Value(contentType);
            s.eVar25 = getValueElseNull(contentProvider);
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop9 = getValueElseNull(propNine);
            //contentid  titleId
            s.eVar18 = getValueElseNull(Content_ID);
            s.eVar8 = getValueElseNull(movie_titleORshowname_Seasonid_Episodeid); //<movie_title | Showname_Seasonid_Episodeid>
            s.eVar4 = getValueElseNull(pipedOrginOfPlayback); //Piped origin of playback  //on video playback
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //packageoftheuser;   //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log('TrackVideoStart');
        }; //end of TrackVideoStart
        /*
         * track TrackVideoOnDemand (not for live video)
         */
        this.TrackVideoOnDemand = function(pipedOrginOfPlayback, movie_titleORshowname_Seasonid_Episodeid, Content_ID, propNine, videoOrlive, contentType, contentProvider, genreinfo) {
            resetEvars();
            s.pageName = pipedOrginOfPlayback;
            s.server = "";
            s.pageType = "";
            s.events = "event27";
            s.eVar7 = getValueElseNull(genreinfo); //optional if applicable
            s.eVar11 = getValueElseNull(videoOrlive);
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar22 = getEvar22Value(contentType);
            s.eVar25 = getValueElseNull(contentProvider);
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop9 = getValueElseNull(propNine);
            //contentid  titleId
            s.eVar18 = getValueElseNull(Content_ID);
            s.eVar8 = getValueElseNull(movie_titleORshowname_Seasonid_Episodeid); //<movie_title | Showname_Seasonid_Episodeid>
            s.eVar4 = getValueElseNull(pipedOrginOfPlayback); //Piped origin of playback  //on video playback
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //packageoftheuser;   //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar20 = s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log('TrackVideoOnDemand');
        }; //end of TrackVideoOnDemand
        /*
         * track TrackProgramDetailsPageLoad (singleAssetPageLoad)
         */
        this.TrackProgramDetailsPageLoad = function(pipedOrginOfPlayback, movie_titleORshowname_Seasonid_Episodeid, Content_ID, propNine, videoOrlive, contentType, contentProvider, genreinfo) {
            resetEvars();
            s.pageName = pipedOrginOfPlayback;
            s.server = "";
            s.pageType = "";
            s.events = "event21";
            s.eVar7 = getValueElseNull(genreinfo); //optional if applicable
            s.eVar8 = getValueElseNull(movie_titleORshowname_Seasonid_Episodeid); //<movie_title | Showname_Seasonid_Episodeid>
            s.eVar20 = s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            s.eVar11 = getValueElseNull(videoOrlive);
            s.eVar13 = getValueElseNull(contentProvider);
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop9 = getValueElseNull(propNine);
            //contentid  titleId
            s.eVar18 = getValueElseNull(Content_ID);
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar22 = getEvar22Value(contentType);
            //account_number
            s.eVar4 = getValueElseNull(pipedOrginOfPlayback); //Piped origin of playback  //on video playback
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //packageoftheuser;   //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log('TrackProgramDetailsPageLoad');
        }; //end of TrackProgramDetailsPageLoad
        this.TrackAddtoWatchList = function(contentId) {
            resetEvars();
            //var accountNumber=Sessions.getCookie('userid');
            s.events = "event5";
            //contentid  titleId
            s.eVar18 = getValueElseNull(contentId);
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop1 = navigator.userAgent; //<device_type>
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackaddtoWatchList');
            // console.log(noofvideosinWatchList);
        }; //end of add TrackWatchList
        this.TrackShareVideo = function(contentId, socialsharingnetworkName, movie_titleORshowname_Seasonid_Episodeid, propNine) {
            resetEvars();
            s.pageName = "ShareVideo:" + contentId; //movie_titleORshowname_Seasonid_Episodeid;
            s.server = "";
            s.pageType = "";
            //contentid  titleId
            s.eVar18 = getValueElseNull(contentId);
            s.events = "event7";
            //account_number
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.eVar9 = socialsharingnetworkName; //Name of social sharing network  //on sharing video
            s.eVar8 = "ShareVideo:" + contentId; //movie_titleORshowname_Seasonid_Episodeid;//<movie_title | Showname_Seasonid_Episodeid>
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics socialsharing:');
            console.log(socialsharingnetworkName);
            console.log(movie_titleORshowname_Seasonid_Episodeid);
        }; //end of TrackShareVideo
        function contructSubscribedPackagesStr(packageObj) {
            var SubscribedPackagesArr = [];
            for (var i in packageObj) {
                SubscribedPackagesArr.push(packageObj[i].id);
            }
            var subscribedPackagesStr = SubscribedPackagesArr.join("|");
            console.log("subscribedPackagesStr:-->");
            console.log(subscribedPackagesStr);
            return subscribedPackagesStr;
        }
        this.TrackSignup = function(userSubscribedPackages, promocodes) {
            resetEvars();
            s.pageName = "signup:checkout complete";
            s.server = "";
            s.pageType = "";
            s.events = "event16";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            var packageoftheuser = contructSubscribedPackagesStr(userSubscribedPackages);
            //
            if (Sessions.getCookie('firedSignupComplete') == accountNumber) {
                return false; //Event should only fire once, even though the user may reload the page.
            }
            Sessions.setCookie('firedSignupComplete', accountNumber, false);
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = getValueElseNull(packageoftheuser); //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.prop8 = getValueElseNull(promocodes); //promocodes // on signup completion or new subscribtion
            s.eVar16 = getValueElseNull(promocodes); //<promo_codes>  // on signup completion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus();
            var s_code = s.t();
            Sessions.setCookie('firedSignupComplete', accountNumber, false);
            if (s_code) console.log(s_code);
            console.log('Analytics TrackSignup:');
            console.log(packageoftheuser + "|" + promocodes);
        }; //end of TrackSignup
        /*
         *
         * @param {string} packageoftheuser
         * @param {string} promocodes
         * @returns {undefined}
         */
        this.TrackSignupConfirmCheckout = function(packageoftheuser, promocodes) {
            resetEvars();
            s.pageName = "signup:confirm checkout";
            s.server = "";
            s.pageType = "";
            s.events = "event1,event2";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber != 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = packageoftheuser; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.prop8 = promocodes; //promocodes // on signup completion or new subscribtion
            s.eVar16 = promocodes; //<promo_codes>  // on signup completion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics signup:confirm checkout');
            console.log(packageoftheuser + "|" + promocodes);
        }; //end of signup:confirm checkout
        /*
         * TrackCheckOutComplete
         * @param {string} packageoftheuser
         * @param {string} promocodes
         * @param {string} PaymentType ( Credit Card/Pay Pal )
         * @returns {undefined}
         *
         */
        this.TrackCheckOutComplete = function(packageoftheuser, promocodes, PaymentType) {
            resetEvars();
            s.pageName = "signup:checkout complete";
            s.server = "";
            s.pageType = "";
            s.events = "event16";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber != 'undefined') s.eVar17 = accountNumber;
            s.eVar32 = PaymentType; //eVar32( Credit Card/Pay Pal )
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = packageoftheuser; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.prop8 = promocodes; //promocodes // on signup completion or new subscribtion
            s.eVar16 = promocodes; //<promo_codes>  // on signup completion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus();
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics signup:checkout complete');
            console.log(packageoftheuser + "|" + promocodes);
        }; //end of TrackCheckOutComplete
        /*
         *
         * @param {string} packageoftheuser
         * @param {string} promocodes
         * @returns {undefined}
         */
        this.TrackSignupCheckOutUnsuccessfull = function(packageoftheuser, promocodes) {
            resetEvars();
            s.pageName = "signup:checkout unsuccessful";
            s.server = "";
            s.pageType = "";
            s.events = "event1,event2";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber != 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = packageoftheuser; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.prop8 = promocodes; //promocodes // on signup completion or new subscribtion
            s.eVar16 = promocodes; //<promo_codes>  // on signup completion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics signup:checkout unsuccessful');
            console.log(packageoftheuser + "|" + promocodes);
        }; //end of TrackSignupCheckOutUnsuccessfull
        this.TrackSignuppageload = function(packageoftheuser, promocodes) {
            resetEvars();
            s.pageName = "signup";
            s.server = "";
            s.pageType = "";
            s.events = "event1,event2";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = getValueElseNull(packageoftheuser); //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.prop8 = getValueElseNull(promocodes); //promocodes // on signup completion or new subscribtion
            s.eVar16 = getValueElseNull(promocodes); //<promo_codes>  // on signup completion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            s.eVar12 = getValueElseNull(null); //<connection_type>  //not sure for web  //on page load
            s.eVar13 = getValueElseNull(null); //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            s.eVar14 = SubscriberStatus(); //<subscription_type> // on signup completion
            s.eVar15 = getWatchlistItemsCount();
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackSignup:');
            console.log(packageoftheuser + "|" + promocodes);
        }; //end of TrackSignuppageload
        this.TrackNetworkPage = function(pagename, programmer_name, propNine) {
            resetEvars();
            s.pageName = pagename;
            s.server = "";
            s.pageType = "";
            s.events = "event1,event2";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop9 = getValueElseNull(propNine);
            s.eVar13 = getValueElseNull(programmer_name); //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar7 = ""; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            s.eVar12 = getValueElseNull(null); //<connection_type>  //not sure for web  //on page load
            s.eVar13 = getValueElseNull(null); //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            s.eVar14 = SubscriberStatus(); //<subscription_type> // on signup completion
            s.eVar15 = getWatchlistItemsCount();
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log(pagename + " programmer" + programmer_name);
        }; //end of TrackFilterPageLoad
        this.TrackWatchList = function(noofvideosinWatchList) {
            resetEvars();
            s.pageName = "watchlist";
            s.server = "";
            s.pageType = "";
            s.events = "event1,event2";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop7 = getValueElseNull(noofvideosinWatchList); //# of Videos in Watchlist //on page load of watchlist
            s.eVar15 = getValueElseNull(noofvideosinWatchList); //Number of videos in watchlist page  //on page load
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar7 = ""; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackWatchListPageLoad:');
            console.log(noofvideosinWatchList);
        }; //end of TrackWatchList
        this.TrackCustomPageLoad = function(pagename, propNine, packageoftheuser, genre) {
            resetEvars();
            s.pageName = pagename;
            s.server = "";
            s.pageType = "";
            s.events = "event1,event2";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.prop9 = getValueElseNull(propNine);
            s.eVar2 = getValueElseNull(packageoftheuser); //package of the user  //on page load
            //s.prop2="" //not known
            s.eVar3 = ""; //<search_term_typed>  //on search
            s.prop3 = ""; //# of results from search  //on search
            s.eVar4 = ""; //Piped origin of playback  //on video playback
            s.prop4 = ""; //view type
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar7 = getValueElseNull(genre); //genre if applicable  on page with genre info  //on page load
            //s.prop7        //# of Videos in Watchlist //on page load of watchlist
            //s.eVar8        //<movie_title | Showname_Seasonid_Episodeid> //on video playback
            //s.prop8        //promocodes // on signup completion or new subscribtion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            s.eVar12 = getValueElseNull(null); //<connection_type>  //not sure for web  //on page load
            s.eVar13 = getValueElseNull(null); //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            s.eVar14 = SubscriberStatus(); //<subscription_type> // on signup completion
            s.eVar15 = getWatchlistItemsCount(); //Number of videos in watchlist page  //on page load
            //s.eVar16       //<promo_codes>  // on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackCustomPageLoad:');
            console.log(pagename);
        }; //end of TrackCustomPageLoad
        this.TrackGenrePage = function(GenreName) {
            resetEvars();
            s.pageName = "genrePage|" + GenreName;
            s.server = "";
            s.pageType = "";
            s.events = "event1,event2";
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop4 = ""; //view type
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar7 = GenreName; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            s.eVar12 = getValueElseNull(null); //<connection_type>  //not sure for web  //on page load
            s.eVar13 = getValueElseNull(null); //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar14 = SubscriberStatus(); //<subscription_type> // on signup completion
            s.eVar15 = getWatchlistItemsCount(); //Number of videos in watchlist page  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log("genrePage|" + GenreName);
        }; //end of TrackGenrePage
        this.TrackFilterPageLoad = function(pagename, propNine) {
            resetEvars();
            s.pageName = pagename;
            s.server = "";
            s.pageType = "";
            s.events = "event1,event2";
            s.prop9 = getValueElseNull(propNine);
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar7 = ""; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            s.eVar12 = getValueElseNull(null); //<connection_type>  //not sure for web  //on page load
            s.eVar13 = getValueElseNull(null); //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            s.eVar14 = SubscriberStatus(); //<subscription_type> // on signup completion
            s.eVar15 = getWatchlistItemsCount(); //Number of videos in watchlist page  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackFilterPageLoad:');
            console.log(pagename);
        }; //end of TrackFilterPageLoad
        this.TrackSearch = function(pageName, search_term_typed, noofresults) {
            resetEvars();
            s.pageName = pageName;
            s.server = "";
            s.pageType = "";
            s.events = "event3";
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.eVar3 = getValueElseNull(search_term_typed); //<search_term_typed>  //on search
            s.prop3 = getValueElseNull(noofresults); //# of results from search  //on search
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ""; //package of the user  //on page load
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar20 = s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            // console.log('Analytics TrackSearch:');
            // console.log(pageName);
            // console.log(search_term_typed+"->"+noofresults);
        }; //end of TrackSearch
        this.TrackUserLogin = function() {
            resetEvars();
            s.events = "event20";
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop1 = navigator.userAgent; //<device_type>
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar20 = s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            s.eVar12 = getValueElseNull(null); //<connection_type>  //not sure for web  //on page load
            s.eVar21 = "UP";
            var s_code = s.t();
            if (s_code) console.log(s_code);
        }; //end of TrackLogin
        this.TrackErrorMessage = function(pipedOrginOfPlayback, videoOrlive, contentProvider, Content_ID, errormsg_errorcode) {
            resetEvars();
            s.events = "event29";
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar4 = getValueElseNull(pipedOrginOfPlayback);
            s.eVar11 = getValueElseNull(videoOrlive);
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.eVar2 = getValueElseNull(currentPackageoftheuser);
            //contentid  titleId
            s.eVar18 = getValueElseNull(Content_ID);
            s.prop1 = navigator.userAgent; //<device_type>
            //s.prop2="" //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar20 = s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            s.eVar25 = getValueElseNull(contentProvider);
            s.eVar12 = getValueElseNull(null); //<connection_type>  //not sure for web  //on page load
            s.eVar13 = getValueElseNull(contentProvider);
            s.prop28 = s.eVar28 = getValueElseNull(errormsg_errorcode);
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log("Analytics TrackError");
        }; //end of TrackErrorMessage
        /*
         * track TrackVideoOnDemandStopCompletePauseClose (not for live video)
         */
        this.TrackVideoOnDemandStopCompletePauseClose = function(movie_titleORshowname_Seasonid_Episodeid, Content_ID, propNine, videoOrlive, contentType, contentProvider, genreinfo, viewedDuration) {
            resetEvars();
            //s.pageName = pipedOrginOfPlayback;
            s.server = "";
            s.pageType = "";
            s.events = "event28";
            s.eVar7 = getValueElseNull(genreinfo); //optional if applicable
            s.eVar11 = getValueElseNull(videoOrlive);
            var currentDate = new Date();
            s.prop19 = s.eVar19 = $filter('date')(currentDate, 'h:mm a - EEEE');
            s.eVar22 = getEvar22Value(contentType);
            s.eVar25 = getValueElseNull(contentProvider);
            s.eVar23 = getValueElseNull(viewedDuration);
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.prop9 = getValueElseNull(propNine);
            //contentid  titleId
            s.eVar18 = getValueElseNull(Content_ID);
            s.eVar8 = getValueElseNull(movie_titleORshowname_Seasonid_Episodeid); //<movie_title | Showname_Seasonid_Episodeid>
            s.prop1 = navigator.userAgent; //<device_type>
            //s.prop2="" //not known
            //s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar20 = s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log('TrackVideoOnDemandStopCompletePauseClose');
        }; //end of TrackVideoOnDemandStopCompletePauseClose
        this.serviceUpgrade = function(userSubscribedPackages, newPackage) {
            resetEvars();
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.events = "event9"; //Buy Add-Ons
            var currentPackageoftheuser = contructSubscribedPackagesStr(userSubscribedPackages);
            s.eVar2 = getValueElseNull(currentPackageoftheuser); //package of the user  //on page load
            s.eVar14 = getValueElseNull(newPackage);
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log('TrackServiceUpgrade');
        };
        this.serviceDowngrade = function(userSubscribedPackages, removedPackage) {
            resetEvars();
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            s.eVar17 = getValueElseNull(accountNumber);
            s.events = "event10"; //Remove Add-Ons
            var currentPackageoftheuser = contructSubscribedPackagesStr(userSubscribedPackages);
            s.eVar2 = getValueElseNull(currentPackageoftheuser); //package of the user  //on page load
            s.eVar14 = getValueElseNull(removedPackage);
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log('TrackServiceDowngrade');
        };
    } //end of analyticsService function
]);