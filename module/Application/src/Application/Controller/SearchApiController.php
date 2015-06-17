<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class SearchApiController extends AbstractActionController
{
    protected $searchObj = array();
    protected $base = BASE_URL;

    public function getResponseWithHeader()
    {
        $response = $this->getResponse();
        $response->getHeaders()->addHeaderLine('Access-Control-Allow-Origin', '*')
                ->addHeaderLine('Access-Control-Allow-Methods', 'POST GET')
                ->addHeaderLine('Content-type', 'application/json');
        return $response;
    }

    public function getRecentlyAddedAction()
    {

        $temQopt=$this->params()->fromQuery('queryoptions');
        $temAmount=$this->params()->fromQuery('amount');
        $queryoptions=(!empty($temQopt)?
                json_decode($temQopt,true):array());
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        //$account_token        = $this->params()->fromQuery('account_token');
        $account_token= $externalApiAdapter->decryptAndGetCookie('newToken');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response = $this->getResponseWithHeader();

        $urlLastpart="";
        if(empty($queryoptions)){
          $urlLastpart="last_added";
          if(empty($temAmount)||$temAmount=='undefined'){
              $queryoptions=array("amount"=>10);
          }else{
              $queryoptions=array("amount"=>$temAmount);
          }

        }else{
//           if(empty($queryoptions['amount'])){
//                    $urlLastpart="last_added";
//                    $queryoptions["amount"]=10;
//           }
//           else{
//                    $urlLastpart="last_added";
//           }
           $urlLastpart="last_added";
           if(empty($temAmount)||$temAmount=='undefined'){
              $queryoptions["amount"]=10;
          }else{
              $queryoptions["amount"]=$temAmount;
          }


        }

        $longMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService($urlLastpart,$queryoptions);
        if($longMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($longMetadataResp));
            return $response;
        }
        if (!empty($longMetadataResp['responseContent']['errors'])) { //200 with errors from search api
            $data = array(
                'error' => 'error from search api',
                'response' => $longMetadataResp['responseContent']
            );

            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        $decodedSearchContentArr=$longSearchParser->LongCallDataArr($longMetadataResp['responseContent']);

        if (empty($decodedSearchContentArr['hits'])) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $longMetadataResp['responseContent']
            );
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }

        $result_array = array();
        foreach ($decodedSearchContentArr['hits'] as $singleHitdataArr) {
          $result_array[]=$longSearchParser->RecentlyAddedSingleHitparser($singleHitdataArr);
        }

