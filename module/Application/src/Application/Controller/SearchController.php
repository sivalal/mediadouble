<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Session\Container;
use Directv\Ooyala\OoyalaAPI;
use Directv\ImageShack\ImageShackUtility;

class SearchController extends AbstractActionController
{
    protected $searchObj = array();
    protected $base = BASE_URL;
    protected $searchResultArray = array();
    
    public function getEntitlementsListAction()
    {
        $account_token   = $this->params()->fromQuery('account_token');
        $searchObj = $this->getServiceLocator()->get('search');
        $respdata        = $searchObj->getSecureEntitlementsListApiCall($account_token);
        $response    = $this->getResponseWithHeader();
        if($respdata['ApiResponseStatus']==200)
           $response->setContent(json_encode($respdata['response']));
        else
           $response->setStatusCode($respdata['ApiResponseStatus'])
                ->setContent(json_encode($respdata['response'])); 
        return $response;
    }
      
    
    public function getSimilarOrDiscoveryItemsAction()
    {
        
        $route='';
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $this->_config           = $this->getServiceLocator()->get('Config');
        $this->ondemandObj       = $this->getServiceLocator()->get('ondemand');
        $embedCode               = $this->params()->fromQuery('embed_code');
        $searchAdapterObj        = $this->getServiceLocator()->get('search');
        $discoveryPath            = $this->params()->fromQuery('path');
        $assetType=  $this->params()->fromQuery('assetType');
        $types=array();
        $param=array();
        if(isset($assetType) && !empty($assetType)){
            $typesOfAsset=  json_decode($assetType,TRUE);
            $types=$typesOfAsset['types'];
        }
        $response = $this->getResponseWithHeader();  

        if(!empty($embedCode)){
          $route = $this->_config['general_routes']['similarAssests'];
        }else{
            if(empty($discoveryPath)){
                   $data = array(
                       'error' => 'query option is empty',
                       'response'=> NULL
                   );
                   $response->setStatusCode(200)->setContent(json_encode($data));
                   return $response;
            } else {
                if($discoveryPath == 'most_popular') {
                    $route = $this->_config['general_routes']['movieAndTv']['most_popular'];
                } elseif($discoveryPath == 'recommended') {
                    $route = $this->_config['general_routes']['movieAndTv']['recommended']; 
                }
            }
        }
        
        $urlWithSignature = $this->generateOoyalaApiUrlWithSignature('GET', $route . urlencode($embedCode),$param);
        
        $accountToken     = $this->params()->fromQuery('accountToken');
        
            if (isset($_COOKIE["loggedin&*"]) && ($_COOKIE["loggedin&*"]=='true'||$_COOKIE["loggedin&*"]==true) ) {
                if (!isset($accountToken)) {
                    $accountToken = NULL;
                }
            } else {
                $accountToken = NULL;
            }
        
        $assetList = $searchAdapterObj->validateSendRequest($urlWithSignature);
        $data      = json_decode(json_encode($assetList), TRUE);
        
        if ($data['ApiResponseStatus'] != 200) {
            $response->setStatusCode($data['ApiResponseStatus']);
            $response->setContent(json_encode($data));
            return $response;
        } else {
            $resultSet               = json_decode($data['response'], TRUE);
            $embedCodes              = $searchAdapterObj->getAllEmbecodes($resultSet['results']);
            $decodedSearchContentArr = $searchAdapterObj->getDataFromMiniEmbeddedCodeSimilar($embedCodes,array(),array(),$types);
            if (!empty($decodedSearchContentArr['response'])) {
                $decodedArray   = json_decode($decodedSearchContentArr['response'], TRUE);
                $parsedResponse = $searchAdapterObj->RailsShortCollectionResults($decodedArray, $accountToken, array());
                if ($parsedResponse == NULL) {
                    $data = array(
                        'error' => 'no results for current query from search api',
                        'response' => $decodedSearchContentArr['response']
                    );
                    //to be updated later
                    $response->setStatusCode(200)->setContent(json_encode($data));
                    return $response;
                }
                $dataListArr = array(
                    "thumblistCarouselOneArr" => $parsedResponse
                );
                $response->setContent(json_encode($dataListArr));
            } else {
                $data = array(
                    'error' => 'error from search api',
                    'response' => (empty($decodedSearchContentArr['response'])? $decodedSearchContentArr['response']:"")
                );
                $response->setStatusCode(200)->setContent(json_encode($data));
                return $response;
            }
        }
        return $response;
    }
    
    
    //before min calls
//    public function getSimilarOrDiscoveryItemsAction()
//    {
//        
//        $route='';
//        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
//        $this->_config           = $this->getServiceLocator()->get('Config');
//        $this->ondemandObj       = $this->getServiceLocator()->get('ondemand');
//        $embedCode               = $this->params()->fromQuery('embed_code');
//        $searchAdapterObj        = $this->getServiceLocator()->get('search');
//        $discoveryPath            = $this->params()->fromQuery('path');
//        $assetType=  $this->params()->fromQuery('assetType');
//        $types=array();
//        $param=array();
//        if(isset($assetType) && !empty($assetType)){
//            $typesOfAsset=  json_decode($assetType,TRUE);
//            $types=$typesOfAsset['types'];
//        }
//        $response = $this->getResponseWithHeader();  
//
//        if(!empty($embedCode)){
//          $route = $this->_config['general_routes']['similarAssests'];
//        }else{
//            if(empty($discoveryPath)){
//                   $data = array(
//                       'error' => 'query option is empty',
//                       'response'=> NULL
//                   );
//                   $response->setStatusCode(200)->setContent(json_encode($data));
//                   return $response;
//            } else {
//                if($discoveryPath == 'most_popular') {
//                    $route = $this->_config['general_routes']['movieAndTv']['most_popular'];
//                } elseif($discoveryPath == 'recommended') {
//                    $route = $this->_config['general_routes']['movieAndTv']['recommended']; 
//                }
//            }
//        }
//        
//        $urlWithSignature = $this->generateOoyalaApiUrlWithSignature('GET', $route . urlencode($embedCode),$param);
//        
//        $accountToken     = $this->params()->fromQuery('accountToken');
//        
//            if (isset($_COOKIE["loggedin&*"]) && ($_COOKIE["loggedin&*"]=='true'||$_COOKIE["loggedin&*"]==true) ) {
//                if (!isset($accountToken)) {
//                    $accountToken = NULL;
//                }
//            } else {
//                $accountToken = NULL;
//            }
//        
//        $assetList = $searchAdapterObj->validateSendRequest($urlWithSignature);
//        $data      = json_decode(json_encode($assetList), TRUE);
//        
//        if ($data['ApiResponseStatus'] != 200) {
//            $response->setStatusCode($data['ApiResponseStatus']);
//            $response->setContent(json_encode($data));
//            return $response;
//        } else {
//            $resultSet               = json_decode($data['response'], TRUE);
//            $embedCodes              = $searchAdapterObj->getAllEmbecodes($resultSet['results']);
//            
//            
//            $decodedSearchContentArr = $searchAdapterObj->getDataFromEmbeddedCodeSimilar($embedCodes,array(),array(),$types);
//            if (!empty($decodedSearchContentArr['response'])) {
//                $decodedArray   = json_decode($decodedSearchContentArr['response'], TRUE);
////                $response->setStatusCode(200)->setContent(json_encode($decodedArray));
////                return $response;
//                
//                $parsedResponse = $searchAdapterObj->RailsShortCollectionResults($decodedArray, $accountToken, array());
//                if ($parsedResponse == NULL) {
//                    $data = array(
//                        'error' => 'no results for current query from search api',
//                        'response' => $decodedSearchContentArr['response']
//                    );
//                    //to be updated later
//                    $response->setStatusCode(200)->setContent(json_encode($data));
//                    return $response;
//                }
//                $dataListArr = array(
//                    "thumblistCarouselOneArr" => $parsedResponse
//                );
//                $response->setContent(json_encode($dataListArr));
//            } else {
//                $data = array(
//                    'error' => 'error from search api',
//                    'response' => (empty($decodedSearchContentArr['response'])? $decodedSearchContentArr['response']:"")
//                );
//                $response->setStatusCode(200)->setContent(json_encode($data));
//                return $response;
//            }
//        }
//        return $response;
//    }
    
    
    
    
    
//    public function getSimilarOrDiscoveryItemsAction(){
//        
//        $route='';
//        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
//        $this->_config           = $this->getServiceLocator()->get('Config');
//        $this->ondemandObj       = $this->getServiceLocator()->get('ondemand');
//        $embedCode               = $this->params()->fromQuery('embed_code');
//        $searchAdapterObj        = $this->getServiceLocator()->get('search');
//        $discoveryPath            = $this->params()->fromQuery('path');
//        $assetType=  $this->params()->fromQuery('assetType');
//        $types=array();
//        $param=array();
//        if(isset($assetType) && !empty($assetType)){
//            $typesOfAsset=  json_decode($assetType,TRUE);
//            $types=$typesOfAsset['types'];
//        }
//        $response = $this->getResponseWithHeader(); 
//        
//        if(!empty($embedCode)){
//          $route = $this->_config['general_routes']['similarAssests'];
//        }else{
//            if(empty($discoveryPath)){
//                   $data = array(
//                       'error' => 'query option is empty',
//                       'response'=> NULL
//                   );
//                   $response->setStatusCode(200)->setContent(json_encode($data));
//                   return $response;
//            } else {
//                if($discoveryPath == 'most_popular') {
//                    $route = $this->_config['general_routes']['movieAndTv']['most_popular_new'];
//                    $param['score_type']='top_titles';
//                } elseif($discoveryPath == 'recommended') {
//                    $route = $this->_config['general_routes']['movieAndTv']['recommended']; 
//                }
//            }
//        }
//        $urlWithSignature = $this->generateOoyalaApiUrlWithSignature('GET', $route . urlencode($embedCode),$param);
//       // print_r($urlWithSignature);
//        $accountToken     = $this->params()->fromQuery('accountToken');        
//        if (isset($_COOKIE["loggedin"]) && ($_COOKIE["loggedin"]=='true'||$_COOKIE["loggedin"]==true) ) {
//            if (!isset($accountToken)) {
//                $accountToken = NULL;
//            }
//        } else {
//            $accountToken = NULL;
//        }
//        $assetList = $searchAdapterObj->validateSendRequest($urlWithSignature);
//        $data      = json_decode(json_encode($assetList), TRUE);
//        if ($data['ApiResponseStatus'] != 200) {
//            $response->setStatusCode($data['ApiResponseStatus']);
//            $response->setContent(json_encode($data));
//            return $response;
//        } else {
//            $resultSet               = json_decode($data['response'], TRUE);  
//            if($discoveryPath == 'most_popular') {
//                $titleIds=$searchAdapterObj->getAllTitleIds($resultSet['results']);
//                $decodedArray=$searchAdapterObj->getShortMetadataBy($titleIds);
//            }else if($discoveryPath == 'recommended'||!empty($embedCode)){
//                $embedCodes              = $searchAdapterObj->getAllEmbecodes($resultSet['results']);
//                $decodedSearchContentArr = $searchAdapterObj->getDataFromEmbeddedCodeSimilar($embedCodes,array(),array(),$types);
//                if (!empty($decodedSearchContentArr['response'])) {
//                    $decodedArray   = json_decode($decodedSearchContentArr['response'], TRUE);
//                }  else {
//                    $decodedArray=array();
//                }
//            }
//            if (!empty($decodedArray)) {
//                $parsedResponse = $searchAdapterObj->RailsShortCollectionResults($decodedArray, $accountToken, array());
//                if ($parsedResponse == NULL) {
//                    $data = array(
//                        'error' => 'no results for current query from search api',
//                        'response' => $decodedSearchContentArr['response']
//                    );
//                    $response->setStatusCode(200)->setContent(json_encode($data));
//                    return $response;
//                }
//                $dataListArr = array(
//                    "thumblistCarouselOneArr" => $parsedResponse
//                );
//                $response->setContent(json_encode($dataListArr));
//            } else {
//                $data = array(
//                    'error' => 'error from search api',
//                    'response' => (empty($decodedSearchContentArr['response'])? $decodedSearchContentArr['response']:"")
//                );
//                $response->setStatusCode(200)->setContent(json_encode($data));
//                return $response;
//            }
//        }
//        return $response;
//    }
    
    
    
    
    
    
    
    
    
