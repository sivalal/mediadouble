'use strict';
/* Services */
function getCookie(value) {
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
    //-------------------rails event attachment common code --------------------
function popoverHider($owlRailDOM, popoverHoldingDivClass) {
    $owlRailDOM.find(popoverHoldingDivClass).each(function() {
        jQuery(this).popover("hide");
        jQuery(this).find('span').css('display', 'none');
        clearTimeout(jQuery(this).data('timeoutId'));
    });
}

function allpopoverHide() {
        jQuery('.owl-carousel').each(function() {
            popoverHider(jQuery(this), '.item');
            popoverHider(jQuery(this), '.itemImg');
        });
    }
    //hide all popover on entering a rails header
jQuery('.railsHeader').on('mouseenter', allpopoverHide);

function destroyAllRails() {
    jQuery(".owl-carousel").each(function() {
        var fid = "#" + jQuery(this).attr('ID');
        if (typeof jQuery(fid).data('owlCarousel') !== 'undefined') jQuery(fid).data('owlCarousel').destroy();
    });
}

function triggerPopupPlayBack(TitleTypeId, contentID, imagePath, title) {
        var embedcode;
        if (typeof contentID != 'undefined') {
            embedcode = contentID;
        } else {
            embedcode = "";
        }
        if (typeof TitleTypeId != 'undefined') {}
        console.log("*TitleTypeId:" + TitleTypeId);
        console.log(contentID);
        console.log("*Embedcode:" + embedcode);
        console.log("IMGPATH");
        console.log(imagePath);
        console.log('ScopeObj');
        if (document.getElementById('partialContainerIDD')) {
            var partialContainerIDDScope = angular.element(document.getElementById('partialContainerIDD')).scope();
            console.log(partialContainerIDDScope);
            var playerData = {};
            playerData.embCode = embedcode;
            playerData.imagePath = imagePath;
            playerData.TitleTypeId = TitleTypeId;
            playerData.title = title;
            partialContainerIDDScope.playSizzleVideo(true, playerData);
        }
    }
    //--------------end of rails event attachment common code -----------/
    /* 
     CustomListSplitter - function that take an array
     and return array of subarray with length maxLengthOfSublist
     @params Array List  array of elements
     @params integer maxLengthOfSubList   maximum length of sublist
     returns  Array NewList an array of array
     */
mdlDirectTvApp.factory("CustomListSplitter", function() {
    return function(List, maxLengthOfSubList) {
        var tempSubList, i, j, k, NewList = [];
        for (j = 0; j < List.length; j += maxLengthOfSubList) {
            k = j;
            tempSubList = [];
            for (i = 0; i < maxLengthOfSubList; i++, k++) {
                if (typeof List[k] != 'undefined') tempSubList.push(List[k]);
            }
            NewList.push(tempSubList);
        }
        return NewList;
    }
});
/*
 railService
 */
mdlDirectTvApp.service('railService', ['configuration', '$rootScope', 'Sessions', '$http', '$filter', 'contentService', 'FilterService','$timeout','$log',
    function(configuration, $rootScope, Sessions, $http, $filter, contentService, FilterService,$timeout,$log) {
        var railServiceOBJ = this;
        var newbase = '',
            railPortraitbase = '';
        /* get imageshack base url
         */
        function getNewbase() {
                if (newbase == '') {
                    /* set imageshack base url
                     */
                    var imgbase = parseAppgridData($rootScope.appGridMetadata['gateways']).images; //(JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                    var device = parseAppgridData($rootScope.appGridMetadata['device']); //(JSON.parse($rootScope.appGridMetadata['device']));
                    var dimension = device['webDesktop']['rail.standard'];
                    newbase = imgbase + '/' + dimension + '/';
                }
                return newbase;
            }
            /* get imageshack getRailPortraitbase url
             */
        function getRailPortraitbase() {
            if (railPortraitbase == '') {
                /* set imageshack base url
                 */
                var imgbase = parseAppgridData($rootScope.appGridMetadata['gateways']).images; //(JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                var device = parseAppgridData($rootScope.appGridMetadata['device']); //(JSON.parse($rootScope.appGridMetadata['device']));
                var dimension = device['webDesktop']['rail.portrait'];
                railPortraitbase = imgbase + '/' + dimension + '/';
            }
            return railPortraitbase;
        }
        var Showcasenewbase = '';
        /* get imageshack base url
         */
        function getShowcaseNewbase() {
                if (Showcasenewbase == '') {
                    /* set imageshack Showcasenewbase url
                     */
                    var imgbase = parseAppgridData($rootScope.appGridMetadata['gateways']).images; //(JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                    var device = parseAppgridData($rootScope.appGridMetadata['device']); //(JSON.parse($rootScope.appGridMetadata['device']));
                    var dimension = device['webDesktop']['showcase'];
                    Showcasenewbase = imgbase + '/' + dimension + '/';
                }
                return Showcasenewbase;
            }
            /*
             * check if genre type is parsable.
             */
        railServiceOBJ.getSourceName = function(pageDetails_genrefilteroptions) {
            console.log('genrequeryoptionstr-->');
            var parsable_genrequeryoptionstr = false;
            var genreTypes_STR = "";
            try {
                if (typeof pageDetails_genrefilteroptions != 'undefined' && pageDetails_genrefilteroptions != 'null') {
                    console.log(pageDetails_genrefilteroptions);
                    console.log(typeof(JSON.parse(pageDetails_genrefilteroptions)));
                    console.log((JSON.parse(pageDetails_genrefilteroptions).types[0]));
                    genreTypes_STR = (JSON.parse(pageDetails_genrefilteroptions).types[0]);
                    parsable_genrequeryoptionstr = true;
                }
            } catch (e) {
                console.log(e);
                parsable_genrequeryoptionstr = false;
            }
            if (parsable_genrequeryoptionstr) {
                if (_.contains(["tv_series", "tv_episode", "tv_season", "tv_show"], genreTypes_STR)) {
                    return "tv";
                } else if (_.contains(["feature_film", "short_film"], genreTypes_STR)) {
                    return "movies";
                }
            }
            return ""; //nosource
        }; //end of genretypeParsable functions
        /*set user entitlements to $rootScope.entitlementIDsArr
         * setEntitlementListToRootScope
         *
         */
        railServiceOBJ.setEntitlementListToRootScope = function() {
            var promise = $http.get(configuration.server_url + '/search/getEntitlementsList').then(function(response, headers) {
                var entitlementIDsArr = new Array();
                $rootScope.entitlementIDsArr = entitlementIDsArr;
                if (response.status == 200) {
                    if (typeof response.data != 'undefined' && typeof response.data.entitlements != 'undefined') {
                        for (var i in response.data.entitlements) {
                            entitlementIDsArr.push(response.data.entitlements[i].id);
                        }
                        $rootScope.entitlementIDsArr = entitlementIDsArr;
                    }
                }
                return response;
            });
            return promise;
        };
        /* check if entitlement is in rootscope.entitlementIDsArr else
         * it is fetched and set using setEntitlementListToRootScope() function
         *
         * @returns {entitlementIDsArr}
         */
        railServiceOBJ.checkAndSetEntitlementListToRootScope = function() {
            if (typeof $rootScope.entitlementIDsArr != 'undefined' && $rootScope.entitlementIDsArr != '') return $rootScope.entitlementIDsArr;
            else return railServiceOBJ.setEntitlementListToRootScope();
        };
        railServiceOBJ.SortLiveChannels = function(data) {
            console.log("Live ChannelFilter call");
            console.log(data);
            console.log('$rootScope.CurrentPagename' + $rootScope.CurrentPagename);
            data["thumblistCarouselOneArr"] = FilterService.ChannelFilter(data, "sort_rail", $rootScope.CurrentPagename);
            console.log("Live data");
            console.log(data);
            data["thumblistCarouselOneArr"] = _.sortBy(data["thumblistCarouselOneArr"], function(singledata) {
                if (typeof singledata.sort[$rootScope.CurrentLang] == "number") return singledata.sort[$rootScope.CurrentLang];
                else return parseInt(singledata.sort[$rootScope.CurrentLang]);
            });
            console.log("Live After Appgrid Sort");
            console.log(data);
            return data;
        };
        railServiceOBJ.sortRailsByEpisodeId = function(data, episodeSortOrder) {
            var railItems = (typeof data['thumblistCarouselOneArr'] != 'undefined') ? data['thumblistCarouselOneArr'] : null;
            if (railItems === null) {
                return data;
            }
            console.log(railItems);
            if (episodeSortOrder === 'asc') {
                railItems = $filter('orderBy')(railItems, ['season_id', 'episode_id']);
            } else if (episodeSortOrder === 'desc') {
                railItems = $filter('orderBy')(railItems, ['-season_id', '-episode_id']);
            }
            console.log("After sort");
            console.log(railItems);
            data['thumblistCarouselOneArr'] = railItems;
            return data;
        };
        /*
         * generate rails backend url
         * @param {object} paramsOBJ
         * @param {string} embedcodeDATA (0ptional only similar)
         * @param {string} similarGenre  (0ptional only for discovery queryoptionsObj.path)
         * @param {string} assetTypes
         * @param {string} boltonid (optional used for mastheads)
         * @returns {String} generated rail backend url
         */
        railServiceOBJ.railUrlgenerator = function(paramsOBJ, embedcodeDATA, similarGenre, assetTypes, boltonid) {
                var queryObj = (typeof paramsOBJ['query'] !== 'undefined' && paramsOBJ['query'] != 'null') ? paramsOBJ['query'] : '';
                if (queryObj == '') {
                    return null; //in valid paramsOBJ['query'] is not defined
                }
                if (queryObj == 'promotions' || queryObj == 'promotions' || queryObj == 'appgrid') {
                    return null; //no callbackurls  for promotions or appgrid
                }
                try {
                    //var queryoptionsObj = (paramsOBJ['queryoptions']) ? paramsOBJ['queryoptions'] : {};
                    var queryoptionsObj = (paramsOBJ['queryoptions'] != 'null') ? JSON.parse(paramsOBJ['queryoptions']) : {};
                    var itemCount = (typeof paramsOBJ['itemcount'] !== 'undefined') ? paramsOBJ['itemcount'] : '';
                    if (itemCount != '' && paramsOBJ['queryoptions'] != 'null') {
                        queryoptionsObj.page_size = itemCount; //comment to disabling pagination
                    }
                    var queryoptionsStr = JSON.stringify(queryoptionsObj);
                } catch (e) {
                    console.log("json stringify failed due to invalid queryoptions structure in appgrid");
                    console.log(e);
                }
                ///singleasset/getSimilarAssets
                var urlPerQuery;
                if (queryObj == 'manual') {
                    urlPerQuery = "/searchApi/manualrailShortCall?queryoptions=" + queryoptionsStr;
                } else if (queryObj == 'similar' && typeof embedcodeDATA !== 'undefined' && embedcodeDATA !== '' && embedcodeDATA != null) {
                    //urlPerQuery = "/search/getSimilarOrDiscoveryItems?embed_code=" + embedcodeDATA + "&assetType=" + assetTypes;
                    urlPerQuery = "/singleasset/getSimilarAssets?embed_code=" + embedcodeDATA + "&assetType=" + assetTypes;
                } else if (queryObj == 'discovery') {
                    var queryoptionsObj_path = '',
                        parsable_queryoptionsObj_pathstr = false;
                    try {
                        if (typeof queryoptionsObj != 'undefined' && queryoptionsObj != 'null') {
                            // queryoptionsObj_path=(JSON.parse(queryoptionsObj).path);
                            if (typeof queryoptionsObj.path === 'string') {
                                queryoptionsObj_path = queryoptionsObj.path;
                            } else {
                                queryoptionsObj_path = (JSON.parse(queryoptionsObj).path);
                            }
                            parsable_queryoptionsObj_pathstr = true;
                        }
                    } catch (e) {
                        console.log(e);
                        parsable_queryoptionsObj_pathstr = false;
                    }
                    if (parsable_queryoptionsObj_pathstr) {
                        var psk = (typeof queryoptionsObj_path !== 'undefined') ? queryoptionsObj_path : '';
                        //window=day&show_type=Movie
                        urlPerQuery = "/singleasset/getDiscoveryAssetsShort?" + psk + "&assetType=" + assetTypes;
                        // urlPerQuery = "/search/getSimilarOrDiscoveryItems?path=" + psk + "&assetType=" + assetTypes;
                    }
                } else if (queryObj == 'personal') {
                    var queryoptionsObj_path = '',
                        parsable_queryoptionsObj_pathstr = false;
                    try {
                        if (typeof queryoptionsObj != 'undefined' && queryoptionsObj != 'null') {
                            queryoptionsObj_path = (JSON.parse(queryoptionsObj).path);
                            parsable_queryoptionsObj_pathstr = true;
                        }
                    } catch (e) {
                        parsable_queryoptionsObj_pathstr = false;
                    }
                    if (parsable_queryoptionsObj_pathstr) {
                        var psk = (typeof queryoptionsObj_path !== 'undefined') ? queryoptionsObj_path : '';
                        if (getCookie('loggedin') == 'true' || getCookie('loggedin') == true) {
                            urlPerQuery = '/singleasset/getDiscoveryPersonalItems?uuid=' + Sessions.getCookie('userid') + '&' + psk + '&assetType=' + assetTypes;
                        }
                    } else {
                        if (getCookie('loggedin') == 'true' || getCookie('loggedin') == true) {
                            urlPerQuery = '/singleasset/getDiscoveryPersonalItems?uuid=' + Sessions.getCookie('userid') + '&assetType=' + assetTypes;
                        }
                    }
                } else if (queryObj == 'similar_genre' && typeof similarGenre !== 'undefined' && similarGenre !== '' && similarGenre != null) {
                    var similarGenreObj = JSON.parse(similarGenre);
                    try {
                        if (typeof(JSON.parse(queryoptionsObj)).page_size != 'undefined') {
                            similarGenreObj.page_size = queryoptionsObj.page_size;
                        }
                        console.log('similar_genre_queryoption->');
                        console.log(queryoptionsObj);
                    } catch (e) {}
                    similarGenre = JSON.stringify(similarGenreObj);
                    urlPerQuery = "/searchApi/railShortCall?queryoptions=" + similarGenre + "&assetType=" + assetTypes;
                } else if (queryObj == 'search') {
                    if (typeof queryoptionsStr != 'undefined') {
                        if (typeof boltonid != "undefined" && boltonid != "") {
                            urlPerQuery = "/searchApi/railShortCall?unentitled=true&queryoptions=" + queryoptionsStr;
                        } else {
                            urlPerQuery = "/searchApi/railShortCall?queryoptions=" + queryoptionsStr;
                        }
                    }
                } else if (queryObj == 'bolt_on_std') {
                    if (typeof queryoptionsStr != 'undefined') {
                        urlPerQuery = "/searchApi/railShortCall?type=bolt_on_std&queryoptions=" + queryoptionsStr;
                    }
                } else if (queryObj == 'bolt_on_promo') {
                    if (typeof queryoptionsStr != 'undefined') {
                        urlPerQuery = "/searchApi/railShortCall?unentitled=true&queryoptions=" + queryoptionsStr;
                    }
                } else if (queryObj == 'xdr') {
                    urlPerQuery = "/searchApi/shortrailXDRdataCall?";
                } else if (queryObj == 'live') {
                    urlPerQuery = "/live/getTrack?";
                } else {
                    return null;
                }
                if (
                    (getCookie('loggedin') == 'true' || getCookie('loggedin') == true)) {
                    if (typeof urlPerQuery != 'undefined') {
                        return configuration.server_url + urlPerQuery;
                        // + '&accountToken=' + Sessions.getCookie('accessToken');
                    } else {
                        return null;
                    }
                } else {
                    if (queryObj == 'xdr') {
                        return null;
                    }
                    if (typeof urlPerQuery != 'undefined') {
                        return configuration.server_url + urlPerQuery;
                    } else {
                        return null;
                    }
                } //end of loggedin check else
            } //end of railUrlgenerator
            /*
             * AddnewRailsorGrid
             * @param {String} singleAssetBaseUrl default singleasset url
             * @param {type} railDataList  items object from appgrid
             * @param {type} accountToken  user accesstoken
             * @param {string} embedcodeDATA (0ptional only similar)
             * @param {string} similarGenre  (0ptional only for discovery queryoptionsObj.path)
             * @param {type} assetTypes
             *
             */
        this.AddnewRailsorGrid = function(singleAssetBaseUrl, railDataList, accountToken, embedcodeDATA, similarGenre, assetTypes) {
            //image fail fall back          
            jQuery('img[data-failover]').error(function() {
                this.src = generateFallbackImgUrl();
            });
            /*
             * Add rails or grid layout on all div's with class owl-carousel
             */
            jQuery(".owl-carousel").each(function() {
                var fid = "#" + jQuery(this).attr('ID');
                // jQuery(fid).prev().hide();
                if (typeof jQuery(fid).data('owlCarousel') == 'undefined') {
                    var indexTempArr = fid.split('_');
                    var indexNO = indexTempArr[1];
                    var singlerailData = railDataList[indexNO];
                    //console.log(indexNO);                        
                    populateSingleRailsOrGrid(fid, singlerailData, embedcodeDATA, similarGenre, assetTypes);
                } //end of if (!(fid.indexOf("owl-railsNEW") >= 0)) 
            }); //end of jQuery(".owl-carousel").each(function()
        }; //end of AddnewRailsorGrid            
        //For popover language switching
        $rootScope.$watch("CurrentLang", function(newValue, oldValue) {
            if (newValue != '') {
                LanguageSwitchPopOver(newValue);
                LanguageSwitchPortraitRail(newValue);
            }
        }); //end watch 'CurrentLanguage'
        /*
         *
         * @param {type} chqueryStr
         * @param {type} railDataList
         * @param {type} assetTypes
         * @param {type} embedcodeDATA
         * @param {type} similarGenre
         * @returns {undefined}
         */
        this.reloadSingleRailorGridUsingFirstMatchingQuery = function(chqueryStr, railDataList, assetTypes, embedcodeDATA, similarGenre) {
            var indexNo = -1;
            for (var i in railDataList) {
                var queryStr = (typeof railDataList[i]['query'] !== 'undefined') ? railDataList[i]['query'] : '';
                if (queryStr == '' || queryStr == 'promotions' || queryStr == 'appgrid') {
                    //no action
                }
                if (queryStr == chqueryStr) {
                    indexNo = i;
                    break;
                }
            }
            if (indexNo > -1) {
                var domfid = '#owl-rails_' + indexNo;
                if (typeof railDataList[indexNo] != 'undefined' && typeof railDataList[indexNo]['layout'] != 'undefined' && railDataList[indexNo]['layout'] == 'grid') {
                    populateSingleRailsOrGrid(domfid, railDataList[indexNo], embedcodeDATA, similarGenre, assetTypes);
                } else if (typeof railDataList[indexNo] != 'undefined' && typeof jQuery(domfid).data('owlCarousel') !== 'undefined') {
                    //jQuery(domfid).prev().hide();
                    jQuery(domfid).data('owlCarousel').destroy();
                    populateSingleRailsOrGrid(domfid, railDataList[indexNo], embedcodeDATA, similarGenre, assetTypes);
                } else if (typeof railDataList[indexNo] != 'undefined') {
                    //jQuery(domfid).prev().hide();
                    //jQuery(domfid).data('owlCarousel').destroy();
                    populateSingleRailsOrGrid(domfid, railDataList[indexNo], embedcodeDATA, similarGenre, assetTypes);
                }
            }
        }; //reload single rail function.
        this.LoadSingleRail = function(indexNo, singlerailData) {
            console.log("inside LoadSingleRail");
            var domfid = '#owl-rails_' + indexNo;
            console.log(domfid);
            if (typeof jQuery(domfid).data('owlCarousel') !== 'undefined') {
                populateSingleRailsOrGrid(domfid, singlerailData);
            }
        };
        /*
         * prepends AssetImagePaths With Standard Imageshack url
         * @param {type} assetsObjArr
         * @returns {unresolved}
         */
        function prependAssetImagePathsWithStdImageshackurl(assetsObjArr) {
                for (var i in assetsObjArr) {
                    // console.log(itemHtml(data["thumblistCarouselOneArr"][i]));
                    if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                        assetsObjArr[i]['imagePath'] = updateimagePath(assetsObjArr[i]['imagePath']);
                    }
                } //end of img update loop
                return assetsObjArr;
            }
            /*
             * used to populate bolton promo rails
             * @param {Object} singlerailData
             * @param {Integer} index
             * @returns null or a promise
             */
        railServiceOBJ.loadBoltonPromoRailAssets = function(singlerailData, index) {
            var domid = "#boltonpromoRail_" + index;
            if (singlerailData['query'] != 'bolt_on_promo') {
                return null;
            }
            console.log(" calling rail url generator from bolt_on_promo rail");
            var callBackUrl = railServiceOBJ.railUrlgenerator(singlerailData, null, null, null);
            if (callBackUrl == null) {
                jQuery(domid).parents(".RailngRepeatClass").removeClass("railLoading");
                jQuery(domid).parents(".RailngRepeatClass").hide();
            }
            var promise = $http.get(callBackUrl).
            then(function(respdata) {
                var resultdata = respdata.data;
                if (typeof resultdata.thumblistCarouselOneArr != 'undefined') {
                    var newresultData = {};
                    newresultData.thumblistCarouselOneArr = [];
                    (typeof resultdata.thumblistCarouselOneArr[0] != 'undefined') ? newresultData.thumblistCarouselOneArr.push(resultdata.thumblistCarouselOneArr[0]): null;
                    (typeof resultdata.thumblistCarouselOneArr[1] != 'undefined') ? newresultData.thumblistCarouselOneArr.push(resultdata.thumblistCarouselOneArr[1]): null;
                    (typeof resultdata.thumblistCarouselOneArr[2] != 'undefined') ? newresultData.thumblistCarouselOneArr.push(resultdata.thumblistCarouselOneArr[2]): null;
                    if (typeof resultdata.thumblistCarouselOneArr[0] != 'undefined') {
                        newresultData.thumblistCarouselOneArr = prependAssetImagePathsWithStdImageshackurl(newresultData.thumblistCarouselOneArr);
                        jQuery(domid).parents(".RailngRepeatClass").removeClass("railLoading");
                        jQuery(domid).parents(".RailngRepeatClass").show();
                        jQuery(domid).show();
                    }
                    console.log('***********respBoltonPromoAssetsObj****');
                    console.log(newresultData);
                    return newresultData;
                }
                return resultdata;
            }, function(errorresp) {
                console.log('*********** RespBoltonPromo rail Api failure ****');
                return errorresp;
            }); //end of promise then 
            return promise;
        };
        //////rail related functions 
        /*
         * used to populate Single RailsOrGrid
         * @param {type} singlerailData ==> railDataList[indexNO] where
         *                                indexNO  --num in "items" array under a pageid appgrid
         * @param {type} fid  --html domid in template
         *
         */
        function populateSingleRailsOrGrid(fid, singlerailData, embedcodeDATA, similarGenre, assetTypes) {
                if (singlerailData !== 'noRails' && typeof singlerailData !== 'undefined' && typeof singlerailData['query'] !== 'undefined' && singlerailData['query'] != 'null') {
                    //queryoptions=singlerailData['queryoptions'];
                    var queryObj = singlerailData['query'];
                    if (queryObj == 'promotions') {
                        return null; //no actions for  promotions banner
                    } //end of if  promotions banner
                    if (queryObj == 'bolt_on_promo') {
                        return null; //handled by loadBoltonPromoRailAssets function
                    }
                    if (queryObj == 'appgrid') {
                        console.log("appgrid rails");
                        try {
                            var qtrOpt = JSON.parse(singlerailData['queryoptions']);
                            singlerailData['collections'] = qtrOpt['collections'];
                        } catch (e) {
                            console.log("appgrid rail queryoption invalid structure in json");
                        }
                        var appgridCollectionOBJ = (typeof singlerailData['collections'] != 'undefined') ? singlerailData['collections'] : [];
                        var appgridresultdata = appgridRailDataAdapter(appgridCollectionOBJ);
                        console.log("<---->");
                        console.log(appgridCollectionOBJ);
                        console.log(appgridresultdata);
                        console.log("<---->");
                        if (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'grid') {
                            var RailgridHtml = gridLayoutRailFinalhtml(appgridresultdata);
                            //console.log(RailgridHtml);
                            //console.log(fid);
                            jQuery(fid).html(RailgridHtml);
                            gridLayoutEventAttachment(jQuery(fid));
                            jQuery(fid).prev().show();
                            jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                            jQuery(fid).show();
                        } else if (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'portrait') { //not portrait layout  owl owlCarousel
                            var episodeSortOrder = (typeof singlerailData['episode_sort_order'] != 'undefined' && singlerailData['episode_sort_order'] != '') ? singlerailData['episode_sort_order'] : null;
                            console.log("play_on_popup::>");
                            console.log(singlerailData['play_on_popup']);
                            var playOnPopup = (typeof singlerailData['play_on_popup'] != 'undefined' && singlerailData['play_on_popup'] != '') ? singlerailData['play_on_popup'] : false;
                            jQuery(fid).html(portraitItemListHtml(appgridresultdata, episodeSortOrder, playOnPopup));
                            jQuery(fid).owlCarousel({
                                items: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'portrait') ? 5 : 5,
                                itemsDesktop: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'portrait') ? [1366, 5] : [1366, 5],
                                itemsDesktopSmall: [900, 3],
                                itemsTablet: [700, 2.5],
                                itemsMobile: [400, 2.5],
                                stagePadding: 100,
                                lazyLoad: true,
                                scrollPerPage: false,
                                navigation: true,
                                afterInit: basicRailattachEvent
                            });
                            jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                            jQuery(fid).prev().show();
                        } else { //not grid layout so use owl owlCarousel
                            var episodeSortOrder = (typeof singlerailData['episode_sort_order'] != 'undefined' && singlerailData['episode_sort_order'] != '') ? singlerailData['episode_sort_order'] : null;
                            var playOnPopup = (typeof singlerailData['play_on_popup'] != 'undefined' && singlerailData['play_on_popup'] != '') ? singlerailData['play_on_popup'] : false;
                            if (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') {
                                //oneByTwoRailHtml
                                // jQuery(fid).html(oneByTwoRailHtml(appgridresultdata));
                                jQuery(fid).html(one_one_TwoRailHtml(appgridresultdata, episodeSortOrder, playOnPopup));
                            } else {
                                jQuery(fid).html(itemListHtml(appgridresultdata, episodeSortOrder, playOnPopup, singlerailData['layout']));
                            }
                            jQuery(fid).owlCarousel({
                                items: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? 4 : 5,
                                itemsDesktop: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? [1366, 3] : [1366, 4],
                                itemsDesktopSmall: [900, 3],
                                itemsTablet: [700, 2.5],
                                itemsMobile: [400, 2.5],
                                stagePadding: 100,
                                lazyLoad: true,
                                scrollPerPage: false,
                                navigation: true,
                                afterInit: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? onebytwoRailattachEvent : basicRailattachEvent
                            });
                            jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                            jQuery(fid).prev().show();
                        }
                    } else {
                        var callBackUrl = railServiceOBJ.railUrlgenerator(singlerailData, embedcodeDATA, similarGenre, assetTypes);
                        if (callBackUrl == null) {
                            jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                            jQuery(fid).parents(".RailngRepeatClass").hide();
                        }
                        //singlerailData['layout']='grid';// for testing a layout
                        if (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'grid') {
                            //console.log('--grid->');console.log(fid);
                            jQuery.ajax({
                                url: callBackUrl,
                                success: function(resultdata) {
                                    // console.log('--resp->');
                                    //&& typeof resultdata.errors!=='undefined'
                                    if (typeof resultdata.thumblistCarouselOneArr != 'undefined') {
                                        var RailgridHtml = gridLayoutRailFinalhtml(resultdata);
                                        //console.log(RailgridHtml);
                                        //console.log(fid);
                                        jQuery(fid).html(RailgridHtml);
                                        gridLayoutEventAttachment(jQuery(fid));
                                        jQuery(fid).prev().show();
                                        jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                                        jQuery(fid).show();
                                    } //end of typeof error 
                                    else {
                                        jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                                        jQuery(fid).prev().hide();
                                    }
                                },
                                error: function() {
                                    jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                                    jQuery(fid).prev().hide();
                                }
                            }); //get grid layout ajax call end.              
                        } // if(typeof singlerailData['layout']!='undefined' && singlerailData['layout']=='grid' )
                        else {
                            console.log("OwlCall ");
                            console.log(fid);
                            console.log(callBackUrl);
                            console.log(singlerailData['query']);
                            if (singlerailData['query'] == "bolt_on_std") {
                                console.log("starting bolton std ajax");
                                jQuery.ajax({
                                    url: callBackUrl,
                                    success: function(data) {
                                        if (typeof data.thumblistCarouselOneArr != 'undefined') {
                                            console.log("starting bolt_on_std response handling");
                                            var episodeSortOrder = (typeof singlerailData['episode_sort_order'] != 'undefined' && singlerailData['episode_sort_order'] != '') ? singlerailData['episode_sort_order'] : null;
                                            console.log("play_on_popup::>");
                                            console.log(singlerailData['play_on_popup']);
                                            var playOnPopup = (typeof singlerailData['play_on_popup'] != 'undefined' && singlerailData['play_on_popup'] != '') ? singlerailData['play_on_popup'] : false;
                                            if (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') {
                                                //oneByTwoRailHtml
                                                //   jQuery(fid).html(oneByTwoRailHtml(data));
                                                jQuery(fid).html(one_one_TwoRailHtml(data, episodeSortOrder, playOnPopup));
                                            } else {
                                                jQuery(fid).html(itemListHtml(data, episodeSortOrder, playOnPopup, singlerailData['layout']));
                                            }
                                            if (typeof jQuery(fid).data('owlCarousel') !== 'undefined') {
                                                //jQuery(fid).prev().hide();
                                                jQuery(fid).data('owlCarousel').destroy();
                                            }
                                            jQuery(fid).owlCarousel({
                                                items: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? 4 : 5,
                                                itemsDesktop: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? [1366, 3] : [1366, 4],
                                                itemsDesktopSmall: [900, 3],
                                                itemsTablet: [700, 2.5],
                                                itemsMobile: [400, 2.5],
                                                stagePadding: 100,
                                                lazyLoad: true,
                                                scrollPerPage: false,
                                                navigation: true,
                                                afterInit: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? onebytwoRailattachEvent : basicRailattachEvent
                                            });
                                            console.log("std bolton OwlCall started");
                                            jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                                            jQuery(fid).prev().show();
                                        } else {
                                            jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                                            jQuery(fid).prev().hide();
                                        }
                                    },
                                    error: function() {
                                        jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                                        jQuery(fid).prev().hide();
                                    }
                                }); //get std bolton ajax call end.
                            } else {
                                jQuery(fid).owlCarousel({
                                    items: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? 4 : 5,
                                    itemsDesktop: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? [1366, 3] : [1366, 4],
                                    itemsDesktopSmall: [900, 3],
                                    itemsTablet: [700, 2.5],
                                    itemsMobile: [400, 2.5],
                                    stagePadding: 100,
                                    lazyLoad: true,
                                    scrollPerPage: false,
                                    navigation: true,
                                    jsonPath: callBackUrl,
                                    jsonSuccess: function(data) {
                                        if (typeof data.thumblistCarouselOneArr != 'undefined') {
                                            //if (typeof data.error === 'undefined') {
                                            var episodeSortOrder = (typeof singlerailData['episode_sort_order'] != 'undefined' && singlerailData['episode_sort_order'] != '') ? singlerailData['episode_sort_order'] : null;
                                            console.log("play_on_popup::>");
                                            console.log(singlerailData['play_on_popup']);
                                            var playOnPopup = (typeof singlerailData['play_on_popup'] != 'undefined' && singlerailData['play_on_popup'] != '') ? singlerailData['play_on_popup'] : false;
                                            if (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') {
                                                //oneByTwoRailHtml
                                                //   jQuery(fid).html(oneByTwoRailHtml(data));
                                                jQuery(fid).html(one_one_TwoRailHtml(data, episodeSortOrder, playOnPopup));
                                            } else {
                                                jQuery(fid).html(itemListHtml(data, episodeSortOrder, playOnPopup, singlerailData['layout']));
                                            }
                                            jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                                            jQuery(fid).prev().show();
                                            jQuery(fid).parents(".RailngRepeatClass").show();
                                            jQuery(fid).show();
                                        } else {
                                            jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                                            jQuery(fid).prev().hide();
                                        }
                                    },
                                    afterInit: (typeof singlerailData['layout'] != 'undefined' && singlerailData['layout'] == 'onebytwo') ? onebytwoRailattachEvent : basicRailattachEvent
                                });
                            } //else stdbolton
                        } //end of else
                    } //end of not appgrid else
                } //end of if (singlerailData !== 'noRails' && typeof singlerailData !=='undefined' &&
                //       typeof singlerailData['queryoptions'] !== 'undefined')
            } //end of populateSingleRailsOrGrid
            //returns fallback url
        function generateFallbackImgUrl() {
                return getNewbase() + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '');
            }
            //returns fallback url
        function generatePortraitFallbackImgUrl() {
                return getRailPortraitbase() + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '');
            }
            /*
             * getSingleAssetBaseUrl
             * @param {Integer} TitleTypeId
             * @returns {String} single asset url
             */
        function getSingleAssetBaseUrl(TitleTypeId) {
                if (_.contains([1, 3], TitleTypeId)) {
                    return "/movie";
                } else if (_.contains([2, 4, 5, 6], TitleTypeId)) {
                    return "/tvShow";
                } else {
                    return null;
                }
            }
            /*
             * getLive Asset Url
             *
             * @returns {String} Live asset url
             */
        function getLiveAssetUrl(embed_code, channelId, title) {
                return "/liveShow?content_id=" + embed_code + "&id=" + channelId + "&title=" + title;
            }
            /* itemHtml takes itemObj returns 
             * general rail asset html
             * @param {Object} itemObj
             * @param {Boolean} playOnPopup
             * @returns {String} underscoretemplate html
             */
        function itemHtml(itemObj, playOnPopup, layout) {
                var typeOfRail = 'others';
                var playhead_seconds = 0;
                var single_asset_url = '';
                var totalMins = '';
                var isLoggedInUser = $rootScope.isLoggedIn;
                var BaseUrl = getSingleAssetBaseUrl(itemObj.TitleTypeId) === null ? '#' : getSingleAssetBaseUrl(itemObj.TitleTypeId);
                // var single_asset_url = BaseUrl + '?contentId=' + itemObj.contentID + '&titleId=' + itemObj.titleId;
                if (typeof itemObj.xdrContent != 'undefined') {
                    playhead_seconds = itemObj.xdrContent.playhead_seconds;
                    var elapsed = parseInt(itemObj.xdrContent.playhead_seconds) / 60;
                    var duration = parseInt(itemObj.duration);
                    totalMins = parseInt(elapsed / duration * 100) + '%';
                    typeOfRail = 'xdr';
                }
                //console.log(itemObj.show_type);
                if (itemObj.show_type != 'live') {
                    single_asset_url = BaseUrl + '?titleId=' + itemObj.titleId;
                } else if (itemObj.show_type == 'live') {
                    single_asset_url = getLiveAssetUrl(itemObj.embed_code, itemObj.channelId, itemObj.title);
                }
                var Htmltemplate = jQuery("#BasicRailsItemHtml").html();
                var placeholderImg_url = (typeof layout != 'undefined' && layout == 'portrait') ? generatePortraitFallbackImgUrl() : generateFallbackImgUrl();
                return _.template(Htmltemplate, {
                    itemObj: itemObj,
                    single_asset_url: single_asset_url,
                    totalMins: totalMins,
                    isLoggedInUser: isLoggedInUser,
                    typeOfRail: typeOfRail,
                    playhead_seconds: playhead_seconds,
                    base_url: BaseUrl,
                    placeholderImg_url: placeholderImg_url,
                    playOnPopup: playOnPopup
                });
            }
            /* itemPortraitHtml takes itemObj returns 
             * general rail asset html
             * @param {Object} itemObj
             * @param {Boolean} playOnPopup
             * @returns {String} underscoretemplate html
             */
        function itemPortraitHtml(itemObj, playOnPopup) {
                var typeOfRail = 'others';
                var playhead_seconds = 0;
                var single_asset_url = '';
                var totalMins = '';
                var isLoggedInUser = $rootScope.isLoggedIn;
                var BaseUrl = getSingleAssetBaseUrl(itemObj.TitleTypeId) === null ? '#' : getSingleAssetBaseUrl(itemObj.TitleTypeId);
                // var single_asset_url = BaseUrl + '?contentId=' + itemObj.contentID + '&titleId=' + itemObj.titleId;
                if (typeof itemObj.xdrContent != 'undefined') {
                    playhead_seconds = itemObj.xdrContent.playhead_seconds;
                    var elapsed = parseInt(itemObj.xdrContent.playhead_seconds) / 60;
                    var duration = parseInt(itemObj.duration);
                    totalMins = parseInt(elapsed / duration * 100) + '%';
                    typeOfRail = 'xdr';
                }
                //console.log(itemObj.show_type);
                if (typeof itemObj.show_type == "undefined") {
                    single_asset_url = '';
                } else if (itemObj.show_type != 'live') {
                    single_asset_url = BaseUrl + '?titleId=' + itemObj.titleId;
                } else if (itemObj.show_type == 'live') {
                    single_asset_url = getLiveAssetUrl(itemObj.embed_code, itemObj.channelId, itemObj.title);
                }
                if (typeof $rootScope.ParsedmsgObj == 'undefined') {
                    $rootScope.ParsedmsgObj = JSON.parse($rootScope.appGridMetadata.messages);
                }
                if (typeof $rootScope.TXT_PLAY_VIDEObj == 'undefined') {
                    $rootScope.TXT_PLAY_VIDEObj = getTranslationObj('TXT_PLAY_VIDEO', $rootScope.ParsedmsgObj);
                }
                var Htmltemplate = jQuery("#PortraitBasicRailsItemHtml").html();
                return _.template(Htmltemplate, {
                    itemObj: itemObj,
                    single_asset_url: single_asset_url,
                    totalMins: totalMins,
                    isLoggedInUser: isLoggedInUser,
                    typeOfRail: typeOfRail,
                    playhead_seconds: playhead_seconds,
                    base_url: BaseUrl,
                    placeholderImg_url: generatePortraitFallbackImgUrl(),
                    TXT_PLAY_VIDEOObj: $rootScope.TXT_PLAY_VIDEObj,
                    playOnPopup: playOnPopup
                });
            }
            /* itemListHtml takes data returns 
             * all general rails assets html
             * @param {object} data
             * @param {String} episodeSortOrder
             * @param {Boolean} playOnPopup
             * @param {String}  layout
             * @returns {string} underscoretemplate html
             */
        function itemListHtml(data, episodeSortOrder, playOnPopup, layout) {
                if (typeof data["thumblistCarouselOneArr"] != 'undefined' && typeof data["thumblistCarouselOneArr"][0] != 'undefined' && data["thumblistCarouselOneArr"][0]['show_type'] == "live") {
                    data = railServiceOBJ.SortLiveChannels(data);
                } else {
                    data = railServiceOBJ.sortRailsByEpisodeId(data, episodeSortOrder);
                }
                console.log(episodeSortOrder);
                console.log("Here");
                var content = "";
                for (var i in data["thumblistCarouselOneArr"]) {
                    if (typeof data["thumblistCarouselOneArr"][i]['imagePath'] != 'undefined') {
                        // console.log(itemHtml(data["thumblistCarouselOneArr"][i]));
                        if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                            if (typeof layout != 'undefined' && layout == 'portrait') {
                                data["thumblistCarouselOneArr"][i]['imagePath'] = updateimageRailPortraitbasePath(data["thumblistCarouselOneArr"][i]['imagePath']);
                            } else {
                                data["thumblistCarouselOneArr"][i]['imagePath'] = updateimagePath(data["thumblistCarouselOneArr"][i]['imagePath']);
                            }
                        }
                        content += itemHtml(data["thumblistCarouselOneArr"][i], playOnPopup, layout);
                    }
                }
                return content;
            }
            /* portraitItemListHtml takes data returns 
             * all portrait layout rails assets html
             * @param {object} data
             * @param {String} episodeSortOrder
             * @param {Boolean} playOnPopup
             * @returns {string} underscoretemplate html
             */
        function portraitItemListHtml(data, episodeSortOrder, playOnPopup) {
                if (typeof data["thumblistCarouselOneArr"] != 'undefined' && typeof data["thumblistCarouselOneArr"][0] != 'undefined' && data["thumblistCarouselOneArr"][0]['show_type'] == "live") {
                    data = railServiceOBJ.SortLiveChannels(data);
                } else {
                    data = railServiceOBJ.sortRailsByEpisodeId(data, episodeSortOrder);
                }
                console.log(episodeSortOrder);
                console.log("Here");
                var content = "";
                for (var i in data["thumblistCarouselOneArr"]) {
                    if (typeof data["thumblistCarouselOneArr"][i]['imagePath'] != 'undefined') {
                        // console.log(itemHtml(data["thumblistCarouselOneArr"][i]));
                        if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                            data["thumblistCarouselOneArr"][i]['imagePath'] = updateimageRailPortraitbasePath(data["thumblistCarouselOneArr"][i]['imagePath']);
                        }
                        content += itemPortraitHtml(data["thumblistCarouselOneArr"][i], playOnPopup);
                    }
                }
                return content;
            }
            /* updateimagePath 
             * used to append imageshack url and
             * replace 'dummy/blank_image.png' with appgrid blank_image
             * assets url.
             * @param {String} currentImgPath
             * @returns {String|$rootScopeappgridAssets.placeholder-large-16-9 or placeholder-yaveo-large-16-9}
             */
        function updateimagePath(currentImgPath) {
                var newImgPath = '';
                if (typeof currentImgPath != "undefined" && currentImgPath.indexOf('dummy/blank_image.png') === -1) {
                    newImgPath = getNewbase() + currentImgPath;
                } else {
                    newImgPath = getNewbase() + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                }
                return newImgPath;
            }
            /* updateimageRailPortraitbasePath 
             * used to append imageshack url and
             * replace 'dummy/blank_image.png' with appgrid blank_image
             * assets url.
             * @param {String} currentImgPath
             * @returns {String|$rootScopeappgridAssets.placeholder-large-16-9 or placeholder-yaveo-large-16-9}
             */
        function updateimageRailPortraitbasePath(currentImgPath) {
                var newImgPath = '';
                if (typeof currentImgPath != "undefined" && currentImgPath.indexOf('dummy/blank_image.png') === -1) {
                    newImgPath = getRailPortraitbase() + currentImgPath;
                } else {
                    newImgPath = getRailPortraitbase() + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                }
                return newImgPath;
            }
            //oneby2 rail template function
            /*
             * oneByTwoRailOBJtoRailInnerHtml
             * @param {Object} itemObj
             * @param {String} className
             * @param {String} position
             * @returns {String} underscoretemplate html
             */
        function oneByTwoRailOBJtoRailInnerHtml(itemObj, className, position) {
                // ----------------------------------
                var Kclass = (className === 'big') ? 'OWLbigImage' : 'OWLsmallImage';
                var data_src = (className === 'big') ? 'data-src' : 'src';
                var PlayICOClass = (className === 'big') ? 'playIco' : (position === 'left') ? 'playIcoSmallLeft' : 'playIcoSmallRight';
                var PicCaptionClass = (className === 'big') ? 'piccaption' : (position === 'left') ? 'piccaptionSmallLeft' : 'piccaptionSmallRight';
                var HideDesc = (className === 'big') ? '' : 'style="visibility:hidden"';
                var onebytwoRailInnertemplate = jQuery("#NEW_onebytwoRailInnerHtml").html();
                // ---------------------------------------
                var typeOfRail = 'others';
                var playhead_seconds = 0;
                var single_asset_url = '';
                var totalMins = '';
                var isLoggedInUser = $rootScope.isLoggedIn;
                var BaseUrl = getSingleAssetBaseUrl(itemObj.TitleTypeId) === null ? '#' : getSingleAssetBaseUrl(itemObj.TitleTypeId);
                if (typeof itemObj.xdrContent != 'undefined') {
                    playhead_seconds = itemObj.xdrContent.playhead_seconds;
                    var elapsed = parseInt(itemObj.xdrContent.playhead_seconds) / 60;
                    var duration = parseInt(itemObj.duration);
                    totalMins = parseInt(elapsed / duration * 100) + '%';
                    typeOfRail = 'xdr';
                }
                if (itemObj.show_type != 'live') {
                    single_asset_url = BaseUrl + '?titleId=' + itemObj.titleId;
                } else if (itemObj.show_type == 'live') {
                    single_asset_url = getLiveAssetUrl(itemObj.embed_code, itemObj.channelId, itemObj.title);
                }
                var oneByTwoInnerHtml = _.template(onebytwoRailInnertemplate, {
                    itemObj: itemObj,
                    single_asset_url: single_asset_url,
                    data_src: data_src,
                    Kclass: Kclass,
                    PlayICOClass: PlayICOClass,
                    PicCaptionClass: PicCaptionClass,
                    HideDesc: HideDesc,
                    totalMins: totalMins,
                    isLoggedInUser: isLoggedInUser,
                    typeOfRail: typeOfRail,
                    playhead_seconds: playhead_seconds,
                    base_url: BaseUrl,
                    placeholderImg_url: generateFallbackImgUrl()
                });
                return oneByTwoInnerHtml;
            }
            //end of oneby2 rail template function
            /*
             * oneByTwoRailHtml onebytwo with 1large image and
             * 2 small image templates -> full template
             * @param {object} data
             * @returns {string} underscoretemplate html
             */
        function oneByTwoRailHtml(data) {
                if (typeof data["thumblistCarouselOneArr"] != 'undefined' && typeof data["thumblistCarouselOneArr"][0] != 'undefined' && data["thumblistCarouselOneArr"][0]['show_type'] == "live") {
                    data = railServiceOBJ.SortLiveChannels(data);
                }
                var content = "";
                for (var i in data["thumblistCarouselOneArr"]) {
                    // console.log(itemHtml(data["thumblistCarouselOneArr"][i]));
                    if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                        data["thumblistCarouselOneArr"][i]['imagePath'] = updateimagePath(data["thumblistCarouselOneArr"][i]['imagePath']);
                    }
                } //end of img update loop
                var itemBigHtml, itemSmallLeftHtml, itemSmallRightHtml;
                var incrementRate = 3;
                for (var i = 0; i < data["thumblistCarouselOneArr"].length; i += incrementRate) {
                    if (i >= 5) {
                        incrementRate = 6;
                        var restofELM = data["thumblistCarouselOneArr"].length - ((i + 1) + incrementRate);
                        if (restofELM < 0) {
                            incrementRate = -restofELM;
                        }
                    }
                    if (i < 6) {
                        var onebytwoRailItemHtmltemplate = jQuery("#NEW_onebytwoRailItemHtml").html(); //ONE railitem with 1img and 2 small img
                        itemBigHtml = itemSmallLeftHtml = itemSmallRightHtml = '';
                        itemBigHtml = oneByTwoRailOBJtoRailInnerHtml(data["thumblistCarouselOneArr"][i], 'big');
                        if (typeof data["thumblistCarouselOneArr"][i + 1] != 'undefined') itemSmallLeftHtml = oneByTwoRailOBJtoRailInnerHtml(data["thumblistCarouselOneArr"][i + 1], 'small', 'left');
                        if (typeof data["thumblistCarouselOneArr"][i + 2] != 'undefined') itemSmallRightHtml = oneByTwoRailOBJtoRailInnerHtml(data["thumblistCarouselOneArr"][i + 2], 'small', 'right');
                        var oneByTwoItemHtml = _.template(onebytwoRailItemHtmltemplate, {
                            itemBigHtml: itemBigHtml,
                            itemSmallLeftHtml: itemSmallLeftHtml,
                            itemSmallRightHtml: itemSmallRightHtml
                        });
                        content += oneByTwoItemHtml;
                    } //end of if i>6
                    else {
                        var onebytwoRailItemwith3inColHtmltemplate = jQuery("#NEW_onebytwoRailItemwith3inColHtml").html(); //ONE railitem with 1img and 2 small img
                        var itemSmall1Html = '',
                            itemSmall2Html = '',
                            itemSmall3Html = '',
                            itemSmall4Html = '';
                        var itemSmall5Html = '',
                            itemSmall6Html = '';
                        itemSmall1Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i], 'small');
                        if (typeof data["thumblistCarouselOneArr"][i + 1] != 'undefined') itemSmall2Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i + 1], 'small');
                        if (typeof data["thumblistCarouselOneArr"][i + 2] != 'undefined') itemSmall3Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i + 2], 'small');
                        if (typeof data["thumblistCarouselOneArr"][i + 3] != 'undefined') itemSmall4Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i + 3], 'small');
                        if (typeof data["thumblistCarouselOneArr"][i + 4] != 'undefined') itemSmall5Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i + 4], 'small');
                        if (typeof data["thumblistCarouselOneArr"][i + 5] != 'undefined') itemSmall6Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i + 5], 'small');
                        var onebytwoRailItemwith3inCol = _.template(onebytwoRailItemwith3inColHtmltemplate, {
                            itemSmall1Html: itemSmall1Html,
                            itemSmall2Html: itemSmall2Html,
                            itemSmall3Html: itemSmall3Html,
                            itemSmall4Html: itemSmall4Html,
                            itemSmall5Html: itemSmall5Html,
                            itemSmall6Html: itemSmall6Html
                        });
                        content += onebytwoRailItemwith3inCol;
                    }
                } //end of for(var i=0;i<data["thumblistCarouselOneArr"].length;i+=3)
                return content;
            }
            /*
             * oneByTwoRailOBJtoRail3ColInnerHtml onebytwo with 1large image and
             * 2 small image templates -> full template
             * @param {Object} itemObj
             * @param {String} className
             * @param {Boolean} playOnPopup
             * @returns {String} underscoretemplate html
             */
            //other template of item div of onebytwo rail
        function oneByTwoRailOBJtoRail3ColInnerHtml(itemObj, className, playOnPopup) {
                // ----------------------------------
                var Kclass = (className === 'big') ? 'OWLbigImage' : 'OWLsmallImage';
                var data_src = (className === 'big') ? 'data-src' : 'src';
                var PlayICOClass = 'playIcoSmallLeft';
                var PicCaptionClass = 'piccaptionSmallLeft';
                var HideDesc = (className === 'big') ? '' : 'style="visibility:hidden"';
                var onebytwoRailInnertemplate = jQuery("#NEW_onebytwoRailInnerHtml").html();
                // ---------------------------------------
                var typeOfRail = 'others';
                var playhead_seconds = 0;
                var single_asset_url = '';
                var totalMins = '';
                var isLoggedInUser = $rootScope.isLoggedIn;
                var BaseUrl = getSingleAssetBaseUrl(itemObj.TitleTypeId) === null ? '#' : getSingleAssetBaseUrl(itemObj.TitleTypeId);
                // var single_asset_url = BaseUrl + '?contentId=' + itemObj.contentID + '&titleId=' + itemObj.titleId;
                if (typeof itemObj.xdrContent != 'undefined') {
                    playhead_seconds = itemObj.xdrContent.playhead_seconds;
                    var elapsed = parseInt(itemObj.xdrContent.playhead_seconds) / 60;
                    var duration = parseInt(itemObj.duration);
                    totalMins = parseInt(elapsed / duration * 100) + '%';
                    typeOfRail = 'xdr';
                }
                if (itemObj.show_type != 'live') {
                    single_asset_url = BaseUrl + '?titleId=' + itemObj.titleId;
                } else if (itemObj.show_type == 'live') {
                    single_asset_url = getLiveAssetUrl(itemObj.embed_code, itemObj.channelId, itemObj.title);
                }
                var oneByTwoInnerHtml = _.template(onebytwoRailInnertemplate, {
                    itemObj: itemObj,
                    single_asset_url: single_asset_url,
                    data_src: data_src,
                    Kclass: Kclass,
                    PlayICOClass: PlayICOClass,
                    PicCaptionClass: PicCaptionClass,
                    HideDesc: HideDesc,
                    totalMins: totalMins,
                    isLoggedInUser: isLoggedInUser,
                    typeOfRail: typeOfRail,
                    playhead_seconds: playhead_seconds,
                    base_url: BaseUrl,
                    placeholderImg_url: generateFallbackImgUrl(),
                    playOnPopup: playOnPopup
                });
                return oneByTwoInnerHtml;
            }
            /*
             * itemImgBIGOne_One_twoHtml
             * @param {object} itemObj
             * @returns {string} underscoretemplate html
             */
        function itemImgBIGOne_One_twoHtml(itemObj) {
                var typeOfRail = 'others';
                var playhead_seconds = 0;
                var single_asset_url = '';
                var totalMins = '';
                var isLoggedInUser = $rootScope.isLoggedIn;
                var BaseUrl = getSingleAssetBaseUrl(itemObj.TitleTypeId) === null ? '#' : getSingleAssetBaseUrl(itemObj.TitleTypeId);
                // var single_asset_url = BaseUrl + '?contentId=' + itemObj.contentID + '&titleId=' + itemObj.titleId;
                if (typeof itemObj.xdrContent != 'undefined') {
                    playhead_seconds = itemObj.xdrContent.playhead_seconds;
                    var elapsed = parseInt(itemObj.xdrContent.playhead_seconds) / 60;
                    var duration = parseInt(itemObj.duration);
                    totalMins = parseInt(elapsed / duration * 100) + '%';
                    typeOfRail = 'xdr';
                }
                if (itemObj.show_type != 'live') {
                    single_asset_url = BaseUrl + '?titleId=' + itemObj.titleId;
                } else if (itemObj.show_type == 'live') {
                    single_asset_url = getLiveAssetUrl(itemObj.embed_code, itemObj.channelId, itemObj.title);
                }
                var Htmltemplate = jQuery("#BasicBigImgone_one_twoRailsItemHtml").html();
                return _.template(Htmltemplate, {
                    itemObj: itemObj,
                    single_asset_url: single_asset_url,
                    totalMins: totalMins,
                    isLoggedInUser: isLoggedInUser,
                    typeOfRail: typeOfRail,
                    playhead_seconds: playhead_seconds,
                    base_url: BaseUrl,
                    placeholderImg_url: generateFallbackImgUrl()
                });
            }
            /* one_one_TwoRailHtml generates one_one_TwoRail complete html
             *
             * @param {object} data
             * @param {String} playOnPopup
             * @returns {String} underscoretemplate html
             */
        function one_one_TwoRailHtml(data, playOnPopup) {
                if (typeof data["thumblistCarouselOneArr"] != 'undefined' && typeof data["thumblistCarouselOneArr"][0] != 'undefined' && data["thumblistCarouselOneArr"][0]['show_type'] == "live") {
                    data = railServiceOBJ.SortLiveChannels(data);
                }
                var content = "";
                for (var i in data["thumblistCarouselOneArr"]) {
                    // console.log(itemHtml(data["thumblistCarouselOneArr"][i]));
                    if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                        data["thumblistCarouselOneArr"][i]['imagePath'] = updateimagePath(data["thumblistCarouselOneArr"][i]['imagePath']);
                    }
                } //end of img update loop
                var itemBigHtml;
                var incrementRate = 1;
                var Length = data["thumblistCarouselOneArr"].length;
                for (var i = 0; i < Length;) {
                    if (i < 2) {
                        //itemBigHtml=oneByTwoRailOBJtoRailInnerHtml(data["thumblistCarouselOneArr"][i],'big');
                        itemBigHtml = itemImgBIGOne_One_twoHtml(data["thumblistCarouselOneArr"][i], playOnPopup);
                        content += itemBigHtml;
                        i += incrementRate;
                    } //end of if i>2
                    else {
                        var NEW_one_one_twoRailItemwith2inColHtmlTemplate = jQuery("#NEW_one_one_twoRailItemwith2inColHtml").html(); //ONE railitem with 1img and 2 small img
                        var itemSmall1Html = '',
                            itemSmall2Html = '',
                            itemSmall3Html = '',
                            itemSmall4Html = '';
                        itemSmall1Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i], 'small', playOnPopup);
                        if (typeof data["thumblistCarouselOneArr"][i + 1] != 'undefined') itemSmall2Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i + 1], 'small', playOnPopup);
                        if (typeof data["thumblistCarouselOneArr"][i + 2] != 'undefined') itemSmall3Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i + 2], 'small', playOnPopup);
                        if (typeof data["thumblistCarouselOneArr"][i + 3] != 'undefined') itemSmall4Html = oneByTwoRailOBJtoRail3ColInnerHtml(data["thumblistCarouselOneArr"][i + 3], 'small', playOnPopup);
                        var onebytwoRailItemwith2inCol = _.template(NEW_one_one_twoRailItemwith2inColHtmlTemplate, {
                            itemSmall1Html: itemSmall1Html,
                            itemSmall2Html: itemSmall2Html,
                            itemSmall3Html: itemSmall3Html,
                            itemSmall4Html: itemSmall4Html
                        });
                        content += onebytwoRailItemwith2inCol;
                        var restofELM = Length - ((i) + incrementRate);
                        if (restofELM < 0) {
                            incrementRate = -restofELM;
                        } else {
                            incrementRate = 4;
                        }
                        i += incrementRate;
                    }
                } //end of for(var i=0;i<data["thumblistCarouselOneArr"].length;i+=3)
                return content;
            }
            //other template function
            /* gridLayoutRailFinalhtml 
             * generates grid layout complate html
             *
             * @param {Object} resultdata
             * @returns {String}  underscoretemplate html
             */
        function gridLayoutRailFinalhtml(resultdata) {
                if (typeof resultdata["thumblistCarouselOneArr"] != 'undefined' && typeof resultdata["thumblistCarouselOneArr"][0] != 'undefined' && resultdata["thumblistCarouselOneArr"][0]['show_type'] == "live") {
                    resultdata = railServiceOBJ.SortLiveChannels(resultdata);
                }
                for (var i in resultdata["thumblistCarouselOneArr"]) {
                    // console.log(itemHtml(data["thumblistCarouselOneArr"][i]));
                    if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                        resultdata["thumblistCarouselOneArr"][i]['imagePath'] = updateimagePath(resultdata["thumblistCarouselOneArr"][i]['imagePath']);
                    }
                }
                var resK = resultdata.thumblistCarouselOneArr;
                //console.log(resK.length);
                var RailgridlayoutInnerHtmltemplate = jQuery("#RailgridlayoutInnerHtml").html();
                var contentAccumulator = '';
                for (var p = 0; p < resK.length; p++) {
                    var itemObj = resK[p];
                    var BaseUrl = getSingleAssetBaseUrl(itemObj.TitleTypeId) === null ? '#' : getSingleAssetBaseUrl(itemObj.TitleTypeId);
                    var watchClipUrl = '';
                    var totalMins = '';
                    var typeOfRail = 'others';
                    var playhead_seconds = 0;
                    if (typeof itemObj.xdrContent != 'undefined') {
                        playhead_seconds = itemObj.xdrContent.playhead_seconds;
                        var elapsed = parseInt(itemObj.xdrContent.playhead_seconds) / 60;
                        var duration = parseInt(itemObj.duration);
                        totalMins = parseInt(elapsed / duration * 100) + '%';
                        typeOfRail = 'xdr';
                    }
                    if (itemObj.show_type != 'live') {
                        watchClipUrl = BaseUrl + '?titleId=' + itemObj.titleId;
                    } else if (itemObj.show_type == 'live') {
                        watchClipUrl = getLiveAssetUrl(itemObj.embed_code, itemObj.channelId, itemObj.title);
                    }
                    var iteminnerHtml = _.template(RailgridlayoutInnerHtmltemplate, {
                        itemObj: itemObj,
                        single_asset_url: watchClipUrl,
                        totalMins: totalMins,
                        typeOfRail: typeOfRail,
                        playhead_seconds: playhead_seconds,
                        base_url: BaseUrl,
                        placeholderImg_url: generateFallbackImgUrl()
                    });
                    contentAccumulator += iteminnerHtml;
                } //for loop
                var RailgridlayoutContainerHtmltemplate = jQuery("#RailgridlayoutContainerHtml").html();
                return _.template(RailgridlayoutContainerHtmltemplate, {
                    loopedAndInnerHtml: contentAccumulator
                });
            } //end of gridLayoutRailFinalhtml
            /* appgridRailDataAdapter converts appgrid rail's 
             * appgridCollectionOBJ to resultDataObj which can be
             * accepted by railtemplate function.
             *
             * @param {Object} appgridCollectionOBJ
             * @returns {Object or null} {appgridRailDataAdapter.resultDataObj}
             */
        function appgridRailDataAdapter(appgridCollectionOBJ) {
                if (typeof appgridCollectionOBJ != 'undefined' && typeof appgridCollectionOBJ != null) {
                    var curImg = '';
                    var railItemsArr = new Array();
                    console.log("inside appgrid rail adapter===>>>");
                    console.log(appgridCollectionOBJ);
                    for (var j = 0; j < appgridCollectionOBJ.length; j++) {
                        var appgridColitemObj = appgridCollectionOBJ[j];
                        var railItemObj = {};
                        railItemObj.title = (typeof appgridColitemObj.title != 'undefined' && typeof appgridColitemObj.title.en_US != 'undefined') ? appgridColitemObj.title.en_US : '';
                        railItemObj.title_es = (typeof appgridColitemObj.title != 'undefined' && typeof appgridColitemObj.title.es_ES != 'undefined') ? appgridColitemObj.title.es_ES : '';
                        railItemObj.titleId = (typeof appgridColitemObj.titleid != 'undefined') ? appgridColitemObj.titleid : '';
                        railItemObj.TitleTypeId = (typeof appgridColitemObj.titletypeid != 'undefined') ? appgridColitemObj.titletypeid : '';
                        railItemObj.contentID = (typeof appgridColitemObj.embedcode != 'undefined') ? appgridColitemObj.embedcode : '';
                        console.log(railItemObj.contentID);
                        console.log("----");
                        if (typeof appgridColitemObj.icon != 'undefined') curImg = (typeof $rootScope.appgridAssets[appgridColitemObj.icon] != 'undefined') ? ($rootScope.appgridAssets[appgridColitemObj.icon]).replace("https", "http") : ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                        else curImg = '/dummy/blank_image.png';
                        railItemObj.imagePath = curImg;
                        railItemsArr.push(railItemObj);
                    } //end of for loop
                    var resultDataObj = {};
                    resultDataObj.thumblistCarouselOneArr = railItemsArr;
                    return resultDataObj;
                } else { //appgridCollectionOBJ is null
                    return null;
                }
            } //end of appgridRailDataAdapter function
            //
            /* LanguageSwitchPopOver
             * for translation rail popover
             * @param {String} lang
             *
             */
        function LanguageSwitchPopOver(lang) {
                //console.log(lang);
                if (lang == 'es_ES') {
                    jQuery('.pophtml_es').show();
                    jQuery('.pophtml_en').hide();
                } else if (lang == 'en_US') {
                    jQuery('.pophtml_en').show();
                    jQuery('.pophtml_es').hide();
                }
            }
            /* LanguageSwitchPortraitRail
             * for translation LanguageSwitchPortraitRail
             * @param {String} lang
             *
             */
        function LanguageSwitchPortraitRail(lang) {
                //console.log(lang);
                if (lang == 'es_ES') {
                    jQuery('.porthtml_es').show();
                    jQuery('.porthtml_en').hide();
                } else if (lang == 'en_US') {
                    jQuery('.porthtml_en').show();
                    jQuery('.porthtml_es').hide();
                }
            }
            /*
             * @param {string} key    -> appgrid message id
             * @param {object} msgObj -> appgrid msg obj
             * @returns {TranslationObj or null}
             */
        function getTranslationObj(key, msgObj) {
                var dummyObj = {};
                dummyObj.en_US = "";
                dummyObj.es_ES = "";
                if (key == "TXT_PLAY_VIDEO") {
                    console.log("Params of TXT_PLAY_VIDEO");
                    console.log(msgObj);
                }
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
            }
            //basicRail attachevent
            //-------------------basicRail event attachment code --------------------
        function basicRailattachEvent(elem) {
                //attach popover to all items in rails
                genericRailEventAttachment(elem, '.item');
            } //end of attachEvent
            //-------------------onebytwo rail event attachment code --------------------
        function onebytwoRailattachEvent(elem) {
                //attach popover to all items in rails 
                genericRailEventAttachment(elem, '.itemImg');
            } //end of attachEvent
        function gridLayoutEventAttachment(elem) {
                //attach popover to all items in rails 
                genericRailEventAttachment(elem, '.item');
            }
            /* genericRailEventAttachment
             * used to attach popover (with manual trigger)
             *  to all rail item and
             * mouseover and mouseout event.
             * @param {type} elem
             * @param {type} dotClassName
             *
             */
        function genericRailEventAttachment(elem, dotClassName) {
                //attach popover with trigger "manual" to 
                // all items in rails with dotClassName
                //owl carousal image fail fallback logic.              
                elem.find('img[data-failover]').error(function() {
                    //       var failover = $(this).data('failover');
                    //       console.log("failed detected.")
                    //       if (this.src != failover){
                    //        this.src = failover;
                    //       }
                    console.log("owl carousal Image load fail detected.");
                    console.log(this.src);
                    this.src = generateFallbackImgUrl();
                });
                elem.find(dotClassName).each(function() {
                    var classNameTitleID = jQuery(this).find("a[class^='titleIDclass_']").attr('class');
                    var TitleID = (classNameTitleID.split('class_'))[1];
                    //console.log(popOverHtml);
                    var options = {
                        placement: function(context, source) {
                            /*var position = jQuery(source).offset();
                            if (position.left > 515) {
                                return "left";
                            }
                            if (position.left < 515) {
                                return "right";
                            }
                            if (position.top < 110) {
                                return "bottom";
                            }*/
                            return "top";
                        },
                        trigger: 'manual',
                        html: true,
                        container: elem,
                        animation: false,
                        content: function() {
                                //railsPopover
                                //add bottomRails class to last visible rail.
                                jQuery(".owl-carousel").each(function() {
                                    var ftid = jQuery(this).attr('ID');
                                    jQuery(this).removeClass('bottomRails');
                                    //                            console.log(jQuery(".owl-carousel:visible:last").attr('ID'));
                                    //                            console.log('<lastvisible==currentId>');
                                    //                            console.log(ftid);
                                    if (jQuery(".owl-carousel:visible:last").attr('ID') == ftid) {
                                        jQuery(this).removeClass('bottomRails');
                                        jQuery(this).addClass('bottomRails');
                                        console.log('bottomRails class added');
                                    }
                                });
                                var e_t = jQuery(this);
                                if ((typeof e_t.attr("data-content") == 'undefined' || (e_t.attr("data-content")).length == 0) && (typeof TitleID != 'undefined' && TitleID != '')) {
                                    $.ajax({
                                        url: configuration.server_url + "/searchApi/railPopOverDataCall?titleID=" + TitleID,
                                        success: function(result) {
                                                var popHtmltemplate = jQuery("#BasicRailsItemPOPoverHtml").html();
                                                var watchClipUrl = "";
                                                if (typeof result.popoverObj != 'undefined' && typeof result.popoverObj.showtype != 'undefined') {
                                                    if (result.popoverObj.showtype == 'Movie') {
                                                        watchClipUrl = "/movie" + "?titleId=" + TitleID;
                                                    } else {
                                                        watchClipUrl = "/tvShow" + "?titleId=" + TitleID;
                                                    }
                                                    result.popoverObj.imgPath = getNewbase() + result.popoverObj.thumbnail;
                                                }
                                                //for popover translation logic
                                                if ((typeof $rootScope.BTN_ADD_TO_PLAYLISTObj == 'undefined' || typeof $rootScope.TXT_WATCh_CLIP_VISITORSObj == 'undefined' || typeof $rootScope.TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNTObj == 'undefined' || typeof $rootScope.BTN_WATCH_NOW_LIVEObj == 'undefined' || typeof $rootScope.BTN_REMOVE_FROM_PLAYLISTObj == 'undefined' || typeof $rootScope.TXT_MINObj == 'undefined' || typeof $rootScope.TXT_STARRINGObj == 'undefined') || ($rootScope.BTN_ADD_TO_PLAYLISTObj == null || $rootScope.TXT_WATCh_CLIP_VISITORSObj == null || $rootScope.TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNTObj == null || $rootScope.BTN_WATCH_NOW_LIVEObj == null || $rootScope.BTN_REMOVE_FROM_PLAYLISTObj == null || $rootScope.TXT_MINObj == null || $rootScope.TXT_STARRINGObj == null)) {
                                                    var msgObj = JSON.parse($rootScope.appGridMetadata.messages);
                                                    $rootScope.POPOVER_PLAYObj = getTranslationObj('POPOVER_PLAY', msgObj);
                                                    $rootScope.POPOVER_EPISODESObj = getTranslationObj('POPOVER_EPISODES', msgObj);
                                                    $rootScope.BTN_ADD_TO_PLAYLISTObj = getTranslationObj('ADMIN_SIDE_BAR_WATCHLIST', msgObj);
                                                    //getTranslationObj('BTN_ADD_TO_PLAYLIST',msgObj);
                                                    $rootScope.TXT_WATCh_CLIP_VISITORSObj = getTranslationObj('TXT_WATCh_CLIP_VISITORS', msgObj);
                                                    $rootScope.BTN_WATCH_NOW_LIVEObj = getTranslationObj('BTN_WATCH_NOW_LIVE', msgObj);
                                                    $rootScope.TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNTObj = getTranslationObj('TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNT', msgObj);
                                                    $rootScope.BTN_REMOVE_FROM_PLAYLISTObj = getTranslationObj('ADMIN_SIDE_BAR_WATCHLIST', msgObj);
                                                    //getTranslationObj('BTN_REMOVE_FROM_PLAYLIST',msgObj);
                                                    $rootScope.TXT_ADMIN_SEASON_WATCHLISTObj = getTranslationObj('TXT_ADMIN_SEASON_WATCHLIST', msgObj);
                                                    $rootScope.TXT_EPISODE_LIVEObj = getTranslationObj('TXT_EPISODE_LIVE', msgObj);
                                                    $rootScope.TXT_MINObj = getTranslationObj('TXT_MINS_LIVE', msgObj);
                                                    $rootScope.TXT_STARRINGObj = getTranslationObj('TXT_STARRING', msgObj);
                                                } //end of translation if already exist check
                                                //for popover translation logic
                                                if (typeof result.popoverObj != 'undefined') {
                                                    var popOverHtml = _.template(popHtmltemplate, {
                                                        itemObj: result.popoverObj,
                                                        single_asset_url: watchClipUrl,
                                                        POPOVER_PLAYObj: $rootScope.POPOVER_PLAYObj,
                                                        POPOVER_EPISODESObj: $rootScope.POPOVER_EPISODESObj,
                                                        BTN_ADD_TO_PLAYLISTObj: $rootScope.BTN_ADD_TO_PLAYLISTObj,
                                                        TXT_WATCh_CLIP_VISITORSObj: $rootScope.TXT_WATCh_CLIP_VISITORSObj,
                                                        TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNTObj: $rootScope.TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNTObj,
                                                        BTN_WATCH_NOW_LIVEObj: $rootScope.BTN_WATCH_NOW_LIVEObj,
                                                        BTN_REMOVE_FROM_PLAYLISTObj: $rootScope.BTN_REMOVE_FROM_PLAYLISTObj,
                                                        TXT_ADMIN_SEASON_WATCHLISTObj: $rootScope.TXT_ADMIN_SEASON_WATCHLISTObj,
                                                        TXT_EPISODE_LIVEObj: $rootScope.TXT_EPISODE_LIVEObj,
                                                        TXT_MINObj: $rootScope.TXT_MINObj,
                                                        TXT_STARRINGObj: $rootScope.TXT_STARRINGObj
                                                    });
                                                    e_t.attr("data-content", popOverHtml);
                                                    (e_t.is(":hover")) ? e_t.popover('show'): ''; //show popover item if it is still hovered
                                                    //show popover when data arrives
                                                    //for language switching
                                                    LanguageSwitchPopOver($rootScope.CurrentLang);
                                                    $rootScope.GetWatchListItemWithCallback(TitleID, titleCheckFunction);
                                                } //end of if ( typeof result.popoverObj!='undefined') check
                                            } // success callback function
                                    }); //get popoverdata ajax call end.
                                } //popover call
                            } //end of content function
                    };
                    jQuery(this).popover(options);
                });
                //attach popover
                /* titleCheckFunction
                 * callback function to call if titleId exist in
                 * watchlist
                 * @param {Boolean} isINwatchList
                 *
                 */
                function titleCheckFunction(isINwatchList) {
                        console.log(isINwatchList);
                        // console.log(domObj);
                        if (isINwatchList) {
                            jQuery('.POPoverAddtoPlaylist').hide();
                            jQuery('.POPoverRemovefromPlaylist').show();
                        } else {
                            jQuery('.POPoverRemovefromPlaylist').hide();
                            jQuery('.POPoverAddtoPlaylist').show();
                        }
                        console.log('titlecheckTriggered--><---');
                    }
                    /*
                     * manual event attachment to trigger each rail item popover.
                     */
                elem.find(dotClassName).on('mouseover', function() {
                    var classNameTitleID = jQuery(this).find("a[class^='titleIDclass_']").attr('class');
                    var TitleID = (classNameTitleID.split('class_'))[1];
                    var domObj = jQuery(this);
                    jQuery('.POPoverRemovefromPlaylist').hide();
                    jQuery('.POPoverAddtoPlaylist').hide();
                    // $rootScope.GetWatchListItemWithCallback(TitleID,titleCheckFunction);
                    //close all popovers
                    allpopoverHide();
                    jQuery(this).find('span').css('display', 'block');
                    if ((!Modernizr.touch) || enablePopoverOnTouch) {
                        var itemClassElement = jQuery(this),
                            timeINId = setTimeout(function() {
                                if (itemClassElement.is(':hover')) {
                                    itemClassElement.popover("show");
                                    $rootScope.GetWatchListItemWithCallback(TitleID, titleCheckFunction);
                                    LanguageSwitchPopOver($rootScope.CurrentLang);
                                }
                            }, 950);
                        // clearTimeout(itemClassElement.data('timeINId'));
                        itemClassElement.data('timeINId', timeINId);
                        //jQuery(this).popover("show");
                    }
                }).on("mouseleave", function() {
                    //clearTimeout(this.timer);
                    //LanguageSwitchPopOver($rootScope.CurrentLang);
                    jQuery(this).find('span').css('display', 'none');
                    if ((!Modernizr.touch) || enablePopoverOnTouch) {
                        /*var itemClassElement = jQuery(this),
                            timeoutId = setTimeout(function () {
                                itemClassElement.popover("hide");
                            }, 2000);
                        itemClassElement.data('timeoutId', timeoutId);*/
                        var itemClassElement = jQuery(this),
                            timeoutId = setTimeout(function() {
                                if (!itemClassElement.is(':hover')) var k = (!jQuery('.popover:hover').length > 0) ? itemClassElement.popover("hide") : '';
                                jQuery('.popover').on('mouseleave', function() {
                                    itemClassElement.popover("hide");
                                });
                            }, 2000);
                        clearTimeout(itemClassElement.data('timeINId'));
                        itemClassElement.data('timeoutId', timeoutId);
                    }
                });
            } //end of genericRailEventAttachment(elem, dotClassName) function        
            //////////rail related functions
        this.populateMastheadsWithBotonIdOnly = function(currentScope, mastHeadArray) {
            var mastheadBoltonKeyArr = [];
            var CurStoreIndex;
            for (var key=0; key<mastHeadArray.length; key++) {
                if (mastHeadArray[key].query !== "appgrid" && mastHeadArray[key].query !== "banner" && mastHeadArray[key].query !== "stackable" && mastHeadArray[key].query !== "scrollable" && mastHeadArray[key].query !== "video") {
                    var url = railServiceOBJ.railUrlgenerator(mastHeadArray[key], null, null, "", mastHeadArray[key].boltonid);
                    if (url != null) {
                        CurStoreIndex=key;
                        url=url+"&indexParam="+key;
                        if (typeof mastHeadArray[key].boltonid != "undefined" && mastHeadArray[key].boltonid != "") {
                            var userboltonStatus = railServiceOBJ.checkStdBoltoninUserBoltonList(mastHeadArray[key].boltonid);
                            if (userboltonStatus !== null) {
                                //ready for boltoncheck
                                console.log("calling masthead bolton renewel ajax");
                                var curboltonid = mastHeadArray[key].boltonid;
                                $http({
                                    method: 'Get',
                                    url: url
                                }).success(function(data, status, headers, config) {
                                    //workaround for titles without translation from collection response
                                    for (var key in data.thumblistCarouselOneArr) {
                                        data.thumblistCarouselOneArr[key].hideUpgradeButton = userboltonStatus;
                                        data.thumblistCarouselOneArr[key].UpgradeButtonLink = "/manageAccount";
                                        data.thumblistCarouselOneArr[key].boltonid = curboltonid;
                                        data.thumblistCarouselOneArr[key].title = {
                                            "en_US": data.thumblistCarouselOneArr[key].title,
                                            "es_ES": data.thumblistCarouselOneArr[key].title
                                        };
                                        if (data.thumblistCarouselOneArr[key].mastheadImage.indexOf('dummy/blank_image.png') !== -1) {
                                            data.thumblistCarouselOneArr[key].mastheadImage = ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                                        }
                                        data.thumblistCarouselOneArr[key].ShowcaseNewbase = getShowcaseNewbase();
                                        $log.info("inside masthead bolton ajax CurStoreIndex:");
                                        $log.info(CurStoreIndex);
                                        data.thumblistCarouselOneArr[key].MastheadSortIndex=(typeof data.indexParam!='undefined')? parseInt(data.indexParam):40;//CurStoreIndex;
                                        currentScope.slides.push(data.thumblistCarouselOneArr[key]);                                        
                                    }
                                    //currentScope.slides=$filter('orderBy')(currentScope.slides, 'MastheadSortIndex', false);
                                    $timeout(function(){
                                        $log.info("inside masthead bolton ajax");
                                        $log.info(currentScope.slides);
                                        currentScope.slides=$filter('orderBy')(currentScope.slides, 'MastheadSortIndex', false);
                                    });
                                    
                                }).error(function(data, status, headers, config) {
                                    console.log("ajax call failed");
                                });
                            }
                        }
                    } //end of if url not equal null
                } //end of query check     
            } //end of for
        };
        /*
         * populateShowcase
         * used for mastehead showcase
         */
        this.populateShowcase = function(mastHeadArray, me) {
            var mastheadImage;
            for (var key=0; key<mastHeadArray.length;key++) {
                if (mastHeadArray[key].query == "appgrid") {
                    if (typeof mastHeadArray[key].collections !== 'undefined' && mastHeadArray[key].collections.length > 0) {
                        for (var appgridIndex in mastHeadArray[key].collections) {
                            mastHeadArray[key].collections[appgridIndex].mastheadImage = ($rootScope.appgridAssets[mastHeadArray[key].collections[appgridIndex].asset_id]).replace("https", "http");
                            mastHeadArray[key].collections[appgridIndex].ShowcaseNewbase = getShowcaseNewbase();
                            mastHeadArray[key].collections[appgridIndex].MastheadSortIndex=key;
                            me.slides.push(mastHeadArray[key].collections[appgridIndex]);
                        }
                        me.slides=$filter('orderBy')(me.slides, 'MastheadSortIndex', false);
                    }
                } else if (mastHeadArray[key].query == "banner" || mastHeadArray[key].query == "stackable" || mastHeadArray[key].query == "scrollable") {
                    if (typeof mastHeadArray[key].showstatus != 'undefined' && mastHeadArray[key].showstatus == 'LOGOUT' && $rootScope.isLoggedIn != true) {
                        mastHeadArray[key].mastheadImage = (mastHeadArray[key].asset_id != 'undefined') ? (mastHeadArray[key].asset_id) : mastHeadArray[key].asset_id;
                        mastHeadArray[key].ShowcaseNewbase = getShowcaseNewbase();
                        mastHeadArray[key].MastheadSortIndex=key;
                        me.slides.push(mastHeadArray[key]);
                    } else if (typeof mastHeadArray[key].showstatus != 'undefined' && mastHeadArray[key].showstatus == 'LOGIN' && $rootScope.isLoggedIn == true) {
                        mastHeadArray[key].mastheadImage = (mastHeadArray[key].asset_id != 'undefined') ? (mastHeadArray[key].asset_id) : mastHeadArray[key].asset_id;
                        mastHeadArray[key].ShowcaseNewbase = getShowcaseNewbase();
                        mastHeadArray[key].MastheadSortIndex=key;
                        me.slides.push(mastHeadArray[key]);
                    } else if (typeof mastHeadArray[key].showstatus != 'undefined' && mastHeadArray[key].showstatus == "null" || mastHeadArray[key].showstatus == 'ALWAYS') {
                        mastHeadArray[key].mastheadImage = (mastHeadArray[key].asset_id != 'undefined') ? (mastHeadArray[key].asset_id) : mastHeadArray[key].asset_id;
                        mastHeadArray[key].ShowcaseNewbase = getShowcaseNewbase();
                        mastHeadArray[key].MastheadSortIndex=key;
                        me.slides.push(mastHeadArray[key]);
                    }
                    $timeout(function(){
                        $log.info("inside banner");
                        $log.info(me.slides);
                        me.slides=$filter('orderBy')(me.slides, 'MastheadSortIndex', false);
                    });
                    
                    //   console.log('mastehead with banner obj:<===>:-');
                    //   console.log(me);
                } else if (mastHeadArray[key].query == "video") {
                    if (typeof mastHeadArray[key].showstatus != 'undefined' && (mastHeadArray[key].showstatus == "null" || mastHeadArray[key].showstatus == 'ALWAYS' || mastHeadArray[key].showstatus == 'LOGIN' && !!$rootScope.isLoggedIn || mastHeadArray[key].showstatus == 'LOGOUT' && !$rootScope.isLoggedIn)) {
                        mastHeadArray[key].mastheadImage = (mastHeadArray[key].asset_id != 'undefined') ? (mastHeadArray[key].asset_id) : mastHeadArray[key].asset_id;
                        mastHeadArray[key].ShowcaseNewbase = getShowcaseNewbase();
                        mastHeadArray[key].MastheadSortIndex=key;
                        me.slides.push(mastHeadArray[key]);
                        me.slides=$filter('orderBy')(me.slides, 'MastheadSortIndex', false);
                    }
                } else {
                    var CurStoreIndex;
                    //(paramsOBJ, embedcodeDATA, similarGenre, assetTypes, boltonid)
                    var url = railServiceOBJ.railUrlgenerator(mastHeadArray[key], null, null, "", mastHeadArray[key].boltonid);
                    if (url != null) {
                        url=url+"&indexParam="+key;
                        CurStoreIndex=key;

                        if (typeof mastHeadArray[key].boltonid != "undefined" 
                                && mastHeadArray[key].boltonid != "") {
                            var userboltonStatus = railServiceOBJ.checkStdBoltoninUserBoltonList(mastHeadArray[key].boltonid);
                            if (userboltonStatus !== null) { //ready for boltoncheck
                                var curboltonid = mastHeadArray[key].boltonid;
                                $log.info("****> search masthead index");
                                 $log.info(CurStoreIndex);
                                $http({
                                    method: 'Get',
                                    url: url
                                }).success(function(data, status, headers, config) {
                                    //workaround for titles without translation from collection response
                                    for (var key1 in data.thumblistCarouselOneArr) {
                                        data.thumblistCarouselOneArr[key1].hideUpgradeButton = userboltonStatus;
                                        data.thumblistCarouselOneArr[key1].UpgradeButtonLink = "/manageAccount";
                                        data.thumblistCarouselOneArr[key1].boltonid = curboltonid;
                                        data.thumblistCarouselOneArr[key1].title = {
                                            "en_US": data.thumblistCarouselOneArr[key1].title,
                                            "es_ES": data.thumblistCarouselOneArr[key1].title
                                        };
                                        if (data.thumblistCarouselOneArr[key1].mastheadImage.indexOf('dummy/blank_image.png') !== -1) {
                                            data.thumblistCarouselOneArr[key1].mastheadImage = ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                                        }
                                        data.thumblistCarouselOneArr[key1].ShowcaseNewbase = getShowcaseNewbase();
                                        data.thumblistCarouselOneArr[key1].MastheadSortIndex=(typeof data.indexParam!='undefined')? parseInt(data.indexParam):40;//CurStoreIndex;
                                        $log.info("inside search masthead index");
                                        $log.info(CurStoreIndex);
                                        me.slides.push(data.thumblistCarouselOneArr[key]);
                                    }
                                    //me.slides=$filter('orderBy')(me.slides, 'MastheadSortIndex', false);
                                    $timeout(function(){
                                        $log.info("inside masthead ajax");
                                        $log.info(me.slides);
                                        me.slides=$filter('orderBy')(me.slides, 'MastheadSortIndex', false);
                                    });
                                }).error(function(data, status, headers, config) {
                                    me.message = 'Unexpected Error';
                                });
                            }
                        } else {
                                $log.info("before call search masthead index");
                                 $log.info(CurStoreIndex);                            
                            $http({
                                method: 'Get',
                                url: url
                            }).success(function(data, status, headers, config) {
                                //workaround for titles without translation from collection response
                                for (var key1 in data.thumblistCarouselOneArr) {
                                    data.thumblistCarouselOneArr[key1].hideUpgradeButton = true;
                                    data.thumblistCarouselOneArr[key1].title = {
                                        "en_US": data.thumblistCarouselOneArr[key1].title,
                                        "es_ES": data.thumblistCarouselOneArr[key1].title
                                    };
                                    if (data.thumblistCarouselOneArr[key1].mastheadImage.indexOf('dummy/blank_image.png') !== -1) {
                                        data.thumblistCarouselOneArr[key1].mastheadImage = ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                                    }
                                    data.thumblistCarouselOneArr[key1].ShowcaseNewbase = getShowcaseNewbase();
                                    data.thumblistCarouselOneArr[key1].MastheadSortIndex=(typeof data.indexParam!='undefined')? parseInt(data.indexParam):40;//CurStoreIndex;
                                    $log.info("insideelse search masthead index ");
                                    $log.info(CurStoreIndex);
                                    me.slides.push(data.thumblistCarouselOneArr[key1]);
                                }
                                //me.slides=$filter('orderBy')(me.slides, 'MastheadSortIndex', false);
                                $timeout(function(){
                                        $log.info("inside masthead ajaxelse");
                                        $log.info(me.slides);
                                        me.slides=$filter('orderBy')(me.slides, 'MastheadSortIndex', false);
                                });
                            }).error(function(data, status, headers, config) {
                                me.message = 'Unexpected Error';
                            });
                        } //end of boltonid check
                    } //if url not equal to null
                }
            } //end of for (var key in mastHeadArray) {
            $timeout(function(){
                 me.slides=$filter('orderBy')(me.slides, 'MastheadSortIndex', false);
            });
        }; //end of this.populateShowcase
        railServiceOBJ.checkPromoBoltoninUserBoltonList = function(railBoltonId) {
            console.log("#*checking PromoBoltoninUserBoltonList");
            console.log($rootScope.userProductList);
            console.log(railBoltonId);
            console.log(typeof $rootScope.userProductList);
            console.log("end of #*checking PromoBoltoninUserBoltonList");
            if (typeof $rootScope.userProductList == 'undefined') {
                return null; //donot show bolton rail
            }
            var k = '{"boltons":[' + $rootScope.userProductList + ']}';
            console.log(k);
            var BoltonObj = JSON.parse(k);
            console.log(BoltonObj['boltons'].indexOf(railBoltonId));
            if (BoltonObj['boltons'].indexOf(railBoltonId) == -1) {
                return true; //show promobolton rail
            } else {
                return false; //donot show bolton rail
            }
        };
        railServiceOBJ.checkStdBoltoninUserBoltonList = function(railBoltonId) {
            console.log("#*checking StdBoltoninUserBoltonList");
            console.log($rootScope.userProductList);
            console.log(railBoltonId);
            if (typeof $rootScope.userProductList == 'undefined') {
                return null; //donot show StdBolton rail
            }
            var k = '{"boltons":[' + $rootScope.userProductList + ']}';
            console.log(k);
            var BoltonObj = JSON.parse(k);
            console.log(BoltonObj['boltons'].indexOf(railBoltonId));
            console.log("end of #*checking StdBoltoninUserBoltonList");
            if (BoltonObj['boltons'].indexOf(railBoltonId) != -1) {
                return true; //show StdBolton rail
            } else {
                return false; //donot show StdBolton rail
            }
        };
    }
]);