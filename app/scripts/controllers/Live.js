'use strict';
/* Live Controllers */
var oplayer = null;
mdlDirectTvApp.controller('LiveCtrl', ['analyticsService', '$scope', 'FilterService', 'railService', '$rootScope', '$filter', '$http', 'configuration', 'SearchService', 'Sessions', '$modal', '$location',
    function(analyticsService, $scope, FilterService, railService, $rootScope, $filter, $http, configuration, SearchService, Sessions, $modal, $location) {
        //onload date initialization
        var currentDate = new Date();
        var utc = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
        $scope.dateToDisplay = $filter('date')(currentDate, 'MMM dd, yyyy');
        $scope.ajaxTrackSpinner = true;
        var pagename = "liveList";
        $scope.showList = true;
        //get tracks
        var getTrackList = function() {
            SearchService.GetTrackContent().then(function(trackList) {
                $scope.tracks = FilterService.ChannelFilter(trackList, "sort", pagename);
                $scope.showList = false;
            });
        };
        //get segments
        var getSegmentList = function() {
            var date = $filter('date')(utc, 'yyyy-MM-dd');
            var hours = utc.getHours();
            var minutes = utc.getMinutes();
            var seconds = utc.getSeconds();
            var startTime = (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
            var endTime = (hours < 10 ? '0' : '') + hours + ":" + ((minutes + 1) < 10 ? '0' : '') + (minutes + 1) + ":" + (seconds < 10 ? '0' : '') + seconds;
            SearchService.GetTrackSegmentsContent(date, startTime, endTime).then(function(trackSegments) {
                //add segments to the corresponding language
                $scope.$watch("tracks", function(newValue, oldValue) {
                    if ((typeof newValue !== "undefined") && (newValue !== '')) {
                        $scope.ajaxTrackSpinner = false;
                        angular.forEach(newValue, function(trachValue, trackKey) {
                            if (trachValue.channelId) {
                                var segmentByTrackid = jQuery.grep(trackSegments, function(segments) {
                                    return segments.track_id == trachValue.channelId
                                });
                                if (segmentByTrackid.length !== 0) {
                                    $scope.tracks[trackKey]["segment"] = segmentByTrackid[0];
                                }
                            }
                        });
                    }
                });
                $scope.trackSegments = trackSegments;
            });
        };
        //order tracks by the "sort" param set through appgrid
        $scope.orderBySortParam = function(track) {
            return parseInt(track.sort[$rootScope.CurrentLang]);
        };
        //watch appgrid to load live page
        $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
            if ((typeof newValue !== "undefined") && (newValue !== '')) {
                getTrackList();
                getSegmentList();
                analyticsService.TrackCustomPageLoad("live:index", "live:index" //propNine
                );
            }
        });
        //get live detail page
        $scope.liveShowDetails = function(contentId, title, id) {
            analyticsService.TrackCustomPageLoad(
                ("live:channel:" + title), ("live:channel:" + title) //propNine
            );
            $location.path("/liveShow").search({
                'content_id': contentId,
                'id': id,
                'title': title
            });
        }
        $scope.showProgramTimes = function() {
            $scope.isProgramVisible = true;
        };
        $scope.hideProgramTimes = function() {
            $scope.isProgramVisible = false;
        };
        //get live tracks-----------------------------------------------
        //         $scope.ajaxSegmentSpinner    = true;
        //         var getSegmentsList = function (date) {
        //             var selectedDate = $filter('date')(date,'yyyy-MM-dd');
        //             var currentDate  = new Date();
        //             currentDate.setSeconds(Math.floor(currentDate.getSeconds() / 60) * 60);
        //             currentDate.setMinutes(Math.floor(currentDate.getMinutes() / 30) * 30);
        //             var currentTime  = (currentDate.getHours()<10?'0':'') + currentDate.getHours()+":"+(currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes()+":"+(currentDate.getSeconds()<10?'0':'') + currentDate.getSeconds();
        //             var time;
        //             if(date.setHours(0,0,0,0) == currentDate.setHours(0,0,0,0)) {
        //                 time = currentTime;
        //             } else {
        //                 time = '00:00:00';
        //             }
        //             $scope.ajaxSegmentSpinner = true;
        //             SearchService.GetLiveSegmentContent(selectedDate, time).then(function (trackSegments) {
        //                 $scope.ajaxSegmentSpinner = false;
        //                 $scope.segments = trackSegments;
        //             });
        //         };
        //         var getSegmentsListInMob = function (date) {
        //             var selectedDate = $filter('date')(date,'yyyy-MM-dd');
        //             var currentDate  = new Date();
        //             currentDate.setSeconds(Math.floor(currentDate.getSeconds() / 60) * 60);
        //             currentDate.setMinutes(Math.floor(currentDate.getMinutes() / 30) * 30);
        //             var currentTime  = (currentDate.getHours()<10?'0':'') + currentDate.getHours()+":"+(currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes()+":"+(currentDate.getSeconds()<10?'0':'') + currentDate.getSeconds();
        //             var time;
        //             if(date.setHours(0,0,0,0) == currentDate.setHours(0,0,0,0)) {
        //                 time = currentTime;
        //             } else {
        //                 time = '00:00:00';
        //             }
        //             $scope.ajaxSegmentMobSpinner = true;
        //             SearchService.GetLiveSegmentContent(selectedDate, time).then(function (trackSegments) {
        //                 $scope.ajaxSegmentMobSpinner = false;
        //                 $scope.segmentsinmob = trackSegments;
        //             });
        //         };
        //         //jquery date picker code------------- dateFormat:'DD, mm, yy',--------------------------------
        //         $rootScope.$watch("CurrentLang", function (newValue, oldValue) {
        //             if (newValue != '' && newValue != 'undefined') {
        //                 /////////////////////// WEB ///////////////////////////////
        //                 jQuery("#liveRangePicker").datepicker("destroy");
        //                 jQuery('#liveRangePicker').datepicker(
        //                     $.extend({
        // //                        onClose: function (selectedDate) {
        // //                            var date = $(this).datepicker( 'getDate' );
        // //                            //date = jQuery.datepicker.formatDate('yy-mm-dd', new Date(date)); // for now
        // //                            $scope.ajaxSegmentSpinner = true;
        // //                            getSegmentsList(date);
        // //                        }
        //                     },
        //                     jQuery.datepicker.regional[newValue],
        //                     {
        //                         dateFormat:'M dd, yy',
        //                         minDate: "-2W",
        //                         maxDate: "+2W"
        //                     }
        //                 ));
        //                 jQuery("#liveRangePicker").datepicker('setDate', 'today');
        /////////////////////// MOBILE WEB ///////////////////////////////
        //                 jQuery("#liveMobRangePicker").datepicker("destroy");
        //                 jQuery('#liveMobRangePicker').datepicker(
        //                     $.extend({
        // //                        onClose: function (selectedDate) {
        // //                            var date = $(this).datepicker( 'getDate' );
        // //                            //date = jQuery.datepicker.formatDate('yy-mm-dd', new Date(date)); // for now
        // //                            $scope.ajaxSegmentMobSpinner = true;
        // //                            getSegmentsListInMob(date);
        // //                        }
        //                     },
        //                     jQuery.datepicker.regional[newValue],
        //                     {
        //                         dateFormat:'M dd, yy',
        //                         minDate: "-2W",
        //                         maxDate: "+2W"
        //                     }
        //                 ));
        //                 jQuery("#liveMobRangePicker").datepicker('setDate', 'today');
        //intial load segments--------------------------------------------
        // if(isMobile.any()) {
        //     var currentDateinmob = jQuery("#liveMobRangePicker").datepicker('getDate');
        //     //currentDateinmob = jQuery.datepicker.formatDate('yy-mm-dd', new Date(currentDateinmob)); // for now
        //     getSegmentsListInMob(currentDateinmob);
        //     jQuery("#liveMobRangePicker").datepicker("destroy");
        // } else {
        //     var currentDate = jQuery("#liveRangePicker").datepicker('getDate');
        //     //currentDate = jQuery.datepicker.formatDate('yy-mm-dd', new Date(currentDate)); // for now
        //     //getSegmentsList(currentDate);
        //     jQuery("#liveRangePicker").datepicker("destroy");
        // //}
        //     }
        // });
        //////////////////SCROLL FOR LIVE CONTENTS////////////////////////
        $scope.prevlivechan = function() {
            var leftPos = jQuery('.livelistcontainer').scrollLeft();
            jQuery('.livelistcontainer').animate({
                scrollLeft: leftPos - 100
            }, 800);
        };
        $scope.nextlivechan = function() {
            var leftPos = jQuery('.livelistcontainer').scrollLeft();
            jQuery('.livelistcontainer').animate({
                scrollLeft: leftPos + 100
            }, 800);
        };
        //////////////////SCROLL FOR LIVE CONTENTS////////////////////////
        if (typeof $rootScope.userid !== 'undefined') {
            $scope.userid = $rootScope.userid;
        } else {
            $scope.userid = 'notset';
        }
        //set reminder for each program
        $scope.setReminder = function(trackId, segmentId) {
            angular.forEach($scope.segments.channels, function(segment) {
                if (segment.channel_id == trackId) {
                    angular.forEach(segment.programs, function(value) {
                        if (value.id == segmentId) {
                            var title = value.virtual_asset.metadata.short_title;
                            var description = value.virtual_asset.metadata.description;
                            $http.get(configuration.server_url + '/live/email_notification?email=' + $rootScope.emailId + '&username=' + $rootScope.firstName + '&lang=' + Sessions.getLanguage() + '&title=' + title + '&description=' + description).then(function(response, headers) {});
                            $scope.reminderModal();
                        }
                    });
                }
            });
        };
        //show reminder modal
        $scope.reminderModal = function() {
            $scope.opts = {
                /* dialogFade: false */
                keyboard: false,
                templateUrl: '/views/dialog/reminderDialog.html',
                controller: ReminderModalICtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    msg: "Hello"
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function() {}, function() {});
        };
        $scope.getMovieItemHeight = function(row) {
            console.log('in row height----------------------' + row + '----------' + (60 * row) + 'px');
            return (60 * row) + 'px';
        };
        $scope.HideColumn = function(itemtype) {
            if (itemtype == '1') return -0.1;
        };

        function mytooltip1() {
            var content = '<div class="content"><div class="col-md-12 col-sm-12 col-xs-12">' + '<div class="row"><div class="col-md-6 col-sm-6 col-xs-6">o</div>' + '<div class="col-md-6 col-sm-6 col-xs-6">Live</div></div></div></div>';
            return content;
        }
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            livePagePopOver();
        }); //end of $onngRepeatFinished
        function livePagePopOver() {
            jQuery('a').on('click', function() {
                //close all popovers
                jQuery('.programPopoverHolder').each(function() {
                    jQuery(this).popover("hide");
                    clearTimeout(jQuery(this).data('timeoutId'));
                });
            });
            jQuery('.programPopoverHolder').each(function() {
                var em = 'body'; //jQuery(this).attr('class');
                var options = {
                    placement: function(context, source) {
                        var position = jQuery(source).offset();
                        if (position.left > 515) {
                            return "left";
                        }
                        if (position.left < 515) {
                            return "right";
                        }
                        if (position.top < 110) {
                            return "bottom";
                        }
                        return "top";
                    },
                    trigger: 'manual',
                    html: true,
                    container: em,
                    animation: false,
                    content: function() {
                        jQuery(this).attr("data-content", jQuery(this).find('.programpopoverContent').html());
                    }
                };
                jQuery(this).popover(options);
            });

            function clearallpopOver() {
                jQuery('.programPopoverHolder').each(function() {
                    jQuery(this).popover("hide");
                    clearTimeout(jQuery(this).data('timeoutId'));
                });
            }
            jQuery('.programPopoverHolder').on('mouseover', function() {
                //close all popovers
                clearallpopOver();
                if ((!Modernizr.touch) || enablePopoverOnTouch) {
                    //  jQuery(this).popover("show");
                    var itemClassElement = jQuery(this),
                        timeINId = setTimeout(function() {
                            if (itemClassElement.is(':hover')) itemClassElement.popover("show");
                        }, 950);
                    // clearTimeout(itemClassElement.data('timeINId'));
                    itemClassElement.data('timeINId', timeINId);
                }
            }).on("mouseleave", function() {
                if ((!Modernizr.touch) || enablePopoverOnTouch) {
                    var itemClassElement = jQuery(this),
                        timeoutId = setTimeout(function() {
                            if (!itemClassElement.is(':hover')) var k = (!jQuery('.popover:hover').length > 0) ? itemClassElement.popover("hide") : '';
                            jQuery('.popover').on('mouseleave', function() {
                                itemClassElement.popover("hide");
                            });
                        }, 3000);
                    clearTimeout(itemClassElement.data('timeINId'));
                    itemClassElement.data('timeoutId', timeoutId);
                }
            });
        }
        $scope.backtoList = true;
        $scope.showGrid = false;
        $scope.tvShowThumb = configuration.server_url + "/dummy/tvShow/tvShowLargeThumb.png";
        $scope.tvBanner = {
            banner: configuration.server_url + "/dummy/tvShow/tvShowDummyBanner.png",
            caption: "Hell's Kitchen"
        };
        $scope.setSelectedSeason = function(index) {
            $scope.selectedSeason = $scope.liveShowDetails.seasons[index];
        };
        $scope.setSelectedEpisode = function(index) {
            $scope.selectedEpisode = $scope.selectedSeason.episodes[index];
        };
        $scope.getElapsedPercentage = function(index) {
            var episode = $scope.selectedSeason.episodes[index];
            return episode.elapsed / episode.duration * 100 + '%';
        };
        $scope.setContentIdAndBackList = function(contentid, isBacklist) {
            $scope.embCode = contentid.toString();
            $scope.backtoList = isBacklist;
            if ($scope.embCode != null && $scope.embCode != '') {
                OO.ready(function(OO) {
                    OO.$("#liveshow_playerwrapper").html('');
                    if (oplayer != null) oplayer.destroy();
                    oplayer = OO.Player.create('liveshow_playerwrapper', $scope.embCode, {
                        wmode: 'transparent',
                        width: '100%',
                        height: '100%'
                    });
                    //            oplayer.mb.subscribe(OO.EVENTS.PLAYING, "ie_iframe", onVideoPlaying);
                });
            } else {
                if (oplayer != null) oplayer.destroy();
            }
        }
    }
]);
var ReminderModalICtrl = ['$scope', '$modalInstance',
    function($scope, $modalInstance) {
        $scope.closeAction = function() {
            $modalInstance.dismiss('cancel');
        };
    }
];
/* ---------------------------------------------LIVE PAGE CONTROLLER-------------------------------------------------------------- */
mdlDirectTvApp.controller('LiveAssetCtrl', ['analyticsService', '$scope', 'railService', 'PlayerService', '$http', '$routeParams', '$rootScope', 'SocialService', '$location', 'configuration', 'Sessions',
    function(analyticsService, $scope, railService, PlayerService, $http, $routeParams, $rootScope, SocialService, $location, configuration, Sessions) {
        var shareurl = $location.absUrl();
        var embededUrl = "";
        $scope.pagename = "LIVE";
        $scope.embCode = '';
        $scope.ajaxLiveloader = true;
        $http.get(configuration.server_url + '/singleasset/get_live_asset?contentId=' + $routeParams.content_id + '&access_token=' + Sessions.getCookie('accessToken')).success(function(data, status, headers, config) {
            $scope.ajaxLiveloader = false;
            $scope.movieDetails = data.assets;
            console.log("live data");
            console.log($scope.movieDetails);
            $scope.video_href = configuration.server_url + '/liveShow?content_id=' + $routeParams.content_id;
            if ($routeParams.playhead_seconds !== '' && $routeParams.playhead_seconds !== 'undefined') {
                $scope.playhead_seconds = $routeParams.playhead_seconds;
            } else {
                $scope.playhead_seconds = 0;
            }
            if ($scope.embCode == null || $scope.embCode == '') {
                $scope.embCode = data.contentID;
            }
            $scope.currentAssetTitleId = $routeParams.id;
            $scope.movie_titleORshowname_Seasonid_Episodeid = $routeParams.title;
            var PLAYER_NAMESPACE = MPLAYER_3;
            var playerWraper = "liveshow_playerwrapper";
            $scope.videoOrlive = "live"; //used for evar11 (live or video) omniture analytics
            PlayerService.mainPlayer(PLAYER_NAMESPACE, playerWraper, $scope);
            $http.get(configuration.server_url + '/search/GetContentImage?contentId=' + $routeParams.titleId).
            success(function(data, status, headers, config) {
                var imageurl = data.imageurl;
                // SocialService.getShareButtons(shareurl, $scope.movieDetails.title, $scope.movieDetails.details, "SAP", "dummy/icon/facebook2.png", "dummy/icon/twitter.png", imageurl, $rootScope.enableTwitterSharing, $rootScope.enableFacebookSharing);
            });
        }).error(function(data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
        $scope.movieThumb = "dummy/movie_thumb.png";
        //-----------rails common code--------------------
        $scope.railList = [];
        $rootScope.$watch("appgridAssets", function(newValue, oldValue) {
            if (newValue != '') {
                $scope.pageDetails = $rootScope.getPageDetails('liveShow');
                analyticsService.TrackCustomPageLoad(
                    ("live:channel:" + $routeParams.content_id), ("live:channel:" + $routeParams.content_id) //propNine
                );
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    if (typeof $scope.pageDetails['items'] !== 'undefined') $scope.railList = getRailList($scope.pageDetails['items']);
                }
            }
        });

        function updateRails() {
            $rootScope.isLoggedIn = Sessions.isLoggedIn();
            var tokenFlag = Sessions.getCookie('tokenFlag');
            var singleAssetBaseUrl = '/movie';
            if ($rootScope.isLoggedIn) {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.railList, Sessions.getCookie('accessToken'));
            } else {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.railList, null);
            }
        }
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            updateRails();
        }); //end of $scope.$on('ngRepeatFinished'
        //-----------rails common code--------------------
        $scope.AddToWatchList = function() {
            WatchListService.Add(id).then(function(response) {});
        };
        $scope.signup = function() {
            $rootScope.signupModal(1);
        };

        function scrolltotop() {
            jQuery(document).ready(function($) {
                $("html, body").animate({
                    scrollTop: 0
                }, "slow");
            });
        }
    }
]);