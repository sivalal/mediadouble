'use strict';
/* NetworkList Controllers */
mdlDirectTvApp.controller('ChannelsCtrl', ['analyticsService', '$scope', '$http', '$routeParams', 'configuration', '$rootScope', 'railService',
    function(analyticsService, $scope, $http, $routeParams, configuration, $rootScope, railService) {
        $rootScope.$watch("appgridAssets", function(newValue, oldValue) {
            if (newValue != '') {
                $scope.pageDetails = $rootScope.getPageDetails("network_channels");
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    $scope.slides = [];
                    $scope.source = (typeof $scope.pageDetails.source != 'undefined') ? $scope.pageDetails.source : '';
                    $scope.pageTitle = $scope.pageDetails.title;
                    $scope.imageMetaDetails = {
                        //(JSON.parse($rootScope.appGridMetadata.gateways))['images']
                        //JSON.parse($rootScope.appGridMetadata.device)
                        "imageshackBaseurl": parseAppgridData($rootScope.appGridMetadata.gateways).images,
                        "deviceArr": parseAppgridData($rootScope.appGridMetadata.device)
                    };
                    if (typeof $scope.pageDetails.mastheads !== 'undefined') railService.populateShowcase($scope.pageDetails.mastheads, $scope);
                    if (typeof $scope.pageDetails.items !== 'undefined') {
                        var channelList = $scope.pageDetails.items;
                        for (var key in channelList) {
                            channelList[key].imagePath = ($rootScope.appgridAssets[channelList[key].icon]).replace("https", "http");
                        }
                        console.log("Appgrid Channel List Order");
                        console.log(channelList);
                        //sort channel list in alphabetic order
                        channelList = _.sortBy(channelList, function(aObj) {
                            console.log("====--===================================");
                            console.log(aObj);
                            var k = (typeof aObj.title != 'undefined' && typeof aObj.title[$rootScope.CurrentLang] != 'undefined') ? aObj.title[$rootScope.CurrentLang] : "";
                            console.log("+-+-+-+-+-+_=_=_----");
                            console.log(k);
                            console.log("====--===================================");
                            var a = k.toLowerCase();
                            return a;
                        });
                        console.log("Channel List Order after sorting");
                        console.log(channelList);
                        $scope.channelList = channelList;
                    }
                    if ($routeParams.q == 'network') {
                        analyticsService.TrackCustomPageLoad(
                            ("more:network:index"), "more:network" //propNine
                        );
                    }
                }
            }
        });
        $scope.callToAction = function(slide) {
            if (slide.cta) {
                if (typeof slide.actionID == 'undefined') {
                    return null;
                } else if (slide.action == 'custom') {
                    return "/" + "page?pageid=" + slide.actionID;
                } else if (slide.action == 'filter') {
                    return "/" + "filterpage?pageid=" + slide.actionID;
                } else if (slide.action == 'link') {
                    return slide.actionID;
                } else {
                    return "/" + slide.actionID;
                }
            }
        };
        $scope.isUndefinedOrNull = function(val) {
            //console.log('Check-->');
            //console.log(val);
            //console.log('Resp:')
            var k = angular.isUndefined(val) || val === null;
            //console.log(k);
            return k;
        };
        //fix for 404 issue angular carousal.
        $scope.addbaseAndImg = function(base, imgpath) {
            if (typeof imgpath != 'undefined') {
                return base + (imgpath.replace("https", "http"));
            } else {
                return ""; //no image 
            }
        }
    }
]);
mdlDirectTvApp.controller('ProgramsCtrl', ['analyticsService', '$scope', '$http', '$routeParams', 'configuration', '$rootScope', 'railService',
    function(analyticsService, $scope, $http, $routeParams, configuration, $rootScope, railService) {
        $rootScope.$watch("appgridAssets", function(newValue, oldValue) {
            if (newValue != '') {
                $scope.pageDetails = $rootScope.getPageDetails($routeParams.q);
                //analytics
                if (typeof $routeParams.p !== 'undefined' && $routeParams.p == 'networks') {
                    analyticsService.TrackNetworkPage(
                        ("more:network:" + $routeParams.q + ":index"), $routeParams.q, "more:network" //propNine
                    );
                } else {
                    analyticsService.TrackCustomPageLoad($routeParams.q);
                }
                //end of analytics
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    $scope.source = (typeof $scope.pageDetails.source != 'undefined') ? $scope.pageDetails.source : '';
                    $scope.slides = [];
                    $scope.programList = [];
                    $scope.pageTitle = $scope.pageDetails.title;
                    $scope.imageMetaDetails = { //(JSON.parse($rootScope.appGridMetadata.gateways))['images']
                        //JSON.parse($rootScope.appGridMetadata.device)
                        "imageshackBaseurl": parseAppgridData($rootScope.appGridMetadata.gateways).images,
                        "deviceArr": parseAppgridData($rootScope.appGridMetadata.device)
                    };
                    if (typeof $scope.pageDetails.mastheads !== 'undefined') railService.populateShowcase($scope.pageDetails.mastheads, $scope);
                    if (typeof $scope.pageDetails['items'] !== 'undefined') $scope.populateGrid($scope.pageDetails['items']);
                }
            }
        });
        $scope.network_dropdown = [{
            key: '0',
            val: 'All'
        }, {
            key: '1',
            val: 'TV Shows'
        }, {
            key: '2',
            val: 'Movies'
        }];
        $scope.dropdownLabel = $scope.network_dropdown[0].val;
        $scope.changeNetworkDropdown = function(index) {
            $scope.dropdownLabel = $scope.network_dropdown[index].val;
        }
        $scope.getSingleAssetBaseUrl = function(TitleTypeId) {
            if (_.contains([1, 3], TitleTypeId)) {
                return "/movie";
            } else if (_.contains([2, 4, 5, 6], TitleTypeId)) {
                return "/tvShow";
            } else {
                return null;
            }
        }
        $scope.populateGrid = function(itemsArray) {
            for (var key in itemsArray) {
                var url = railService.railUrlgenerator(itemsArray[key]); // $rootScope.accessToken
                if (url != null) {
                    $http({
                        method: 'Get',
                        url: url
                    }).success(function(data, status, headers, config) {
                        //workaround for titles without translation from collection response
                        for (var key in data.thumblistCarouselOneArr) {
                            data.thumblistCarouselOneArr[key].title = {
                                "en_US": data.thumblistCarouselOneArr[key].title,
                                "es_ES": data.thumblistCarouselOneArr[key].title
                            };
                            if (data.thumblistCarouselOneArr[key].imagePath.indexOf('dummy/blank_image.png') !== -1) {
                                data.thumblistCarouselOneArr[key].imagePath = ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                            }
                            $scope.programList.push(data.thumblistCarouselOneArr[key]);
                        }
                    }).error(function(data, status, headers, config) {
                        $scope.message = 'Unexpected Error';
                    });
                } //end of if(url!=null) 
            }
        }
        $scope.callToAction = function(slide) {
            if (slide.cta) {
                if (typeof slide.actionID == 'undefined') {
                    return null;
                } else if (slide.action == 'custom') {
                    return "/" + "page?pageid=" + slide.actionID;
                } else if (slide.action == 'filter') {
                    return "/" + "filterpage?pageid=" + slide.actionID;
                } else if (slide.action == 'link') {
                    return slide.actionID;
                } else {
                    return "/" + slide.actionID;
                }
            }
        };
        $scope.isUndefinedOrNull = function(val) {
            //console.log('Check-->');
            //console.log(val);
            //console.log('Resp:')
            var k = angular.isUndefined(val) || val === null;
            //console.log(k);
            return k;
        };
        //fix for 404 issue angular carousal.
        $scope.addbaseAndImg = function(base, imgpath) {
            if (typeof imgpath != 'undefined') {
                return base + (imgpath.replace("https", "http"));
            } else {
                return ""; //no image 
            }
        };
    }
]);