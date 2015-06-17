'use strict';
mdlDirectTvApp.service('SocialService', ['analyticsService', '$routeParams', '$rootScope', function(analyticsService, $routeParams, $rootScope) {
    var SocialService = {
        getShareButtons: function(linkBack, title, description, location, fbImageURL, twitterImgURL, imageurl, enableTwitterSharing, enableFacebookSharing) {
            if (typeof gigya != 'undefined' && typeof $rootScope.socializeScriptReceived != 'undefined' && $rootScope.socializeScriptReceived) {
                var userAction = new gigya.socialize.UserAction();
                userAction.setLinkBack(linkBack);
                userAction.setTitle(title);
                userAction.setDescription(description);
                userAction.setSubtitle("   ");
                var twitterImgURL, fbImageURL;
                var image_object = {
                    // src: 'http://imagizer.imageshack.us/308x173/http://directv-prod.hds.adaptive.level3.net/1jcHZ4bTphDKr6SzXQH23MY9hJyDAJZ3/promo224728621',
                    src: imageurl,
                    type: 'image'
                }
                userAction.addMediaItem(image_object);
                var facebookObj = (enableFacebookSharing) ? {
                    'provider': 'Facebook',
                    'iconImgUp': fbImageURL, // override the default icon
                    'iconImgOver': fbImageURL
                } : {};
                var twitterObj = (enableTwitterSharing) ? {
                    'provider': 'Twitter',
                    'iconImgUp': twitterImgURL,
                    'iconImgOver': twitterImgURL
                } : {};
                var shareButtons = [facebookObj, twitterObj];
                var titleId = $routeParams.titleId;
                var params = {
                    userAction: userAction,
                    shareButtons: shareButtons,
                    enabledProviders: '*,hyves,digg,aol',
                    showCounts: 'none',
                    scope: 'both',
                    privacy: 'public',
                    iconsOnly: 'true',
                    shortURLs: "Never",
                    containerID: 'shareButtons', // The ID of the <DIV> element on the page in which the plugin is displayed
                    onShareButtonClicked: function(e) {
                        analyticsService.TrackShareVideo(titleId, e.shareItem.provider);
                    }
                };
                // Show the share bar
                gigya.socialize.showShareBarUI(params);
            }
        }
    };
    return SocialService;
}]);