<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class WatchListController extends AbstractActionController
{
    public function getListAction(){
        $config              = $this->getServiceLocator()->get('Config');
        $externalApiAdapter  = $this->getServiceLocator()->get('externalApi');
        $longSearchParser    = $this->getServiceLocator()->get('longSearchParser');
        $accountToken        = $externalApiAdapter->decryptAndGetCookie('newToken');
        $params              = array("account_token" => $accountToken);
        $watchlistResult     = $externalApiAdapter->watchlistCallOnDemand('get', $params);
        $watchlistContent    = array();
        $nextIndex           = 1;
        if($watchlistResult['responseStatus'] == 200) {
            if(!empty($watchlistResult['responseContent'])) {
                $parsedResponse = $longSearchParser->LongCallDataArr($watchlistResult['responseContent']);
                $parsedContent  = $longSearchParser->longMetadataParser($parsedResponse);
                if(!empty($parsedContent)) {
                	$parsedContent      = $longSearchParser->array_orderby($parsedContent, 'showtype', SORT_ASC, 'seriesId', SORT_ASC, 'seasonId', SORT_ASC, 'episodeId', SORT_ASC);
                    foreach ($parsedContent as $key => $value) {
                        $showType = ($value['showtype'] == 'Episode' || $value['showtype'] == 'Season' || $value['showtype'] == 'Series') ? 'tvShow' : 'movie';
                        $titleMediumUS = isset($value['title_medium']['en_US']) ? $value['title_medium']['en_US'] : '';
                        $titleMediumES = isset($value['title_medium']['es_ES']) ? $value['title_medium']['es_ES'] : '';
                        $value['title_medium']['en_US'] = !empty($titleMediumUS) ? $titleMediumUS : $titleMediumES;
                        $value['title_medium']['es_ES'] = !empty($titleMediumES) ? $titleMediumES : $titleMediumUS;
                        if($showType == 'tvShow') {
                            $watchlistContent[$showType][$value['seriesId']]['title_medium']['en_US'] = $value['title_medium']['en_US'];
                            $watchlistContent[$showType][$value['seriesId']]['title_medium']['es_ES'] = $value['title_medium']['es_ES'];
                            $watchlistContent[$showType][$value['seriesId']]['id']                    = isset($value['id']) ? $value['id'] : '';
                            $watchlistContent[$showType][$value['seriesId']]['imagePath']             = isset($value['imagePath']) ? $value['imagePath'] : '';
                            $watchlistContent[$showType][$value['seriesId']]['showtype']              = isset($value['showtype']) ? $value['showtype'] : '';
                            $watchlistContent[$showType][$value['seriesId']]['seriesId']              = isset($value['seriesId']) ? $value['seriesId'] : '';
                            $watchlistContent[$showType][$value['seriesId']]['seasonId']              = isset($value['seasonId']) ? $value['seasonId'] : '';
                            $watchlistContent[$showType][$value['seriesId']]['episodeId']             = isset($value['episodeId']) ? $value['episodeId'] : '';
                            $watchlistContent[$showType][$value['seriesId']]['contentID']             = isset($value['contentID']) ? $value['contentID'] : '';
                            $watchlistContent[$showType][$value['seriesId']]['tiers']                 = isset($value['tiers']) ? $value['tiers'] : '';
                            $watchlistContent[$showType][$value['seriesId']]['isExpired']             = isset($value['isExpired']) ? $value['isExpired'] : 'available';
                            $watchlistContent[$showType][$value['seriesId']]['expiration_days_left']  = isset($value['expiration_days_left']) ? $value['expiration_days_left'] : '';
                            if($value['showtype'] == 'Episode')  {
                                $value['nextIndex']              = $nextIndex;
                                $value['isExistInWatchlistItem'] = true;
                                $value['source']    ='tvShow';
                                if(isset($value['seasonId']) && !empty($value['seasonId'])) {
                                    $watchlistContent[$showType][$value['seriesId']]['episode'][$value['seasonId']][]  = $value;
                                    $watchlistContent[$showType][$value['seriesId']]['episodeIdsList'][]               = $value['id'];

                                } else {
                                    $watchlistContent[$showType][$value['seriesId']]['episode'][]    = $value;    
                                }
                                $nextIndex++;

                            } elseif($value['showtype'] == 'Season') {
                                $watchlistContent[$showType][$value['seriesId']]['season'][]            = $value;
                                $watchlistContent[$showType][$value['seriesId']]['seasonNumbersList'][] = $value['seasonId'];
                                $watchlistContent[$showType][$value['seriesId']]['seasonIdsList'][]     = $value['id'];
                            }
                        } else {
                            $watchlistContent[$showType][] = $value;   
                        }
                    }
                }
            }
        } else {
            $watchlistContent = $watchlistResult['responseContent'];
        }
        $response = $this->getResponseWithHeader();
        $response->setStatusCode($watchlistResult['responseStatus'])->setContent(json_encode($watchlistContent));
        return $response;
    }

    public function getEpisodeListAction(){
        $seriesData         = $this->fromJson();
        $seriesId           = $seriesData['seriesId'];
        $seasonNumbersList  = isset($seriesData['seasonNumbersList']) ? $seriesData['seasonNumbersList'] : array();
        $episodeIdsList     = isset($seriesData['episodeIdsList']) ? $seriesData['episodeIdsList'] : array();
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $accountToken        = $externalApiAdapter->decryptAndGetCookie('newToken');
        $response           = $this->getResponseWithHeader();
        $episodeContent     = array();
        if(!empty($seriesId)) {
            $queryoptions            = array('series_id'=>$seriesId,'include'=>'Episode,Season', 'size'=>0);
            $episodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series", $queryoptions);
            if($episodeListMetadataResp['responseStatus'] == 200) {
                $size = (isset($episodeListMetadataResp['responseContent']['hits']['total'])?$episodeListMetadataResp['responseContent']['hits']['total']:0);
                $queryoptions                = array('series_id'=>$seriesId,'include'=>'Episode,Season','size'=>$size);
                $fullEpisodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series", $queryoptions);
                if($fullEpisodeListMetadataResp['responseStatus'] == 200){
                    $parsedEpisodelistResponse = $longSearchParser->LongCallDataArr($fullEpisodeListMetadataResp['responseContent']);
                    $parsedContent             = $longSearchParser->longMetadataParser($parsedEpisodelistResponse);
                    if(!empty($parsedContent) && isset($seasonNumbersList) && !empty($seasonNumbersList)) {
                        foreach ($seasonNumbersList as $key => $seadonId) {
                            $resultArray  = $longSearchParser->searchMultidimensionalArray($parsedContent, "seasonId", $seadonId, "showtype", "Episode", $episodeIdsList);
                            $resultArray  = $longSearchParser->array_orderby($resultArray, 'episodeId', SORT_ASC);
                            $episodeContent[$seadonId] = $resultArray;
                        }
                    } else {
                        foreach ($parsedContent as $value) {
                           $episodeContent[$value['seasonId']][] = $value;
                        }
                    } 
                } else {
                    $episodeContent = "Error returned in API response";
                }
            } 
        } 
        $response->setContent(json_encode($episodeContent, JSON_NUMERIC_CHECK));
        return $response;
    }


    public function getPlayListAction(){
        $playList = array();   
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response           = $this->getResponseWithHeader(); 
        $accountToken       = $externalApiAdapter->decryptAndGetCookie('newToken');
        $watchlistParam     = array("account_token" => $accountToken);
        $watchlistResult    = $externalApiAdapter->watchlistCallOnDemand('get', $watchlistParam);
        $data               = array();
        if($watchlistResult['responseStatus'] == 200) {
            if(!empty($watchlistResult['responseContent'])) {
                $parsedResponse = $longSearchParser->LongCallDataArr($watchlistResult['responseContent']);
                $parsedContent  = $longSearchParser->longMetadataParser($parsedResponse);
                if(!empty($parsedContent)) {
                    foreach ($parsedContent as $key => $value) {
                        $value['source'] = ($value['showtype'] == 'Episode' || $value['showtype'] == 'Season') ? 'tvShow' : 'movie'; 
                        if($value['showtype'] == 'Season') {
                            $episodeParam            = array('series_id'=>$value['seriesId'],'include'=>'Episode,Season', 'size'=>0);
                            $episodeListMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series", $episodeParam);
                
                            $size             = (isset($episodeListMetadataResp['responseContent']['hits']['total'])?$episodeListMetadataResp['responseContent']['hits']['total']:0);
                            $queryoptions     = array('series_id'=>$value['seriesId'],'include'=>'Episode,Season','size'=>$size);
                            $seasonListResult = $externalApiAdapter->constructUrlForLongSearchAndCallApiService("series", $queryoptions);

                            $parsedEpisodelistResponse = $longSearchParser->LongCallDataArr($seasonListResult['responseContent']);
                            $parsedEpisodeContent      = $longSearchParser->longMetadataParser($parsedEpisodelistResponse);
                            if(!empty($parsedEpisodeContent)) {
                                foreach ($parsedEpisodeContent as $episodekey => $episodevalue) {
                                   if(isset($episodevalue['seasonId']) && ($episodevalue['seasonId'] == $value['seasonId']) && ($episodevalue['showtype'] == 'Episode')) {
                                        $episodevalue['source'] = $value['source'];
                                        array_push($data,$episodevalue);
                                    }
                                }
                            }
                        } else {
                            array_push($data,$value);
                        }
                    }
                }
            }
        }
        if(!empty($data)) {
            $data = array_map("unserialize", array_unique(array_map("serialize", $data)));
        	$data = $longSearchParser->array_orderby($data, 'seriesId', SORT_DESC, 'seasonId', SORT_ASC, 'episodeId', SORT_ASC);
        	$nextIndex = 1;
            foreach ($data as $key => $value) {
	        	$data[$key]['nextIndex']=$nextIndex;
                $nextIndex++;
	        }
		}
        $response->setStatusCode($watchlistResult['responseStatus'])->setContent(json_encode($data,JSON_NUMERIC_CHECK));
        return $response;
   }

    public function getAllWatchlistIdsAction() {
        $config              = $this->getServiceLocator()->get('Config');
        $externalApiAdapter  = $this->getServiceLocator()->get('externalApi');
        $longSearchParser    = $this->getServiceLocator()->get('longSearchParser');
        $accountToken        = $externalApiAdapter->decryptAndGetCookie('newToken');
        $params              = array("account_token" => $accountToken);
        $watchlistResult     = $externalApiAdapter->watchlistCallOnDemand('get', $params);
        $watchlistContent    = array();
        $data                = array();
        if($watchlistResult['responseStatus'] == 200) {
            if(!empty($watchlistResult['responseContent'])) {
                $parsedResponse = $longSearchParser->LongCallDataArr($watchlistResult['responseContent']);
                $parsedContent  = $longSearchParser->longMetadataParser($parsedResponse);
                foreach ($parsedContent as $key => $value) {
                    if(isset($value['id'])) {
                        $data[] = $value['id'];
                    }
                }
            }
        } else {
            $data = $watchlistResult['responseContent'];
        }
        $response = $this->getResponseWithHeader();  
        $response->setStatusCode($watchlistResult['responseStatus'])->setContent(json_encode($data));
        return $response;
    }


    public function CheckItemInWatchListAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $accountToken       = $externalApiAdapter->decryptAndGetCookie('newToken');
        $title_id           = $this->params()->fromQuery('title_id');
        $position           = $this->params()->fromQuery('position');
        $queryoptions       = array('account_token'=>$accountToken,'embed_code'=>$title_id);
        $watchlistResult    = $externalApiAdapter->watchlistCallOnDemand('has', $queryoptions); 
        $isItemFound        = false;
        if($watchlistResult['responseStatus'] == 200 || $watchlistResult['responseStatus'] == 201) {
            if(!empty($watchlistResult['responseContent'])) {
                if($watchlistResult['responseContent']['response']) {
                    $isItemFound= true;
                } 
            }

        }
        $response            = $this->getResponseWithHeader();  
        $response->setContent(json_encode(array('isExist' => $isItemFound,'position'=>$position)));
        return $response;
    }


    /**
     * POST method
     * @see \Zend\Mvc\Controller\AbstractRestfulController::create()
     */
    public function createAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $accountToken       = $externalApiAdapter->decryptAndGetCookie('newToken');
        $title_id           = $this->params()->fromQuery('title_id');
        $queryoptions       = array('account_token'=>$accountToken,'embed_code'=>$title_id);
        $watchlistResult    = $externalApiAdapter->watchlistCallOnDemand('get', $queryoptions, 'POST'); 
        $response           = $this->getResponseWithHeader();
        $result             = array();
        if($watchlistResult['responseStatus'] == 200 || $watchlistResult['responseStatus'] == 201) {
            if(!empty($watchlistResult['responseContent'])) {
                $result = $watchlistResult['responseContent'];
            }
        }
        $response->setContent(json_encode($result));
        return $response;
    }

    /**
     * Delete the entire resource collection
     *
     * Not marked as abstract, as that would introduce a BC break
     * (introduced in 2.1.0); instead, raises an exception if not implemented.
     *
     * @return mixed
     */
    public function deleteListAction()
    {
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $accountToken       = $externalApiAdapter->decryptAndGetCookie('newToken');
        $title_id           = $this->params()->fromQuery('title_id');
        $type               = $this->params()->fromQuery('type');
        if($type == "item") {
            $queryoptions    = array('account_token'=>$accountToken,'embed_code'=>$title_id);
            $watchlistResult = $externalApiAdapter->watchlistCallOnDemand('get', $queryoptions, 'DELETE'); 
        } else {
            $queryoptions    = array('account_token'=>$accountToken,'embed_code'=>$title_id);
            $watchlistResult = $externalApiAdapter->watchlistCallOnDemand('all', $queryoptions, 'DELETE'); 
        }    
        $response           = $this->getResponseWithHeader();
        $response->setStatusCode($watchlistResult['responseStatus'])->setContent(json_encode($watchlistResult['responseContent']));
        return $response;
    }
    

    public function fromJson() {
      $body = $this->getRequest()->getContent();
      if (!empty($body)) {
          $json = json_decode($body, true);
          if (!empty($json)) {
              return $json;
          }
      }

      return false;
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
}
