/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
/* Movie Sigle Asset Controller */
mdlDirectTvApp.controller('WelcomeCtrl', ['$scope', '$filter', '$sce', 'Sessions', 'railService', 'contentService', '$http', '$routeParams', '$rootScope', 'SocialService', '$location', 'configuration', 'CookieService', 'analyticsService',
    function($scope, $filter, $sce, Sessions, railService, contentService, $http, $routeParams, $rootScope, SocialService, $location, configuration, CookieService, analyticsService) {
        //omniture call
        analyticsService.TrackCustomPageLoad('signup:welcome');
        $scope.pagename = 'welcome';
        /*Appgid Asset Watch*/
        $rootScope.$watch('[appGridMetadata,appgridAssets]', function(newValue, oldValue) {
            if (newValue[0] != '' && newValue[1]) {
                var appgridData = $rootScope.appGridMetadata;
                $scope.pageDetails = $rootScope.getPageDetails($scope.pagename);
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    if (typeof $scope.pageDetails['custom-region'] !== 'undefined') {
                        $scope.AppcustomSections = $scope.processCustomSections($scope.pageDetails['custom-region']);
                        console.log("app custom");
                        console.log($scope.AppcustomSections);
                        $scope.yaveoImage = $rootScope.appgridAssets['yaveo_image'];
                    }
                }
                var appAssets = $rootScope.appgridAssets;
                console.log(appAssets);
                //SocialService.getShareButtons(configuration.server_url, $rootScope.appInfo.title, $rootScope.appInfo.description, "Home", "dummy/icon/w_share_fb.png", "dummy/icon/w_share_twitter.png", $rootScope.logoweb, $rootScope.enableTwitterSharing, $rootScope.enableFacebookSharing);
                $scope.socialShareUrl = configuration.server_url + "/homeshare";
            }
            if (newValue[1] != '') {}
        }, true);
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
        $rootScope.$watch("[userSubscribedPackages,packagesReady]", function(val) {
            console.log("#*#---#*# obje structure");
            console.log(val);
            if ((val[0] == '' || val[0] == 'undefined') || (val[1] == 'undefined' || val[1] == false)) {
                return null; //userSubscribedPackages has to be objectsArray,
                //packagesReady has to be true
            }
            console.log("userSubscribedPackagesObj:--->");
            console.log($rootScope.userSubscribedPackages);
            var PromoCOde = ""; //tobe set
            analyticsService.TrackSignup($rootScope.userSubscribedPackages, PromoCOde);
        }, true);
        $scope.trustUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }
]);