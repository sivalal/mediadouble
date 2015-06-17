<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MovieController
 *
 * @author Asish
 */
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;

use Zend\Http\Client;
use Zend\Http\Request;
use Directv\Ooyala\OoyalaAPI;

class MovieController extends AbstractRestfulController{
    
    protected static $http = null;
     /**
     * GET method
     * @see \Zend\Mvc\Controller\AbstractRestfulController::getList()
     */
    
    


     public function getMovieAssetAction(){
        static::$http = $this->getHttpClient();
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $contentID=$this->params()->fromQuery('contentId');
        $access_token=$this->params()->fromQuery('access_token');
        $titleId= $this->params()->fromQuery('titleId');
        $details = $this->ondemandObj->getAssetDataByID($titleId);
        $res=$this->getAssetDetails($details);
        $asset= $res;
        $playerTokenResponse= $this->ondemandObj->getEmbeddedTokenUrl($contentID,$access_token);
        $embbdedUrl=$playerTokenResponse['tokens'][$contentID]['embed_token'];
        $data=array("assets"=>$asset,"embbdedUrl"=>$embbdedUrl);
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }
    
    public function getAssetData($contentID,$allAsset){
        foreach ($allAsset as $asset) {
            if($asset['contentID']===$contentID){
                return $asset;
            }
        }
    }
    
    
    public function getAssetDetails($details){
       
        $assets=array();
        if($details["found"] && $details['_source']){
            $assetrArray=$details['_source']['Assets'][1];
            if($assetrArray){
                $assets['title']="Movie Title";
                $assets['genre']=$assetrArray['Genre'];
                
                foreach ($assetrArray['LocalizableTitle'] as $localisableTitle){
                    if($localisableTitle['Language']==='en'){
                        
                        $assets['details']=$localisableTitle['SummaryShort'];
                        $assets['director']=$localisableTitle['Director'];
                        $assets['staring']=$localisableTitle['Actor'];
                        $assets['company']=$localisableTitle['StudioDisplay']; 
                    }
                }
                
                foreach($assetrArray['Rating'] as $rating){
                    if(!empty($rating)){
                        if($rating['RatingSystem']==="TV"){
                            $assets['rating']=$rating['RatingValue']; 
                        }
                        
                    }
                }
                $assets['audio']=$assetrArray['AudioType'];
               $assets['duration']=$assetrArray['Duration'];
            }
        }
        return $assets;
    }

    public function getTVAssetAction(){
        static::$http = $this->getHttpClient();
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $contentID=$this->params()->fromQuery('contentId');
        $titleId= $this->params()->fromQuery('titleId');
        $details = $this->ondemandObj->getAssetDataByID($titleId);
        $res=$this->getTVAssetDetails($details);
        $asset= $res;
        $embbdedUrl='';
        $data=array("assets"=>$asset,"embbdedUrl"=>$embbdedUrl);
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }
    
    
    
    public function getTVAssetDetails($details){
       
        $assets=array();
        if($details['_source']){
            $assetrArray=$details['_source']['Assets'][1];
            if($assetrArray){
                $assets['title']=$details['_source']["Assets"][1]["LocalizableTitle"][0]["TitleSortName"];
                $assets['label']="TV Label";
                $assets['type']="TV Type";
                
                foreach ($assetrArray['LocalizableTitle'] as $localisableTitle){
                    if($localisableTitle['Language']==='en'){
                        
                        $assets['details']=$localisableTitle['SummaryShort'];
                        $assets['director']=$localisableTitle['Director'];
                        $assets['staring']=$localisableTitle['Actor'];
                        $assets['company']=$localisableTitle['StudioDisplay']; 
                    }
                }
                
                foreach($assetrArray['Rating'] as $rating){
                    if(!empty($rating)){
                        if($rating['RatingSystem']==="TV"){
                            $assets['rating']=$rating['RatingValue']; 
                        }
                        
                    }
                }
                $assets['audio']=$assetrArray['AudioType'];
                $assets['duration']=$assetrArray['Duration'];
            }
        }
        return $assets;
    }

    public function mostPopularAction() {
        $requestPath  = $this->_config['general_routes']['movieAndTv']['most_popular'];
        echo $url          = $this->generateOoyalaApiUrlWithSignature('GET', $requestPath);
        die();


    }

    public function recommendedAction() {
        $requestPath  = $this->_config['general_routes']['movieAndTv']['recommended'];
        $url          = $this->generateOoyalaApiUrlWithSignature('GET', $requestPath);


    }

    public function generateOoyalaApiUrlWithSignature($method, $requestPath) {
        $ooyalaApiObject = new OoyalaAPI();
        $config          = $this->getServiceLocator()->get('Config');
        $apiKey          = $this->_config['ooyala']['backlot_api_key'];
        $secretKey       = $this->_config['ooyala']['backlot_secret_key'];
        $generatedUrl    = $ooyalaApiObject->generateURL($method, $apiKey, $secretKey, $this->getDataTimeTwoDaysAfter(), $requestPath, "", "");
        return $generatedUrl;
    }
     
    public function getResponseWithHeader()
    {
        $response = $this->getResponse();
        $response->getHeaders()
                 ->addHeaderLine('Access-Control-Allow-Origin','*')
                 ->addHeaderLine('Access-Control-Allow-Methods','POST GET')
                 ->addHeaderLine('Content-type', 'application/json');
        return $response;
    }

    /**
     * A utility function that return a HttpClient for API calls.
     * @return \Zend\Http\Client
     */
    protected function getHttpClient(){
        $config = array(
                'adapter'   => 'Zend\Http\Client\Adapter\Curl',
                'curloptions' => array(
                        CURLOPT_ENCODING => '',
                        CURLOPT_FOLLOWLOCATION => TRUE,
                        CURLOPT_SSL_VERIFYPEER => FALSE
                ),
        );
        return new Client('', $config);
    }

    protected function getDataTimeTwoDaysAfter() {
        $$dateTimeInStrtotime = strtotime(date('Y-m-d h:m:s', strtotime(date('Y-m-d h:m:s') .' +2 day')));
        return $dateTimeInStrtotime;
    }
    
    
}
