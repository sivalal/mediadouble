/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
// Footer Controller
mdlDirectTvApp.controller('IframeCtrl', ['$scope', 'configuration', '$filter', '$rootScope', '$routeParams', 'Sessions', '$sce',
    function($scope, configuration, $filter, $rootScope, $routeParams, Sessions, $sce) {
        $rootScope.setMenuBackgroundColorWithLogo();
        $rootScope.$watch("footerNavListNewArray", function(newValue, oldValue) {
            if (typeof newValue !== 'undefined' && newValue != '') {
                var page = $routeParams['page_id'];
                var lang = Sessions.getCookie('current_language');
                if (typeof lang == 'undefined' || lang == '') {
                    lang = 'en_US';
                }
                var footerList = $rootScope.footerNavListNewArray;
                if (typeof page == 'undefined' || page == '') {} else {
                    var footerListItem = $filter('filter')(footerList, {
                        id: page
                    });
                    if (typeof footerListItem !== 'undefined' && footerListItem !== '' && typeof footerListItem[0] !== 'undefined' && typeof footerListItem[0]['externalUrls'] !== 'undefined' && footerListItem[0]['externalUrls'] !== '') {
                        // $scope.loadIframehtml();
                        $scope.iframeSrc = footerListItem[0]['externalUrls']; //footerList[order]['externalUrls'][lang];
                    } else {
                        console.log('inside else');
                        if (typeof $rootScope.appgridAssets[page] != 'undefined') {
                            $scope.iframeSrc = {};
                            $scope.iframeSrc['en_US'] = $rootScope.appgridAssets[page];
                            $scope.iframeSrc['es_ES'] = $rootScope.appgridAssets[page];
                            console.log('iframeSrc' + $scope.iframeSrc);
                        }
                    }
                }
            }
        });
        $scope.trustUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };
        //     $scope.loadIframehtml=function(){
        //         
        //         var myIframe= document.getElementById("frame1");
        //var iframeDocument = (myIframe.contentWindow || myIframe.contentDocument);
        //if (iframeDocument.document)
        //    iframeDocument = iframeDocument.document;
        // myIframe.onload = function () {
        //     console.log('on load iframe');
        //        iframeDocument.body.style.textAlign = "center";
        // }
        //         
        //         
        ////             var iframe = document.getElementById("frame1");
        ////                iframe.onload = function () {
        ////                    console.log('on load iframe');
        ////                    iframe1.document.getElementsByTagName('body')[0].style.textAlign = "center";
        ////                   // jQuery("#frame1").contents().find("head").append($("<style type='text/css'>  body{color:'#FFF';} </style>"));
        ////                }
        //      };
    }
]);
mdlDirectTvApp.controller('thirdpartyCtrl', ['$scope', '$location', 'configuration', '$filter', '$rootScope', '$routeParams', 'Sessions', '$sce',
    function($scope, $location, configuration, $filter, $rootScope, $routeParams, Sessions, $sce) {
        //get current path 
        $scope.path = $location.path();
        $rootScope.cookieSpinner = false;
        $rootScope.cookieLogOut = function() {
            $rootScope.cookieSpinner = true;
            $rootScope.logOut();
        };
    }
]);