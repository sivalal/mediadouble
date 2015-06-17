'use strict';
/*
 testService
 */
mdlDirectTvApp.service('contentService', ['configuration', '$rootScope', '$filter',
    function(configuration, $rootScope, $filter) {
        var contentServiceOBJ = this;
        contentServiceOBJ.updatePromotionRailCTA = function(railItems) {
            for (var key in railItems) {
                if (railItems[key].query == "promotion") {
                    //parse promotions str to object    
                    try {
                        railItems[key].promotion = JSON.parse(railItems[key].promotion);
                    } catch (e) {
                        console.log(e);
                    }
                    if (railItems[key].promotion.type == "dynamic_html") {
                        // store href and target based on the action
                        if (railItems[key].promotion.call_to_action.action == 'link') {
                            railItems[key].promotion.call_to_action.href = railItems[key].promotion.call_to_action.actionID;
                            railItems[key].promotion.call_to_action.target = "_blank";
                        } else if (railItems[key].promotion.call_to_action.action == 'custom') {
                            railItems[key].promotion.call_to_action.href = '/page?pageid=' + railItems[key].promotion.call_to_action.actionID;
                            railItems[key].promotion.call_to_action.target = "_self";
                        } else if (railItems[key].promotion.call_to_action.action == 'page') {
                            railItems[key].promotion.call_to_action.href = '/' + railItems[key].promotion.call_to_action.actionID;
                            railItems[key].promotion.call_to_action.target = "_self";
                        }
                        for (var promo_key in railItems[key].promotion.assets) {
                            railItems[key].promotion.assets[promo_key].imgSrc = ($rootScope.appgridAssets[railItems[key].promotion.assets[promo_key].id]).replace("https", "http");
                            // store href and target based on the action
                            if (railItems[key].promotion.assets[promo_key].action == 'link') {
                                railItems[key].promotion.assets[promo_key].href = railItems[key].promotion.assets[promo_key].actionID;
                                railItems[key].promotion.assets[promo_key].target = "_blank";
                            } else if (railItems[key].promotion.assets[promo_key].action == 'custom') {
                                railItems[key].promotion.assets[promo_key].href = '/page?pageid=' + railItems[key].promotion.assets[promo_key].actionID;
                                railItems[key].promotion.assets[promo_key].target = "_self";
                            } else if (railItems[key].promotion.assets[promo_key].action == 'page') {
                                railItems[key].promotion.assets[promo_key].href = '/' + railItems[key].promotion.assets[promo_key].actionID;
                                railItems[key].promotion.assets[promo_key].target = "_self";
                            }
                        }
                    }
                }
            }
            return railItems;
        };
        /* getContentProviderName
         * returns contentprovider and studio name based on appgrid "programmer_attribution"
         * @param {String} content_provider
         * @param {String} studio_display
         * @param {String} studio_display_es
         * @returns {String}
         */
        contentServiceOBJ.getContentProviderName = function(content_provider, studio_display, studio_display_es) {
            var programmer_attribution = $rootScope.appGridMetadata['programmer_attribution'];
            programmer_attribution = contentServiceOBJ.contentProviderAdapter(programmer_attribution);
            if (typeof programmer_attribution === 'undefined') {
                return null;
            }
            console.log('contentprovider:' + content_provider + '<:>studio_display:' + studio_display + '<:>studio_display_es:' + studio_display_es);
            if (typeof studio_display === 'undefined' || studio_display == null || studio_display == "") {
                studio_display = studio_display_es;
            }
            console.log('__contentprovider:' + content_provider + '<:>studio_display:' + studio_display + '<:>studio_display_es:' + studio_display_es);
            try {
                var networksObjArr = programmer_attribution.content_provider; //JSON.parse(programmer_attribution)['content_provider'];
                var NetworkObjArr = $filter('filter')(networksObjArr, {
                    name: content_provider
                });
                var NetworkObj = ((typeof NetworkObjArr[0] !== 'undefined') ? NetworkObjArr[0] : null);
                console.log(NetworkObj);
                if (NetworkObj == null) {
                    var resultObj = {};
                    resultObj.en_US = content_provider;
                    resultObj.es_ES = content_provider;
                    return resultObj; // content_provider is not found
                }
                if (typeof studio_display === 'undefined' || studio_display == null || studio_display == "") {
                    var resultObj = {};
                    resultObj.en_US = content_provider;
                    resultObj.es_ES = content_provider;
                    return resultObj; //show content_provider if studio_display is empty
                }
                var studio_includelist = $filter('filter')(NetworkObj.studio_includelist, studio_display);
                var studio_includelistStatus = ((typeof studio_includelist[0] !== 'undefined') ? studio_includelist[0] : null);
                console.log(studio_includelistStatus);
                if (studio_includelistStatus !== null) {
                    var resultObj = {};
                    resultObj.en_US = content_provider + ", " + studio_display;
                    if (typeof studio_display_es === 'undefined' || studio_display_es == "null" || studio_display_es == null || studio_display_es == "") {
                        resultObj.es_ES = resultObj.en_US;
                    } else {
                        resultObj.es_ES = content_provider + ", " + studio_display_es;
                    }
                    return resultObj;
                }
                var studio_excludelist = $filter('filter')(NetworkObj.studio_excludelist, studio_display);
                var studio_excludelistStatus = ((typeof studio_excludelist[0] !== 'undefined') ? studio_excludelist[0] : null);
                console.log(studio_excludelistStatus);
                if (studio_excludelistStatus !== null) {
                    var resultObj = {};
                    resultObj.en_US = content_provider;
                    resultObj.es_ES = content_provider;
                    return resultObj; //show nothing
                }
                var resultObj = {};
                resultObj.en_US = content_provider;
                resultObj.es_ES = content_provider;
                return resultObj; //if doesn't belong include and exclude list
            } catch (e) {
                console.log(e);
            }
        };
        /*
         *  console.log("getContentProviderName:-");
                   console.log(
                            contentServiceOBJ.getContentProviderName(result.popoverObj.content_provider,
                            result.popoverObj.studio_display )
              );
         */
        /*
         * testing functions
         */
        contentServiceOBJ.testgetContentProviderName = function() {
            //var programmer_attribution='{programmer_attribution: "{"content_provider":[{"name":"Univision","studio_includelist":["sony"],"studio_excludelist":["viacom"]},{"name":"Flixlatino","studio_includelist":["sony"],"studio_excludelist":["viacom"]},{"name":"HolaTV","studio_includelist":["sony"],"studio_excludelist":["viacom"]}]}" }';
            var content_provider, studio_display, studio_display_es;
            //test case 1 not in list content provider-----------
            content_provider = "unknownpro";
            studio_display = null;
            console.log("result 1:-->");
            console.log(contentServiceOBJ.getContentProviderName(content_provider, studio_display));
            //test case 2 in list content provider -----------
            content_provider = "Univision";
            studio_display = null;
            studio_display_es = null;
            console.log("result 2:-->");
            console.log(contentServiceOBJ.getContentProviderName(content_provider, studio_display, studio_display_es));
            //test case 3 studio_display in includelist  -----------
            content_provider = "OLYMPUSAT";
            studio_display = "Joy Chapman";
            studio_display_es = "Joy Chapman ES";
            console.log("result 3:-->");
            console.log(contentServiceOBJ.getContentProviderName(content_provider, studio_display, studio_display_es));
            //test case 4 studio_display in  excludelist -----------
            content_provider = "OLYMPUSAT";
            studio_display = "Alan Jonsson";
            studio_display_es = "Alan Jonsson ES";
            console.log("result 4:-->");
            console.log(contentServiceOBJ.getContentProviderName(content_provider, studio_display, studio_display_es));
        }; //end of testgetContentProviderName
        contentServiceOBJ.contentProviderAdapter = function(contentProviders) {
            console.log(contentProviders);
            var contentProvidersList = contentProviders.content_provider;
            var newContentProviderList = {};
            newContentProviderList.content_provider = [];
            for (var i = 0; i < contentProvidersList.length; i++) {
                newContentProviderList.content_provider.push(processStudioList(contentProvidersList[i]));
            }

            function processStudioList(contentProvider) {
                var contentProviderObject = {};
                contentProviderObject.name = contentProvider.name;
                contentProviderObject.studio_excludelist = [];
                contentProviderObject.studio_includelist = [];
                //studio_excludelist
                //studio_includelist
                for (var i = 0; i < contentProvider.studio_excludelist.length; i++) {
                    contentProviderObject.studio_excludelist.push(contentProvider.studio_excludelist[i].studio_name);
                }
                for (var i = 0; i < contentProvider.studio_includelist.length; i++) {
                    contentProviderObject.studio_includelist.push(contentProvider.studio_includelist[i].studio_name);
                }
                return contentProviderObject;
            };
            console.log("New List");
            console.log(newContentProviderList);
            return newContentProviderList;
        };
    }
]);