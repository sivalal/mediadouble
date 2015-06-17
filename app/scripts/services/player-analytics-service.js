'use strict';
mdlDirectTvApp.service('PlayerAnalyticsService', ['configuration', '$rootScope',
    function(configuration, $rootScope) {
        this.reportPlayerMetadata = function(PLAYER_NAMESPACE, playerScope) {
            var props;
            var assetData = playerScope.assetData;
            var currentLang = $rootScope.CurrentLang;
            var isLive = (!!playerScope.pagename && playerScope.pagename == "LIVE") ? true : false;
            var device = simpleBrowserDetection(navigator.userAgent);
            if ((PLAYER_NAMESPACE === MPLAYER_3) && (typeof youboraData !== 'undefined') && !!assetData) { // Flash player only for DRMed content
                youboraData.setAccountCode(configuration.youbora_account_code);
                // youboraData.setService(configuration.youbora_service); // if service url is different from default Youbora url
                youboraData.setUsername($rootScope.userid || "");
                // youboraData.setTransaction("");
                if (isLive) youboraData.setLive(true);
                props = {
                    "content_id": assetData["titleId"] || "",
                    "filename": playerScope["currentUrl"] || "",
                    "content_metadata": {
                        "title": assetData[currentLang]["show_name"] || "",
                        "genre": assetData["genres"] || "",
                        "language": currentLang,
                        "year": assetData["airedon"] || "",
                        "cast": assetData[currentLang]["actors_display"] || "",
                        "director": assetData[currentLang]["directors_display"] || "",
                        "owner": assetData["content_provider"] || "",
                        "duration": assetData["display_run_time"] || "",
                        "rating": assetData["ratings"] || "",
                        "audioType": assetData["audio_type"] || "",
                        "parental": assetData["ratings"] || "",
                        "price": "",
                        "audioChannels": ""
                    },
                    "content_type": assetData["show_type"],
                    "transaction_type": "",
                    "quality": "",
                    "device": device
                };
                youboraData.setProperties(props);
            }
        }

        function simpleBrowserDetection(userAgent) {
            var browser = (userAgent.indexOf('Chrome') > -1) ? 'Chrome' : (userAgent.indexOf('Firefox') > -1) ? 'Firefox' : (userAgent.indexOf("Safari") > -1) ? 'Safari' : (userAgent.indexOf('MSIE') > -1) ? 'MSIE' : (userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv') > -1) ? 'MSIE' : 'Other';
            var platform = (userAgent.indexOf('iPad') > -1) ? 'iPad' : (userAgent.indexOf('iPhone') > -1) ? 'iPhone' : (userAgent.indexOf('iPod') > -1) ? 'iPod' : (userAgent.indexOf('android') > -1) ? 'android' : (userAgent.indexOf('Windows') > -1) ? 'Windows' : (userAgent.indexOf('Macintosh') > -1) ? 'Macintosh' : (userAgent.indexOf('Linux') > -1) ? 'Linux' : 'Other';
            var device = {
                'manufecturer': platform,
                'type': browser,
                'version': "",
                'firmware': userAgent
            };
            return device;
        }
    }
]);