    public function generateOoyalaApiUrlWithSignature($method, $requestPath,$param) {
        //$this->_config  = $this->getServiceLocator()->get('Config');
        if(empty($param)){
            $param="";
        }
        $ooyalaApiObject = new OoyalaAPI();
        $this->_config   = $this->getServiceLocator()->get('Config');
        $apiKey          = $this->_config['ooyala']['backlot_api_key'];
        //$apiKey='R3ZHExOjHcfMbqoMxpYBE7PbDEyB.qLsju';
        $secretKey       = $this->_config['ooyala']['backlot_secret_key'];
        $generatedUrl    = $ooyalaApiObject->generateURL($method, $apiKey, $secretKey, $this->getDataTimeTwoDaysAfter(), $requestPath, "",$param, DISCOVERY);//OAL_PLAYER --> DISCOVERY
        return $generatedUrl;
    }
    
    protected function getDataTimeTwoDaysAfter()
    {
        $dateTimeInStrtotime = strtotime(date('Y-m-d h:m:s', strtotime(date('Y-m-d h:m:s') . ' +2 day')));
        return $dateTimeInStrtotime;
    }
    
    
    public function getEpisodeListAction()
    {
        $series_id   = $this->params()->fromQuery('series_id');
        $ondemandObj = $this->getServiceLocator()->get('ondemand');
        $data        = $ondemandObj->getEpisodeList($series_id);
        $response    = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }
      