//        $regionlist   = $this->getRegionSelection();
//        if (!empty($regionlist)) {
//            foreach ($result as $key => $value) {
//                $regionArr = array_intersect($regionlist, $value['region']);
//
//                if (!empty($regionArr)) {
//                    array_push($result_array, $value);
//                }
//            }
//        } else {
//            $result_array = $result;
//        }

        $final_result['thumblistCarouselOneArr'] = $result_array;
        $response->setContent(json_encode($final_result));
        return $response;
    }

    public function GenreListAction()
      {

            $genre                = $this->params()->fromQuery('group_type');
          //  $account_token        = $this->params()->fromQuery('accountToken');


    $externalApiAdapter = $this->getServiceLocator()->get('externalApi');

        $account_token= $externalApiAdapter->decryptAndGetCookie('newToken');
           if($account_token=='undefined'){
                $account_token=NULL;
            }

            $page_size                = !empty($this->params()->fromQuery('page_size'))?$this->params()->fromQuery('page_size'):10;
            $page_number              = !empty($this->params()->fromQuery('page_number'))?$this->params()->fromQuery('page_number'):1;
            $this->ondemandObj    = $this->getServiceLocator()->get('ondemand');
            $this->searchObj = $this->getServiceLocator()->get('search');
             $region_list=str_replace(array('[',']','"'),array('','',''),$this->getRegionSelection());
               $quality_list=str_replace(array('[',']','"'),array('','',''),$this->getQualitySelection());

               $format=($quality_list=="")?array():$quality_list;
               $region=($region_list=="")?array():$region_list;

           $types=(empty($this->params()->fromQuery('types'))?null:
                   $this->params()->fromQuery('types'));

                          $typesjsonArr=json_decode($types,true);
           $typesArrStr='"types":["'.  implode('","',$typesjsonArr['types']).'"]';

           $genreStr=(($genre=="ALL")?'"genres":[]':'"genres":["'.$genre.'"]');

           $tierStr=$this->getTiersQueryStr();
           $CommaPlustierStrOrEmpty='';
            if(!empty($tierStr)){
              $CommaPlustierStrOrEmpty=",".$tierStr;
            }
           $queryoptions ='{'.$genreStr.',"format":'.json_encode($format).
                    ',"regions":'.json_encode($region).
                    ',"page_size":'.$page_size.
                    ',"page_number":'.$page_number.','.
                    '"sort":{"field":"title", "order":"asc"},'.
                    $typesArrStr.$CommaPlustierStrOrEmpty.
                    '}';

    $drf=json_decode($queryoptions,true);


    $searchContentArr=$externalApiAdapter->basicShortSearchAndCallApiService($drf);

    //print_r($decodedSearchContentArr);
    $shortSearchParser   = $this->getServiceLocator()->get('shortSearchParser');
            $response                = $this->getResponseWithHeader();
             // $details   = $this->ondemandObj->getGenreList($genre, $page_number,
             //                                         $page_size,$quality_list,$region_list,
             //                            (empty($this->params()->fromQuery('types'))?null:$this->params()->fromQuery('types'))
             //                                     );


        if ($searchContentArr['responseStatus'] != 200) {
            $response->setStatusCode($searchContentArr['responseStatus']);
            $response->setContent($searchContentArr['responseContent']);
            return $response;
        }
        $decodedSearchContentArr =$searchContentArr['responseContent'];
        if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
            $response->setStatusCode(200)
                    ->setContent(json_encode($decodedSearchContentArr));
            return $response;
        }

        $parsedResponse = $shortSearchParser->shortCallData($decodedSearchContentArr);

        if (empty($parsedResponse)) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $searchContentArr['responseContent']
            );
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }

            $paginationDetails=array();
            if(!empty($decodedSearchContentArr)){
                $paginationDetails['SearchDuration']=$decodedSearchContentArr['SearchDuration'];
                $paginationDetails['NumOfResults']=$decodedSearchContentArr['NumOfResults'];
                $paginationDetails['StartIndex']=$decodedSearchContentArr['StartIndex'];
                $paginationDetails['PageCount']=$decodedSearchContentArr['PageCount'];
                $paginationDetails['Results_Count']=$decodedSearchContentArr['Results']['Count'];
                if($paginationDetails['Results_Count']<$paginationDetails['PageCount'])
                {//less results than page count so load more should not be shown.
                   $paginationDetails['showmore']='no';
                } else { //$paginationDetails['Results_Count'] is equal to $paginationDetails['PageCount']
                    //if totalresults($paginationDetails['NumOfResults']) greater than (those already shown :- $paginationDetails['StartIndex'])
                    // plus (those to be shown :- $paginationDetails['Results_Count'])
                    if( $paginationDetails['NumOfResults'] >
                            ($paginationDetails['StartIndex']+$paginationDetails['Results_Count']) )
                    {
                        $paginationDetails['showmore']='yes';
                    } else {
                        $paginationDetails['showmore']='no';
                    }
                }

                $paginationDetails['current_page_number']=$page_number;
                $paginationDetails['new_page_number']=$page_number+1;
            }
            $final_result['paginationDetails']=$paginationDetails;
            $final_result['thumblistCarouselOneArr']=$parsedResponse;
            $response->setContent(json_encode($final_result));
            return $response;

      }


    public function shortrailXDRdataCallAction()
    {
        $dataListArr             = array();
        $this->searchAdapterObj  = $this->getServiceLocator()->get('search');
        $externalApiAdapter      = $this->getServiceLocator()->get('externalApi');

        $accountToken            = $externalApiAdapter->decryptAndGetCookie('newToken');

        $shortSearchParser       = $this->getServiceLocator()->get('shortSearchParser');

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
                //$decodedSearchContentArr = $this->searchAdapterObj->getDataFromEmbeddedCode($embedCodes,'','');
       // $queryoptions='{"embed_code":['.$embedCode.'],"format":'.json_encode($format).',"region":'.json_encode($region).'}';

     //with tiers
 //$queryoptions='{"embed_code":['.$embedCodes.'],'.$this->getTiersQueryStr().'}';

 //without tiers
  $queryoptions='{"embed_code":['.$embedCodes.']}';

              $drf=json_decode($queryoptions,true);
              $searchContentArr=$externalApiAdapter->basicShortSearchAndCallApiService($drf);

               if ($searchContentArr['responseStatus']==200) {
                   $decodedSearchContentArr =$searchContentArr['responseContent'];
  // $parsedResponse = $this->searchAdapterObj->parseRailsSearchCollectionResults($decodedSearchContentArr, $accountToken, $imageMetaDetails, $XDRResponse['items']);
   $parsedResponse = $shortSearchParser->shortCallData($decodedSearchContentArr,null,$XDRResponse['items']);
                    usort($parsedResponse, function($a, $b)
                    {
                        if( !isset($a["xdrContent"]["timestamp"]) ||
                           !isset($b["xdrContent"]["timestamp"])
                            )
                        return 1;

                        if(!empty($a["xdrContent"]["timestamp"]) &&
                           !empty($b["xdrContent"]["timestamp"]))
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

                    $dataListArr      = array(
                        "thumblistCarouselOneArr" => $parsedResponse
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


    public function railShortCallAction()
    {
        $result_array = array();
        $queryoptions = $this->params()->fromQuery('queryoptions');
        $indexParam = $this->params()->fromQuery('indexParam');
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');

        $accountToken= $externalApiAdapter->decryptAndGetCookie('newToken');
        $types=$this->params()->fromQuery('assetType');
        
        $unentitled=$this->params()->fromQuery('unentitled');

        if ($accountToken == 'null' || $accountToken=='undefined' || empty($accountToken) ) {
            $accountToken = NULL;
        }
         if (isset($_COOKIE["loggedin&*"]) && ($_COOKIE["loggedin&*"]=='true'||$_COOKIE["loggedin&*"]==true) ) {
                if (!isset($accountToken)) {
                    $accountToken = NULL;
                }
            } else {
                $accountToken = NULL;
            }

        $shortSearchParser   = $this->getServiceLocator()->get('shortSearchParser');

        $response               = $this->getResponseWithHeader();
        if (empty($queryoptions)) {
            $queryoptions = "";
        }
        $region_list      = $this->getRegionSelection();
        $quality_list     = $this->getQualitySelection();
        $queryoptionsObj=  json_decode($queryoptions,true);

        if(isset($types) && !empty($types)){
            $queryoptionsObj['types']=$types;
        }
     //   print_r("==========================");
      //  print_r($queryoptionsObj);
        $tierArr=null;
        if($accountToken!=NULL)
        {
            $tierStr=$this->getTiersQueryStr();
            if(!empty($tierStr))

            try{
                    $ntierStr="{".$tierStr."}";
                    $dntierStr=json_decode($ntierStr,true);
                    $tierArr=$dntierStr=$dntierStr['tiers'];                 
                
                if(!empty($unentitled) && $unentitled=='true'){   
                   //no tier need to be passed to api
                   //used for promotional rails
                } else {
   
                    $queryoptionsObj['tiers']=$dntierStr; 
                } 
            
            }catch(\Exception $e){

            }
        }

        $drf=$queryoptionsObj;

        $searchContentArr = $externalApiAdapter->basicShortSearchAndCallApiService($drf);

        if ($searchContentArr['responseStatus'] != 200) {
            $response->setStatusCode($searchContentArr['responseStatus']);
            $response->setContent($searchContentArr['responseContent']);
            return $response;
        }
        $decodedSearchContentArr =$searchContentArr['responseContent'];
        if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
            $response->setStatusCode(200)->setContent(json_encode($decodedSearchContentArr));
            return $response;
        }
        $parsedResponse = $shortSearchParser->shortCallData($decodedSearchContentArr,$tierArr);

        if (empty($parsedResponse)) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $searchContentArr['responseContent']
            );
            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        $dataListArr = array(
            "thumblistCarouselOneArr" => $parsedResponse,
            "indexParam"=>$indexParam
        );
        $response->setContent(json_encode($dataListArr));
        return $response;
    }

    public function manualrailShortCallAction()
    {

        $queryoptions = $this->params()->fromQuery('queryoptions');
        //$accountToken = $this->params()->fromQuery('accountToken');
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');

        $accountToken= $externalApiAdapter->decryptAndGetCookie('newToken');

        if (empty($accountToken) || $accountToken == 'null' || $accountToken=='undefined' ) {
            $accountToken = NULL;
        }
         if (isset($_COOKIE["loggedin&*"]) && ($_COOKIE["loggedin&*"]=='true'||$_COOKIE["loggedin&*"]==true) ) {
                if (!isset($accountToken)) {
                    $accountToken = NULL;
                }
            } else {
                $accountToken = NULL;
            }

        $shortSearchParser   = $this->getServiceLocator()->get('shortSearchParser');
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
         $queryoptions='{"id":"'.$titleid.'"';
        $queryoptions     = $queryoptions . ',"regions":' .trim(stripslashes(json_encode($region_list)),'"');
        $queryoptions     = $queryoptions . ',"format":' . trim(stripslashes(json_encode($quality_list)),'"');
        $queryoptions     = $queryoptions . '}';

        $drf=json_decode($queryoptions,true);
            $searchContentArr = $externalApiAdapter->basicShortSearchAndCallApiService($drf);
            if ($searchContentArr['responseStatus'] != 200) {
                //            $response->setStatusCode($searchContentArr['ApiResponseStatus']);
                //            $response->setContent($searchContentArr['response']);
                //            return $response;
                $FailedCallList[$titleid]['titleID']        = $titleid;
                $FailedCallList[$titleid]['responseStatus'] = $searchContentArr['responseStatus'];
                $FailedCallList[$titleid]['responseContent']       = $searchContentArr['responseContent'];
                $FailedCallsCount++;

            } else {
                //var_dump($searchContentArr['responseContent']);
                $decodedSearchContentArr = $searchContentArr['responseContent'];
                if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
                    //            $data = array(
                    //                'error' => 'error from search api',
                    //                'response'=> $searchContentArr['response']
                    //            );
                    //   $response->setStatusCode(200)->setContent(json_encode($data));
                    //   return $response;
                    $FailedCallList[$titleid]['titleID']        = $titleid;
                    $FailedCallList[$titleid]['responseStatus'] = $searchContentArr['responseStatus'];
                    $FailedCallList[$titleid]['responseContent']       = $searchContentArr['responseContent'];
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
            $parsedResponse                       = $shortSearchParser->shortCallData($SearchContentArr);
        }
        if ($parsedResponse == NULL) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $searchContentArr['responseContent']
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

        $titleId                = $this->params()->fromQuery('titleID');

        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response           = $this->getResponseWithHeader();

        $longMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService($titleId);
        if($longMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($longMetadataResp));
            return $response;
        }
        $longParserResp=$longSearchParser->LongCallDataArr($longMetadataResp['responseContent']);
        $decodedSearchContentArr = $longParserResp;
        if (!empty($decodedSearchContentArr['errors'])) { //200 with errors from search api
            $data = array(
                'error' => 'error from search api',
                'response' => $longMetadataResp['responseContent']
            );

            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }
        $parsedResponse = $longSearchParser->longMetaforPopover($longParserResp);

        if ($parsedResponse == NULL) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response' => $longMetadataResp['responseContent']
            );

            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;
        }

        $dataListArr = array(
            "popoverObj" => $parsedResponse
        );

        $response->setContent(json_encode($dataListArr));
        return $response;
    }

     /*
     * term wise people search and parse the content
     */
    //People search-----------------------------------------------------------------------------------
    public function searchByTypeAction()
    {
        $searchKey            = $this->params()->fromQuery('q');
        $searchType           = $this->params()->fromQuery('type');
        $externalApiAdapter   = $this->getServiceLocator()->get('externalApi');
        $searchResult         = $externalApiAdapter->instantSearchOnDemand($searchType, $searchKey);
        $response             = $this->getResponseWithHeader();
        $searchContent        = array();
        if($searchResult['responseStatus'] == 200) {
            if(!empty($searchResult['responseContent'])) {
                if(!empty($searchResult['responseContent']['Link'])) {
                    $finalSearchResult['link']         = $searchResult['responseContent']['Link'];
                    $finalSearchResult['NumOfResults'] = count($searchResult['responseContent']['Link']);
                } else {
                    $finalSearchResult['warning'] = "no results for current query from instant search api";
                    $finalSearchResult['NumOfResults'] = 0;
                }
            }
        }
        if(empty($finalSearchResult)) {
            $finalSearchResult['warning'] = "no results for current query from instant search api";
        }
        $response->setStatusCode($searchResult['responseStatus'])->setContent(json_encode($finalSearchResult));
        return $response;
    }

    public function GetSearchMiniContentAction()
    {
        $contentId            = $this->params()->fromQuery('contentId');
        $position             = $this->params()->fromQuery('position');
        $externalApiAdapter   = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser    = $this->getServiceLocator()->get('shortSearchParser');
        //$account_token=
        $accountToken = $this->params()->fromQuery('accountToken');
    /*
        $accountToken= $externalApiAdapter->decryptAndGetCookie('newToken');
    */
        if($this->params()->fromQuery('embed_code')){
            $embdcode = $this->params()->fromQuery('embed_code');
            $queryOption          = array('q' => '{"embed_code":"'.$embdcode.'"}');
            $searchResult         = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
            if(count($searchResult['Results']['Results'])>0)
               $contentId = $searchResult['Results']['Results'][0]['Title']['Id'];
        }else {
            $queryOption          = array('q' => '{"id":"'.$contentId.'"}');
            $searchResult         = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
        }
        $searchContent       = array();
        if($searchResult['responseStatus'] == 200) {
            if(!empty($searchResult['responseContent'])) {
                $parsedResponse = $shortSearchParser->shortCallData($searchResult['responseContent']);
                if(!empty($parsedResponse)) {
                     $searchContent = $parsedResponse[0];
                     $searchContent['position'] = $position;
                }
            }

        } else {
            $searchContent = $searchResult['responseContent'];
        }
        if(empty($searchContent)) {
            $searchContent['warning'] = "no results for current query from instant search api";
            $searchContent['position'] = $position;
            $searchContent['asset']=null;
        }
        $response                 = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchContent));
        return $response;
    }


