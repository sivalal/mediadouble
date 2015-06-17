'use strict';
var swiper;
/* Custom main page Controllers */
mdlDirectTvApp.controller('CustomainpageCtrl', ['analyticsService', '$sce', '$routeParams', '$location', '$scope', 'railService', 'contentService', '$http', '$modal', 'configuration', '$rootScope', 'Sessions', 'Authentication', 'FilterService', 'CookieService', 'PlayerService', 'SocialService', 'Gigya', '$filter', '$log',
    function(analyticsService, $sce, $routeParams, $location, $scope, railService, contentService, $http, $modal, configuration, $rootScope, Sessions, Authentication, FilterService, CookieService, PlayerService, SocialService, Gigya, $filter, $log) {
        jQuery('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : jQuery('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    jQuery('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
        $scope.AppcustomSections = []; //clear out previously set custom regions if any
        ///////////////////////package button color////////////////////////////////////
        $scope.packButtonHoverInHome = function(packageId, colorCode) {
            jQuery('#package-button-in-home-' + packageId).css('background-color', colorCode);
            jQuery('#package-button-in-home-' + packageId).css('color', 'white');
        };
        $scope.packButtonLeaveInHome = function(packageId, colorCode) {
            jQuery('#package-button-in-home-' + packageId).css('background-color', '');
            jQuery('#package-button-in-home-' + packageId).css('color', colorCode);
        };
        ///////////////////////package button color////////////////////////////////////
        $scope.selectedGenre = "TXT_GENRE_SUBSCRIBER"; //"GENRE";
        $scope.selectedGenreCollectionName = null;
        // $rootScope.isLoggedIn=Sessions.isLoggedIn();
        $scope.myInterval = 5000; // set interval in sec
        $scope.slides = []; //set slides array
        // $scope.ajaxHomeSpinner = true;
        // $scope.ajaxRailsSpinner = true;
        $scope.sliderIntiated = false;
        $scope.location = $location.url();
        // $scope.pagename = $location.hash();
        $rootScope.CurrentPagename = $scope.pagename = $routeParams.pageid;
        //$scope.pagename=$routeParams.pagename;
        if (typeof $scope.pagename === 'undefined') {
            $rootScope.CurrentPagename = $scope.pagename = 'home';
        }
        $scope.showPackage = false;
        $scope.TopNAVmenu = true;
        if ($scope.pagename === 'home') {
            $scope.showPackage = false; // Removed according to YAVWEB-129
            $scope.TopNAVmenu = false;
            jQuery("#secondaryTopMenu").next().removeClass("topFix");
        } else {
            jQuery("#secondaryTopMenu").next().addClass("topFix");
        }
        if ($scope.pagename === 'movieList') {
            var assetType = ["feature_film", "short_film"];
            var movieTypes = {};
            movieTypes.types = assetType;
            $scope.type = JSON.stringify(movieTypes);
        } else if ($scope.pagename === 'tvList') {
            var assetType = ["tv_season", "tv_series", "tv_episode", "tv_show"];
            var tvTypes = {};
            tvTypes.types = assetType;
            $scope.type = JSON.stringify(tvTypes);
        }
        $rootScope.$watch("CurrentLang", function(newValue, oldValue) {
            railService.reloadSingleRailorGridUsingFirstMatchingQuery('live', $scope.VisiblerailList, $scope.type, null, null);
        });
        $scope.myInterval = 5000; // set interval in sec
        $scope.slides = []; //set slides array
        $scope.railList = [];
        $scope.customSections = [];
        $scope.hasMasthead = false;
        var thumbslides;
        $scope.subscriptionStatus = $rootScope.GetsubscriptionStatus();
        $rootScope.$watch("appgridAssets", function(newValue, oldValue) {
            if (newValue != '') {
                var pageName = ($scope.pagename == 'home' && !userIsLoggedin()) ? 'home_visitor' : $scope.pagename;
                pageName = (Sessions.getCookie("subscriptionStatus") != "true") ? 'home_visitor' : $scope.pagename;
                $scope.subscriptionStatus = $rootScope.GetsubscriptionStatus();
                $scope.pageDetails = $rootScope.getPageDetails(pageName);
                //get sizzle video
                if (typeof $scope.pageDetails.mastheads !== 'undefined') {
                    railService.populateShowcase($scope.pageDetails.mastheads, $scope);
                    if ($scope.pageDetails.mastheads[0].query !== 'undefined' && $scope.pageDetails.mastheads[0].query !== 'null') {
                        console.log("slide length");
                        console.log($scope.pageDetails.mastheads[0].query);
                        $scope.hasMasthead = true;
                    } else {
                        console.log("no slide length");
                        $scope.hasMasthead = false;
                    }
                    console.log($scope.hasMasthead);
                    if (pageName === 'home_visitor') {
                        // showHideMenuElements(true);
                        $scope.videoBanner = $scope.slides.splice(0, 1)[0];
                        processVisitorHomepageData();
                        (!$rootScope.isMobileScreen()) ? jQuery('#logo').hide(): jQuery('#logo').show();
                    } else {
                        jQuery('#logo').show();
                    }
                }
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    //   $scope.source = (typeof $scope.pageDetails.source != 'undefined') ? $scope.pageDetails.source : '';
                    $scope.source = '';
                    if (typeof $scope.pageDetails != 'undefined' && typeof $scope.pageDetails.genrefilteroptions != 'undefined') {
                        $scope.source = railService.getSourceName($scope.pageDetails.genrefilteroptions);
                    }
                    if (typeof $scope.pageDetails['custom-region'] !== 'undefined') {
                        $scope.AppcustomSections = $scope.processCustomSections($scope.pageDetails['custom-region']);
                        console.log("app custom sections");
                        console.log($scope.AppcustomSections);
                    } else {
                        $scope.AppcustomSections = [];
                    }
                    ////////////////////////////////////////////////////////
                    $scope.pageTitle = $scope.pageDetails.title;
                    $scope.imageMetaDetails = { //(JSON.parse($rootScope.appGridMetadata.gateways))['images'],
                        //JSON.parse($rootScope.appGridMetadata.device)
                        "imageshackBaseurl": parseAppgridData($rootScope.appGridMetadata.gateways).images,
                        "deviceArr": parseAppgridData($rootScope.appGridMetadata.device)
                    };
                    if (typeof $scope.pageDetails['items'] !== 'undefined') {
                        var tempRailList = contentService.updatePromotionRailCTA($scope.pageDetails['items']);
                        $scope.railList = updatePromoANDSTDBoltonRail(tempRailList);
                        console.log('Complete items obj');
                        console.log($scope.railList);
                        $scope.VisiblerailList = [];
                        $scope.LoadMoreRailItem(0, $rootScope.RailInitialLoadItemCount);
                    }
                    FilterService.GenreFilter($scope.pageDetails.genrefilter, $scope.pagename);
                    FilterService.RegionFilter($scope.pageDetails.regionfilter);
                    FilterService.QualityFilter($scope.pageDetails.regionfilter);
                    $scope.CustomPageOmnitureCaller($scope.pagename);
                }
            }
        });
        $rootScope.$on('updateXDRrail', function(event, data) {
            railService.reloadSingleRailorGridUsingFirstMatchingQuery('xdr', $scope.VisiblerailList, $scope.type, null, null);
        });
        $scope.processCustomSections = function(customSections) {
            var customSectionsArr = [];
            customSectionsArr = $filter('filter')(customSections, {
                active: true
            });
            if (typeof customSectionsArr === 'undefined') return customSectionsArr;
            for (var j = 0; j < customSectionsArr.length; j++) {
                var largeTxt = $filter('filter')(customSections[j].text, {
                    id: "large"
                });
                var smallText = $filter('filter')(customSections[j].text, {
                    id: "small"
                });
                var images = customSectionsArr[j].images;
                var desk_En_Asset_Id = images['desktop_images'].en_US;
                var desk_Es_Asset_Id = images['desktop_images'].es_ES;
                var mobile_En_Asset_Id = images['mobile_images'].en_US;
                var mobile_Es_Asset_Id = images['mobile_images'].es_ES;
                var custom_images = {};
                custom_images.desktop_images_url = {};
                custom_images.mobile_images_url = {};
                custom_images.desktop_images_url['en_US'] = (typeof $rootScope.appgridAssets[desk_En_Asset_Id] != 'undefined') ? $rootScope.appgridAssets[desk_En_Asset_Id] : '';
                custom_images.desktop_images_url['es_ES'] = (typeof $rootScope.appgridAssets[desk_Es_Asset_Id] != 'undefined') ? $rootScope.appgridAssets[desk_Es_Asset_Id] : '';
                custom_images.mobile_images_url['en_US'] = (typeof $rootScope.appgridAssets[mobile_En_Asset_Id] != 'undefined') ? $rootScope.appgridAssets[mobile_En_Asset_Id] : '';
                custom_images.mobile_images_url['es_ES'] = (typeof $rootScope.appgridAssets[mobile_Es_Asset_Id] != 'undefined') ? $rootScope.appgridAssets[mobile_Es_Asset_Id] : '';
                customSectionsArr[j].custom_image = custom_images;
                //                for(var i=0;i<images.length;i++){
                //                    var key_US=images[i].en_US['image-asset-id'];
                //                    var key_ES=images[i].es_ES['image-asset-id'];
                //                    images[i].en_US['image_asset_key']=$rootScope.appgridAssets[key_US];
                //                    images[i].es_ES['image_asset_key']=$rootScope.appgridAssets[key_ES];
                //                }
                //                customSectionsArr[j].image=images;
                if (largeTxt !== 'undefind') {
                    customSectionsArr[j].largeTxt = (typeof largeTxt[0] !== 'undefined') ? largeTxt[0] : ''
                } else {
                    customSectionsArr[j].largeTxt = '';
                };
                if (smallText !== 'undefind') {
                    customSectionsArr[j].smallText = (typeof smallText[0] !== 'undefined') ? smallText[0] : '';
                } else {
                    customSectionsArr[j].smallText = '';
                }
            }
            return customSectionsArr;
        };
        $scope.loadMore = function() {
            if (typeof $scope.VisiblerailList != 'undefined' && $scope.disableInfiniteScroll == false) {
                $scope.LoadMoreRailItem($scope.VisiblerailList.length, $rootScope.RailOnScrollItemCount);
                console.log("LoadMoreEvent fired");
                console.log($scope.VisiblerailList);
            }
        };
        $scope.disableInfiniteScroll = false;
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
                if (newValue != oldValue) {
                    if (typeof $scope.pageDetails != 'undefined' && $scope.pageDetails.mastheads != 'undefined') {
                        railService.populateMastheadsWithBotonIdOnly($scope, $scope.pageDetails.mastheads);
                    }
                }
            }
        });
        $scope.RedirectAndSetReturnUrlInCookie = function(slide, UpgradeButtonLink) {
            var ReturnUrl = $location.path();
            $log.info("############---------RedirectAndSetReturnUrlInCookie");
            $log.info(ReturnUrl);
            Sessions.setCookie('MastheadBolton_ReturnUrl', ReturnUrl, Sessions.setExpiryForCookie());
            var rl = UpgradeButtonLink + "?id=" + slide.boltonid;
            $log.info(rl);
            $location.path(UpgradeButtonLink).search({
                id: slide.boltonid
            });
        };

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

        function userIsLoggedin() {
            return ($rootScope.isLoggedIn == true && Sessions.getCookie('loggedin') != "undefined" && Sessions.getCookie("loggedin") === "true");
        }

        function processVisitorHomepageData() {
            if ($scope.videoBanner.query == 'video') {
                $scope.videoMasthead = true;
                $scope.videoBanner.embedcode = parseAppgridData($scope.videoBanner.embedcode);
                $scope.embCode = $scope.videoBanner.embedcode['default'];
                PlayerService.sizzlePlayer(SIZZLE, $scope, true);
            } else if ($scope.videoBanner.query == 'stackable') {
                $scope.videoMasthead = false;
            }
        }
        $scope.playSizzleVideo = function(isRailPopUp, playerData) {
            $scope.videoOrlive = "video"; //used fo analytics
            if (isRailPopUp) {
                $scope.embCode = playerData.embCode;
                $scope.socialShareUrl = configuration.server_url + "/homeshare"; //playerData.imagePath;
                ($scope.embCode !== '' && typeof $scope.embCode !== 'undefined') ? PlayerService.sizzlePlayer(SIZZLE, $scope, false): $rootScope.closePopUpVideoPlayer();
            } else {
                $scope.embCode = $scope.videoBanner.embedcode[$rootScope.CurrentLang];
                PlayerService.sizzlePlayer(SIZZLE, $scope, false);
            }
            $('#popUpPlayBtnMob').hide();
            $("#scrollAnchor").hide();
            //SocialService.getShareButtons(configuration.server_url, $rootScope.appInfo.title, $rootScope.appInfo.description, "Home", "dummy/icon/fb_share_icon_white.png", "dummy/icon/twitter_small.png", $rootScope.logoweb, $rootScope.enableTwitterSharing, $rootScope.enableFacebookSharing);
            console.log('Playing Video in ' + $rootScope.CurrentLang + ' embedcode ' + $scope.embCode);
        };
        $scope.CustomPageOmnitureCaller = function(pagename) {
            var omniPageName, prop9;
            if (pagename == 'home') {
                prop9 = omniPageName = (userIsLoggedin() ? 'home:subscriber' : 'home:prospect');
                analyticsService.TrackCustomPageLoad(omniPageName, prop9);
            } else if (pagename == 'movieList') {
                prop9 = omniPageName = 'movie:index';
                analyticsService.TrackCustomPageLoad(omniPageName, prop9);
            } else if (pagename == 'tvList') {
                prop9 = omniPageName = 'tv:index';
                analyticsService.TrackCustomPageLoad(omniPageName, prop9);
            } else {
                analyticsService.TrackCustomPageLoad(pagename);
            }
        };
        // $rootScope.$watch(
        //   "var_RegionFilterUpdated",
        //   function (newValue, oldValue) {
        //      if (newValue != '' && typeof newValue != 'undefined' ) {
        //          console.log(newValue);
        //       var temp=$scope.railList;
        //     updateRails();
        //  }
        // });
        $scope.QualityFilterUpdated = function(key, event) {
            $rootScope.SelectedQuality = [];
            var checkbox = event.target;
            if (checkbox.checked) {
                $rootScope.SelectedQuality.push(key);
            } else {
                var index = $rootScope.SelectedQuality.indexOf(key);
                if (index > -1) {
                    $rootScope.SelectedQuality.splice(index, 1);
                }
            }
            CookieService.SaveQualityFilter($rootScope.SelectedQuality);
            $scope.ContentList = [];
            updateRails();
        };
        $scope.RegionFilterUpdated = function(key, event) {
            if (typeof $rootScope.SelectedRegions === 'undefined') {
                $rootScope.SelectedRegions = [];
            }
            var checkbox = event.target;
            if (checkbox.checked) {
                $rootScope.SelectedRegions.push(key);
            } else {
                var index = $rootScope.SelectedRegions.indexOf(key);
                if (index > -1) {
                    $rootScope.SelectedRegions.splice(index, 1);
                }
            }
            //console.log($rootScope.SelectedRegions);
            CookieService.SaveRegionFilter($rootScope.SelectedRegions);
            $scope.ContentList = [];
            //  $scope.MakeRailCalls();
            updateRails();
        };

        function updateRails() {
            $rootScope.isLoggedIn = Sessions.isLoggedIn();
            var singleAssetBaseUrl = '/movie';
            if ($rootScope.isLoggedIn) {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, Sessions.getCookie('accessToken'), null, null, $scope.type);
            } else {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, null, null, null, $scope.type);
            }
        }
        $scope.isUndefinedOrNull = function(val) {
                //console.log('Check-->');
                //console.log(val);
                //console.log('Resp:')
                var k = angular.isUndefined(val) || val === null;
                //console.log(k);
                return k;
            }
            //fix for 404 issue angular carousal.
        $scope.addbaseAndImg = function(base, imgpath) {
            //  console.log("-------------");
            //  console.log(base);
            //  console.log(imgpath);
            if (typeof imgpath != 'undefined') {
                return base + (imgpath.replace("https", "http"));
            } else {
                return ""; //no image 
            }
        };
        $scope.CheckBannerStatus = function(slide) {
            return (typeof slide.query != 'undefined' && slide.query == 'banner');
        };
        // $scope.QualityFilterUpdated = function (key, event) {
        //      var checkbox = event.target;
        //      if (checkbox.checked)
        //          $rootScope.SelectedQuality.push(key);
        //      else {
        //          var index = $rootScope.SelectedQuality.indexOf(key);
        //          if (index > -1) {
        //              $rootScope.SelectedQuality.splice(index, 1);
        //          }
        //      }
        //      CookieService.SaveQualityFilter($rootScope.SelectedQuality);
        //      $rootScope.var_QualityFilterUpdated=$rootScope.SelectedQuality.length.toString();
        //  }
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            updateRails();
        }); //end of $scope.$on('ngRepeatFinished'  
        $scope.$on('ngRepeatSliderFinished', function(ngRepeatFinishedEvent) {
            console.log("on Slider ng end");
            //  console.log(ngRepeatFinishedEvent);
            carouselSweeper();
        }); //end of $scope.$on('ngRepeatFinished'  
        //end of rail related code  
        function carouselSweeper() {
            var SwiperObj = (typeof $('.swiper-container')[0] != 'undefined' && typeof $('.swiper-container')[0].swiper != 'undefined') ? $('.swiper-container')[0].swiper : null;
            console.log("SwiperObj Result");
            console.log(SwiperObj);
            if (SwiperObj != null) {
                swiper.destroy();
                initSwipper();
            } else {
                initSwipper();
            }
        }

        function initSwipper() {
            swiper = new Swiper(".swiper-container", {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                direction: 'vertical',
                parallax: true,
                effect: 'fade',
                speed: 1000,
                autoplay: $scope.slides.length > 1 ? 5000 : "",
                loop: true,
                autoplayDisableOnInteraction: false
            });
        }
        $scope.createAccountModal = function() {
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
            modalInstance.result.then(function() {}, function() {
                //on cancel button press
            });
        };
        $scope.isAllSel = false;
        $scope.isHDSel = false;
        $scope.isCheckBoxChecked = function(type) {
            // if (type === "hd") {
            //   $scope.isHDSel = $scope.isHDSel !== true;
            // } else {
            //   if ($scope.isAllSel === true) {
            //     $scope.isAllSel = false;
            //     $scope.filters[0][0].isFilterSelected = false;
            //   } else {
            //     $scope.isAllSel = true;
            //     $scope.filters[0][0].isFilterSelected = true;
            //   }
            // }
        };
        $scope.callToAction = function(slide, type) {
            if (typeof slide.action != 'undefined') {
                if (typeof slide.actionid == 'undefined') {
                    return null;
                } else if (slide.action == 'modal' && type == 'modal' && slide.actionid == 'signup') {
                    $rootScope.signupModal(1);
                } else if (slide.action == 'custom' && type == 'page') {
                    return "/" + "page?pageid=" + slide.actionid;
                } else if (slide.action == 'filter' && type == 'page') {
                    return "/" + "filterpage?pageid=" + slide.actionid;
                } else if (slide.action == 'link' && type == 'page') {
                    return slide.actionid;
                } else {
                    return "#";
                }
            }
        };
        $scope.trustUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };
        $scope.cartAbandonmentFlow = function() {
            var packageList = (!!$rootScope.userData && !!$rootScope.userData.data.packageList) ? $rootScope.userData.data.packageList : '';
            if (!!packageList) {
                $rootScope.$watch("packageListNEW", function(newValue, oldValue) {
                    if (!!newValue) {
                        for (var i = 0; i < newValue.length; i++) {
                            if (packageList.indexOf(newValue[i].id) > -1) {
                                newValue[i].newPackageSelection = newValue[i].packageSelection = true;
                            }
                        }
                        $rootScope.packageObjList = newValue;
                        $rootScope.signupRouteInfo.selectPackage = $rootScope.signupRouteInfo.createAccount = true;
                        $location.url("/finalCheckout");
                    }
                });
            } else {
                $location.url("/selectPackage");
            }
        };
    }
]);