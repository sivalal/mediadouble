<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MovieController
 *
 */
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

use Zend\Http\Client;
use Zend\Http\Request;
use Application\Controller\OnLoginController;

class SingleAssetController extends AbstractActionController{
    
    protected static $http = null;

    public function getLiveAssetAction(){
        $ondemandObj     = $this->getServiceLocator()->get('ondemand');
        $searchObj       = $this->getServiceLocator()->get('search');
        $contentID       = $this->params()->fromQuery('contentId');
        $titleId         = "VrdjcybjoM7sFoNfOoW_b8qFy9SvhPqr";
        $externalApiObj  = $this->getServiceLocator()->get('externalApi');
        $accessToken     = $externalApiObj->decryptAndGetCookie('newToken');            
        $details         = $ondemandObj->getAssetDataByID($titleId);
        $asset           = $searchObj->getNewAssetDetails($details);
      //  $playerTokenResponse = $ondemandObj->getEmbeddedTokenUrl($contentID, $accessToken);
        $resp = $ondemandObj->getDataFromEmbeddedCode($contentID,"","");
        //$embbdedUrl          = $playerTokenResponse['tokens']['all']['embed_token'];
        $data                = array("assets"=>$asset,"embbdedUrl"=>"","contentID"=>$contentID);
        $response            = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
     
    }

     /**
     * GET method
     * @see \Zend\Mvc\Controller\AbstractRestfulController::getList()
     */
    
    public function getMovieAssetAction(){
        static::$http = $this->getHttpClient();
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $this->searchObj = $this->getServiceLocator()->get('search');
        //$contentID=$this->params()->fromQuery('contentId');
        if($this->params()->fromQuery('embed_code')){
            $embdcode = $this->params()->fromQuery('embed_code');
            $resultSet = $this->searchObj->getAssetDataByEmbdCode($embdcode);
            if(count($resultSet['Results']['Results'])>0)
               $titleId = $resultSet['Results']['Results'][0]['Title']['Id'];
        }
        else if($this->params()->fromQuery('titleId')){
            $titleId = $this->params()->fromQuery('titleId');
        }
        else{ return; }

        //if(empty($contentID)){  
            $details1 = $this->searchObj->getAssetDataByID($titleId); 
            $videoDetails=$this->searchObj->getNewAssetDetails($details1);
            
            
            if(!empty($videoDetails['embed_codes_hd'])){
               $contentID=$videoDetails['embed_codes_hd'];
            }else if(!empty($videoDetails['embed_codes_sd'])){
               $contentID=$videoDetails['embed_codes_sd']; 
            }else{
                 $contentID=$videoDetails['embed_code']; 
            }
       // }
           // $access_token=$this->params()->fromQuery('access_token');
            $uid=$this->params()->fromQuery('uid');
            $tokenResp=  $this->getAccountTokenByUserId($uid);
            if(!empty($tokenResp)){
                $access_token=$tokenResp->account_token;
            }else{
                $access_token='';
            }

            //entitlements check--------------------
            //$this->getEntitlementsAction($access_token);
            
            $details = $this->ondemandObj->getAssetDataByID($titleId);
            $asset=$this->getMovieAssetDetails($details);
            
           // $playerTokenResponse= $this->ondemandObj->getEmbeddedTokenUrl($contentID,$access_token);
            //$embbdedUrl=$playerTokenResponse['tokens'][$contentID]['embed_token'];
          //  $embbdedUrl=$playerTokenResponse['tokens']['all']['embed_token'];
            $data=array("assets"=>$asset,"embbdedUrl"=>"","contentID"=>$contentID);
            $response = $this->getResponseWithHeader();
            $response->setContent(json_encode($data));
            return $response;
     
    }
    