    public function TVMovieSearchAction()
    {
        $searchResultArray               = array();
        $searchKey                       = $this->params()->fromQuery('q');
        $this->ondemandObj               = $this->getServiceLocator()->get('ondemand');
        $this->searchObj                 = $this->getServiceLocator()->get('search');
        $tvResult                        = $this->ondemandObj->getTVDataBySearchValue($searchKey);
        $searchResultArray               = array();
        $searchResultArray["SearchText"] = $searchKey;
        if ($tvResult['Link']) {
            foreach ($tvResult['Link'] as $key => $value) {
                $typeKey                           = 'data';
                $searchResultArray[$typeKey][$key] = $this->SearchInitParser($value);
            }
        }
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchResultArray));
        return $response;
        
    }
    
    public function SearchInitParser($search_result)
    {
        $item_details                    = array();
        $idArray                         = explode("?", $search_result["Id"]);
        $item_details["id"]              = $idArray[0];
        $item_details["title"]           = $search_result["Title"];
        $item_details['imagePath_large'] = $item_details['imagePath'] = BASE_URL . '/dummy/blank_image.png';
        return $item_details;
    }
    
    
    public function CheckItemInXDRAction()
    {
        $accountToken      = $this->params()->fromQuery('account_token');
        $embed_code        = $this->params()->fromQuery('embed_code');
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $data              = $this->ondemandObj->getXDRitem($accountToken, $embed_code);
        $response          = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }
    
    
    public function LiveSearchAction()
    {
        $searchKey                       = $this->params()->fromQuery('q');
        $this->ondemandObj               = $this->getServiceLocator()->get('ondemand');
        $this->searchObj                 = $this->getServiceLocator()->get('search');
        $liveResult                      = $this->ondemandObj->getLiveDataBySearchValue($searchKey);
        $searchResultArray               = array();
        $searchResultArray["SearchText"] = $searchKey;
        $typeKey                         = 'data';
        if ($liveResult['Link']) {
            foreach ($liveResult['Link'] as $key => $value) {
                $searchResultArray[$typeKey][$key] = $this->SearchInitParser($value);
            }
        }
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchResultArray));
        return $response;
    }
    
    public function GetSearchMiniContentAction()
    {
        $contentId                = $this->params()->fromQuery('contentId');
        $position                 = $this->params()->fromQuery('position');
        $this->ondemandObj        = $this->getServiceLocator()->get('ondemand');
        $this->searchObj          = $this->getServiceLocator()->get('search');
        $details                  = $this->ondemandObj->getDataByID($contentId);
        $searchResult             = $this->searchObj->GenericSearchParser_SingleResult_New($details, array());
        $searchResult['position'] = $position;
        $response                 = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchResult));
        return $response;
        
        
    }
    
    public function GetSummaryAction()
    {
        $contentId                = $this->params()->fromQuery('contentId');
        $position                 = $this->params()->fromQuery('position');
        $this->ondemandObj        = $this->getServiceLocator()->get('ondemand');
        $this->searchObj          = $this->getServiceLocator()->get('search');
        $details                  = $this->ondemandObj->getAssetDataByID($contentId);
        $searchResult             = $this->searchObj->getNewAssetDetails_Basic($details);
        $searchResult['position'] = $position;
        $response                 = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchResult));
        return $response;
        
        
    }
    
    
    public function GetContentImageAction()
    {
        $position          = $this->params()->fromQuery('position');
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $this->searchObj   = $this->getServiceLocator()->get('search');
        if($this->params()->fromQuery('embed_code')){
            $embdcode = $this->params()->fromQuery('embed_code');
            $resultSet = $this->searchObj->getAssetDataByEmbdCode($embdcode);
            if(count($resultSet['Results']['Results'])>0)
               $contentId = $resultSet['Results']['Results'][0]['Title']['Id'];
        }
        else if($this->params()->fromQuery('contentId')){
            $contentId = $this->params()->fromQuery('contentId');
        }
        else{ return; }
        $details           = $this->ondemandObj->getDataByID($contentId);
        $searchResult      = $this->searchObj->GenericSearchParser_SingleResult_New($details, array());
        $result            = array();
        if ($searchResult)
            $result['imagePath'] = $searchResult['imagePath'];
        else
            $result['imagePath'] ='/dummy/blank_image.png';
        $result['position'] = $position;
        $response           = $this->getResponseWithHeader();
        $response->setContent(json_encode($result));
        return $response;
        
        
    }
    
    
    
    
    public function PeopleSearchAction()
    {
        $searchKey                       = $this->params()->fromQuery('q');
        $this->ondemandObj               = $this->getServiceLocator()->get('ondemand');
        $peopleResult                    = $this->ondemandObj->getPeopleDataBySearchValue($searchKey);
        $searchResultArray               = array();
        $searchResultArray["SearchText"] = $searchKey;
        if ($peopleResult['Link']) {
            foreach ($peopleResult['Link'] as $key => $value) {
                $typeKey                           = 'people';
                $searchResultArray[$typeKey][$key] = $this->SearchInitParser($value);
            }
        }
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchResultArray));
        return $response;
    }
    
    public function PeopleSearchDetailAction()
    {
        $name               = $this->params()->fromQuery('name');
        $ondemandObj        = $this->getServiceLocator()->get('ondemand');
        $peopleDetailResult = $ondemandObj->getPeopleDetailByName($name);
        $searchObj          = $this->getServiceLocator()->get('search');
        
        $searchResult       = array();
        if(!empty($peopleDetailResult)) {

            if(count($peopleDetailResult->Results->Results)>0) {
                foreach ($peopleDetailResult->Results->Results as $key => $results) {
                    
                   
                    if($results->Title->Id !=='fake_epg_title_id'){
            
                    $peopleSearchResult[$key]        = $searchObj->GenericSearchParser_people_details($results, array());
                    $details[$key]                   = $ondemandObj->getAssetDataByID($peopleSearchResult[$key]['id']);
                    $searchResult[$key]              = $searchObj->getNewAssetDetails_Basic($details[$key]);
                    $searchResult[$key]['imagePath'] = $peopleSearchResult[$key]['imagePath'];
                    # code...
                    }
                }

            }
        }
        $response          = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchResult));
        return $response;
    }
    
    
    public function SeeMoreAction()
    {
        $searchKey         = $this->params()->fromQuery('q');
        $category          = $this->params()->fromQuery('category');
        $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
        $searchResultArray = array();
        $resultList;
        switch ($category) {
            case 'people':
                $resultList = $this->ondemandObj->getPeopleDataBySearchValue($searchKey);
                break;
            case 'live':
                $resultList = $this->ondemandObj->getLiveDataBySearchValue($searchKey);
                break;
            case 'movie':
                $resultList = $this->ondemandObj->getTVDataBySearchValue($searchKey);
                break;
            
            default:
                $resultList = $this->ondemandObj->getTVDataBySearchValue($searchKey);
                break;
        }
        $searchResultArray = array();
        if ($resultList->Link) {
            foreach ($resultList->Link as $key => $value) {
                $itemID       = explode("?", $value->Id);
                $assetdetails = $this->ondemandObj->getAssetDataByID($itemID[0]);
                if ($assetdetails) {
                    if ($category == "live") {
                        $searchResultArray[$key]['single_page'] = "liveShow";
                    }
                    $searchResultArray[$key]['id']    = $itemID[0];
                    $searchResultArray[$key]['title'] = $value->Title;
                    if ($assetdetails["found"]) {
                        foreach ($assetdetails["_source"]["Assets"] as $assets) {
                            if ($assets["XsiType"] == "title:TitleType") {
                                $searchResultArray[$key]['category'] = $assets["Genre"];
                                $searchResultArray[$key]['desc']     = $assets["LocalizableTitle"][0]["SummaryMedium"];
                            }
                        }
                    } else {
                        $searchResultArray[$key]['desc'] = "No data avaialable";
                    }
                    $searchResultArray[$key]['img_small'] = '${base}/dummy/blank_image_small.png';
                    $searchResultArray[$key]['img_large'] = '${base}/dummy/blank_image.png';
                }
                
            }
        }
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchResultArray));
        return $response;
    }
    
    public function searchDetailDescriptionAction()
    {
        $this->searchObj = $this->getServiceLocator()->get('search');
        $titleId         = $this->params()->fromQuery('titleId');
        // $titleId='V4MXV4bTrte7NrfRnXcZCs8PdgSm0Iwf';
        $details         = $this->searchObj->getAssetDataByID($titleId);
        $videoDetails    = $this->searchObj->getNewAssetDetails($details);
        if (!empty($videoDetails) && !empty($videoDetails['details'])) {
            $videoDescrption = array(
                'summaryShort' => $videoDetails['details']
            );
        } else {
            $videoDescrption = array(
                'summaryShort' => ''
            );
        }
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($videoDescrption));
        return $response;
    }
    
    // public function SeeMoreAction()
    // {
    // }
    
    public function GetSPDataAction()
    {
        $searchKey = $this->params()->fromQuery('id');
        $category  = $this->params()->fromQuery('category');
        $details   = $this->ondemandObj->getAssetDataByID($value->Id);
        $response  = $this->getResponseWithHeader();
        $response->setContent(json_encode($details));
        return $response;
        
    }
    
    public function getGenreListAction()
    {
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        $this->_config          = $this->getServiceLocator()->get('config');
        $apiKey                 = $this->_config['ooyala']['backlot_api_key'];
        $response               = $this->getResponseWithHeader();
        $searchContentArr       = $this->searchAdapterObj->getGenreList($apiKey);
        if ($searchContentArr['ApiResponseStatus'] != 200) {
            $response->setStatusCode($searchContentArr['ApiResponseStatus']);
            $response->setContent(json_encode($searchContentArr));
            return $response;
        }
        $response->setContent(json_encode($searchContentArr['response']));
        return $response;
    }
    
    
    public function railSearchdataAction()
    {
        
        $queryoptions = $this->params()->fromQuery('queryoptions');
        $accountToken = $this->params()->fromQuery('accountToken');
        if (!isset($accountToken)) {
            $accountToken = NULL;
        }
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        $response               = $this->getResponseWithHeader();
        if (empty($queryoptions)) {
            $queryoptions = "";
        }
        
        $searchContentArr = $this->searchAdapterObj->getRailsSearchCollectionResults(NULL, $queryoptions);
        if ($searchContentArr['ApiResponseStatus'] != 200) {
            $response->setStatusCode($searchContentArr['ApiResponseStatus']);
            $response->setContent($searchContentArr['response']);
            return $response;
        }
        
        $decodedSearchContentArr = json_decode($searchContentArr['response'], true);
        if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
            $data = array(
                'error' => 'error from search api',
                'response' => $searchContentArr['response']
            );
            
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        //$appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        //$imageMetaDetails = $appviewAdapterObj->getImageMetaDetails();
        $parsedResponse = $this->searchAdapterObj->parseRailsSearchCollectionResults($decodedSearchContentArr, $accountToken, null);
        
        
        if ($parsedResponse == NULL) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $searchContentArr['response']
            );
            //to be updated later
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        
        $dataListArr = array(
            "thumblistCarouselOneArr" => $parsedResponse
        );
        // $this->railSearchdataSessionObj = new Container('railSearchdataSession'); 
        if (empty($accountToken)) {
            //$this->railSearchdataSessionObj->
        }
        $response->setContent(json_encode($dataListArr));
        return $response;
    }
    
    public function railXDRdataAction()
    {
        $dataListArr             = array();
        $accountToken            = $this->params()->fromQuery('accountToken');
        $this->searchAdapterObj  = $this->getServiceLocator()->get('search');
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $imageMetaDetails        = $this->appviewAdapterObj->getImageMetaDetails();
        $response                = $this->getResponseWithHeader();
        $XDRContentArr           = $this->searchAdapterObj->getRailsXDRResults($accountToken);
        if ($XDRContentArr['ApiResponseStatus'] == 200) {
            $XDRResponse = json_decode($XDRContentArr['response'], TRUE);
            usort($XDRResponse['items'], function($a, $b)
            {
                return $a["timestamp"] < $b["timestamp"];
            });
            $embedCodes = $this->searchAdapterObj->getXDREmbedcodes($XDRResponse);
            if (!empty($embedCodes)) {
                $decodedSearchContentArr = $this->searchAdapterObj->getDataFromEmbeddedCode($embedCodes,'','');
                if ($decodedSearchContentArr) {
                    $parsedResponse = $this->searchAdapterObj->parseRailsSearchCollectionResults($decodedSearchContentArr, $accountToken, $imageMetaDetails, $XDRResponse['items']);
                    usort($parsedResponse, function($a, $b)
                    {
                        return $a["xdrContent"]["timestamp"] < $b["xdrContent"]["timestamp"];
                    });
                    if ($parsedResponse == NULL) {
                        $data = array(
                            'error' => 'no results for current query from search api',
                            'response' => $XDRContentArr['response']
                        );
                        //to be updated later
                        $response->setStatusCode(200)->setContent(json_encode($data));
                        return $response;
                    }
                    $imageMetaDetails = $this->appviewAdapterObj->getImageMetaDetails();
                    $dataListArr      = array(
                        "thumblistCarouselOneArr" => $parsedResponse,
                        "imageMetaDetails" => $imageMetaDetails
                    );
                } else {
                    $data = array(
                        'error' => 'error from search api',
                        'response' => $XDRContentArr['response']
                    );
                    $response->setStatusCode(200)->setContent(json_encode($data));
                    return $response;
                }
            }
            
        } else {
            $response->setStatusCode($XDRContentArr['ApiResponseStatus']);
            $response->setContent($XDRContentArr['response']);
            return $response;
        }
        if (empty($dataListArr)) {
            $dataListArr = array(
                'error' => 'no response'
            );
        }
        $response->setContent(json_encode($dataListArr));
        return $response;
    }
    
    public function testrailSearchParserAction()
    {
        $collectionName         = $this->params()->fromQuery('cname');
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        
        if (empty($collectionName))
            $collectionName = "action";
        
        $searchContentArr = $this->searchAdapterObj->getRailsSearchCollectionResults(NULL, '{"collection":"comedy"}');
        echo 'Before Parsing<pre>';
        print_r($searchContentArr);
        echo '----';
        $appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        //$imageMetaDetails = $appviewAdapterObj->getImageMetaDetails();
        $parsedResponse    = $this->searchAdapterObj->parseRailsSearchCollectionResults($searchContentArr, null, null);
        echo 'After Parsing<pre>';
        print_r($parsedResponse);
        die();
        $response = $this->getResponseWithHeader();
        //   $response->setContent(json_encode($parsedResponse));
        return $response;
    }
    
    public function testgetNewAssetDetailsAction()
    {
        $titleid                = $this->params()->fromQuery('titleid');
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        $res      = $this->searchAdapterObj->testgetNewAssetDetails($titleid);
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($res));
        return $response;
    }
    
    public function checkUserSubscriptionForVideoPlayAction()
    {
        $postData                = $this->fromJson();
        $entitlementList         = $this->getEntitlementsAction($postData['accessToken']);
        $this->searchObj         = $this->getServiceLocator()->get('search');
        $longSearchDataByTitleId = $this->searchObj->getAssetDataByID($postData['titleID']);
        $assets                  = $this->searchObj->getNewAssetDetails($longSearchDataByTitleId);
        if ($entitlementList) {
            foreach ($entitlementList['entitlements'] as $key => $entitlement) {
                if (isset($assets['entitlements'])) {
                    if ($entitlement['id'] == $assets['entitlements']) {
                        $data['id']              = $entitlement['id'];
                        $data['start_timestamp'] = $entitlement['start_timestamp'];
                        $data['end_timestamp']   = $entitlement['end_timestamp'];
                        $data['exist']           = true;
                        $data['success']         = 'OK';
                        $data['code']            = 200;
                        
                    }
                } else {
                    $data['error'] = "no entitlement id found for the user";
                    $data['code']  = 404;
                }
            }
        } else {
            $data['error'] = "no entitlement list found for the user";
            $data['code']  = 404;
        }
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }
    
    public function getEntitlementsAction($access_token)
    {
        $config           = $this->getServiceLocator()->get('Config');
        $ondemandObj      = $this->getServiceLocator()->get('ondemand');
        $entitlementRoute = $config['general_routes']['vindicia']['entitlements'];
        $url              = OAL . $entitlementRoute . "?account_token=" . urlencode($access_token);
        $responseData     = json_decode($ondemandObj->sendRequest($url), true);
        $entitlementList  = $responseData ? $responseData : array();
        return $entitlementList;
    }
    
    
    public function getRecentlyAddedAction()
    {
        $account_token        = $this->params()->fromQuery('account_token');
        $amount   = (empty($this->params()->fromQuery('amount')) || 
                     $this->params()->fromQuery('amount')=='undefined' || 
                     $this->params()->fromQuery('amount')=='null')?
                10:$this->params()->fromQuery('amount');
        
        
        $temQopt=$this->params()->fromQuery('queryoptions');
        $queryoptions=(!empty($temQopt)?
                json_decode($temQopt,true):'NA');

        
        $ondemandObj          = $this->getServiceLocator()->get('ondemand');
        $searchObj            = $this->getServiceLocator()->get('search');
        $api_result           = $ondemandObj->getRecentlyAddedList($queryoptions);
        $result               = array();
        $entitlement_contents = array();
        if (!empty($api_result) && !empty($api_result['hits']) && !empty($api_result['hits']['hits'])) {
            $result_items = array();
            if ($account_token) {
                $entitlementList = $searchObj->getEntitlements($account_token);
                if (!empty($entitlementList) && isset($entitlementList['entitlements'])) {
                    $entitlement_contents = $entitlementList['entitlements'];
                }
            }
            foreach ($api_result['hits']['hits'] as $key => $items) {
                $result_items[$key] = $searchObj->getNewAssetDetails($items);
            }
            foreach ($result_items as $key => $item) {
                $item_details = array();
                $showFlag     = true;
                if (isset($item['entitlements'])) {
                    foreach ($entitlement_contents as $key1 => $entitlement) {
                        $showFlag = false;
                        if ($entitlement['id'] == $item['entitlements']) {
                            $showFlag = true;
                            break;
                        }
                    }
                    if (!$showFlag)
                        break;
                }
                
                $item_details['id']        = $item['title_id'];
                $item_details['region']    = $item['region'];
                $item_details['title']     = (!empty($item['title']))?$item['title']:'';
                $item_details['imagePath'] = BASE_URL . '/dummy/blank_image.png';
                if ($showFlag) {
                    $result[$key] = $item_details;
                }
            }
        }
        
        $result_array = array();
        $regionlist   = $this->getRegionSelection();
        if (!empty($regionlist)) {
            foreach ($result as $key => $value) {
                $regionArr = array_intersect($regionlist, $value['region']);
                
                if (!empty($regionArr)) {
                    array_push($result_array, $value);
                }
            }
        } else {
            $result_array = $result;
        }
        $final_result['thumblistCarouselOneArr'] = $result_array;
        $response                                = $this->getResponseWithHeader();
        $response->setContent(json_encode($final_result));
        return $response;
    }
    
    public function getResponseWithHeader()
    {
        $response = $this->getResponse();
        $response->getHeaders()->addHeaderLine('Access-Control-Allow-Origin', '*')->addHeaderLine('Access-Control-Allow-Methods', 'POST GET')->addHeaderLine('Content-type', 'application/json');
        return $response;
    }
    
    public function fromJson()
    {
        $body = $this->getRequest()->getContent();
        if (!empty($body)) {
            $json = json_decode($body, true);
            if (!empty($json)) {
                return $json;
            }
        }
        
        return false;
    }
    
    public function showcasedataAction()
    {
        $queryoptions = $this->params()->fromQuery('queryoptions');
        $accountToken = $this->params()->fromQuery('accountToken');
        if (!isset($accountToken)) {
            $accountToken = NULL;
        }
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        $response               = $this->getResponseWithHeader();
        if (empty($queryoptions)) {
            $queryoptions = "";
        }
        
        $searchContentArr = $this->searchAdapterObj->getRailsSearchCollectionResults(NULL, $queryoptions);
        if ($searchContentArr['ApiResponseStatus'] != 200) {
            $response->setStatusCode($searchContentArr['ApiResponseStatus']);
            $response->setContent($searchContentArr['response']);
            return $response;
        }
        
        $decodedSearchContentArr = json_decode($searchContentArr['response'], true);
        if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
            $data = array(
                'error' => 'error from search api',
                'response' => $searchContentArr['response']
            );
            
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        $parsedResponse = $this->searchAdapterObj->parseRailsSearchCollectionResults($decodedSearchContentArr, $accountToken);
        
        
        if ($parsedResponse == NULL) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $searchContentArr['response']
            );
            //to be updated later
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        
        $dataListArr = array(
            "showcaseArr" => $parsedResponse
        );
        // $this->railSearchdataSessionObj = new Container('railSearchdataSession'); 
        if (empty($accountToken)) {
            //$this->railSearchdataSessionObj->
        }
        $response->setContent(json_encode($dataListArr));
        return $response;
    }
    
    
    public function getRegionSelection()
    {
        $a = array();
        if (isset($_COOKIE["showRegionFilter"])) {
            $flag = str_replace('"', '', $_COOKIE["showRegionFilter"]);
            if ($flag == "true" && isset($_COOKIE["regionFilter"])) {
                return $_COOKIE["regionFilter"];
            } else{
                return $a;
            }
        }
        return $a;
    }
    
    public function getQualitySelection()
    {
        $a = array();
        if (isset($_COOKIE["showQualityFilter"])) {
            $flag = str_replace('"', '', $_COOKIE["showQualityFilter"]);
            if ($flag == "true" && isset($_COOKIE["qualityFilter"])) {
                return $_COOKIE["qualityFilter"];
            } else{
                return $a;
            }
        }
        return $a;
    }
    
    /*
     * gets entitlements and create tiers querystr
     */
    public function getTiersQueryStr($accountToken){
        $tiersqueryoptions='"tiers":[]';
        if(empty($accountToken)){
            return $tiersqueryoptions;
        }            
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');     
        $respdata = $this->searchAdapterObj
                ->getSecureEntitlementsListApiCall($accountToken);
            if($respdata['ApiResponseStatus']==200)
            {
                    $entitlerespArr=json_decode($respdata['response'],true);
                    if(!empty($entitlerespArr['entitlements'])){                        
                        $EntitlementList=array();
                        foreach($entitlerespArr['entitlements'] as $idsArr){
                            $EntitlementList[]=$idsArr['id'];
                        }
                        if(!empty($EntitlementList)){
                            $tiersqueryoptions='"tiers":["'.implode('","',$EntitlementList).'"]';
                        }                        
                    }
            }
      return $tiersqueryoptions;
    }

    public function railShortCallAction()
    {
        $result_array = array();
        $queryoptions = $this->params()->fromQuery('queryoptions');
        $accountToken = $this->params()->fromQuery('accountToken');
        $types=$this->params()->fromQuery('assetType');
        
        
        
        if ($accountToken == 'null' || $accountToken=='undefined' ) {
            $accountToken = NULL;
        }
         if (isset($_COOKIE["loggedin&*"]) && ($_COOKIE["loggedin&*"]=='true'||$_COOKIE["loggedin&*"]==true) ) {
                if (!isset($accountToken)) {
                    $accountToken = NULL;
                }
            } else {
                $accountToken = NULL;
            }
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        $response               = $this->getResponseWithHeader();
        if (empty($queryoptions)) {
            $queryoptions = "";
        }
        
        $region_list      = $this->getRegionSelection();
        $quality_list     = $this->getQualitySelection();
        $queryoptions     = str_replace('}', '', $queryoptions);
        if(isset($types) && !empty($types)){
            $patterns = array();
            $patterns[0]='/{/';
            $patterns[1]='/}/';
            $typeasset=preg_replace($patterns, '', $types);
            $queryoptions=$queryoptions.",".$typeasset;
        }
        
        if($accountToken!=NULL)
        {
          $queryoptions=$queryoptions.','.$this->getTiersQueryStr($accountToken);
        }
        $queryoptions     = $queryoptions . ',"region":' .trim(stripslashes(json_encode($region_list)),'"');
        $queryoptions     = $queryoptions . ',"format":' . trim(stripslashes(json_encode($quality_list)),'"');
        $queryoptions     = $queryoptions . '}';
        
        
        $searchContentArr = $this->searchAdapterObj->getRailsSearchCollectionResults(NULL, $queryoptions);
        if ($searchContentArr['ApiResponseStatus'] != 200) {
            $response->setStatusCode($searchContentArr['ApiResponseStatus']);
            $response->setContent($searchContentArr['response']);
            return $response;
        }
        $decodedSearchContentArr = json_decode($searchContentArr['response'], true);
        if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
            $data = array(
                'error' => 'error from search api',
                'response' => $searchContentArr['response']
            );
            
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        $parsedResponse = $this->searchAdapterObj->RailsShortCollectionResults($decodedSearchContentArr, $accountToken, array());
        
        if ($parsedResponse == NULL) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $searchContentArr['response']
            );
            //to be updated later
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        } else {
            //     echo "<pre>";
            //     print_r($parsedResponse);
            //     $regionlist= $this->getRegionSelection();
            //     if(!empty($regionlist))
            //     {
            //     foreach ($parsedResponse as $key => $value) {
            //         $regionArr=array_intersect( $regionlist , $value['region']);
            //       if(!empty($regionArr))
            //       {
            //         array_push($result_array,$value);
            //       }
            //     }
            //     }
            // else
            // {
            //     $result_array=$parsedResponse;
            // }
            
            //$result_array=$this->ProcessRegion($parsedResponse);
            $result_array = $parsedResponse;
        }
        
        
        $dataListArr = array(
            "thumblistCarouselOneArr" => $result_array
        );        
        $response->setContent(json_encode($dataListArr));
        return $response;
    }
    
    
    public function ProcessRegion($actual_result)
    {
        $result_array = array();
        if(!empty($this->getRegionSelection()))
            $regionlist   = json_decode($this->getRegionSelection(), true);
        else
            $regionlist   =array();
        if(!empty($this->getQualitySelection()))
            $quality_list = json_decode($this->getQualitySelection(), true);
        else
            $quality_list   =array();
        
        $checkRegion = !empty($regionlist);
        $checkQuality = !empty($quality_list);
        if ($checkRegion || $checkQuality) {
            foreach ($actual_result as $key => $value) {
                $regionMatch  = true;
                $qualityMatch = true;
                $region       = array_intersect($regionlist, $value['region']);
                if ($checkRegion && empty($region))
                    $regionMatch = false;
                $quality = array_intersect($quality_list, $value['quality']);
                if ($checkQuality && $quality_list[0] != 'All' && empty($quality))
                    $qualityMatch = false;
                if ($regionMatch && $qualityMatch)
                    array_push($result_array, $value);
            }
        } else {
            $result_array = $actual_result;
        }
        return $result_array;
    }
    
    
    public function manualrailShortCallAction()
    {
        
        $queryoptions = $this->params()->fromQuery('queryoptions');
        $accountToken = $this->params()->fromQuery('accountToken');
        if ($accountToken == 'null' || $accountToken=='undefined' ) {
            $accountToken = NULL;
        }
         if (isset($_COOKIE["loggedin&*"]) && ($_COOKIE["loggedin&*"]=='true'||$_COOKIE["loggedin&*"]==true) ) {
                if (!isset($accountToken)) {
                    $accountToken = NULL;
                }
            } else {
                $accountToken = NULL;
            }
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        $response               = $this->getResponseWithHeader();
        $FailedCallList   = array();
        $FailedCallsCount = 0;
        $SearchContentArr = array();        
        $queryoptionsArr = json_decode($queryoptions, true);
        $titleIdArr      = $queryoptionsArr['collections'];
        $searchResARR    = array();
        $region_list   = $this->getRegionSelection();
        $quality_list     = $this->getQualitySelection();
        foreach ($titleIdArr as $titleid) {
            $searchContentArr = $this->searchAdapterObj->getShortSearchBytitleIDResult($titleid,$quality_list,$region_list);
            if ($searchContentArr['ApiResponseStatus'] != 200) {
                //            $response->setStatusCode($searchContentArr['ApiResponseStatus']);
                //            $response->setContent($searchContentArr['response']);
                //            return $response;
                $FailedCallList[$titleid]['titleID']        = $titleid;
                $FailedCallList[$titleid]['responseStatus'] = $searchContentArr['ApiResponseStatus'];
                $FailedCallList[$titleid]['response']       = $searchContentArr['response'];
                $FailedCallsCount++;
                
            } else {
                $decodedSearchContentArr = json_decode($searchContentArr['response'], true);
                if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
                    //            $data = array(
                    //                'error' => 'error from search api',
                    //                'response'=> $searchContentArr['response']
                    //            );
                    //   $response->setStatusCode(200)->setContent(json_encode($data));
                    //   return $response;    
                    $FailedCallList[$titleid]['titleID']        = $titleid;
                    $FailedCallList[$titleid]['responseStatus'] = $searchContentArr['ApiResponseStatus'];
                    $FailedCallList[$titleid]['response']       = $searchContentArr['response'];
                    $FailedCallsCount++;
                } else {
                    $searchResARR[] = $decodedSearchContentArr['Results']['Results'][0];
                }
                
            }
        } //end of loop 
        
        $SearchContentArr['Results']['Results'] = $searchResARR;
        $parsedResponse                         = NULL;
        if (!empty($SearchContentArr['Results']['Results'])) {
            $SearchContentArr['Results']['Count'] = count($SearchContentArr['Results']['Results']);
            $parsedResponse                       = $this->searchAdapterObj->RailsShortCollectionResults($SearchContentArr, $accountToken, array());
        }
        if ($parsedResponse == NULL) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $searchContentArr['response']
            );
            //to be updated later
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        
        //$final_result = $this->ProcessRegion($parsedResponse);
        $final_result =$parsedResponse;
        $dataListArr = array(
            "FailedCallsCount" => $FailedCallsCount,
            "FailedCallsLogList" => $FailedCallList,
            "thumblistCarouselOneArr" => $final_result
        );
        
        $response->setContent(json_encode($dataListArr));
        return $response;
    }
    
    public function railPopOverDataCallAction()
    {
        
        $titleID                = $this->params()->fromQuery('titleID');
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        $response               = $this->getResponseWithHeader();
  
        $searchContentArr = $this->searchAdapterObj->getAssetbyIDwithoutParsing($titleID);
        
        if ($searchContentArr['ApiResponseStatus'] != 200) {
            $response->setStatusCode($searchContentArr['ApiResponseStatus']);
            $response->setContent($searchContentArr['response']);
            return $response;
        }
        $decodedSearchContentArr = json_decode($searchContentArr['response'], true);
        if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
            $data = array(
                'error' => 'error from search api',
                'response' => $searchContentArr['response']
            );
            
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        
        $assets         = $this->searchAdapterObj->getNewAssetDetails($decodedSearchContentArr);
        $parsedResponse = $this->searchAdapterObj->longMetaCollection($assets);
        
        if ($parsedResponse == NULL) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $searchContentArr['response']
            );
            //to be updated later
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        
        $dataListArr = array(
            "popoverObj" => $parsedResponse
        );
        
        $response->setContent(json_encode($dataListArr));
        return $response;
    }
    
    public function shortrailXDRdataCallAction()
    {
        $dataListArr             = array();
        $accountToken            = $this->params()->fromQuery('accountToken');
        $this->searchAdapterObj  = $this->getServiceLocator()->get('search');
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        
        $response      = $this->getResponseWithHeader();
        $XDRContentArr = $this->searchAdapterObj->getRailsXDRResults($accountToken);
        if ($XDRContentArr['ApiResponseStatus'] == 200) {
            $XDRResponse = json_decode($XDRContentArr['response'], TRUE);
            usort($XDRResponse['items'], function($a, $b)
            {
                return $a["timestamp"] < $b["timestamp"];
            });
            $embedCodes = $this->searchAdapterObj->getXDREmbedcodes($XDRResponse);
            if (!empty($embedCodes)) {
                $region_list   = $this->getRegionSelection();
        $quality_list     = $this->getQualitySelection();
                $decodedSearchContentArr = $this->searchAdapterObj->getDataFromEmbeddedCode($embedCodes,$quality_list,$region_list);
                if ($decodedSearchContentArr) {
                    $parsedResponse = $this->searchAdapterObj->parseRailsSearchCollectionResults($decodedSearchContentArr, $accountToken, array(), $XDRResponse['items']);
                    
                    usort($parsedResponse, function($a, $b)
                    {
                        return $a["xdrContent"]["timestamp"] < $b["xdrContent"]["timestamp"];
                    });
                    if ($parsedResponse == NULL) {
                        $data = array(
                            'error' => 'no results for current query from search api',
                            'response' => $XDRContentArr['response']
                        );
                        //to be updated later
                        $response->setStatusCode(200)->setContent(json_encode($data));
                        return $response;
                    }
                    
                    $final_result = $this->ProcessRegion($parsedResponse);
                    $dataListArr  = array(
                        "thumblistCarouselOneArr" => $final_result
                    );
                } else {
                    $data = array(
                        'error' => 'error from search api',
                        'response' => $XDRContentArr['response']
                    );
                    $response->setStatusCode(200)->setContent(json_encode($data));
                    return $response;
                }
            }
            
        } else {
            $response->setStatusCode($XDRContentArr['ApiResponseStatus']);
            $response->setContent($XDRContentArr['response']);
            return $response;
        }
        if (empty($dataListArr)) {
            $dataListArr = array(
                'error' => 'no response'
            );
        }
        $response->setContent(json_encode($dataListArr));
        return $response;
    }
}