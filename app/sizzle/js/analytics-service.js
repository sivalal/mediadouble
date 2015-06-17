'use strict';
/* Omniture Service */
mdlDirectTvApp.service('analyticsService', ['configuration', '$rootScope',
    function(configuration, $rootScope) {
        //omniture constants
        var s = Reporting.getReportingObject(configuration.omniture_rsid); // 'dtvdtvdirectvhottest' for testing, 'dtvdirectvhottprod' for production
        s.channel = configuration.server_url; // https://www.yaveo.com
        function SubscriberStatus() {
            if (getCookie('loggedin') === 'true') {
                return 'Subscriber'; //<subscriber_type> Subscriber/Non Subscribe //on page load
            } else {
                return 'Non-Subscriber'; //<subscriber_type> Subscriber/Non Subscribe //on page load
            }
        }

        function resetEvars() {
            s.pageName = '';
            s.server = '';
            s.pageType = '';
            s.events = '';
            s.eVar17 = '';
            s.eVar8 = '';
            s.prop9 = '';
            s.eVar18 = '';
            s.eVar4 = '';
            s.eVar1 = '';
            s.prop1 = '';
            s.eVar2 = '';
            s.prop5 = s.eVar5 = '';
            s.eVar10 = '';
            s.eVar14 = '';
        }
        this.TrackVideoPlay = function(pipedOrginOfPlayback, movie_titleORshowname_Seasonid_Episodeid, Content_ID, propNine) {
            resetEvars();
            s.pageName = pipedOrginOfPlayback;
            s.server = '';
            s.pageType = '';
            s.events = 'event4';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') {
                s.eVar17 = accountNumber;
            }
            s.prop9 = (typeof propNine !== 'undefined') ? propNine : '';
            //contentid  titleId
            if (typeof Content_ID !== 'undefined') {
                s.eVar18 = Content_ID;
            }
            s.eVar8 = movie_titleORshowname_Seasonid_Episodeid; //<movie_title | Showname_Seasonid_Episodeid>
            s.eVar4 = pipedOrginOfPlayback; //Piped origin of playback  //on video playback
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //packageoftheuser;   //package of the user  //on page load
            //s.prop2='' //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            console.log('-o-');
            console.log(pipedOrginOfPlayback);
            var s_code = s.t();
            if (s_code) {
                console.log(s_code);
            }
            console.log('Analytics:');
            console.log('TrackVideoPlay');
        }; //end of TrackVideoPlay
        this.TrackAddtoWatchList = function(contentId) {
            resetEvars();
            // s.pageName='addtowatchlist';
            // s.server='';
            // s.pageType='';
            //var accountNumber=Sessions.getCookie('userid'); 
            s.events = 'event5';
            //contentid  titleId
            if (typeof contentId !== 'undefined') s.eVar18 = contentId;
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2='' //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar7 = ''; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackaddtoWatchList');
            // console.log(noofvideosinWatchList);
        }; //end of add TrackWatchList
        this.TrackShareVideo = function(contentId, socialsharingnetworkName, movie_titleORshowname_Seasonid_Episodeid, propNine) {
            resetEvars();
            s.pageName = 'ShareVideo:' + contentId; //movie_titleORshowname_Seasonid_Episodeid;
            s.server = '';
            s.pageType = '';
            //contentid  titleId
            if (typeof contentId !== 'undefined') s.eVar18 = contentId;
            s.events = 'event7';
            //account_number
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar9 = socialsharingnetworkName; //Name of social sharing network  //on sharing video
            s.eVar8 = 'ShareVideo:' + contentId; //movie_titleORshowname_Seasonid_Episodeid;//<movie_title | Showname_Seasonid_Episodeid>
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2='' //not known
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
        this.TrackSignup = function(packageoftheuser, promocodes) {
            resetEvars();
            s.pageName = 'signup';
            s.server = '';
            s.pageType = '';
            s.events = 'event16';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = packageoftheuser; //package of the user  //on page load
            //s.prop2='' //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.prop8 = promocodes; //promocodes // on signup completion or new subscribtion
            s.eVar16 = promocodes; //<promo_codes>  // on signup completion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus();
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackSignup:');
            console.log(packageoftheuser + '|' + promocodes);
        }; //end of TrackSignup
        this.TrackSignuppageload = function(packageoftheuser, promocodes) {
            resetEvars();
            s.pageName = 'signup';
            s.server = '';
            s.pageType = '';
            s.events = 'event1,event2';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = packageoftheuser; //package of the user  //on page load
            //s.prop2='' //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.prop8 = promocodes; //promocodes // on signup completion or new subscribtion
            s.eVar16 = promocodes; //<promo_codes>  // on signup completion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            s.eVar14 = SubscriberStatus(); //<subscriber_type> on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackSignup:');
            console.log(packageoftheuser + '|' + promocodes);
        }; //end of TrackSignuppageload
        this.TrackNetworkPage = function(pagename, programmer_name, propNine) {
            resetEvars();
            s.pageName = pagename;
            s.server = '';
            s.pageType = '';
            s.events = 'event1,event2';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.prop9 = (typeof propNine !== 'undefined') ? propNine : '';
            s.eVar13 = programmer_name; //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2='' //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar7 = ''; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log(pagename + ' programmer' + programmer_name);
        }; //end of TrackFilterPageLoad
        this.TrackWatchList = function(noofvideosinWatchList) {
            resetEvars();
            s.pageName = 'watchlist';
            s.server = '';
            s.pageType = '';
            s.events = 'event1,event2';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.prop7 = noofvideosinWatchList; //# of Videos in Watchlist //on page load of watchlist
            s.eVar15 = noofvideosinWatchList; //Number of videos in watchlist page  //on page load
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2='' //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar7 = ''; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackWatchListPageLoad:');
            console.log(noofvideosinWatchList);
        }; //end of TrackWatchList
        this.TrackCustomPageLoad = function(pagename, propNine) {
            resetEvars();
            s.pageName = pagename;
            s.server = '';
            s.pageType = '';
            s.events = 'event1,event2';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.prop9 = (typeof propNine !== 'undefined') ? propNine : '';
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2='' //not known
            s.eVar3 = ''; //<search_term_typed>  //on search
            s.prop3 = ''; //# of results from search  //on search
            s.eVar4 = ''; //Piped origin of playback  //on video playback
            s.prop4 = ''; //view type
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar7 = ''; //genre if applicable  on page with genre info  //on page load
            //s.prop7        //# of Videos in Watchlist //on page load of watchlist
            //s.eVar8        //<movie_title | Showname_Seasonid_Episodeid> //on video playback
            //s.prop8        //promocodes // on signup completion or new subscribtion
            //s.eVar9        //Name of social sharing network  //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            //s.eVar13       //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            s.eVar14 = SubscriberStatus(); //<subscription_type> // on signup completion
            //s.eVar15       //Number of videos in watchlist page  //on page load
            //s.eVar16       //<promo_codes>  // on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackCustomPageLoad:');
            console.log(pagename);
        }; //end of TrackCustomPageLoad
        this.TrackGenrePage = function(GenreName) {
            resetEvars();
            s.pageName = 'genrePage|' + GenreName;
            s.server = '';
            s.pageType = '';
            s.events = 'event1,event2';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2='' //not known
            s.prop4 = ''; //view type
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar7 = GenreName; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics:');
            console.log('genrePage|' + GenreName);
        }; //end of TrackGenrePage
        this.TrackFilterPageLoad = function(pagename, propNine) {
            resetEvars();
            s.pageName = pagename;
            s.server = '';
            s.pageType = '';
            s.events = 'event1,event2';
            s.prop9 = (typeof propNine !== 'undefined') ? propNine : '';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2='' //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar7 = ''; //genre if applicable  on page with genre info  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log('Analytics TrackFilterPageLoad:');
            console.log(pagename);
        }; //end of TrackFilterPageLoad
        this.TrackSearch = function(pageName, search_term_typed, noofresults) {
            resetEvars();
            s.pageName = pageName;
            s.server = '';
            s.pageType = '';
            s.events = 'event3';
            var accountNumber = $rootScope.userid; //Sessions.getCookie('userid');
            //account_number
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar3 = search_term_typed; //<search_term_typed>  //on search
            s.prop3 = noofresults; //# of results from search  //on search
            s.eVar1 = SubscriberStatus(); //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.eVar2 = ''; //package of the user  //on page load
            //s.prop2='' //not known
            s.prop5 = s.eVar5 = $rootScope.CurrentLang; //selected language(en_US/es_ES)  //on page load
            s.eVar10 = navigator.userAgent; //<device_type>    //on page load
            //s.eVar12       //<connection_type>  //not sure for web  //on page load
            var s_code = s.t();
            if (s_code) console.log(s_code);
            // console.log('Analytics TrackSearch:');
            // console.log(pageName);
            // console.log(search_term_typed+'->'+noofresults);
        }; //end of TrackSearch    
    } //end of analyticsService function
]);