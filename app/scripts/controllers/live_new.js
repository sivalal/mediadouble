'use strict';
/* Live Controllers */
var oplayer = null;
mdlDirectTvApp.controller('LiveNewCtrl', ['analyticsService', '$scope', 'FilterService', 'PlayerService', 'railService', 'contentService', '$rootScope', '$filter', '$http', 'configuration', 'SearchService', 'Sessions', '$modal', '$location', '$log',
    function(analyticsService, $scope, FilterService, PlayerService, railService, contentService, $rootScope, $filter, $http, configuration, SearchService, Sessions, $modal, $location, $log) {
        console.log("in new live controller");
        //onload date initialization
        var currentDate = new Date();
        var utc = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
        $scope.dateToDisplayGuide = $filter('date')(currentDate, 'EEEE, MMM d');
        $scope.ajaxTrackSpinner = true;
        $scope.ajaxTrackSpinnerInitial = true;
        var pagename = "liveList";
        $scope.showList = true;
        $scope.isFirstShow = true;
        $scope.selectedChannelIndex = 0;
        $scope.button_clicked = false;
        $scope.nextDate = new Date();
        //$scope.page="live";
        //get tracks
        var getTrackList = function() {
            var sortedTracks, lang = Sessions.getLanguage();
            SearchService.GetTrackContent().then(function(trackList) {
                console.log("trackList");
                console.log(trackList);
                $log.info('Missing Assets');
                for (var i in trackList.error) {
                    $log.error(trackList.error[i]);
                }
                sortedTracks = FilterService.ChannelFilter(trackList, "sort", pagename);
                sortedTracks.sort(function(a, b) {
                    return (a.sort[lang] || 10000) - (b.sort[lang] || 10000);
                }); // channel with no sort order should go last
                $scope.tracks = sortedTracks;
                console.log("$scope.tracks");
                $scope.completeTracks = $scope.tracks;
                console.log($scope.tracks);
                screenWaiting(true);
                getSegmentList(new Date());
            });
        };
        $scope.removeUwantedPrograms = function(programs, date) {
            var ids = [],
                filteredProgs = [],
                progIds = [];
            for (var i in $scope.tracks) {
                ids.push($scope.tracks[i].channelId);
            }
            for (var j in programs) {
                if (programs[j]) {
                    if (ids.indexOf(programs[j].channel_id) > -1) {
                        filteredProgs.push(programs[j]);
                        progIds.push(programs[j].channel_id);
                    }
                }
            }
            //var commonValues = _.intersection(ids, progIds);
            var commonValues = _.union(ids, progIds);
            $scope.missingProgIDs = _.difference(ids, progIds);
            if($scope.missingProgIDs && $scope.missingProgIDs.length > 0){
                var noProgTracks = $filter('filter')($scope.tracks, function(Obj, index) {
                    return ($scope.missingProgIDs.indexOf(Obj.channelId) > -1);
                });
                $scope.removeA($scope.tracks, noProgTracks);
                $scope.tracks = $scope.tracks.concat(noProgTracks);
            }
            $scope.commonIds = commonValues;

            var filteredPrograms = $filter('filter')(filteredProgs, function(Obj, index) {
                return (commonValues.indexOf(Obj.channel_id) > -1);
            });
            $scope.tracks = $filter('filter')($scope.tracks, function(Obj, index) {
                return (commonValues.indexOf(Obj.channelId) > -1);
            });

            $scope.preTracks = (typeof $scope.preTracks == 'undefined') ? Array() : $scope.preTracks;
            if (typeof $scope.preTracks[date] == 'undefined') {
                $scope.preTracks[date] = $scope.tracks;
            }
            if ($scope.isFirstShow == true) {
                $scope.isFirstShow = false;
                $scope.startPlayBack();
            }
            var filteredProgObj = {};
            for (var i in filteredPrograms) {
                filteredProgObj[i] = filteredPrograms[i];
            }
            return filteredProgObj;
        };
        $scope.startPlayBack = function() {
            var isEntitledTracksAvailable = $filter('filter')($scope.tracks, {
                isEntitled: true
            });
            if (typeof $scope.tracks != 'undefined' && $scope.tracks.length > 0 && typeof $scope.tracks[0] != 'undefined' && typeof $scope.tracks[0].embed_code != 'undefined' && isEntitledTracksAvailable.length > 0) {
                $scope.ajaxTrackSpinnerInitial = false;
                console.log("embedcode initial " + isEntitledTracksAvailable[0].embed_code);
                $scope.showList = false;
                $scope.LivePlayerStart(isEntitledTracksAvailable[0].embed_code, isEntitledTracksAvailable[0].title, isEntitledTracksAvailable[0].channelId);
            } else {
                console.log("embedcode missing from trackList call");
                $scope.ajaxTrackSpinnerInitial = false;
            }
        };
        //get segments
        var getSegmentList = function(targetDate, isFocusProg) {
                console.log("inside getSegmentList");
                var date = $filter('date')(targetDate, 'yyyy-MM-dd');
                var dateToday = new Date();
                var hours = dateToday.getHours();
                var minutes = dateToday.getMinutes();
                var seconds = dateToday.getSeconds();
                $scope.currTime = $scope.getCurrTime();
                // if not current date then start from begining of the day
                var startTime = "00:00:00";
                var endTime = "24:00:00";
                // if(targetDate.getDate() != dateToday.getDate()){
                //   var startTime = "00:00:00";
                //   var endTime = "24:00:00" ;
                // }else{
                //   var startTime = (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                //   // checking endtime is nearing or greater than midnight 12pm
                //   if((hours + 10) >= 24){
                //       var endTime = "24:00:00" ;
                //   }else{
                //       var endTime = ((hours + 10) < 10 ? '0' : '') + (hours + 10) + ":" + (minutes  < 10 ? '0' : '') + minutes  + ":" + (seconds < 10 ? '0' : '') + seconds;
                //   }
                // }
                $scope.PreData = (typeof $scope.PreData == 'undefined') ? Array() : $scope.PreData;
                if (typeof $scope.PreData[date] != 'undefined') {
                    $scope.segments = $scope.PreData[date];
                    console.log("$scope.PreData[date]");
                    console.log($scope.PreData[date]);
                    loadProgramEPG(date, true);
                } else {
                    // not in cache so make api call
                    SearchService.GetTrackSegmentsContent(date, startTime, endTime).then(function(trackSegments) {
                        $scope.PreData = (typeof $scope.PreData == 'undefined') ? Array() : $scope.PreData;
                        if (typeof $scope.PreData[date] == 'undefined') {
                            $scope.PreData[date] = trackSegments;
                        }
                        $scope.segments = trackSegments;
                        loadProgramEPG(date);
                    });
                }
                if (isFocusProg == true) {
                    $scope.showProgramTimes();
                    screenWaiting(false);
                } else if (isFocusProg == false) {
                    $scope.nextMove(0);
                    screenWaiting(false);
                }
            }
            //order tracks by the "sort" param set through appgrid
        $scope.orderBySortParam = function(track) {
            return parseInt(track.sort[$rootScope.CurrentLang]);
        };
        //Removes given values/objects from the array
        $scope.removeA = function(arr, arrToRemove) {
            var pos, L = arrToRemove.length,
                ax;
            while (L > 0 && arr.length) {
                pos = arrToRemove[--L];
                while ((ax = arr.indexOf(pos)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        };
        // get epg content for program guide
        function loadProgramEPG(date, isFromCache) {
                $scope.bigRowLength = 0;
                $scope.channels = [];
                var keyCh, keyT;
                var temp;
                if (typeof $scope.segments.channels !== 'undefined') {
                    var programs = $scope.segments.channels;
                    if (!isFromCache) {
                        programs = $scope.removeUwantedPrograms(programs, date);
                        $scope.segments.channels = programs;
                    } else {
                        $scope.tracks = $scope.preTracks[date];
                    }
                    console.log("programs");
                    console.log(programs);
                    //$scope.colCount = $scope.segments.max_time_slot.length * 200;
                    //$rootScope.colCount = $scope.colCount;
                    //sort channels according to the tracks calls

                    if ($scope.segments.max_time_slot != null) {
                        for (keyCh in $scope.tracks) {
                            for (keyT in programs) {
                                if (programs[keyT] && (programs[keyT].channel_id == $scope.tracks[keyCh].channelId)) {
                                    temp = programs[keyT];
                                    programs[keyT] = programs[keyCh];
                                    programs[keyCh] = temp;
                                }
                            }
                        }
                    }
                    var key, currentRow = 0;
                    var keyC, keyP, thisBlock;
                    var bigRowLength = 0; // biggest blocks count.
                    // building epg segments/blocks and rows
                    for (keyC in programs) {
                        if (programs[keyC] && programs[keyC].programs) {
                            for (keyP in programs[keyC].programs) {
                                var prgId = programs[keyC].programs[keyP].id;
                                if ($scope.segments.channels[keyC] && $scope.segments.channels[keyC].programs[keyP]) {
                                    if (prgId) {
                                        thisBlock = programs[keyC].programs[keyP].rows; //blocks in a single program
                                        $scope.segments.channels[keyC].programs[keyP].duration = thisBlock * 30;
                                        if (thisBlock == 1) {
                                            $scope.segments.channels[keyC].programs[keyP].rowWidth = 200;
                                        } else {
                                            $scope.segments.channels[keyC].programs[keyP].rowWidth = (206 * thisBlock) - 6;
                                        }
                                        currentRow += thisBlock;
                                        thisBlock = 0;
                                    } else {
                                        $scope.segments.channels[keyC].programs[keyP].rowWidth = 200;
                                        currentRow += 1;
                                    }
                                }
                            }
                        }
                        if (currentRow > bigRowLength) {
                            bigRowLength = currentRow;
                        }
                        currentRow = 0;
                    }
                    $scope.bigRowLength = bigRowLength * 208;
                    console.log($scope.bigRowLength);
                }
                screenWaiting(false);
            }
            //watch appgrid to load live page
        $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
            if ((typeof newValue !== "undefined") && (newValue !== '')) {
                getTrackList();
                analyticsService.TrackCustomPageLoad("live:index", "live:index" //propNine
                );
                $scope.upgradePage = "/" + "page?pageid=upgradePage";
                $scope.SetupLivePageAppgridData();
            }
        });
        $scope.focusCurrentProg = function(index, isNotFocus) {
            $scope.selectedChannelIndex = index;
            var selectedRow = $("#livelistcontainer").children()[index],
                rowBlocks = $(selectedRow).children();
            for (var block = 0; block < rowBlocks.size(); block++) {
                if ($(rowBlocks[block]).find("#timeSpan").length > 0) {
                    var separatedTime = ($($(rowBlocks[block]).find("#timeSpan")).text()).split("-");
                    var separateStartTime = separatedTime[0].split(':'),
                        separateEndTime = separatedTime[1].split(':');
                    $scope.currTime = $scope.getCurrTime();
                    var tempDate = $filter('date')(new Date(), 'MM/dd/yyyy');
                    var currentTime = Date.parse(tempDate + ' ' + $scope.currTime);
                    var startTime = Date.parse(tempDate + ' ' + separatedTime[0]);
                    var endTime = Date.parse(tempDate + ' ' + separatedTime[1]);
                    if (currentTime >= startTime && currentTime <= endTime) {
                        if ($scope.lastSelectedProg) {
                            $scope.lastSelectedProg.removeClass("blockActive");
                        }
                        $scope.lastSelectedProg = $(rowBlocks[block]);
                        $(rowBlocks[block]).addClass("blockActive");
                        $scope.isProgramVisible = true;
                        if (!isNotFocus) {
                            selectCurrProgram(separatedTime[0]);
                        }
                        break;
                    }
                }
            }
        };
        $scope.getCurrTime = function() {
            var currentDate = new Date();
            var hours = currentDate.getHours();
            var minutes = currentDate.getMinutes();
            var seconds = currentDate.getSeconds();
            $scope.currTime = hours + ":" + minutes + ":" + seconds;
            return $scope.currTime;
        };
        $scope.LivePlayerStart = function(embedcode, title, channelId, index) {
            $scope.isFirstShow == true;
            var formattedCurrDate = $filter('date')(new Date(), 'EEEE, MMM d');
            if (typeof index == "number") {
                $scope.selectedChannelIndex = index;
                if ($scope.isProgramVisible == true && (formattedCurrDate == $scope.dateToDisplayGuide)) {
                    $scope.focusCurrentProg(index, true);
                }
            }
            var PLAYER_NAMESPACE = MPLAYER_3;
            var playerWraper = "liveshow_playerwrapper";
            $scope.videoOrlive = "live"; //used for evar11 (live or video) omniture analytics
            $scope.embCode = embedcode;
            $scope.playhead_seconds = 0;
            $scope.currentAssetTitleId = channelId;
            $scope.movie_titleORshowname_Seasonid_Episodeid = title;
            PlayerService.mainPlayer(PLAYER_NAMESPACE, playerWraper, $scope);
        };
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
        };
        $scope.showProgramTimes = function() {
            console.log("inside showProgramTimes");
            $scope.focusCurrentProg($scope.selectedChannelIndex);
        };

        function selectCurrProgram(startTime) {
            var separatedTime = startTime.split(":"),
                sepHours = parseInt(separatedTime[0]),
                sepMinutes = parseInt(separatedTime[1]);
            var hoursCount = Math.round((sepHours + (sepMinutes / 60)) * 2 * 206);
            $log.info(sepHours + " " + sepMinutes + " " + hoursCount);
            //minutesCount  = sepMinutes*Math.round(206/30);
            $scope.nextMove(hoursCount);
        }
        $scope.hideProgramTimes = function() {
            $scope.isProgramVisible = false;
            $scope.onChannelChange();
        };
        $scope.onChannelChange = function() {
            console.log("in onchannelchange");
            screenWaiting(true);
            $scope.dateToDisplayGuide = $filter('date')(new Date(), 'EEEE, MMM d');
            $scope.nextDate = new Date();
            getSegmentList(new Date());
            $scope.nextMove(0);
        };
        $scope.livelistcontainer = function() {
            return {
                'width': $rootScope.colCount
            }
        };
        $scope.nextDayMove = function() {
            console.log("nextDayMove");
            console.log($scope.button_clicked);
            screenWaiting(true);
            var dateToday = new Date();
            var valid2weeks = 14;
            dateToday.setDate(dateToday.getDate() + valid2weeks);
            $scope.nextDate = ($scope.nextDate) ? $scope.nextDate : new Date();
            var numberOfDaysToAdd = 1;
            $scope.nextDate.setDate($scope.nextDate.getDate() + numberOfDaysToAdd);
            console.log("Dates==>" + $scope.nextDate + " " + dateToday);
            if ((moment($scope.nextDate).format("YYYY/MM/DD") == moment(dateToday).format("YYYY/MM/DD")) || $scope.nextDate <= dateToday) {
                $scope.dateToDisplayGuide = $filter('date')($scope.nextDate, 'EEEE, MMM d');
                getSegmentList($scope.nextDate);
                $scope.nextMove(0);
            } else {
                $scope.nextDate.setDate($scope.nextDate.getDate() - numberOfDaysToAdd);
                screenWaiting(false);
            }
        };
        $scope.previousDayMove = function() {
            console.log("previousDayMove");
            var dateToday = new Date();
            var previousDate = ($scope.nextDate) ? $scope.nextDate : new Date();
            var numberOfDaysToSub = 1;
            previousDate.setDate(previousDate.getDate() - numberOfDaysToSub);
            console.log("Dates==>" + previousDate + " " + dateToday);
            if ((moment(previousDate).format("YYYY/MM/DD") == moment(dateToday).format("YYYY/MM/DD")) || previousDate >= dateToday) {
                $scope.dateToDisplayGuide = $filter('date')(previousDate, 'EEEE, MMM d');
                if (moment(previousDate).format("YYYY/MM/DD") == moment(dateToday).format("YYYY/MM/DD")) {
                    $scope.nextMove(0);
                    setTimeout(function() {
                        getSegmentList(previousDate, true);
                    }, 1000);
                } else {
                    screenWaiting(true);
                    getSegmentList(previousDate, false);
                }
            } else {
                previousDate.setDate(previousDate.getDate() + numberOfDaysToSub);
                screenWaiting(false);
            }
        };

        function screenWaiting(waitingParam) {
            console.log("waitingParam : " + waitingParam);
            $scope.ajaxTrackSpinnerChannel = waitingParam;
            $scope.button_clicked = waitingParam;
        }
        $scope.nextMove = function(moveDist) {
            var item = '#trackRow',
                itemContainer = ["#livelistcontainer", ".timeSlot"],
                itemsCount = $(item).children().size(),
                itemSize = $($(itemContainer[0]).children()[0]).width(),
                timeLineWidth = ($scope.mLeft == 0) ? 0 : $(".liveTimeLine").width(),
                totalWidth = (moveDist) ? moveDist : $(".liveTimeLine").width();
            for (var items = 0; items < itemContainer.length; items++) {
                var maxtotalWidth = itemSize,
                    mLeft = jQuery(itemContainer[items]).css("margin-left").replace('px', ''),
                    currentLeft = Math.abs(mLeft),
                    normalWidthAdd = Math.round(currentLeft + timeLineWidth),
                    doubleWidthAdd = Math.round(currentLeft + (2 * timeLineWidth)),
                    normalFocusWidthAdd = Math.round(currentLeft + totalWidth + timeLineWidth);
                if (typeof moveDist == "number") {
                    if (moveDist == 0) {
                        console.log("inside movedist 0");
                        jQuery(itemContainer[items]).css('margin-left', '0px');
                    } else if (normalFocusWidthAdd < maxtotalWidth) {
                        jQuery(itemContainer[items]).css('margin-left', '-=' + totalWidth + 'px');
                    } else if (normalFocusWidthAdd > maxtotalWidth) {
                        var reducedWidth = normalFocusWidthAdd - maxtotalWidth;
                        jQuery(itemContainer[items]).css('margin-left', '-=' + (totalWidth - (4 * (reducedWidth + timeLineWidth))) + 'px');
                    } else {
                        jQuery(itemContainer[items]).css('margin-left', '0px');
                    }
                } else if (normalWidthAdd < maxtotalWidth && doubleWidthAdd < maxtotalWidth) {
                    jQuery(itemContainer[items]).css('margin-left', '-=' + totalWidth + 'px');
                } else if (normalWidthAdd < maxtotalWidth && doubleWidthAdd > maxtotalWidth) {
                    var reducedWidth = doubleWidthAdd - maxtotalWidth;
                    jQuery(itemContainer[items]).css('margin-left', '-=' + (totalWidth - reducedWidth) + 'px');
                } else if (normalWidthAdd > maxtotalWidth) {
                    var reducedWidth = normalWidthAdd - maxtotalWidth;
                    jQuery(itemContainer[items]).css('margin-left', '-=-' + reducedWidth + 'px');
                } else {
                    jQuery(itemContainer[items]).css('margin-left', '0px');
                }
            }
            $scope.mLeft = currentLeft;
        }
        $scope.previousMove = function() {
            var totalWidth = $(".liveTimeLine").width(),
                itemContainer = ["#livelistcontainer", ".timeSlot"];
            for (var items = 0; items < itemContainer.length; items++) {
                var mLeft = jQuery(itemContainer[items]).css("margin-left").replace('px', '');
                if (Math.abs(mLeft) < totalWidth) {
                    jQuery(itemContainer[items]).css('margin-left', '0px');
                } else if (mLeft < 0) {
                    jQuery(itemContainer[items]).css('margin-left', '+=' + totalWidth + 'px');
                }
            }
        }
        $scope.topMove = function() {
            var itemContainer = [".liveChannelListCont", "#livelistcontainer"],
                scrollContainer = ".liveChannelList";
            for (var items = 0; items < itemContainer.length; items++) {
                var totalHeight = $(scrollContainer).height(),
                    mTop = jQuery(itemContainer[items]).css("margin-top").replace('px', '');
                if (Math.abs(mTop) < totalHeight) {
                    jQuery(itemContainer[items]).css('margin-top', '0px');
                } else if (mTop < 0) {
                    jQuery(itemContainer[items]).css('margin-top', '+=' + totalHeight + 'px');
                }
            }
        }
        $scope.downMove = function() {
                var itemContainer = [".liveChannelListCont", "#livelistcontainer"],
                    scrollContainer = ".liveChannelList";
                for (var items = 0; items < itemContainer.length; items++) {
                    var childHeight = $($(itemContainer[items]).children()[0]).height(),
                        containerItemheight = (itemContainer[items] == ".liveChannelListCont") ? childHeight + 6 : childHeight,
                        maxtotalHeight = ($(itemContainer[items]).children().size()) * containerItemheight,
                        totalHeight = $(scrollContainer).height(),
                        mTop = jQuery(itemContainer[items]).css("margin-top").replace('px', ''),
                        currentTop = Math.abs(mTop);
                    if ((currentTop + totalHeight) < maxtotalHeight) {
                        jQuery(itemContainer[items]).css('margin-top', '-=' + totalHeight + 'px');
                    }
                    // else{
                    //     totalHeight= totalHeight*(-1);
                    //     jQuery(itemContainer[items]).css('margin-top', totalHeight+'px');
                    // }
                }
            }
            //get live tracks-----------------------------------------------
            //rails related code
        $scope.railList = [];
        $scope.SetupLivePageAppgridData = function() {
            $scope.pagename = "liveList";
            $scope.pageDetails = $rootScope.getPageDetails("liveList");
            if (typeof $scope.pageDetails == 'undefined' || $scope.pageDetails == null) {
                console.log("no page id " + $scope.pagename + " in appgrid");
                return null;
            }
            if (typeof $scope.pageDetails['items'] !== 'undefined') {
                $scope.railList = contentService.updatePromotionRailCTA($scope.pageDetails['items']);
                console.log('live rail related items obj');
                console.log($scope.railList);
                $scope.VisiblerailList = [];
                $scope.LoadMoreRailItem(0, $rootScope.RailInitialLoadItemCount);
            } else {
                console.log("no rail items under page id " + $scope.pagename + " in appgrid");
            }
        }; //end of SetupLivePageAppgridData
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            updateRails();
        }); //end of $scope.$on('ngRepeatFinished'
        function updateRails() {
            $rootScope.isLoggedIn = Sessions.isLoggedIn();
            var singleAssetBaseUrl = '';
            if ($rootScope.isLoggedIn) {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, Sessions.getCookie('accessToken'), null, null, $scope.type);
            } else {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, null, null, null, $scope.type);
            }
        }
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
                    $scope.VisiblerailList.push($scope.railList[j]);
                }
            }
            console.log("Updated live VisiblerailList");
            console.log($scope.VisiblerailList);
        };
        //end of rail related code
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
    }
]);