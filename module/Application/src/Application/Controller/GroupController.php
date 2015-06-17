<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Application\Controller;
use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\Http\Client;
use Zend\Http\Request;
use Directv\Ooyala\OoyalaAPI;
use Directv\ImageShack\ImageShackUtility;

class GroupController extends AbstractRestfulController
  {
    public function GetGroupResultAction()
      {
        $group_type             = $this->params()->fromQuery('group_type');
        $source_type            = $this->params()->fromQuery('source_type');
        $account_token          = $this->params()->fromQuery('account_token');
        $ResultArray            = array();
        $entitlement_contents   = array();
        $isEntitleMentAvailable = false;
        try
          {
            $this->_config     = $this->getServiceLocator()->get('Config');
            $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
            $this->searchObj = $this->getServiceLocator()->get('search');
            $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
            if ($account_token)
              {
                $entitlementList = $this->searchObj->getEntitlements($account_token);
                if (!empty($entitlementList) && isset($entitlementList['entitlements']))
                  {
                    $entitlement_contents = $entitlementList['entitlements'];
                  }
              }
            $requestPath = $this->_config['general_routes']['movieAndTv'][$group_type];
            $url             = $this->generateOoyalaApiUrlWithSignature('GET', $requestPath);
            $Result          = $this->ondemandObj->getGroupItemList($url);
            $embedded_Code   = "";
            foreach ($Result->results as $key => $value)
              {
                $embedded_Code = $embedded_Code . '"' . $value->embed_code . '",';
              }
            if (count($embedded_Code) > 0)
              {
                $embedded_Code = trim($embedded_Code, ",");
              }
               $region_list=str_replace(array('[',']','"'),array('','',''),$this->getRegionSelection());
               $quality_list=str_replace(array('[',']','"'),array('','',''),$this->getQualitySelection());
            $Mini_data_result = $this->ondemandObj->getDataFromEmbeddedCode($embedded_Code,$quality_list,$region_list);
            $SearchParser_Result      = $this->SearchParser($Mini_data_result, $ResultArray, $entitlement_contents);
            $final_result['thumblistCarouselOneArr']=$this->ProcessRegion($SearchParser_Result);
            $response         = $this->getResponseWithHeader();
            $response->setContent(json_encode($final_result));
            return $response;
          }
        catch (\Exception $e)
          {
            $ResultArray = $this->SearchParser($Mini_data_result, $ResultArray);
            $response    = $this->getResponseWithHeader();
            $response->setContent(json_encode($ResultArray));
            return $response;
          }
      }
    

    
    public function SearchParser($response, $result,  $entitlement_contents)
      {
        if ($response && $response->NumOfResults > 0 && $response->Results->Count > 0)
          {
            foreach ($response->Results->Results as $key => $value)
              {
                $item_details=array();
               $result[$key]=$this->searchObj->Mini_Data_Parser($value,$entitlement_contents);
              }
          }
        return $result;
      }
    

    
    public function generateOoyalaApiUrlWithSignature($method, $requestPath)
      {
        //$this->_config  = $this->getServiceLocator()->get('Config');
        $ooyalaApiObject = new OoyalaAPI();
        $config          = $this->getServiceLocator()->get('Config');
        $apiKey          = $this->_config['ooyala']['backlot_api_key'];
        $secretKey       = $this->_config['ooyala']['backlot_secret_key'];
        $generatedUrl    = $ooyalaApiObject->generateURL($method, $apiKey, $secretKey, $this->getDataTimeTwoDaysAfter(), $requestPath, "", "", DISCOVERY); //OAL_PLAYER --> DISCOVERY
        return $generatedUrl;
      }
    
    public function getResponseWithHeader()
      {
        $response = $this->getResponse();
        $response->getHeaders()->addHeaderLine('Access-Control-Allow-Origin', '*')->addHeaderLine('Access-Control-Allow-Methods', 'POST GET')->addHeaderLine('Content-type', 'application/json');
        return $response;
      }
    protected function getDataTimeTwoDaysAfter()
      {
        $dateTimeInStrtotime = strtotime(date('Y-m-d h:m:s', strtotime(date('Y-m-d h:m:s') . ' +2 day')));
        return $dateTimeInStrtotime;
      }
    
    
    public function GenreListAction()
      {
        try
          {
            $genre                = $this->params()->fromQuery('group_type');
            $account_token        = $this->params()->fromQuery('account_token');
            if($account_token=='undefined'){
                $account_token=NULL;
            }
            $page_size                = !empty($this->params()->fromQuery('page_size'))?$this->params()->fromQuery('page_size'):10;
            $page_number              = !empty($this->params()->fromQuery('page_number'))?$this->params()->fromQuery('page_number'):1;
            $this->ondemandObj    = $this->getServiceLocator()->get('ondemand');
            $this->searchObj = $this->getServiceLocator()->get('search');
             $region_list=str_replace(array('[',']','"'),array('','',''),$this->getRegionSelection());
               $quality_list=str_replace(array('[',']','"'),array('','',''),$this->getQualitySelection());
           $details=''; 
           if($genre=="all")
            {   
             
              $details   = $this->ondemandObj->getAllGenreList($page_number,$page_size,
                                                                          $quality_list,$region_list,
                                           (empty($this->params()->fromQuery('types'))?null:$this->params()->fromQuery('types'))      
                                                );
            }
            else
            {
              
              $details   = $this->ondemandObj->getGenreList($genre, $page_number,
                                                      $page_size,$quality_list,$region_list,
                                         (empty($this->params()->fromQuery('types'))?null:$this->params()->fromQuery('types'))     
                                                  );
            }
          if(!empty($details->errors)){
            $response = $this->getResponseWithHeader();
            $response->setContent(json_encode( ((array)$details->errors) ));
            return $response;              
          }
            $searchResultArray    = array();
            $entitlement_contents = array();

            if (!empty($account_token))
              {
                
                $entitlementList = $this->searchObj->getEntitlements($account_token);
                if (!empty($entitlementList) && isset($entitlementList['entitlements']))
                  {
                    $entitlement_contents = $entitlementList['entitlements'];
                  }
              }   
           
            if (!empty($details) && $details->Results->Count > 0)
              {
                foreach ($details->Results->Results as $key => $result)
                  {
                    $item_details=array();
                $item_details=$this->searchObj->Mini_Data_Parser($result,$entitlement_contents);
                $searchResultArray[$key]=$item_details;
                  }
              }
            $paginationDetails=array();
            if(!empty($details) && $details->Results->Count>=0){
                $paginationDetails['SearchDuration']=$details->SearchDuration;
                $paginationDetails['NumOfResults']=$details->NumOfResults;
                $paginationDetails['StartIndex']=$details->StartIndex;
                $paginationDetails['PageCount']=$details->PageCount;
                $paginationDetails['Results_Count']=$details->Results->Count;
                if($paginationDetails['Results_Count']<$paginationDetails['PageCount'])
                {//less results than page count so load more should not be shown.
                   $paginationDetails['showmore']='no'; 
                } else { //$paginationDetails['Results_Count'] is equal to $paginationDetails['PageCount']
                    //if totalresults($paginationDetails['NumOfResults']) greater than (those already shown :- $paginationDetails['StartIndex'])
                    // plus (those to be shown :- $paginationDetails['Results_Count'])
                    if($paginationDetails['NumOfResults'] > ($paginationDetails['StartIndex']+$paginationDetails['Results_Count']) )
                    {
                        $paginationDetails['showmore']='yes'; 
                    } else {
                        $paginationDetails['showmore']='no';
                    }
                }
                
                $paginationDetails['current_page_number']=$page_number;
                $paginationDetails['new_page_number']=$page_number+1;
            }
          //  $final_result['thumblistCarouselOneArr']=$this->ProcessRegion($searchResultArray);
            $final_result['paginationDetails']=$paginationDetails;
            $final_result['thumblistCarouselOneArr']=$searchResultArray;
            $response = $this->getResponseWithHeader();
            $response->setContent(json_encode($final_result));
            return $response;
          }
        catch (\Exception $e)
          {
            
          }
      }


      public function ProcessRegion($actual_result)
      {
             $result_array=array();
             $regionlist=array();
             $quality_list=array();
             if(!is_array($this->getRegionSelection()))
              $regionlist= json_decode($this->getRegionSelection(),true);
             
             if(!is_array($this->getQualitySelection()))
              $quality_list= json_decode($this->getQualitySelection(),true);
            
                 
             $checkRegion=false;
              $checkQuality=false;
 if(!empty($regionlist)){
$checkRegion=true;
 } 
  if(!empty($quality_list)){
$checkQuality=true;
 } 

            if($checkRegion || $checkQuality)
            {
            foreach ($actual_result as $key => $value) {
              $regionMatch=true;
              $qualityMatch=true;
              $region=array_intersect( $regionlist , $value['region']);
              if($checkRegion && empty($region))
                  $regionMatch=false;
              $quality=  array_intersect( $quality_list , $value['quality']);
              if($checkQuality && $quality_list[0]!='All' && empty($quality))
                 $qualityMatch=false;
               if($regionMatch && $qualityMatch)
                array_push($result_array,$value);
              
            }
            }
        else
        {
            $result_array=$actual_result;
        }
        return $result_array;
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
    
  }