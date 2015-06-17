<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Directv\ImageShack\ImageShackUtility;
class TVController extends AbstractRestfulController
{
    public function clearPlayerAuthCookieAction(){
        $ondemandObj         = $this->getServiceLocator()->get('ondemand');
        $config              = $this->getServiceLocator()->get('Config');
        $pcode               =$config['general_routes']['pcode'];
        $requestUrl=OAL."/sas/revoke_embed_token/".$pcode;
        //$cookieResponse    = $ondemandObj->genericSendRequest($requestUrl, null, null, "GET");
        $response            = $this->getResponseWithHeader();
        $response->setContent(json_encode(array("cookieUrl"=>$requestUrl)));
        return $response;
        
    }
    
    //for fetching all the epiosodes,season list and embed code associated with a series
    public function getShowEpisodeListAction()
    {
        $series_id               = $this->params()->fromQuery('series_id');
        $show_type               = $this->params()->fromQuery('show_type');
        $ondemandObj             = $this->getServiceLocator()->get('ondemand');
        $externalApiObj          = $this->getServiceLocator()->get('externalApi');
        $account_token           = $externalApiObj->decryptAndGetCookie('newToken');
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $searchObj               = $this->getServiceLocator()->get('search');
        $api_result              = $ondemandObj->getEpisodeList($series_id, $show_type); //gets the list of episodes and seasons associated with a series id
        //
        
        $XDRContentArr           = $searchObj->getRailsXDRResults($account_token);
        if ($XDRContentArr['ApiResponseStatus'] == 200) {
            $XDRResponse = json_decode($XDRContentArr['response'], TRUE);
        }
        
//        print_r(json_encode($XDRResponse));
//        die();
        
        $result             = array();
        $result["episodes"] = array();
        $embed_code_list    = array();
        $season_list          = array();
        if (!empty($api_result) && !empty($api_result['hits'])) {
            $result_items         = array();
            $entitlement_contents = array();            
            if ($account_token) { //check if account token is provided (user logged in)
                $entitlementList = $searchObj->getEntitlements($account_token); //retrieve entitlement list
                if (!empty($entitlementList) && isset($entitlementList['entitlements'])) {
                    $entitlement_contents = $entitlementList['entitlements'];
                }
            }
            foreach ($api_result['hits'] as $key => $items) { //iterate the result and pass it to search API result parser
                $result_items[$key] = $searchObj->getNewAssetDetails($items);                
            }
            
            
            
            $titleEmbedCodeArr = array();
            foreach ($result_items as $key => $item) {             
                $item_details       = array();
                $showFlag           = true;
                $item_details['id'] = $item['title_id'];
                if (isset($item['episodeName'])) {
                    $item_details['episodeName'] = $item['episodeName'];
                } 
                if (isset($item['titleMedium'])) {
                    $item_details['titleMedium'] = $item['titleMedium'];
                } 
                
                if (isset($item['lang']['title'])){
                    $item_details['title'] = $item['lang']['title'];   
                }        
                if (isset($item['duration'])) {
                    $parsed   = date_parse($item['duration']);
                    $duration = ($parsed['hour'] * 60 * 60) + ($parsed['minute'] * 60) + $parsed['second'];
                    $item_details['duration'] = $duration;
                }
                
                if (isset($item['lang']))
                    $item_details['lang'] = $item['lang'];
                if (isset($item['episodeID'])) {
                    $item_details['episodeID'] = $item['episodeID'];
                }
                if (isset($item['SeasonID'])) {
                    $item_details['season_id'] = $item['SeasonID'];
                }
                if (isset($item['embed_codes_hd'])) {
                    array_push($embed_code_list, $item['embed_codes_hd']);
                            $titleEmbedCodeArr[] = array(
                                    'embed_code' => $item['embed_codes_hd'],
                                    'title_id' => $item['title_id'],
                                    'episode_number' => (isset($item['episodeID']))?$item['episodeID']:'',
                                    'season_number' => (isset($item['SeasonID']))?$item['SeasonID']:''
                                );
                } else if (isset($item['embed_codes_sd'])) {
                    array_push($embed_code_list, $item['embed_codes_sd']);
                                $titleEmbedCodeArr[] = array(
                                    'embed_code' => $item['embed_codes_sd'],
                                    'title_id' => $item['title_id'],
                                    'episode_number' => (isset($item['episodeID']))?$item['episodeID']:'',
                                    'season_number' => (isset($item['SeasonID']))?$item['SeasonID']:''
                                );
                }
                $item_details['added_to_watchlist'] = true;
                if (isset($item['showtype'])) {
                   // print_r($item['showtype']);
                    $item_details['showtype'] = $item['showtype'];
                    if ($item['showtype'] === 'Season' && isset($item['SeasonID'])) {
                        // $item_details['season_id']=$item['SeasonID'];  
                       // print_r($item['showtype']);
                        
                        $new_season = true;
                        foreach ($season_list as $season_item) {
                            if ($season_item['season_number'] == $item['SeasonID']) {
                                $new_season = false;
                                break;
                            }
                        }
                        if ($new_season === true) {
                            //print_r($item['SeasonID']);
                            array_push($season_list, array(
                                'id' => $item_details['id'],
                                'season_number' => $item['SeasonID'],
                                'added_to_watchlist' => true
                            ));
                        }
                    }  
                }
                if (!isset($item['showtype']) || $item['showtype'] != 'Episode') {
                    continue;
                }
                ////////////////////////XDR EMBEDCODE CHECK STARTS/////////////////////////

                $embedCodeArr = array();
                $item_details["playhead_seconds"] = 0;
                if (!empty($XDRResponse)) {
                    if(isset($XDRResponse['items'])) {
                        foreach ($XDRResponse['items'] as $xdrListKey => $xdrListValues) {
                            if (isset($item['embed_codes_hd'])) {
                                $embedCodeArr[] = $item['embed_codes_hd'];
                                
                                
                            } elseif(isset($item['embed_codes_sd'])) {
                                $embedCodeArr[] = $item['embed_codes_sd'];
                                
                            }
                            if(in_array($xdrListValues['embed_code'], $embedCodeArr)) {
                                $item_details["playhead_seconds"] = $xdrListValues['playhead_seconds'];
                            }
                        }
                    }
                }
                $item_details["url"] = "tvShow?titleId=" . $item_details['id'];
                $item_details["playhead_seconds"] = $item_details["playhead_seconds"];
                ////////////////////////XDR EMBEDCODE CHECK ENDS/////////////////////////////
                // $details = $ondemandObj->getDataByID($item['title_id']);
                $item_details['image']  = '/dummy/blank_image.png';
                $item_details["source"] = "tvShow";
                if ($showFlag) {
                    array_push($result["episodes"], $item_details);
                }
                
                
                $result["embed_code_list"]   = $embed_code_list;
                $result["titleEmbedCodeArr"] = $titleEmbedCodeArr;
                
            }
        }
          $result["seasons"]  = $season_list;
          if(count($result["seasons"])>1){
                usort($result["seasons"],function($a, $b) {
                        return $a['season_number'] - $b['season_number'];
                });
          }
        
        usort($result['episodes'],function ($a, $b) {
            if(!isset($a['episodeID'])){
                return 1;
            }
            if(!isset($b['episodeID'])){
                return -1;
            }
            if ($a['episodeID'] == '' && $b['episodeID'] != '') return 1;
            if ($b['episodeID'] == '' && $a['episodeID'] != '') return -1;
            if($a['episodeID']>$b['episodeID']) return 1; 
            return 0; 
        });
        
        
        if(!empty($result["episodes"])){
            $sortedSeasons=$this->array_orderby($result["episodes"], 'season_id', SORT_DESC, 'episodeID', SORT_DESC);
            $result["episodes"]=$sortedSeasons;
            
        }
        if(!empty($result["titleEmbedCodeArr"])){
        $titleEmbedCodeArrsorted = $this->array_orderby($result['titleEmbedCodeArr'], 'season_number', SORT_ASC, 'episode_number', SORT_ASC);
        $result["titleEmbedCodeArr"]=$titleEmbedCodeArrsorted;
        }
        
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($result));
        return $response;
    }
    
     function array_orderby(){
           $args = func_get_args();         
           $data = array_shift($args);           
           foreach ($args as $n => $field) {
               if (is_string($field)) {
                   $tmp = array();
                   foreach ($data as $key => $row){
                       if(isset($row[$field]))
                            $tmp[$key] = $row[$field];
                       else
                           $tmp[$key]='';
                   }
                   $args[$n] = $tmp;
               }
           }         
           $args[] = &$data;
           call_user_func_array('array_multisort', $args);
           return array_pop($args);
       }
    
    
    public function getEpisodesBySeasonIDAction(){
        $series_id        = $this->params()->fromQuery('series_id');
        $show_type        = $this->params()->fromQuery('show_type');
        $order            = $this->params()->fromQuery('order');
        $seasonNumber     = $this->params()->fromQuery('season_number');
        $searchAdapterObj = $this->getServiceLocator()->get('search');
        $externalApiObj   = $this->getServiceLocator()->get('externalApi');
        $account_token    = $externalApiObj->decryptAndGetCookie('newToken');
        $Episodes         = $searchAdapterObj->getShowEpisodes($series_id,$show_type,$seasonNumber,$order);
        $response         = $this->getResponseWithHeader();
        $response->setContent(json_encode($Episodes));
        return $response;
    }
       
      public function getPlayListAction(){
        $playList=array();   
        $config              = $this->getServiceLocator()->get('Config');
        $ondemandObj         = $this->getServiceLocator()->get('ondemand');
        $searchObj           = $this->getServiceLocator()->get('search');
        $response            = $this->getResponseWithHeader(); 
        $externalApiObj      = $this->getServiceLocator()->get('externalApi');
        $accountToken        = $externalApiObj->decryptAndGetCookie('newToken');
        $show_type="Episode,Season";
        $nextIndex=1;
        //$playListType-->'all'/'seasons'
        $playListType        = $this->params()->fromQuery('play_list_type');       
        if($playListType==='seasons'){          
            $series_id=$this->params()->fromQuery('series_id');
            $seasonNumber=$this->params()->fromQuery('season_number');
            if(isset($series_id) && isset($seasonNumber)){
             $playList=$searchObj->getShowEpisodes($series_id,$show_type,$seasonNumber,'asc'); 
             foreach ($playList as $key=>$item){
                 $item['nextIndex']=$nextIndex;
                 $playList[$key]=$item;
                 $nextIndex++;
             }
               //set the last element's nextindex to null;
                if(count($playList)>0){
                    $playList[count($playList)-1]['nextIndex']=null;
                }
            }
            $response->setContent(json_encode($playList));
            return $response;
        }
        $allWatchListAssets  = $ondemandObj->getWatchlist($accountToken);
        $result              = array();
        if($allWatchListAssets['responseStatus'] == 200) {
            if(!empty($allWatchListAssets['responseContent']['docs'])) {
                foreach( $allWatchListAssets['responseContent']['docs'] as $key => $details ){
                    $singleAsset  = $searchObj->getNewAssetDetails_Basic($details);
                    $result[]     = $singleAsset;
                }                
                foreach ($result as $item){
                    if($item['showtype']==='Season'){
                        $series_id=(isset($item['SeriesID']))?$item['SeriesID']:'';
                        $seasonNumber=(isset($item['SeasonID']))?$item['SeasonID']:'';
                        $Episodes=$searchObj->getShowEpisodes($series_id,$show_type,$seasonNumber,'asc');                      
                        if(!empty($Episodes)){
                            foreach ($Episodes as $episode){
                                $episode['nextIndex']=$nextIndex;
                                array_push($playList,$episode);
                                $nextIndex++;
                            }
                        }
                    }else{
                        $item['nextIndex']=$nextIndex;
                        array_push($playList,$item);
                        $nextIndex++;
                    }
                }
                //set the last element's nextindex to null;
                if(count($playList)>0){
                    $playList[count($playList)-1]['nextIndex']=null;
                }
                $response->setContent(json_encode($playList));
                return $response;
            } 
            $response->setStatusCode($allWatchListAssets['responseStatus'])->setContent(json_encode($allWatchListAssets['responseContent']));
            return $response;
        }else{
            $response->setStatusCode($allWatchListAssets['responseStatus'])->setContent(json_encode($allWatchListAssets['responseContent']));
            return $response;
        }
   }


  public function getResponseWithHeader(){
        $response = $this->getResponse();
        $response->getHeaders()->addHeaderLine('Access-Control-Allow-Origin', '*')->addHeaderLine('Access-Control-Allow-Methods', 'POST GET')->addHeaderLine('Content-type', 'application/json');
        
        return $response;
    }
    
}