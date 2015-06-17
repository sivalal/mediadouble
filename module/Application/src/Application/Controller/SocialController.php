<?php

/**
 * SocialController - Provides social meta tags on a static html page for social crawlers
 *                    and redirect to app for mobile request.
 *
 */
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

use Zend\View\Model\ViewModel;

class SocialController extends AbstractActionController
{

    /**
     * Default action for sharing
     */
    public function indexAction() {

        $view = $this->processRequestBasedOnQueryParams();
        $view->setTemplate('social/view');
        $this->setLayout();

        return $view;

    }

    public function processRequestBasedOnQueryParams() {

        $this->setLanguage(null);

        $titleId = $this->params()->fromQuery('titleId');

        if(isset($titleId) && strlen($titleId)>0) {
            return $this->getSingleAssetView($titleId);
        } else {
            return $this->getHomepageView();
        }

        // TODO: additional query params processing for other pages

    }

    public function getHomepageView() {

        $view;

        $socialMetaTagsData = $this->getSocialMetaTagsForHomepage();

        // Set viewModel with asset data
        $view = new ViewModel( array(
            'data' => $socialMetaTagsData,
        ));

        return $view;
    }

    public function getSingleAssetView($titleId) {

        $view;

        // Get data from backlot for the titleId passed
        $singleAssetData = $this->getSingleAssetDataByTitleId($titleId);

        if(count($singleAssetData)) {
            // Format data for social meta tags
            $socialMetaTagsData = $this->getSocialMetaTagsForSingleAssetData($singleAssetData);

            // Set viewModel with asset data
            $view = new ViewModel( array(
                'data' => $socialMetaTagsData,
            ));
        } else {
            // Set viewModel with error data
            $view = new ViewModel( array(
                'error' => 'DATA_UNAVAILABLE',
            ));
        }

        return $view;
    }

    /**
     * Get single asset data cia Backlot api call for a given titleId
     */
    public function getSingleAssetDataByTitleId($titleId) {

        $externalApiAdapter  = $this->getServiceLocator()->get('externalApi');
        $longSearchParser    = $this->getServiceLocator()->get('longSearchParser');

        $longMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService($titleId);

        if($longMetadataResp['responseStatus']!=200){
            return array();
        }

        $singleAssetData = $longSearchParser->getSingleAssetMetadata($longMetadataResp['responseContent']);
        return isset($singleAssetData[0]) && count($singleAssetData[0]>0) ? $singleAssetData[0] : $singleAssetData;
    }

    /**
     * Provide data for chosen language for social sharing meta tags from the single asset data received from Backlot api call
     */
    public function getSocialMetaTagsForSingleAssetData($singleAssetData) {

        $lang = $this->getLanguage();
        $params = '?titleId=' . $singleAssetData['titleId'] . '&lang=' . $lang;
        $sharingUrl  = 'social' . $params;

        $mobileAppConfig = $this->getMobileAppConfig();

        $arrShowTypes = array('movie' => 'movie', 'series' => 'tv_show', 'episode' => 'episode');
        $showType = isset($arrShowTypes[strtolower($singleAssetData['show_type'])]) ? $arrShowTypes[strtolower($singleAssetData['show_type'])] : 'other';

        $appgridConfig   = $this->getAppgridData();
        $webUrl = $appgridConfig['social-sharing-url'];
        if(substr($webUrl, -1)!='/') $webUrl .= '/';

        $webRedirectUrl = ($showType=='movie' ? 'movie' : 'tvShow') . $params;

        $data = array(

            'titleId' => $singleAssetData['titleId'],

            'url' => $webUrl . $sharingUrl,

            'mobile_url' => 'yaveo://' . $sharingUrl,

            'web_redirect_url' => $webUrl . $webRedirectUrl,

            'language' => $lang,

            'title' => $singleAssetData[$lang]['title_medium'],

            'social_title' => $this->getTitleForSingleAssetPost($singleAssetData),

            'description' => $singleAssetData[$lang]['summary_medium'],

            'image' => $singleAssetData['masthead'],

            'thumb' => $singleAssetData['thumbnail'],

            'show_type' => 'video.'.$showType,

            'mobile_app_config' => $mobileAppConfig,
        );

        return $data;

    }

    /**
     * Title for each kind of content
     *  EPISODE: Watch [Enter Series Title] - [Enter Season and Episode Number] on Yaveo
     *  SERIES:  Watch [Enter Series Title] on Yaveo 
     *  MOVIE:   Watch [Enter Movie Title] on Yaveo 
     *  OTHER:   Watch [Enter Asset Title] on Yaveo
     */
    public function getTitleForSingleAssetPost($singleAssetData) {

        $lang  = $this->getLanguage();
        $showType = strtolower($singleAssetData['show_type']);
        $title = $singleAssetData[$lang]['title_medium'];

        switch($showType) {

            case 'episode':
                $season = $singleAssetData['season_id'];
                $episode = $singleAssetData['episode_id'];
                return 'Watch ' . $title . ' - Season ' . $season . ' Episode ' . $episode . ' on Yaveo';
                break;

            case 'movie':
            case 'series':
            default:
                return 'Watch ' . $title . ' on Yaveo';
                break;

        }
    }

    /**
     * Provide social sharing meta tags in the chosen language for homepage
     */
    public function getSocialMetaTagsForHomepage() {

        $lang = $this->getLanguage();
        $params = '?lang=' . $lang;

        $mobileAppConfig = $this->getMobileAppConfig();
        $appgridConfig   = $this->getAppgridData();

        $webUrl = $appgridConfig['social-sharing-url'];
        if(substr($webUrl, -1)!='/') $webUrl .= '/';

        $data = array(

            'titleId' => '',

            'url' => $webUrl . $params,

            'mobile_url' => 'yaveo://' . $params,

            'web_redirect_url' => $webUrl . $params,

            'language' => $lang,

            'title' => $appgridConfig['social-sharing-site-title'][$lang],

            'description' => $appgridConfig['social-sharing-site-description'][$lang],

            'image' => $appgridConfig['social-sharing-image'][$lang],

            'thumb' => $appgridConfig['social-sharing-image'][$lang],

            'show_type' => 'website',

            'mobile_app_config' => $mobileAppConfig,
        );

        return $data;

    }

    public function getAppgridData() {
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $metadataArr = $this->appviewAdapterObj->getMetadata(true);
        $metadataArr['version']['social-sharing-image']['en_US'] = $this->appviewAdapterObj->appgridAssetUrl($metadataArr['version']['social-sharing-image']['en_US']);
        $metadataArr['version']['social-sharing-image']['es_ES'] = $this->appviewAdapterObj->appgridAssetUrl($metadataArr['version']['social-sharing-image']['es_ES']);

        return $metadataArr['version'];
    }

    public function getMobileAppConfig() {

        $config = $this->getServiceLocator()->get('Config');

        return $config['mobile_app'];

    }

    /**
     *  Set the language to English by default or provided by the query parameter
     */
    public function setLanguage($lang) {

        $languages = array('en_US', 'es_ES');

        // force set/change the language if exclusively passed as parameter
        if(isset($lang) && in_array($lang, $languages))
                $this->language = $lang;

        if(!isset($this->language))
            $this->language = $this->params()->fromQuery('lang');

        if(!isset($this->language))
            $this->language = 'en_US';
    }

    public function getLanguage() {
        if(!isset($this->language))
            $this->setLanguage(null);
        return $this->language;
    }

    /**
     * Set the layout of the page to social. If not called, the default layout will be used.
     */
    public function setLayout() {
        $this->layout()->setTemplate('social/layout');
    }

}

?>