    public function CheckItemInXDRAction()
    {
        $externalApiObj    = $this->getServiceLocator()->get('externalApi');
        $accountToken      = $externalApiObj->decryptAndGetCookie('newToken');       
        $embed_code        = $this->params()->fromQuery('embed_code');
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $data              = $this->ondemandObj->getXDRitem($accountToken);
         $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($result));
        return $response;
    }
    
    public function watchplayerAction(){
        static::$http = $this->getHttpClient();
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $this->searchObj = $this->getServiceLocator()->get('search');
        $titleId= $this->params()->fromQuery('titleId');
        //$access_token=$this->params()->fromQuery('access_token');
        $uid=$this->params()->fromQuery('uid');
        $tokenResp=  $this->getAccountTokenByUserId($uid);
        if(!empty($tokenResp)){
            $access_token=$tokenResp->account_token;
        }else{
            $access_token='';
        }
        
        $details1 = $this->searchObj->getAssetDataByID($titleId); 
            $videoDetails=$this->searchObj->getNewAssetDetails($details1);
            
           
            
            if(!empty($videoDetails['embed_codes_hd'])){
               $contentID=$videoDetails['embed_codes_hd'];
            }else if(!empty($videoDetails['embed_codes_sd'])){
               $contentID=$videoDetails['embed_codes_sd']; 
            }else{
               $contentID=$videoDetails['embed_code']; 
            }
       // $contentID="all";    
        $playerTokenResponse= $this->ondemandObj->getEmbeddedTokenUrl($contentID,$access_token);
       // $embbdedUrl=$playerTokenResponse['tokens'][$contentID]['embed_token'];
       $embbdedUrl=$playerTokenResponse['tokens']['all']['embed_token'];
       //$embbdedUrl.="&pcode=R3ZHExOjHcfMbqoMxpYBE7PbDEyB";
        //print_r($embbdedUrl);
        //die();
        $data=array("embbdedUrl"=>$embbdedUrl,"contentID"=>$contentID);
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
            
    }
    
    public function getOptAction(){
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $embedCode         = '';
        $externalApiObj    = $this->getServiceLocator()->get('externalApi');
        $access_token      = $externalApiObj->decryptAndGetCookie('newToken');  
        //print_r($access_token);
        $playerTokenResponse= $this->ondemandObj->getEmbeddedTokenUrl($embedCode,$access_token);
        $embbdedUrl=$playerTokenResponse['tokens']['all']['embed_token'];
        //$embbdedUrl=$playerTokenResponse['tokens'][$embedCode]['embed_token'];
        $result = explode(":",$embbdedUrl);
        $protocol= $result[0];  
        if($protocol=="http"||$protocol=="https"){
          $replaceItem= $protocol."://" ;
          $reqUrl=str_replace($replaceItem,"//",$embbdedUrl);
        }else{
          $reqUrl=$embbdedUrl;
        }
        $data=array("embbdedUrl"=>$reqUrl);
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }

    




    public function getAccountTokenByUserId($userId) {
    if(empty($userId) || !isset($userId) || $userId==='null' || $userId==='undefined'){
        return NULL;
    }
    //get user details
    $userData = array(
      'userId' => $userId,
      'action' => 'userInfo'
    );
    $this->gigyaPostHandlerObj = $this->getServiceLocator()->get('gigya');
    $userObject                = json_decode($this->gigyaPostHandlerObj->postHandler($userData),TRUE);
     

    $this->_config      = $this->getServiceLocator()->get('Config');
    $this->_ondemandObj = $this->getServiceLocator()->get('ondemand');
    $pcode              = $this->_config['general_routes']['pcode'];
    $url                = OAL."/authentication/v1/providers/".$pcode."/gigya?";
    //get account token
    $postData = array(
      "uid"                => $userObject['UID'],
      "UIDSignature"       => $userObject['UIDSignature'],
      "signatureTimestamp" => $userObject['signatureTimestamp']
    );
    $responseData = json_decode($this->_ondemandObj->sendRequest($url, $postData, NULL, 'POST'));
    //$response    = $this->getResponseWithHeader();
    //$responseData = ($responseData != null) ? json_encode($responseData): null;
    //$response->setContent($responseData);
    return $responseData;
  }


    public function getAssetData($contentID,$allAsset){
        foreach ($allAsset as $asset) {
            if($asset['contentID']===$contentID){
                return $asset;
            }
        }
    }
    
    public function getEmbededCode($videoDetails){
        if(array_key_exists('Results', $videoDetails)){
            if($videoDetails['Results']['Count']>0){
                $resultsArray=$videoDetails['Results']['Results'];
                foreach ($resultsArray as $res){
                    $assets=$res['Title']['Assets'];
                    if($assets['Count']>0){ 
                       foreach ($assets['Assets'] as $val) {

                        if(!empty($val['Attributes']['Count'])){
                              foreach ($val['Attributes']['Attribute'] as $valEMB){

                                if($valEMB['Key']=='embed_code')
                                  return $valEMB['Value'][0];
                            }
                        }                           
                       }
                    }
                    break;
                }
            }
        }
        return NULL;
    }

    public function getMovieAssetDetails($details){
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        return $this->searchAdapterObj->getNewAssetDetails($details);
    }

    public function getAudioType($lang){
        if(empty($lang)){
            return '';
        }
        $languageArray=array();
        if($lang==='en'){
            array_push($languageArray, "English");
        }elseif ($lang==='es') {
            array_push($languageArray, "Spanish");
        }
        
        return implode (", ", $languageArray);
    }

    public function getTVAssetAction() {  
        $base = BASE_URL;
        $access_token=$this->params()->fromQuery('access_token');
        static::$http = $this->getHttpClient();
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $this->searchObj = $this->getServiceLocator()->get('search');
        $response = $this->getResponseWithHeader();
        if($this->params()->fromQuery('embed_code')){
            $embdcode = $this->params()->fromQuery('embed_code');
            $resultSet = $this->searchObj->getAssetDataByEmbdCode($embdcode);
            //print_r($resultSet);
            
            if(count($resultSet['Results']['Results'])>0)
               $titleId = (!empty($resultSet['Results']['Results'][0]['Title']['Id']))?$resultSet['Results']['Results'][0]['Title']['Id']:null;
        }
        else if($this->params()->fromQuery('titleId')){
            $titleId = $this->params()->fromQuery('titleId');
        }
        else{ return; }

        //if(empty($contentID)){
            
            if(empty($titleId)){
                $response->setContent(json_encode(array('assets'=>array(),'contentID'=>'')));
                return $response;
            }
           
        
            $details1 = $this->searchObj->getAssetDataByID($titleId);
            $videoDetails=$this->searchObj->getNewAssetDetails($details1);
            $qoption=array();
            $qoption['id']=$titleId;
            //print_r(json_encode($qoption));
            //die();
            $queryoptions=json_encode($qoption);
            $miniData=$this->searchObj->getRailsSearchCollectionResults(NULL, $queryoptions);
            $decodedSearchContentArr = json_decode($miniData['response'], true);
            if(!empty($miniData))
                $minidataParseRes=$this->searchObj->RailsShortCollectionResults($decodedSearchContentArr, null, array());
            
//            print_r(json_encode($minidataParseRes));
//            die();
            
            $contentID="";
            if(!empty($videoDetails['embed_codes_hd'])){
               $contentID=$videoDetails['embed_codes_hd'];
            }else if(!empty($videoDetails['embed_codes_sd'])){
               $contentID=$videoDetails['embed_codes_sd']; 
            }else if(!empty($videoDetails['embed_code'])){
                 $contentID=$videoDetails['embed_code']; 
            }
        //}
        $details = $this->ondemandObj->getAssetDataByID($titleId);
        
        $res=$this->getTVAssetDetails($details);
        
        if(!empty($minidataParseRes[0]['mastheadImage'])){
          $res['banner']=$minidataParseRes[0]['mastheadImage'];
        }else{
         $res['banner']=$base."/dummy/banner_promotion.jpg";
        }
        
        
        $asset= $res;
        $asset['showtype']=(!empty($videoDetails['showtype']))? $videoDetails['showtype']:'' ;
        $asset['series_id']=(!empty($videoDetails['SeriesID']))? $videoDetails['SeriesID']:'';
        
        
        //$playerTokenResponse= $this->ondemandObj->getEmbeddedTokenUrl($contentID,$access_token);
        //$embbdedUrl=$playerTokenResponse['tokens'][$contentID]['embed_token'];
        $data=array("assets"=>$asset,"contentID"=>$contentID);
        
        $response->setContent(json_encode($data));
        return $response;
    }
    
    public function getTVAssetDetails($details){
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        return $this->searchAdapterObj->getNewAssetDetails($details);
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
    $this->_config  = $this->getServiceLocator()->get('Config');
    $options = $this->_config['curloptions'];

        $config = array(
                'adapter'   => 'Zend\Http\Client\Adapter\Curl',
                'curloptions' => $options,
        );
        return new Client('', $config);
    }


    /*******************NEW API**************************/
    
    public function getSigleAssetMetadataAction(){
        $externalApiAdapter  = $this->getServiceLocator()->get('externalApi');
        $longSearchParser    = $this->getServiceLocator()->get('longSearchParser');
        $shortSearchParser   = $this->getServiceLocator()->get('shortSearchParser');
        $ondemandObj         = $this->getServiceLocator()->get('ondemand');
        $response            = $this->getResponseWithHeader();
        $accountToken        = $externalApiAdapter->decryptAndGetCookie('newToken'); 
        $titleId = $this->params()->fromQuery('titleId');
        $embed_code=$this->params()->fromQuery('embed_code');
        if(!empty($embed_code)&& $embed_code!=='undefined' && $embed_code!==null){
            $queryOption=array('q'=>  json_encode(array('embed_code'=>$embed_code)));
            $miniDataCallRespArr=$externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
            $titleId=$shortSearchParser->getTitleIdByEmbedCode($miniDataCallRespArr['responseContent']);
        }
        $longMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService($titleId);
        if($longMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($longMetadataResp));      
            return $response;
        }
        $singleAssetMetadata=  $longSearchParser->getSingleAssetMetadata($longMetadataResp['responseContent']);
        if(!empty($accountToken)){
            $isCheckList=$ondemandObj->checkItemExistInWatchlist($accountToken, $titleId);
            $singleAssetMetadata[0]['isExistInPlayList']=(isset($isCheckList['response']))?$isCheckList['response']:false;
        }
        $response->setContent(json_encode(current($singleAssetMetadata)));      
        return $response;
    }
    /*
     * 
     * Get the list of episodes in a series
     * 
     * 
     */
    public function getEpisodelistAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response           = $this->getResponseWithHeader();
        $series_id          = $this->params()->fromQuery('series_id');
        $account_token      = $externalApiAdapter->decryptAndGetCookie('newToken');  
        $XDRVideos=array();
        if(empty($series_id)){
           $episodeListMetadataResp=array("responseStatus"=>200,"responseContent"=>"Empty SeriesId");
           $response->setContent(json_encode($episodeListMetadataResp));      
           return $response;
        }       
        $queryoptions=array('series_id'=>$series_id,'include'=>'Episode,Season');
        $episodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series",$queryoptions);
        if($episodeListMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($episodeListMetadataResp));      
            return $response;
        }
        
        $size=(isset($episodeListMetadataResp['responseContent']['hits']['total'])?$episodeListMetadataResp['responseContent']['hits']['total']:0);
        $queryoptions=array('series_id'=>$series_id,'include'=>'Episode,Season','size'=>$size);
        $fullEpisodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series",$queryoptions);
        if($fullEpisodeListMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($fullEpisodeListMetadataResp));      
            return $response;
        } 
        if(!empty($account_token)){ //s0cXhmbjotXJc0eh-BewC6_AfBAixuSW
            $xdrqueryOption = array('account_token'=>$account_token);
            $XDRVideos      = $externalApiAdapter->constructUrlForXDRApiService('', $xdrqueryOption,"");
        }
        
        if(isset($XDRVideos['responseContent']) && $XDRVideos['responseStatus']==200 && isset($XDRVideos['responseContent']['items'])){
            /*{"responseStatus":200,"responseContent":{"items":[{"playhead_seconds":196.94,"timestamp":1412014576,"embed_code":"N5ZjNpbjoTXHVAq65v6LNlId0nMYniOy"},{"playhead_seconds":32.479,"timestamp":1412014362,"embed_code":"o0aGxnbjrEK47Pg_nmneOX9okzhwQltZ"},{"playhead_seconds":61.839,"timestamp":1412006253,"embed_code":"1rbGVobjqw9nDxwKAYKMrE9EBcsVVSNr"},{"playhead_seconds":5907.282,"timestamp":1412006116,"embed_code":"F1cHkybzoTQnaHzzziEPB2mAU__K342Z"},{"playhead_seconds":10.915,"timestamp":1412000938,"embed_code":"hkZG5wbzqQo0O_uA1hJLhJjvCiJIZ8Tz"},{"playhead_seconds":122,"timestamp":1411993883,"embed_code":"5hOWtmbjpugg6lGW7Mg1Kepk0E8bqNwS"},{"playhead_seconds":1267,"timestamp":1411993729,"embed_code":"A5OGtmbjrXOqM6vWYRpwwityJLvzjYpV"},{"playhead_seconds":75,"timestamp":1411989761,"embed_code":"YzajdkbzoPMoQswkOnaw_Mi7k1dPK3Kg"},{"playhead_seconds":0.163,"timestamp":1411988768,"embed_code":"A5NnhzbjrEe_LVjsIo7Y6QyjfxKM0Rx9"},{"playhead_seconds":5858.625,"timestamp":1411983916,"embed_code":"dqN2Zobjr-hbpN89rdcS6fL3-IiqUxQs"}],"account":"09e542cf75864b3687cbd6f81d78b5fc","provider_id":"R3ZHExOjHcfMbqoMxpYBE7PbDEyB"}}*/
            
          $episodeAssetMetadataDetails=  $longSearchParser->getSeriesEpisodesMetadata($fullEpisodeListMetadataResp['responseContent'],$XDRVideos['responseContent']['items']);    
        }else{ 
          $episodeAssetMetadataDetails=  $longSearchParser->getSeriesEpisodesMetadata($fullEpisodeListMetadataResp['responseContent']);    
        }
        $response->setContent(json_encode($episodeAssetMetadataDetails,JSON_NUMERIC_CHECK));
        return $response;
       
    }

    /*
     * 
     * Get the list of episodes in a series
     * 
     * 
     */
    public function getOPTEpisodelistAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response           = $this->getResponseWithHeader();
        $series_id          = $this->params()->fromQuery('series_id');
        //default or a valid season id
        $season_id= $this->params()->fromQuery('season_id');
        if(!isset($season_id))
          $season_id='default';
        
        $account_token      = $externalApiAdapter->decryptAndGetCookie('newToken');  
        $XDRVideos=array();
        if(empty($series_id)){
           $episodeListMetadataResp=array("responseStatus"=>200,"responseContent"=>"Empty SeriesId");
           $response->setContent(json_encode($episodeListMetadataResp));      
           return $response;
        }
       
     //get season list of a series from api    
        $season_queryoptions=array('series_id'=>$series_id,'include'=>'Season');
        $seasonListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series",$season_queryoptions);
        if($seasonListMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($seasonListMetadataResp));      
            return $response;
        }
        $seasonListMetadata=  $longSearchParser->getSeasonListDetails($seasonListMetadataResp['responseContent']);
        
    //end of get season list of a series from api        
        
        
        
    //if season is 'default'  
        if($season_id=='default'){ 
 
    $Seasonsize=(isset($seasonListMetadataResp['responseContent']['hits']['total'])?$seasonListMetadataResp['responseContent']['hits']['total']:0);    
        
    if($Seasonsize>0){
        $sortedSeasonArr=$seasonListMetadataResp['responseContent']['hits']['hits'];
        
        $sortStatus=usort(
                $sortedSeasonArr,
                function ($a, $b){

                               if(!isset($a['_source']['season_id']) || !isset($b['_source']['season_id']))
                                   return 0;
                                          
                               if ($a['_source']['season_id'] == $b['_source']['season_id'])
                                return 0;
                               return ($a['_source']['season_id'] > $b['_source']['season_id']) ? 1 : -1;
                             }
                );//end of usort function.
                        
        if($sortStatus!=FALSE){
            $season_id=isset($sortedSeasonArr[0]['_source']['season_id'])?
                           $sortedSeasonArr[0]['_source']['season_id']:
                            1;
        } else {
            $season_id=1;//if sort fails seasonid is 1.
        }

    }
    
        }// endif($season_id=='default')
   
        $SizeCheckqueryoptions=array('series_id'=>$series_id,'season_id'=>$season_id,'include'=>'Episode','size'=>0);
        $SizeCheckepisodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series",$SizeCheckqueryoptions);
        if($SizeCheckepisodeListMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($SizeCheckepisodeListMetadataResp));      
            return $response;
        }   
              
        $size=(isset($SizeCheckepisodeListMetadataResp['responseContent']['hits']['total'])?$SizeCheckepisodeListMetadataResp['responseContent']['hits']['total']:0);
        $queryoptions=array('series_id'=>$series_id,'season_id'=>$season_id,'include'=>'Episode','size'=>$size);
        $fullEpisodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series",$queryoptions);
        if($fullEpisodeListMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($fullEpisodeListMetadataResp));      
            return $response;
        } 
        if(!empty($account_token)){ 
            $xdrqueryOption = array('account_token'=>$account_token);
            $XDRVideos      = $externalApiAdapter->constructUrlForXDRApiService('', $xdrqueryOption,"");
        }
        
        if(isset($XDRVideos['responseContent']) && $XDRVideos['responseStatus']==200 && isset($XDRVideos['responseContent']['items'])){
            /*{"responseStatus":200,"responseContent":{"items":[{"playhead_seconds":196.94,"timestamp":1412014576,"embed_code":"N5ZjNpbjoTXHVAq65v6LNlId0nMYniOy"},{"playhead_seconds":32.479,"timestamp":1412014362,"embed_code":"o0aGxnbjrEK47Pg_nmneOX9okzhwQltZ"},{"playhead_seconds":61.839,"timestamp":1412006253,"embed_code":"1rbGVobjqw9nDxwKAYKMrE9EBcsVVSNr"},{"playhead_seconds":5907.282,"timestamp":1412006116,"embed_code":"F1cHkybzoTQnaHzzziEPB2mAU__K342Z"},{"playhead_seconds":10.915,"timestamp":1412000938,"embed_code":"hkZG5wbzqQo0O_uA1hJLhJjvCiJIZ8Tz"},{"playhead_seconds":122,"timestamp":1411993883,"embed_code":"5hOWtmbjpugg6lGW7Mg1Kepk0E8bqNwS"},{"playhead_seconds":1267,"timestamp":1411993729,"embed_code":"A5OGtmbjrXOqM6vWYRpwwityJLvzjYpV"},{"playhead_seconds":75,"timestamp":1411989761,"embed_code":"YzajdkbzoPMoQswkOnaw_Mi7k1dPK3Kg"},{"playhead_seconds":0.163,"timestamp":1411988768,"embed_code":"A5NnhzbjrEe_LVjsIo7Y6QyjfxKM0Rx9"},{"playhead_seconds":5858.625,"timestamp":1411983916,"embed_code":"dqN2Zobjr-hbpN89rdcS6fL3-IiqUxQs"}],"account":"09e542cf75864b3687cbd6f81d78b5fc","provider_id":"R3ZHExOjHcfMbqoMxpYBE7PbDEyB"}}*/
            
          $episodeAssetMetadataDetails=  $longSearchParser->getEpisodeListofaSeasonMetadata($fullEpisodeListMetadataResp['responseContent'],$XDRVideos['responseContent']['items']);    
        }else{ 
          $episodeAssetMetadataDetails=  $longSearchParser->getEpisodeListofaSeasonMetadata($fullEpisodeListMetadataResp['responseContent']);    
        }
      
   $seriesEpisodes=array('seasons'=>$seasonListMetadata,'episodes'=>$episodeAssetMetadataDetails);
        
        $response->setContent(json_encode($seriesEpisodes,JSON_NUMERIC_CHECK));
        return $response;
       
    }    
        
    
    
    /*
     * 
     * Get the list of episodes without seaonslist
     *  where season_id is mandatory
     * 
     * 
     * 
     */
    public function getOPTEpisodelistOnlyAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response           = $this->getResponseWithHeader();
        $series_id          = $this->params()->fromQuery('series_id');
        //default or a valid season id
        $season_id= $this->params()->fromQuery('season_id');
        
        $account_token      = $externalApiAdapter->decryptAndGetCookie('newToken');  
        $XDRVideos=array();
        if(empty($series_id)){
           $episodeListMetadataResp=array("responseStatus"=>200,"responseContent"=>"Empty SeriesId");
           $response->setContent(json_encode($episodeListMetadataResp));      
           return $response;
        }
  
   
        $SizeCheckqueryoptions=array('series_id'=>$series_id,'season_id'=>$season_id,'include'=>'Episode','size'=>0);
        $SizeCheckepisodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series",$SizeCheckqueryoptions);
        if($SizeCheckepisodeListMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($SizeCheckepisodeListMetadataResp));      
            return $response;
        }   
              
        $size=(isset($SizeCheckepisodeListMetadataResp['responseContent']['hits']['total'])?$SizeCheckepisodeListMetadataResp['responseContent']['hits']['total']:0);
        $queryoptions=array('series_id'=>$series_id,'season_id'=>$season_id,'include'=>'Episode','size'=>$size);
        $fullEpisodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series",$queryoptions);
        if($fullEpisodeListMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($fullEpisodeListMetadataResp));      
            return $response;
        } 
        if(!empty($account_token)){ 
            $xdrqueryOption = array('account_token'=>$account_token);
            $XDRVideos      = $externalApiAdapter->constructUrlForXDRApiService('', $xdrqueryOption,"");
        }
        
        if(isset($XDRVideos['responseContent']) && $XDRVideos['responseStatus']==200 && isset($XDRVideos['responseContent']['items'])){
            /*{"responseStatus":200,"responseContent":{"items":[{"playhead_seconds":196.94,"timestamp":1412014576,"embed_code":"N5ZjNpbjoTXHVAq65v6LNlId0nMYniOy"},{"playhead_seconds":32.479,"timestamp":1412014362,"embed_code":"o0aGxnbjrEK47Pg_nmneOX9okzhwQltZ"},{"playhead_seconds":61.839,"timestamp":1412006253,"embed_code":"1rbGVobjqw9nDxwKAYKMrE9EBcsVVSNr"},{"playhead_seconds":5907.282,"timestamp":1412006116,"embed_code":"F1cHkybzoTQnaHzzziEPB2mAU__K342Z"},{"playhead_seconds":10.915,"timestamp":1412000938,"embed_code":"hkZG5wbzqQo0O_uA1hJLhJjvCiJIZ8Tz"},{"playhead_seconds":122,"timestamp":1411993883,"embed_code":"5hOWtmbjpugg6lGW7Mg1Kepk0E8bqNwS"},{"playhead_seconds":1267,"timestamp":1411993729,"embed_code":"A5OGtmbjrXOqM6vWYRpwwityJLvzjYpV"},{"playhead_seconds":75,"timestamp":1411989761,"embed_code":"YzajdkbzoPMoQswkOnaw_Mi7k1dPK3Kg"},{"playhead_seconds":0.163,"timestamp":1411988768,"embed_code":"A5NnhzbjrEe_LVjsIo7Y6QyjfxKM0Rx9"},{"playhead_seconds":5858.625,"timestamp":1411983916,"embed_code":"dqN2Zobjr-hbpN89rdcS6fL3-IiqUxQs"}],"account":"09e542cf75864b3687cbd6f81d78b5fc","provider_id":"R3ZHExOjHcfMbqoMxpYBE7PbDEyB"}}*/
            
          $episodeAssetMetadataDetails=  $longSearchParser->getEpisodeListofaSeasonMetadata($fullEpisodeListMetadataResp['responseContent'],$XDRVideos['responseContent']['items']);    
        }else{ 
          $episodeAssetMetadataDetails=  $longSearchParser->getEpisodeListofaSeasonMetadata($fullEpisodeListMetadataResp['responseContent']);    
        }
      
   $seriesEpisodes=array('episodes'=>$episodeAssetMetadataDetails);
        
        $response->setContent(json_encode($seriesEpisodes,JSON_NUMERIC_CHECK));
        return $response;
       
    }
    
    /*
     * Discovery call- Similar Assets for both 
     * TV and Movies
     * 
     */
    
    public function getSimilarAssetsAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser  = $this->getServiceLocator()->get('shortSearchParser');
        $response           = $this->getResponseWithHeader();
        $embedCode          = $this->params()->fromQuery('embed_code');
        $assetType          = $this->params()->fromQuery('assetType');
        $accountToken       = $externalApiAdapter->decryptAndGetCookie('newToken');  
        if(empty($embedCode)){
           $episodeListMetadataResp=array("responseStatus"=>200,"responseContent"=>"Empty EmbedCode");
           $response->setContent(json_encode($episodeListMetadataResp));      
           return $response;
        }
        $discoveryResult=$externalApiAdapter->constructUrlForDiscoverySearchSimilarApiService($embedCode);
        if($discoveryResult['responseStatus']!=200){
            $response->setContent(json_encode($discoveryResult));      
            return $response;
        } 
        $embedCodes=$shortSearchParser->getEmbedCodesFromSimilarDiscoveryCall($discoveryResult['responseContent']['results']);
        //$embedCodes=array('k5ZWtmbjpIRUddnNtonfkPiWIehJZWGM','MzMTRpbjracnBeTK3x45Ujp43MXlXoY8');
        $queryOption=array('embed_code'=>$embedCodes);
        if(isset($assetType) && !empty($assetType)){
            $typesOfAsset=  json_decode($assetType,TRUE);
            $types=$typesOfAsset['types'];
            $queryOption['types']=$types;
        }
        if(isset($accountToken)&&!empty($accountToken)){       
            $queryOption['tiers']=  $this->getTiers($accountToken);
        }
        $shortMetadata=$externalApiAdapter->basicShortSearchAndCallApiService($queryOption);
        if($shortMetadata['responseStatus']!=200){
            $response->setContent(json_encode($shortMetadata));      
            return $response;
        } 
        $similarData=$shortSearchParser->shortCallData($shortMetadata['responseContent']); 
        if(!empty($similarData)){
        $similarRailAssets['thumblistCarouselOneArr']=$shortSearchParser->shortCallData($shortMetadata['responseContent']); 
        }else{
            $similarRailAssets=array("error"=>"warning");
        }
        $response->setContent(json_encode($similarRailAssets));      
        return $response;
        
    }
    
    /*
     * gets entitlements array
     */
    public function getTiers($accountToken){
        $EntitlementList=array();
        if(empty($accountToken)){
            return $EntitlementList;
        } 
        $tierStr=  $this->getTiersQueryStr();
        if(empty($tierStr)){
            return $EntitlementList;
        }
        $tierJsonStr="{".$tierStr."}";
        $tObj=  json_decode($tierJsonStr,true);
        $EntitlementList=$tObj["tiers"];
        return $EntitlementList;
    }
    /*
     * gets entitlements and create tiers querystr
     */
    public function getTiersQueryStr($l=0){
        $tiersqueryoptions = ''; //'"tiers":[]';
        $externalApiObj        = $this->getServiceLocator()->get('externalApi');
        $tiersqueryoptions = $externalApiObj->decryptAndGetCookie('entitlement_list');

        if(isset($tiersqueryoptions) && !empty($tiersqueryoptions)) {
            return $tiersqueryoptions;
        } else {
            $config            = $this->getServiceLocator()->get('Config');
            $entitlementRoute  = $config['general_routes']['vindicia']['entitlements'];
            $url               = OAL.$entitlementRoute;
            $accountToken      = $externalApiObj->decryptAndGetCookie('newToken');
            $params            = array("account_token" => $accountToken);
            $entitlementList   = $externalApiObj->callHttpUtilityService($url, $params);
            if($entitlementList['responseStatus'] == 200) {
              if(!empty($entitlementList['responseContent']['entitlements'])) {
                $list              = array();
                $tiersqueryoptions = '';
                foreach($entitlementList['responseContent']['entitlements'] as $entitlementIds) {
                    $list[] = $entitlementIds['id'];
                }
                if(!empty($list)) {
                  $tiersqueryoptions = '"tiers":["'.implode('","',$list).'"]';
                  $externalApiObj->encryptAndSetCookie('entitlement_list', $tiersqueryoptions);
                  if($l==0){
                    $this->getTiersQueryStr(1);
                  } else {
                    return "";//to prevent infinite recursion  
                  }
                }
              }
            }
        }
    }    
    /*
     * Discover API- Recommended/Most Popular , both
     * TV and Movie Assets
     * 
     * For Recommended window=day
     * For Most Popular window=month
     * 
     * long metadata api call
     * 
     * 
     */
    public function getDiscoveryAssetsAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response           = $this->getResponseWithHeader();
        $window             = $this->params()->fromQuery('window');
        $show_type          = $this->params()->fromQuery('show_type');
        $accountToken       = $externalApiAdapter->decryptAndGetCookie('newToken');  
        
        if(empty($window) && empty($show_type)){
           $episodeListMetadataResp=array("responseStatus"=>200,"responseContent"=>"Empty window or show type.");
           $response->setContent(json_encode($episodeListMetadataResp));      
           return $response;
        }
        $queryOptionDiscovery=array('window'=>$window,'show_type'=>$show_type);
        $discoveryResult=$externalApiAdapter->constructUrlForDiscoverySearchApiService('', $queryOptionDiscovery,"");
        if($discoveryResult['responseStatus']!=200){
            $response->setContent(json_encode($discoveryResult));      
            return $response;
        }      
        $allAssetTitleIds=$longSearchParser->getAllTitleIdsFromLongCall($discoveryResult['responseContent']);
        $queryOption=array('ids'=>$allAssetTitleIds);
        $longMetaData=$externalApiAdapter->constructUrlForLongSearchAndCallApiService('', $queryOption,'');
        
        if($longMetaData['responseStatus']!=200){
            $response->setContent(json_encode($longMetaData));      
            return $response;
        } 
        $tiers=array();
        if(isset($accountToken)&&!empty($accountToken)){       
            $tiers=  $this->getTiers($accountToken);
        }
        
        $railAssets=$longSearchParser->getRailsMetadataFormLong($longMetaData['responseContent'],$tiers);
        $response->setContent(json_encode($railAssets));      
        return $response; 
    }
    /**
     * 
     * @return type
     * 
     * Discovery call -with short-mini api call.
     * For Recommended window=day
     * For Most Popular window=month
     * 
     */
    
    public function getDiscoveryAssetsShortAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser  = $this->getServiceLocator()->get('shortSearchParser');
        $response           = $this->getResponseWithHeader();
        $window             = $this->params()->fromQuery('window');
        $show_type          = $this->params()->fromQuery('show_type');
        $limit              = $this->params()->fromQuery('limit');
        $accountToken       = $externalApiAdapter->decryptAndGetCookie('newToken');
        if(empty($window) && empty($show_type)){
           $episodeListMetadataResp=array("responseStatus"=>200,"responseContent"=>"Empty window or show type.");
           $response->setContent(json_encode($episodeListMetadataResp));      
           return $response;
        }
        $queryOptionDiscovery=array('window'=>$window,'show_type'=>$show_type,'limit'=>$limit);
        $discoveryResult=$externalApiAdapter->constructUrlForDiscoverySearchApiService('', $queryOptionDiscovery,"");
        if($discoveryResult['responseStatus']!=200){
            $response->setContent(json_encode($discoveryResult));      
            return $response;
        } 
        $miniIds = array();
        foreach ($discoveryResult['responseContent']['results'] as $data){
            if(!isset($data['id'])){
                continue;
            }
            $miniIds[] = $data['id'];
        }

        $queryOption['id']=$miniIds;
        if(isset($accountToken)&&!empty($accountToken)){       
            $queryOption['tiers']=  $this->getTiers($accountToken);
        }
        $shortResponse=$externalApiAdapter->basicShortSearchAndCallApiService($queryOption);

        $miniDataResponseArray=array();
        if($shortResponse['responseStatus']==200){
            if(isset($shortResponse['responseContent']['Results']['Results'])&& !empty($shortResponse['responseContent']['Results']['Results'])){
                $miniDataResponseArray = $shortResponse['responseContent']['Results']['Results'];
            }
        }

        $customMiniResponse['Results']['Count']=  count($miniDataResponseArray);
        $customMiniResponse['Results']['Results']=$miniDataResponseArray;
        $parsedResponse=$shortSearchParser->shortCallData($customMiniResponse);
        if (empty($parsedResponse)) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $parsedResponse
            );
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        if(!empty($parsedResponse)){
         $discoveryRails['thumblistCarouselOneArr']=$parsedResponse;
        }else{
          $discoveryRails['warning']="no data from api";  
        }
        $response->setContent(json_encode($discoveryRails));      
        return $response;
    }
    
    public function getDiscoveryItemsAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response           = $this->getResponseWithHeader();
        $window             = $this->params()->fromQuery('window');
        $show_type          = $this->params()->fromQuery('show_type');
        $limit          = $this->params()->fromQuery('limit');
        $discoveryAssets['thumblistCarouselOneArr']=array();
        if(empty($window) && empty($show_type)){
           $episodeListMetadataResp=array("responseStatus"=>200,"responseContent"=>"Empty window or show type.");
           $response->setContent(json_encode($episodeListMetadataResp));      
           return $response;
        }
        $queryOptionDiscovery=array('window'=>$window,'show_type'=>$show_type,'limit'=>$limit);
        $discoveryResult=$externalApiAdapter->constructUrlForDiscoverySearchApiService('', $queryOptionDiscovery,"");
       
        
        if($discoveryResult['responseStatus']!=200){
            $response->setContent(json_encode($discoveryResult));      
            return $response;
        } 
        if(!empty($discoveryResult['responseContent']) && isset($discoveryResult['responseContent']['results'])){
            foreach ($discoveryResult['responseContent']['results'] as $item){
                $assets=array();
                $assets['id']=$item['id'];
                //$assets['title']=  $this->getTitlNameFromDiscovery($item['localized_names']);
                $assets['show_type']=$item['show_type'];
                $assets['imagePath']='';
                $assets['source']=$longSearchParser->GetSingleAssetPageType($item['show_type']);
                array_push($discoveryAssets['thumblistCarouselOneArr'],$assets);
            }
        }
        $response->setContent(json_encode($discoveryAssets));      
        return $response;
        //source,id,imagePath,title
    }
    
    
    public function getDiscoveryPersonalItemsAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser  = $this->getServiceLocator()->get('shortSearchParser');
        $response           = $this->getResponseWithHeader();
        $accountToken       =$externalApiAdapter->decryptAndGetCookie('newToken');
        $uuid               = $this->params()->fromQuery('uuid');
        $limit              = $this->params()->fromQuery('limit');
        $personalRailAssets['thumblistCarouselOneArr']=array();
        $queryOptionDiscovery=array();
        if(empty($uuid)){
           $episodeListMetadataResp=array("responseStatus"=>200,"responseContent"=>"Empty uuid.");
           $response->setContent(json_encode($episodeListMetadataResp));      
           return $response;
        }
        if(isset($limit)){
            $queryOptionDiscovery=array('limit'=>$limit);
        }
        $discoveryResult=$externalApiAdapter->constructUrlForDiscoveryPersonalApiService($uuid, $queryOptionDiscovery);       
        if($discoveryResult['responseStatus']!=200){
            $response->setContent(json_encode($discoveryResult));      
            return $response;
        } 
        if(empty($discoveryResult['responseContent']) || !isset($discoveryResult['responseContent']['results'])){
            $response->setContent(json_encode($discoveryResult));      
            return $response;
        }      
        $embedCodes=$shortSearchParser->getEmbedCodesFromSimilarDiscoveryCall($discoveryResult['responseContent']['results']);
        $queryOption=array('embed_code'=>$embedCodes);              
        if(isset($accountToken)&&!empty($accountToken)){       
            $queryOption['tiers']=  $this->getTiers($accountToken);
        }
        $shortMetadata=$externalApiAdapter->basicShortSearchAndCallApiService($queryOption);
        if($shortMetadata['responseStatus']!=200){
            $response->setContent(json_encode($shortMetadata));      
            return $response;
        } 
        $personalData=$shortSearchParser->shortCallData($shortMetadata['responseContent']); 
        if(!empty($personalData)){
            $personalRailAssets['thumblistCarouselOneArr']=$personalData;
        }else{
            $personalRailAssets=array("error"=>"warning");
        }
        $response->setContent(json_encode($personalRailAssets));      
        return $response; 
    }


