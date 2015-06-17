'use strict';
/* Movie Sigle Asset Controller */
mdlDirectTvApp.controller('MovieSingleAssetCtrl', ['analyticsService', '$scope', 'Sessions', 'railService', 'contentService', '$http', '$routeParams', '$rootScope', 'SingleAssetService', 'SocialService', '$location', 'PlayerService', 'WatchListService', 'configuration', 'CookieService',
    function(analyticsService, $scope, Sessions, railService, contentService, $http, $routeParams, $rootScope, SingleAssetService, SocialService, $location, PlayerService, WatchListService, configuration, CookieService) {
        /*Initialization*/
        $scope.init = function() {
            $scope.ajaxMovieloader = true;
            $scope.currentUrl = configuration.server_url + '/movie?titleId=' + $routeParams.titleId;
            $scope.noPreview = true;
            $scope.isTrailer = (typeof $routeParams.isTrailer !== 'undefined' && $routeParams.isTrailer === 'true') ? true : false;
            $scope.socialShareUrl = configuration.server_url + "/social?titleId=" + $routeParams.titleId + "&lang=" + $rootScope.CurrentLang;
            $scope.pagename = 'movie';
            $scope.initalLoad = true;
            $rootScope.showWatchlistAddBtn = true;
            $rootScope.showWatchlistRemoveBtn = false;
            $scope.playhead_seconds = (typeof $routeParams.playhead_seconds === 'undefined' || $routeParams.playhead_seconds === '') ? 0 : $routeParams.playhead_seconds;
        };
        /*Call Initialization Method*/
        $scope.init();
        /*Method to populate metadata*/
        $scope.populateMetadata = function(isContinuousPlayBack, titleIdOrEmbedCode) {
            SingleAssetService.getMetadata(isContinuousPlayBack, titleIdOrEmbedCode).then(function(response) {
                $scope.ajaxMovieloader = false;
                if (typeof response === 'undefined' || !angular.isObject(response)) {
                    return null;
                }
                $scope.assetData = response;
                var studio_en = (typeof $scope.assetData.studio_display['en_US'] != 'undefined') ? $scope.assetData.studio_display['en_US'] : '';
                var studio_es = (typeof $scope.assetData.studio_display['es_ES'] != 'undefined') ? $scope.assetData.studio_display['es_ES'] : '';
                $scope.assetData.programer_studioname = contentService.getContentProviderName($scope.assetData.content_provider, studio_en, studio_es);
                if (typeof $scope.assetData.titleId != 'undefined') {
                    $scope.currentAssetTitleId = $scope.assetData.titleId;
                } else {
                    $scope.currentAssetTitleId = '';
                }
                /*On load update add/remove playlist button*/
                if ($scope.assetData.isExistInPlayList) {
                    $rootScope.showWatchlistAddBtn = false;
                    $rootScope.showWatchlistRemoveBtn = true;
                }
                $scope.setGenerQuery(response.genres);
                $scope.embCode = (typeof response.embed_code !== 'undefined') ? response.embed_code : null;
                $scope.preview_embedCode = (typeof response.preview_embedcode !== 'undefined') ? response.preview_embedcode : null;
                if ($scope.preview_embedCode != null) {
                    $scope.noPreview = false;
                    if ($scope.isTrailer) {
                        $scope.embCode = $scope.preview_embedCode;
                    }
                }
                $scope.movie_titleORshowname_Seasonid_Episodeid = '';
                if (typeof $scope.assetData[$rootScope.CurrentLang] !== 'undefined') {
                    $scope.movie_titleORshowname_Seasonid_Episodeid = (typeof $scope.assetData[$rootScope.CurrentLang]['title_long'] !== 'undefined') ? $scope.assetData[$rootScope.CurrentLang]['title_long'] : '';
                    $scope.programTitleMedium = (typeof $scope.assetData[$rootScope.CurrentLang]['title_medium'] != 'undefined') ? $scope.assetData[$rootScope.CurrentLang]['title_medium'] : '';
                    $scope.programSummaryMedium = (typeof $scope.assetData[$rootScope.CurrentLang]['summary_medium'] != 'undefined') ? $scope.assetData[$rootScope.CurrentLang]['summary_medium'] : '';
                }
                $scope.videoOrlive = "video"; //used for evar11 (live or video) omniture analytics
                /*Analytics*/
                var genres = (typeof $scope.assetData.genres !== 'undefined') ? $scope.assetData.genres : "";
                $scope.propNine = $scope.pagename + ":index";
                $scope.analyticPagename = $scope.pagename + ":index:" + genres + ':' + $scope.movie_titleORshowname_Seasonid_Episodeid;
                //----------------------------
                if (!isContinuousPlayBack) {
                    $scope.choosePlayer();
                }
                // $scope.similarItems($scope.embCode);
                /*Load Similar rails based on embed code*/
                railService.reloadSingleRailorGridUsingFirstMatchingQuery('similar', $scope.VisiblerailList, $scope.type, $scope.embCode, null);
                /*Load rails based on genres*/
                railService.reloadSingleRailorGridUsingFirstMatchingQuery('similar_genre', $scope.VisiblerailList, $scope.type, null, $scope.genreQuery);
                /*SOCIAL SHARE BUTTON*/
                //  SocialService.getShareButtons($scope.socialShareUrl, $scope.programTitleMedium, $scope.programSummaryMedium, "SAP", "dummy/icon/facebook2.png", "dummy/icon/twitter.png", $scope.assetData['thumbnail'], $rootScope.enableTwitterSharing, $rootScope.enableFacebookSharing);
                analyticsService.TrackCustomPageLoad($scope.analyticPagename, $scope.propNine);
                analyticsService.TrackProgramDetailsPageLoad($scope.analyticPagename, $scope.movie_titleORshowname_Seasonid_Episodeid, $scope.currentAssetTitleId, $scope.propNine, $scope.videoOrlive, $scope.assetData.show_type, $scope.assetData.content_provider, $scope.assetData.genres);
            });
        };
        /*Select player */
        $scope.choosePlayer = function() {
            if ($scope.embedCode !== null) {
                if ($scope.isTrailer) {
                    var PLAYER_NAMESPACE = MPLAYER_4;
                    var playerWraper = "playerwrapper";
                    PlayerService.mainPlayer(PLAYER_NAMESPACE, playerWraper, $scope);
                } else {
                    var PLAYER_NAMESPACE = MPLAYER_3;
                    var playerWraper = "playerwrapper";
                    PlayerService.mainPlayer(PLAYER_NAMESPACE, playerWraper, $scope);
                }
            }
        };
        $scope.similarItems = function(embed_code) {
            var queryOptionObj = {};
            var assetType = ["feature_film", "short_film"];
            queryOptionObj.types = assetType;
            var queryOption = JSON.stringify(queryOptionObj);
            SingleAssetService.getSimilarItemsList(embed_code, queryOption).then(function(data) {
                if (typeof data.thumblistCarouselOneArr !== 'undefined') {
                    var similarItems = data.thumblistCarouselOneArr;
                    var totalSimilarItems = [];
                    for (var i = 0; i < similarItems.length; i++) {
                        var item = {};
                        item.titleId = similarItems[i].titleId;
                        item.embed_code = similarItems[i].contentID[0];
                        totalSimilarItems.push(item);
                    }
                    $scope.titleEmbedCodeArr = totalSimilarItems;
                }
            });
        };
        /*Sign up button action*/
        $scope.signup = function() {
            $rootScope.signupModal(1);
        };
        /*Add to watchlist*/
        $scope.AddToWatchList = function() {
            WatchListService.Add(id).then(function(response) {});
        };
        /*Remove Asset from playlist*/
        $scope.DeleteRelatedEpisodeToWatchList = function(episodeID) {
            $rootScope.openDeleteWatchlistDialog(null, episodeID, null);
        };
        $rootScope.CurrentPagename = "movie";
        $rootScope.$watch("CurrentLang", function(newValue, oldValue) {
            railService.reloadSingleRailorGridUsingFirstMatchingQuery('live', $scope.VisiblerailList, null, null, null);
        });
        /*Update Add and Remove Playlist button*/
        $rootScope.$watch("globalWatchlistIds", function(newval, oldval) {
            if (typeof newval != 'undefined') {
                var isIdExistInGlobalWatchlist = $rootScope.checkTitleIDExistInGlobalWatchlistIds($routeParams.titleId);
                if (isIdExistInGlobalWatchlist) {
                    $rootScope.showWatchlistAddBtn = false;
                    $rootScope.showWatchlistRemoveBtn = true;
                } else {
                    $rootScope.showWatchlistAddBtn = true;
                    $rootScope.showWatchlistRemoveBtn = false;
                }
            }
        }, true);
        /*Appgid Asset Watch*/
        $rootScope.$watch('[appGridMetadata,appgridAssets]', function(newValue, oldValue) {
            if (newValue[0] != '') {
                $scope.railList = [];
                $scope.pageDetails = $rootScope.getPageDetails($scope.pagename);
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    if (typeof $scope.pageDetails['items'] !== 'undefined') $scope.railList = $scope.pageDetails['items'];
                    console.log('Complete items obj');
                    console.log($scope.railList);
                    $scope.VisiblerailList = [];
                    $scope.LoadMoreRailItem(0, $rootScope.RailInitialLoadItemCount);
                    //                    if($rootScope.isLoggedIn){
                    //                        $scope.checkThirdPartyEnabled();
                    //                    }else{
                    //                        $scope.populateMetadata(false,$routeParams.titleId);
                    //                    }
                    //analytics
                    analyticsService.TrackCustomPageLoad($scope.pagename);
                }
            }
            if (newValue[1] != '') {
                var appAssets = $rootScope.appgridAssets;
                console.log(appAssets.third_party_cookie);
                var tpcUrl = appAssets.third_party_cookie;
                //$scope.checkThirdPartyEnabled();
                if ($rootScope.isLoggedIn) {
                    $scope.checkThirdPartyEnabled(tpcUrl);
                } else {
                    $scope.populateMetadata(false, $routeParams.titleId);
                }
            }
        }, true);
        $scope.loadMore = function() {
            if (typeof $scope.VisiblerailList != 'undefined' && $scope.disableInfiniteScroll == false) {
                $scope.LoadMoreRailItem($scope.VisiblerailList.length, $rootScope.RailOnScrollItemCount);
                console.log("LoadMoreEvent fired");
                console.log($scope.VisiblerailList);
            }
        };
        $scope.disableInfiniteScroll = false;
        $scope.checkThirdPartyEnabled = function(tpcUrl) {
            var iframe = document.getElementById("cookieUrl");
            iframe.onload = function() {
                iframe.contentWindow.postMessage('hello child, this is parent', '*');
                $scope.populateMetadata(false, $routeParams.titleId);
            };
            iframe.src = tpcUrl;
            //iframe.src = "https://b091462921713d3c55184ced1914d5f611df3934-www.googledrive.com/host/0B4IGm0TG9QPAWURxVmZwNEJsSG8?configUrl="+configuration.server_url; 
        };
        /*Load rails*/
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            var assetType = ["feature_film", "short_film"];
            var movieTypes = {};
            movieTypes.types = assetType;
            var type = JSON.stringify(movieTypes);
            $scope.type = type;
            $rootScope.isLoggedIn = Sessions.isLoggedIn();
            var singleAssetBaseUrl = '/movie';
            if ($rootScope.isLoggedIn) {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, Sessions.getCookie('accessToken'), null, null, type);
            } else {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, null, null, null, type);
            }
        }); //end of $scope.$on('ngRepeatFinished' 
        /*Create and set genrequery for Similar movie rails*/
        $scope.setGenerQuery = function(geners) {
            if (typeof geners !== 'undefined' && typeof geners === 'string') {
                var generLists = geners.split(",");
                var queryObj = {};
                queryObj = {
                    genres: generLists
                };
                var res = JSON.stringify(queryObj);
                $scope.genreQuery = res;
            } else {
                $scope.genreQuery = '';
            }
        };
        //bolt rail related codes
        $scope.LoadMoreRailItem = function(curLength, noofnewAssets) {
            var TotalRailItems = $scope.railList.length;
            if ((curLength + noofnewAssets) >= TotalRailItems) {
                noofnewAssets = TotalRailItems - curLength;
                $scope.disableInfiniteScroll = true;
                console.log("disable ngscroll event true");
            }
            for (var j = (curLength != 0) ? (curLength - 1) : 0; j < (curLength + noofnewAssets); j++) {
                if (typeof $scope.railList[j] != 'undefined' && typeof $scope.VisiblerailList[j] == 'undefined') {
                    $scope.railList[j].BoltonPromoRailAssets = [];
                    if ($scope.railList[j].query == 'bolt_on_promo') { //show only to valid user
                        console.log("triggering bolt_on_promo rail");
                        $scope.VisiblerailList.push($scope.railList[j]);
                        var indeX = $scope.VisiblerailList.length - 1;
                        railService.loadBoltonPromoRailAssets($scope.railList[j], indeX).then(function(resp) {
                            console.log(" response -->");
                            console.log(resp);
                            console.log("updating bolt_on_promorail assets");
                            console.log(j + "  -->");
                            console.log(indeX);
                            console.log($scope.VisiblerailList[indeX]);
                            console.log("response thumblistCarouselOneArr  -->");
                            console.log(resp.thumblistCarouselOneArr);
                            $scope.VisiblerailList[indeX].BoltonPromoRailAssets = (typeof resp.thumblistCarouselOneArr != 'undefined' && typeof resp.thumblistCarouselOneArr[0] != 'undefined') ? resp.thumblistCarouselOneArr : [];
                            console.log("#****updated bolt_on_promorail assets");
                            console.log($scope.VisiblerailList[indeX].BoltonPromoRailAssets);
                        }, function(error) {});
                    } else if ($scope.railList[j].query == 'bolt_on_std') { //show only to valid user
                        console.log("triggering bolt_on_std rail");
                        $scope.VisiblerailList.push($scope.railList[j]);
                    } else {
                        $scope.VisiblerailList.push($scope.railList[j]);
                    }
                }
                if (typeof $rootScope.userProductList != 'undefined') {
                    console.log("calling UpdatePromoBoltonInRailScope as userProductList is not undefined");
                    UpdatePromoBoltonInRailScope();
                }
            } // end of for loop
            console.log("Updated VisiblerailList");
            console.log($scope.VisiblerailList);
        };
        $scope.boltonPromoLearnMore = function(base) {
            $location.path(base);
        };
        $scope.boltonPromoBuyNow = function(base, boltonid) {
            console.log("boltonPromoBuyNow");
            //var path1=base+"?id="+boltonid;
            console.log(base);
            $location.path(base).search({
                id: boltonid
            });
        };
        $rootScope.$watch("userProductList", function(newValue, oldValue) {
            console.log("userProductList--->>>");
            console.log(newValue);
            if (newValue == '') {
                return null;
            }
            if (typeof newValue != 'undefined') {
                console.log("*#1ProductList updated");
                UpdatePromoBoltonInRailScope();
            }
        });

        function UpdatePromoBoltonINVisibleRailList() {
            console.log("UpdatePromoBoltonINVisibleRailList function");
            for (var k in $scope.VisiblerailList) {
                console.log("bolt_on_promo_&#  check");
                console.log($scope.VisiblerailList[k].query.indexOf("bolt_on_promo_&#"));
                if ($scope.VisiblerailList[k].query.indexOf("bolt_on_promo_&#") != -1) {
                    console.log("UpdatePromoBoltonINRailList -->UpdatePromoBoltonINVisibleRailList");
                    console.log($scope.VisiblerailList[k].query);
                    if ($scope.checkPromoBoltoninUserBoltonList($scope.VisiblerailList[k].boltonid) == true) {
                        $scope.VisiblerailList[k].query = "bolt_on_promo";
                        console.log("updating Visible Rail query name at " + k + " to " + $scope.VisiblerailList[k].query);
                        var indeX = k;
                        railService.loadBoltonPromoRailAssets($scope.railList[indeX], indeX).then(function(resp) {
                            console.log(" response -->");
                            console.log(resp);
                            console.log("updating bolt_on_promorail assets");
                            console.log(indeX);
                            console.log($scope.VisiblerailList[indeX]);
                            console.log("response thumblistCarouselOneArr  -->");
                            console.log(resp.thumblistCarouselOneArr);
                            $scope.VisiblerailList[indeX].BoltonPromoRailAssets = (typeof resp.thumblistCarouselOneArr != 'undefined' && typeof resp.thumblistCarouselOneArr[0] != 'undefined') ? resp.thumblistCarouselOneArr : [];
                            console.log("#****updated bolt_on_promorail assets");
                            console.log($scope.VisiblerailList[indeX].BoltonPromoRailAssets);
                        }, function(error) {});
                    }
                } else if ($scope.VisiblerailList[k].query.indexOf("bolt_on_std_&#") != -1) {
                    console.log("checkStdBoltoninUserBoltonList -->");
                    console.log($scope.VisiblerailList[k].query);
                    console.log("**checkStdBoltoninUserBoltonList");
                    console.log($scope.checkStdBoltoninUserBoltonList($scope.VisiblerailList[k].boltonid));
                    if ($scope.checkStdBoltoninUserBoltonList($scope.VisiblerailList[k].boltonid) == true) {
                        $scope.VisiblerailList[k].query = "bolt_on_std";
                        $scope.$broadcast('bolt_on_stdQueryUpdate', k);
                        console.log("updating checkStdBoltoninUserBoltonList Visible Rail query name at " + k + " to " + $scope.VisiblerailList[k].query);
                    }
                }
            }
            RenewBoltonStdRailNotLoadedYetif();
        }
        $scope.$on('bolt_on_stdQueryUpdate', function(event, k) {
            console.log("$$$----> inside $on bolt_on_stdQueryUpdate");
            console.log(k);
            railService.LoadSingleRail(k, $scope.VisiblerailList[k]);
        });

        function RenewBoltonStdRailNotLoadedYetif() {
            jQuery(".owl-carousel").each(function() {
                var fid = "#" + jQuery(this).attr('ID');
                var index = typeof fid.split("_") != 'undefined' ? fid.split("_")[1] : -1;
                // jQuery(fid).prev().hide();
                if (index != -1 && typeof $scope.VisiblerailList[index] != 'undefined' && $scope.VisiblerailList[index].query == "bolt_on_std") {
                    if (typeof jQuery(fid).data('owlCarousel') == 'undefined') {
                        console.log("renewing bolt_on_std " + fid + " rails");
                        railService.LoadSingleRail(index, $scope.VisiblerailList[index]);
                    } else {
                        console.log("reShowing bolt_on_std " + fid + " rails");
                        jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                        jQuery(fid).prev().show();
                        jQuery(fid).parents(".RailngRepeatClass").show();
                    }
                }
            });
        }

        function UpdatePromoBoltonInRailScope() {
            console.log("***^^***UpdatePromoBoltonInRailScope");
            UpdatePromoBoltonINVisibleRailList();
            //updateRails();
        }
        $scope.checkPromoBoltoninUserBoltonList = function(railBoltonId) {
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
        $scope.checkStdBoltoninUserBoltonList = function(railBoltonId) {
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

        function updatePromoANDSTDBoltonRail(railobjArr) {
            var NEWrailobjArr = [];
            for (var k in railobjArr) {
                if (railobjArr[k].query == 'bolt_on_promo') {
                    if ($scope.checkPromoBoltoninUserBoltonList(railobjArr[k].boltonid) == null) {
                        //productidlist undefined so adding index of bolt_on_promo
                        console.log("Changing bolt_on_promo_ query");
                        railobjArr[k].query = "bolt_on_promo_&#" + k; //updating query
                        console.log("Changing bolt_on_promo_ query-->" + railobjArr[k].query);
                        NEWrailobjArr.push(railobjArr[k]);
                    } else {
                        $scope.checkPromoBoltoninUserBoltonList(railobjArr[k].boltonid) ? NEWrailobjArr.push(railobjArr[k]) : console.log("removing bolt_on_promorail:>" + railobjArr[k].boltonid);
                    }
                } else if (railobjArr[k].query == 'bolt_on_std') {
                    if ($scope.checkStdBoltoninUserBoltonList(railobjArr[k].boltonid) == null) {
                        //productidlist undefined so adding index of bolt_on_std
                        railobjArr[k].query = "bolt_on_std_&#" + k; //updating query
                        NEWrailobjArr.push(railobjArr[k]);
                    } else {
                        $scope.checkStdBoltoninUserBoltonList(railobjArr[k].boltonid) ? NEWrailobjArr.push(railobjArr[k]) : console.log("removing bolt_on_stdrail:>" + railobjArr[k].boltonid);
                    }
                } else {
                    NEWrailobjArr.push(railobjArr[k]);
                }
            } //end of for loop  
            return NEWrailobjArr;
        }
    }
]);