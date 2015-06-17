<?php

/**
 * SocialController - Provides social meta tags on a static html page for social crawlers
 *                    and redirect to app for mobile request.
 *
 */
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

use Zend\View\Model\ViewModel;

class HomeShareController extends AbstractActionController
{

    /**
     * Default action for sharing
     */
    public function indexAction() {

        $view = $this->processRequestBasedOnQueryParams();

        $this->setLayout();
        $view->setTemplate('homeshare/view');
    
        return $view;

    }

    public function processRequestBasedOnQueryParams() {

        $this->setLanguage(null);
        return $this->getHomepageView();
    }

    public function getHomepageView() {

         //$view;
        // Get data for home page
        $homeAssetData = $this->getSocialMetaTagsForHomePageData();
        $view = new ViewModel( array(
                'data' => $homeAssetData,
            ));
        return $view;
    }


     /**
     * Get home page data from App grid
     */
    public function getHomeMetaData() {

        // $paramsKey         = $this->params()->fromQuery('q');
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $metadataArr = $this->appviewAdapterObj->getMetadata(true);
        $appgrid_assets = $this->appviewAdapterObj->getAppAssets();

        if (isset($appgrid_assets['welcome-to-yaveo']))
            $logo = $appgrid_assets['welcome-to-yaveo'];

       if($metadataArr) {
        array_push($metadataArr["app_info"], $logo);

            return $metadataArr["app_info"] ;

        }
    }

    public function getSocialMetaTagsForHomePageData() {

        $lang = $this->getLanguage();
        $params = '?lang=' . $lang;
        $sharingUrl  = 'homeshare' . $params;

        $homeAssetData = $this->getHomeMetaData();
        $mobileAppConfig = $this->getMobileAppConfig();

        $showType = "movie";
        $webRedirectUrl = "//".$_SERVER["HTTP_HOST"];
        $protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
        $data = array(

            'url' => $protocol.$_SERVER["HTTP_HOST"]."/".$sharingUrl,

            'mobile_url' => 'yaveo://'.$sharingUrl,

            'web_redirect_url' => $webRedirectUrl,

            'language' => $lang,

            'title' => $homeAssetData['title'],

            'description' => $homeAssetData['description'],

            'image' => $homeAssetData[0],

            'thumb' =>  $homeAssetData[0],

            'show_type' => $showType,

            'mobile_app_config' => $mobileAppConfig,
        );
        return $data;

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