//    public function getTitlNameFromDiscovery($localized_names){
//        $titles=array();      
//        $localized_names=array(array('language'=>'en','name'=>'showname;s01 ep02'),
//            array('language'=>'es','name'=>'showname_es;s01 ep02'));
//        
//       
//        if(isset($localized_names)&& !empty($localized_names)){
//            foreach($localized_names as $title){
//                if($title['language']=='en'){
//                    $splitTitle=explode(';',$title['name']);
//                    $titles['en_US']['title_name']=$title['name'];
//                    $titles['en_US']['title_showname']=(isset($splitTitle[0])?$splitTitle[0]:'');
//                    $titles['en_US']['title_season_episode']=(isset($splitTitle[1])?$splitTitle[1]:'');
//                }else{
//                    $titles['en_US']['title_name']='';
//                    $titles['en_US']['title_showname']='';
//                    $titles['en_US']['title_season_episode']='';
//                }
//                if($title['language']=='es'){
//                    $splitTitle=explode(';',$title['name']);
//                    $titles['es_ES']['title_name']=$title['name'];
//                    $titles['es_ES']['title_showname']=(isset($splitTitle[0])?$splitTitle[0]:'');
//                    $titles['es_ES']['title_season_episode']=(isset($splitTitle[1])?$splitTitle[1]:'');
//                }else{
//                    $titles['es_ES']['title_name']='';
//                    $titles['es_ES']['title_showname']='';
//                    $titles['es_ES']['title_season_episode']='';
//                }            
//            }
//        }
//        return $titles;
//    }
    
}