public function GetSearchTotalMiniContentAction()
    {
        $contentId            = $this->params()->fromQuery('contentId');
        $position             = $this->params()->fromQuery('position');
        $externalApiAdapter   = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser    = $this->getServiceLocator()->get('shortSearchParser');
        $positionArray=json_decode($position);

        //$account_token=
        $accountToken = $this->params()->fromQuery('accountToken');
    /*
        $accountToken= $externalApiAdapter->decryptAndGetCookie('newToken');
    */
        if($this->params()->fromQuery('embed_code')){
            $embdcode = $this->params()->fromQuery('embed_code');
            $queryOption          = array('q' => '{"embed_code":"'.$embdcode.'"}');
            $searchResult         = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
            if(count($searchResult['Results']['Results'])>0)
               $contentId = $searchResult['Results']['Results'][0]['Title']['Id'];
        }else {
            $queryOption          = array('q' => '{"id":'.$contentId.'}');
            $searchResult         = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
        }
        $searchContent       = array();
        $idCount = array();
        if($searchResult['responseStatus'] == 200) {
            if(!empty($searchResult['responseContent'])) {
                $parsedResponse = $shortSearchParser->shortCallData($searchResult['responseContent']);
                if(!empty($parsedResponse)) {
                     $searchContent = $parsedResponse;
                     for($count=0;$count < count($searchContent);$count++) {
                        $searchContent[$count]['position'] = array_search($searchContent[$count]['id'], json_decode($contentId));
                        array_push($idCount,$searchContent[$count]['position']);
                     }
                     $missing = array_diff($positionArray,$idCount);
                     array_push($searchContent,$missing);
                }
            }

        } else {
            $searchContent = $searchResult['responseContent'];
        }
        if(empty($searchContent)) {
            $searchContent['warning'] = "no results for current query from instant search api";
            $searchContent['position'] = $position;
            $searchContent['asset']=null;
        }
        $response                 = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchContent));
        return $response;
    }

    public function GetSearchDataByMiniContentAction()
    {
        $contentId            = $this->params()->fromQuery('contentId');
        $position             = $this->params()->fromQuery('position');
        $externalApiAdapter   = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser    = $this->getServiceLocator()->get('shortSearchParser');
        $positionArray        = json_decode($position);


        $accountToken = $this->params()->fromQuery('accountToken');
    /*
        $accountToken= $externalApiAdapter->decryptAndGetCookie('newToken');
    */
        if($this->params()->fromQuery('embed_code')){
            $embdcode = $this->params()->fromQuery('embed_code');
            $queryOption          = array('q' => '{"embed_code":"'.$embdcode.'"}');
            $searchResult         = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
            if(count($searchResult['Results']['Results'])>0)
               $contentId = $searchResult['Results']['Results'][0]['Title']['Id'];
        }else {
            $queryOption          = array('q' => '{"id":'.$contentId.'}');
            $searchResult         = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
        }
        $searchContent       = array();
        $finalSearchResult=array();
        $idCount = array();
        if($searchResult['responseStatus'] == 200) {
            if(!empty($searchResult['responseContent'])) {
                $parsedResponse = $shortSearchParser->shortCallData($searchResult['responseContent']);
                if(!empty($parsedResponse)) {
                     $searchContent = $parsedResponse;
                     for($count=0;$count < count($searchContent);$count++) {
                        $searchContent[$count]['position'] = array_search($searchContent[$count]['id'], json_decode($contentId));
                        array_push($idCount,$searchContent[$count]['position']);
                     }
                     $finalSearchResult['assets']=$searchContent;
                     $missing = array_diff($positionArray,$idCount);
                     $finalSearchResult['missing_positions']=$missing;
                }
            }

        } else {
            $searchContent = $searchResult['responseContent'];
        }
        if(empty($searchContent)) {
            $finalSearchResult['warning'] = "no results for current query from instant search api";
            $finalSearchResult['missing_positions'] = array();
            $finalSearchResult['assets']=array();
        }
        $response                 = $this->getResponseWithHeader();
        $response->setContent(json_encode($finalSearchResult));
        return $response;
    }

    /*New Serch implementation*/
    public function getNewSearchResultsByQueryOptionAction() {
        $query               = $this->params()->fromQuery('query');
        $page_no             = json_decode($query);
        $page_number         = (isset($page_no->page_number) && !empty($page_no->page_number)) ? $page_no->page_number : 1;
        $externalApiAdapter  = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser   = $this->getServiceLocator()->get('shortSearchParser');
        $tierStr             = $this->getTiersQueryStr();
        if(empty($tierStr) && empty($query)) {
            $finalSearchResult['warning'] = "no tier/query option found with the request";
        } else {
            $tierStr  = '{'.$tierStr.'}';
            $tierArr  = json_decode($tierStr, true);
            $queryArr = json_decode($query, true);
            $queryArr["tiers"] = $tierArr["tiers"];
            $queryArr = json_encode($queryArr);
            $queryOption = array('q' => $queryArr); 
        }
        $searchResult        = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
        if($searchResult['responseStatus'] == 200) {
            if(!empty($searchResult['responseContent'])) {
                $finalSearchResult['NumOfResults'] = $searchResult['responseContent']['NumOfResults'];
                $parsedResponse    = $shortSearchParser->shortCallData($searchResult['responseContent']);
                if(!empty($parsedResponse)) {
                    $finalSearchResult['assets'] = $parsedResponse;
                    $paginationDetails['SearchDuration'] = $searchResult['responseContent']['SearchDuration'];
                    $paginationDetails['NumOfResults']   = $searchResult['responseContent']['NumOfResults'];
                    $paginationDetails['StartIndex']     = $searchResult['responseContent']['StartIndex'];
                    $paginationDetails['PageCount']      = $searchResult['responseContent']['PageCount'];
                    $paginationDetails['Results_Count']  = $searchResult['responseContent']['Results']['Count'];
                    if($paginationDetails['Results_Count'] < $searchResult['responseContent']['PageCount']){
                        //less results than page count so load more should not be shown.
                       $paginationDetails['showmore']='no';
                    } else {
                        //$paginationDetails['Results_Count'] is equal to
                        if( $paginationDetails['NumOfResults'] >
                                ($paginationDetails['StartIndex']+$paginationDetails['Results_Count']) )
                        {
                            $paginationDetails['showmore']='yes';
                        } else {
                            $paginationDetails['showmore']='no';
                        }
                    }
                    $paginationDetails['current_page_number'] = $page_number;
                    $paginationDetails['new_page_number']     = $page_number+1;
                    $finalSearchResult['paginationDetails']   = $paginationDetails;
                } else {
                    $finalSearchResult['warning'] = "no results for current query from instant search api";
                }
            }

        }
        if(empty($finalSearchResult)) {
            $finalSearchResult['warning'] = "no results for current query from instant search api";
        }
        $response                 = $this->getResponseWithHeader();
        $response->setContent(json_encode($finalSearchResult));
        return $response;
    }


    /*New people Search implementation*/
    public function GetPeopleSearchDataByMiniContentAction()
    {
        $searchKey            = $this->params()->fromQuery('q');
        $page_no               = json_decode($searchKey);
        $page_number           = $page_no->page_number;
        //$page_number              = $this->params()->fromQuery('page_number');
        $externalApiAdapter   = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser    = $this->getServiceLocator()->get('shortSearchParser');
        //$positionArray=json_decode($position);
        if($this->params()->fromQuery('embed_code')){
            $embdcode = $this->params()->fromQuery('embed_code');
            $queryOption          = array('q' => '{"embed_code":"'.$embdcode.'"}');
            $searchResult         = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
            if(count($searchResult['Results']['Results'])>0)
               $contentId = $searchResult['Results']['Results'][0]['Title']['Id'];
        }else {

            $queryOption          = array('q' => $searchKey);
            $searchResult         = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
        }
        $searchContent       = array();
        $finalSearchResult=array();
        $paginationDetails = array();
        if($searchResult['responseStatus'] == 200) {
            if(!empty($searchResult['responseContent'])) {
                $parsedResponse = $shortSearchParser->shortCallData($searchResult['responseContent']);
                 if(!empty($parsedResponse)) {
                    $paginationDetails['SearchDuration']=$searchResult['responseContent']['SearchDuration'];
                    $paginationDetails['NumOfResults']=$searchResult['responseContent']['NumOfResults'];
                    $paginationDetails['StartIndex']=$searchResult['responseContent']['StartIndex'];
                    $paginationDetails['PageCount']=$searchResult['responseContent']['PageCount'];
                    $paginationDetails['Results_Count']=$searchResult['responseContent']['Results']['Count'];
                    if($paginationDetails['Results_Count']<$searchResult['responseContent']['PageCount'])
                    {//less results than page count so load more should not be shown.
                       $paginationDetails['showmore']='no';
                    } else { //$paginationDetails['Results_Count'] is equal to $paginationDetails['PageCount']
                        //if totalresults($paginationDetails['NumOfResults']) greater than (those already shown :- $paginationDetails['StartIndex'])
                        // plus (those to be shown :- $paginationDetails['Results_Count'])
                        if( $paginationDetails['NumOfResults'] >
                                ($paginationDetails['StartIndex']+$paginationDetails['Results_Count']) )
                        {
                            $paginationDetails['showmore']='yes';
                        } else {
                            $paginationDetails['showmore']='no';
                        }
                    }

                    $paginationDetails['current_page_number']=$page_number;
                    $paginationDetails['new_page_number']=$page_number+1;
                    $searchContent = $parsedResponse;
                    $finalSearchResult['assets']=$searchContent;
                    $finalSearchResult['paginationDetails']=$paginationDetails;
                 }
            }

        } else {
            $searchContent = $searchResult['responseContent'];
        }
        if(empty($searchContent)) {
            $finalSearchResult['warning'] = "no results for current query from mini people search api";
            $finalSearchResult['assets']=array();
        }
        $response                 = $this->getResponseWithHeader();
        $response->setContent(json_encode($finalSearchResult));
        return $response;
    }

    public function GetSummaryAction()
    {
        $contentId           = $this->params()->fromQuery('contentId');
        $position            = $this->params()->fromQuery('position');
        $externalApiAdapter  = $this->getServiceLocator()->get('externalApi');
        $longSearchParser    = $this->getServiceLocator()->get('longSearchParser');
        $searchResult        = $externalApiAdapter->constructUrlForLongSearchAndCallApiService($contentId);
        $searchContent       = array();

        if($searchResult['responseStatus'] == 200) {
            if(!empty($searchResult['responseContent'])) {
                $parsedResponse      = $longSearchParser->LongCallDataArr($searchResult['responseContent']);
                $basicParsedResponse = $longSearchParser->longMetadataParser($parsedResponse);
                if(!empty($basicParsedResponse)) {
                     $searchContent = $basicParsedResponse[0];
                     $searchContent['position'] = $position;
                }

            }
        }
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($searchContent));
        return $response;
    }

    public function PeopleSearchDetailAction()
    {
        $name                = $this->params()->fromQuery('name');
        $externalApiAdapter  = $this->getServiceLocator()->get('externalApi');
        $shortSearchParser   = $this->getServiceLocator()->get('shortSearchParser');
        $longSearchParser    = $this->getServiceLocator()->get('longSearchParser');
        $queryOption         = array('q' => '{"people":[{"name":"'.$name.'"}]}');
        $searchResult        = $externalApiAdapter->constructUrlForShortSearchAndCallApiService($queryOption);
        $peopleSearchContent = array();

        if($searchResult['responseStatus'] == 200) {
            if(!empty($searchResult['responseContent'])) {
                $shortSearchArray = $shortSearchParser->getShortSearchParser($searchResult['responseContent']);
                if(!empty($shortSearchArray)) {
                    foreach ($shortSearchArray as $key => $shortSearch) {
                        $searchLongResult  = $externalApiAdapter->constructUrlForLongSearchAndCallApiService($shortSearch['id']);
                        if($searchLongResult['responseStatus'] == 200) {
                            if(!empty($searchLongResult['responseContent'])) {
                                $parsedLongResponse  = $longSearchParser->LongCallDataArr($searchLongResult['responseContent']);
                                if(!empty($parsedLongResponse)) {
                                    $basicParsedLongResponse  = $longSearchParser->longMetadataParser($parsedLongResponse);
                                    if(!empty($basicParsedLongResponse)) {
                                        $peopleSearchContent[$key] = $basicParsedLongResponse[0];

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $response          = $this->getResponseWithHeader();
        $response->setContent(json_encode($peopleSearchContent));
        return $response;
    }


}