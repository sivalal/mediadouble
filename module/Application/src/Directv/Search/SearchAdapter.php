<?php

namespace Directv\Search;

use Zend\Http\Request;
use Zend\Http\Client;


class SearchAdapter implements SearchAdapterInterface
{
    protected $param = null;
    protected static $http = null;
    protected static $cache = null;

    public function __construct($param, $curlOptionParam) {
      $this->param           = $param;
      $this->curlOptionParam = $curlOptionParam;
      static::$http          = $this->getHttpClient();
      $this->dateFormat      = "y-m-d h:i:s A T";
    }
    public function getSecureEntitlementsListApiCall($access_token) {
        $entitlementRoute   = $this->param['entitlements'];
        $url                = OAL.$entitlementRoute."?account_token=".urlencode($access_token);
        $resp               = $this->validateSendRequest($url);
        return $resp;
    }

// Gets the  list of Genre to be displayed in Genre filter
    public  function getGenreList($apiKey){
      //  http://player.staging.us-east-1.atlantis.services.ooyala.com/search/v1/genres

      $url=  OAL.$this->param['genreList']."?helios_api_key=".$apiKey;
      //$url='https://player-staging.ooyala.com/search/v1/genres';  
       $searchContentArr=$this->validateSendRequest($url);
       if($searchContentArr['ApiResponseStatus']!=200){
           return $searchContentArr;
       } 
       $responseArr= json_decode($searchContentArr['response'],true );       
       $genreArr=array();
       
       if(isset($responseArr['genres']))
       {
           //convert all to lower case
           $responseArr['genres'] = array_map("strtolower", $responseArr['genres']);
           sort($responseArr['genres']);
        $genreArr[]=array("href"=>"#","label"=>"ALL_GENRES",
               "short_label"=>"all","collection_name"=>"all");
       foreach ($responseArr['genres'] as $value) {
           $genreArr[]=array("href"=>"#","label"=>ucfirst($value),
               "short_label"=>$value,"collection_name"=>$value);
       }
     }
       $parsedGenreArr=array();
       $parsedGenreArr['ApiResponseStatus']=200;
       $parsedGenreArr['response']=$this->ListSplitter($genreArr,8);
       return $parsedGenreArr; 
    }


 public function GenericSearchParser_SingleResult($response,$shack_url)
    {
      $result=array();
        if ($response && $response->NumOfResults > 0 && $response->Results->Count > 0) {
                $value= $response->Results->Results[0];
                $result["id"]    = $value->Title->Id;
                $result["Title"] = $value->Title->Title;
                $result=$this->GetSPType( $result ,$value->Title->TitleType);
                $result['preview_thumb'] = BASE_URL.'/dummy/blank_image.png';
                if ($value->Title->Assets->Count > 0) {
                    $assets = $value->Title->Assets->Assets[0]->Attributes;
                   $result['AvailableUntil']=$value->Title->Assets->Assets[0]->AvailableUntil;
               if(isset($value->Title->Assets->Assets[0]->Duration))
               {
                 $result["Duration"] = $value->Title->Assets->Assets[0]->Duration;
               }
                    if ($assets->Count > 0) {
                        foreach ($assets->Attribute as $videoAsset) {
                            if ($videoAsset->Key == "embed_code" && !empty($videoAsset->Value[0])) {
                                $result['content_id'] = $videoAsset->Value[0];
                            } else if ($videoAsset->Key == "preview_thumb_320x240" && !empty($videoAsset->Value[0])) {
                                $result['preview_thumb'] = $shack_url.$videoAsset->Value[0];
                                
                            } else if ($videoAsset->Key == "thumbnail" && !empty($videoAsset->Value[0])) {
                                $result['preview_thumb'] = $shack_url.$videoAsset->Value[0];
                                
                            }
                             else if ($videoAsset->Key == "tiers" && !empty($videoAsset->Value[0]))
                              { $result['tier'] =$videoAsset->Value[0];
                              }
                        }
                    }
                }
        }
        return $result;
    }

// function user for parsing the data returned by mini meta data calls or search 
// API's that return data in format similar to MINI 
    public function GenericSearchParser_SingleResult_New($response,$entitlement_contents)
    {
      $result=array();
        if ($response && $response->NumOfResults > 0 && $response->Results->Count > 0) {
               $result=$this->Mini_Data_Parser($response->Results->Results[0],$entitlement_contents);
        }
        return $result;
    }

    public function GenericSearchParser_people_details($response,$entitlement_contents)
    {
      $result=array();
        if ($response) {
               $result=$this->Mini_Data_Parser($response,$entitlement_contents);
        }
        return $result;
    }


     public function Mini_Data_Parser($value,$entitlement_contents)
    {
      $result=array();
      $showFlag = true;
                $result["id"]    = $value->Title->Id;
                $result["title"] = $value->Title->Title;
                $result["titleType"] = $value->Title->TitleType;
               $result=$this->GetSPType( $result ,$value->Title->TitleType);
                $result['imagePath'] = BASE_URL.'/dummy/blank_image.png';
                if ($value->Title->Assets->Count > 0) {
$result['region']=array();
$result['quality']=array();
                  foreach ($value->Title->Assets->Assets as $key => $assets_out) {
                  
                    $assets = $assets_out->Attributes;
                   $result['AvailableUntil']=$assets_out->AvailableUntil;
               if(isset($assets_out->Duration))
               {
                 $result["Duration"] = $assets_out->Duration;
               }
                    if ($assets->Count > 0) {
                        foreach ($assets->Attribute as $videoAsset) {
                            if ($videoAsset->Key == "embed_code" && !empty($videoAsset->Value[0])) {
                                $result['content_id'] = $videoAsset->Value[0];
                            } else if ($videoAsset->Key == "preview_thumb_320x240" && !empty($videoAsset->Value[0])) {
                                $result['imagePath'] = $videoAsset->Value[0];
                                
                            } else if ($videoAsset->Key == "thumbnail" && !empty($videoAsset->Value[0])) {
                                $result['imagePath'] = $videoAsset->Value[0];
                                
                            }
                            else if($videoAsset->Key =="format" &&  !empty($videoAsset->Value[0]))
                            {
                                array_push($result['quality'],$videoAsset->Value[0]);
                            }
                           else if ($videoAsset->Key == "tiers" && !empty($videoAsset->Value[0]))
                              {
                                $tier = $videoAsset->Value[0];
                                foreach ($entitlement_contents as $key1 => $entitlement)
                                  {
                                    $showFlag = false;
                                    if ($entitlement['id'] == $tier)
                                      {
                                        $showFlag = true;
                                        break;
                                      }
                                  }
                              }
                              else if($videoAsset->Key == "region")
                              {
                              array_push($result['region'],$videoAsset->Value[0]);
                              }

                        }
                    }
                  }
                }
                if(!$showFlag)
                  return array();
        return $result;
    }
  
  //Identifies the single page and content type from title type value returned by MINI data call
  public function GetSPType($result,$TitleType)
  {
     switch ($TitleType) {
                              case '1':
                                  $content_type = "feature film";
                                  $category     = "movie";
                                  break;
                              case '2':
                                  $content_type = "tv series";
                                  $category     = "tvShow";
                                  break;
                              case '3':
                                  $content_type = "short film";
                                  $category     = "movie";
                                  break;
                              case '4':
                                  $content_type = "tv season";
                                  $category     = "tvShow";
                                  break;
                              case '5':
                                  $content_type = "tv episode";
                                  $category     = "tvShow";
                                  break;
                              case '6':
                                  $content_type = "tv show";
                                  $category     = "tvShow";
                                  break;
                              default:
                                  $content_type = "movie";
                                  $category     = "movie";
                                  break;
                          }
                          $result["source"]=$category;
                          $result["content_type"]=$content_type ;
                          return  $result;
  }

  //Identifies the single page and content type from title type value returned by LONG data call
  public function GetSPType_Long($result)
  {

     switch ($result['showtype']) {
                              case 'Movie':
                                  $content_type = "feature film";
                                  $category     = "movie";
                                  break;
                              case 'Series':
                                  $content_type = "tv series";
                                  $category     = "tvShow";
                                  break;
                              case '3':
                                  $content_type = "short film";
                                  $category     = "movie";
                                  break;
                              case 'Season':
                                  $content_type = "tv season";
                                  $category     = "tvShow";
                                  break;
                              case 'Episode':
                                  $content_type = "tv episode";
                                  $category     = "tvShow";
                                  break;
                              case '6':
                                  $content_type = "tv show";
                                  $category     = "tvShow";
                                  break;
                              default:
                                  $content_type = "movie";
                                  $category     = "movie";
                                  break;
                          }
                          $result["source"]=$category;
                          $result["content_type"]=$content_type ;
                          return  $result;
  }

  public function validateSendRequest($url,$param=array(),$opts=NULL){
   try{
      $searchContentArr= $this->sendRailsRequest($url, $param, $opts); 
      } catch (\Exception $e)
      {
          echo $e;
          die();
      }
        if(!empty($searchContentArr['ApiResponseStatus']))
        {
            return $searchContentArr; 
        } else {
            $data = array(
                'error' => 'search api response status not found in adapter',
                'response'=>'NA',
                'ApiResponseStatus'=>500
            );
            return $data;            
        }
  }
  public function ListSplitter($List,$maxLengthOfSubList)
    {
        $tempSubList=array();
        $NewList=array();
        $arrLength=sizeof($List);
        for($j=0;$j<$arrLength; $j+=$maxLengthOfSubList)
        {
          $k=$j;
          $tempSubList=array();
          for($i=0; $i<$maxLengthOfSubList; $i++,$k++)
          {
             if(!empty($List[$k])){
             $tempSubList[]=$List[$k];
             }
          }
          $NewList[]=$tempSubList;
        }    
        return $NewList;
    }
    
    public function getAllDataBySearchValue($searchKey){
        if( isset($searchKey) ){
            $url = OAL.$this->param['searchpoint'];
            //return json_decode( $this->sendRequest($url, array(), NULL) );
            return  $this->validateSendRequest($url, array(), NULL);
        }
        return array();
    }
    
    public function customDateParser($dateStr)
    {
        $Date1Arr=explode(' ', $dateStr);
        $DateArr=explode('.', $Date1Arr[0]);
        if(count($DateArr)>=3)
        {
            $newdate=$DateArr[0].'-'.$DateArr[1].'-'.$DateArr[2];
          return date("d M,Y", strtotime($newdate)); 
        } else {
            return $dateStr; //cannot parse. show as it is as of now.
        }
    }
    
     public function getAssetDataByID($searchID){
        if( isset($searchID) ){
            $url = OAL.$this->param['searchpoint_asset'].$searchID;
            //print_r($url);
            return json_decode( $this->sendRequest($url, array(), NULL),TRUE);
        }
        return array();
    }
    
    //used to fetch all asset detail with a single request
     public function getAssetsDataByIDs($searchIDArr){
        if( isset($searchIDArr) ){
            //rtrim to remove / at the end if it exist. 
            $url =rtrim(OAL.$this->param['searchpoint_asset'], "/").'?ids='.implode(',',$searchIDArr);
            $response=$this->validateSendRequest($url, array(), NULL);
            return $response;
               
        }
        return array();
        
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
    
    public function getAssetDetails($details){

        $assets=array();
        if(!empty($details['_id'])){
        $title_id=$details['_id'];
        if($details["found"] && $details['_source']){
            $assetrArray=$details['_source']['Assets'][1];
            if($assetrArray){
                //$assets['title']="Movie Title";
                $assets['genre']=$assetrArray['Genre'];
                foreach ($assetrArray['LocalizableTitle'] as $localisableTitle){
                    if($localisableTitle['Language']==='en'){
                        $assets['title']=$localisableTitle["TitleBrief"];
                        $assets['details']=$localisableTitle['SummaryShort'];
                        $assets['director']=$localisableTitle['DirectorDisplay'];
                        $assets['staring']=$localisableTitle['ActorDisplay'];
                        $assets['company']=$localisableTitle['StudioDisplay']; 
                        $assets['audio']=  $this->getAudioType($localisableTitle['Language']);
                    }
                }
                
                foreach($assetrArray['Rating'] as $rating){
                    if(!empty($rating)){
                        if($rating['RatingSystem']==="TV"){
                            $assets['rating']=$rating['RatingValue']; 
                        }
                    }
                }
               $assets['releaseDate']=$assetrArray['Year'];
               $assets['duration']=$assetrArray['Duration'];
               $assets['title_id']=$title_id;
            }
        }
            return $assets;
        } else {
            return null;
        }
    }

 public function getNewAssetDetails_Basic($details){

        $EN='en_US';
        $ES='es_ES'; 
        $assets=array();
        if(!empty($details['_id'])){
        $assets['id']=$details['_id'];
        $assets['imagePath'] = BASE_URL.'/dummy/blank_image.png';
        if((!isset($details["found"]) || $details["found"]) && $details['_source']){
            //$assetrArray=$details['_source']['Assets'][1];
            if(!empty($details['_source']['ADI3']['Asset'])){
                $assetrArray=$details['_source']['ADI3']['Asset'];
                foreach ($assetrArray as $adArr) {
                  if(!empty($adArr['@endDateTime']) && isset($adArr['@endDateTime'])) {
                       $assets['endDateTime']          = $adArr['@endDateTime'];
                       $assets['isExpired']            = $this->checkGivenTimestampIsExpired($adArr['@endDateTime']);
                       $assets['expiration_days_left'] = $this->daysUntil($adArr['@endDateTime']);
                  }
                  
                  if(!empty($adArr['title:LocalizableTitle'])){
                    if(empty($adArr['title:LocalizableTitle']['@xml:lang'])) {
                      foreach($adArr['title:LocalizableTitle'] as $localisableTitle){
                        if(!empty($localisableTitle['@xml:lang']) && $localisableTitle['@xml:lang']=='en'){
                          $assets['lang']['title']['en_US']=$localisableTitle["title:TitleBrief"]['$'];
                          $assets['lang']['details']['en_US']=$localisableTitle['title:SummaryShort']['$'];
                          $assets['lang']['details']['en_US']=$localisableTitle['title:SummaryShort']['$'];
                          $assets['lang']['titleMedium']['en_US']=$localisableTitle["title:TitleMedium"]['$'];                   
                        }
                        if(!empty($localisableTitle['@xml:lang']) && $localisableTitle['@xml:lang']=='es'){
                          $assets['lang']['title']['es_ES']=$localisableTitle["title:TitleBrief"]['$'];
                          $assets['lang']['details']['es_ES']=$localisableTitle['title:SummaryShort']['$'];
                          $assets['lang']['titleMedium']['es_ES']=$localisableTitle["title:TitleMedium"]['$'];
                        }
                      }
                    } else {
                      if(!empty($adArr['title:LocalizableTitle']['@xml:lang']) && $adArr['title:LocalizableTitle']['@xml:lang']=='en'){
                        $assets['lang']['title']['en_US']=$adArr['title:LocalizableTitle']["title:TitleBrief"]['$'];
                        $assets['lang']['details']['en_US']=$adArr['title:LocalizableTitle']['title:SummaryShort']['$'];
                      }
                      if(!empty($adArr['title:LocalizableTitle']['@xml:lang']) && $adArr['title:LocalizableTitle']['@xml:lang']=='es'){
                        $assets['lang']['title']['es_ES']=$adArr['title:LocalizableTitle']["title:TitleBrief"]['$'];
                        $assets['lang']['details']['es_ES']=$adArr['title:LocalizableTitle']['title:SummaryShort']['$'];
                      }
                    }
                  }
                  if(!empty($adArr['title:ShowType'])){
                     $assets['showtype']=$adArr['title:ShowType']['$'];
                     $assets=$this->GetSPType_Long( $assets);
                  }
                  if(!empty($adArr['core:Ext'])){
                       if(!empty($adArr['core:Ext']['SeriesID'])){
                            $assets['SeriesID']=$adArr['core:Ext']['SeriesID']['$'];
                       }
                       if(!empty($adArr['core:Ext']['SeasonID'])){
                            $assets['SeasonID']=$adArr['core:Ext']['SeasonID']['$'];
                       }
                      if(isset($adArr['core:Ext']['EpisodeID']))
                        $assets['episodeID_es']=$adArr['core:Ext']['EpisodeID']['$'];        
                   }
                }
          }
          
        }
            if(isset($assets['lang'])) {
                foreach ( $assets['lang'] as $key => $value) {
                       if(! isset($assets['lang'][$key][$ES]))
                       {
                        $assets['lang'][$key][$ES]= $assets['lang'][$key][$EN];
                       }
                       elseif(! isset($assets['lang'][$key][$EN]))
                       {
                        $assets['lang'][$key][$EN]= $assets['lang'][$key][$ES];
                       }
                }
            }
            return $assets;
        } else {
            return null;
        }
    }


    public function processLocal($localisableTitle,$assets)
    {

        $EN='en_US';
        $ES='es_ES';
        if(!empty($localisableTitle['@xml:lang']) && $localisableTitle['@xml:lang']=='en'){
          $assets['lang'] = array();
          $assets['title']=$localisableTitle["title:TitleBrief"]['$'];
          $assets['titleLong']=$localisableTitle["title:TitleLong"]['$'];
          $assets['details']=$localisableTitle['title:SummaryShort']['$'];
          $assets['detailsLong']=$localisableTitle["title:SummaryLong"]['$'];
          // if(isset($localisableTitle["title:EpisodeID"]))
          // $assets['episodeID']=$localisableTitle["title:EpisodeID"]['$'];

          $assets['episodeName'][$EN] = isset($localisableTitle["title:EpisodeName"]) ? $localisableTitle["title:EpisodeName"]['$'] : '';
          
          if(!empty($localisableTitle['title:StudioDisplay'])){
             $assets['company']=$localisableTitle['title:StudioDisplay']['$']; 
          }
          if(!empty($localisableTitle['title:DirectorDisplay']))
          $assets['director']=$localisableTitle['title:DirectorDisplay']['$'];
          if(!empty($localisableTitle['title:ActorDisplay']))
            $assets['staring']=$localisableTitle['title:ActorDisplay']['$'];


//language switch
         $assets['lang']['title'][$EN]=$localisableTitle["title:TitleBrief"]['$'];
          $assets['lang']['titleLong'][$EN]=$localisableTitle["title:TitleLong"]['$'];
          $assets['lang']['details'][$EN]=$localisableTitle['title:SummaryShort']['$'];
          $assets['lang']['detailsLong'][$EN]=$localisableTitle["title:SummaryLong"]['$'];
          $assets['lang']['TitleMedium'][$EN]=$localisableTitle["title:TitleMedium"]['$'];
          
          
          
          if(!empty($localisableTitle['title:StudioDisplay'])){
             $assets['lang']['company'][$EN]=$localisableTitle['title:StudioDisplay']['$']; 
          }
          if(!empty($localisableTitle['title:DirectorDisplay']))
          $assets['lang']['director'][$EN]=$localisableTitle['title:DirectorDisplay']['$'];
          if(!empty($localisableTitle['title:ActorDisplay']))
            $assets['lang']['staring'][$EN]=$localisableTitle['title:ActorDisplay']['$'];
//lang switch end

          
          //$assets['audio']=  $this->getAudioType($localisableTitle['Language']);
         }//end of if($adArr['@xml:lang']==='en')
         if(!empty($localisableTitle['@xml:lang']) && $localisableTitle['@xml:lang']=='es'){
         
          $assets['title_es']=$localisableTitle["title:TitleBrief"]['$'];
          
          $assets['titleLong_es']=$localisableTitle["title:TitleLong"]['$'];
          $assets['details_es']=$localisableTitle['title:SummaryShort']['$'];
          $assets['detailsLong_es']=$localisableTitle["title:SummaryLong"]['$'];
          // if(isset($localisableTitle["title:EpisodeID"]))
          // $assets['episodeID']=$localisableTitle["title:EpisodeID"]['$'];

          $assets['episodeName'][$ES] = isset($localisableTitle["title:EpisodeName"]) ? $localisableTitle["title:EpisodeName"]['$'] : '';
          
          if(!empty($localisableTitle['title:StudioDisplay'])){
             $assets['company_es']=$localisableTitle['title:StudioDisplay']['$']; 
          }
        //  $assets['director']=$localisableTitle['DirectorDisplay'];
          if(!empty($localisableTitle['title:ActorDisplay']['$']))
            $assets['staring_es']=$localisableTitle['title:ActorDisplay']['$'];
                                   
//lang switch
          $assets['lang']['title'][$ES]=$localisableTitle["title:TitleBrief"]['$'];
          $assets['lang']['titleLong'][$ES]=$localisableTitle["title:TitleLong"]['$'];
          $assets['lang']['details'][$ES]=$localisableTitle['title:SummaryShort']['$'];
          $assets['lang']['detailsLong'][$ES]=$localisableTitle["title:SummaryLong"]['$'];
          $assets['lang']['TitleMedium'][$ES]=$localisableTitle["title:TitleMedium"]['$'];
         
          if(!empty($localisableTitle['title:StudioDisplay'])){
             $assets['lang']['company'][$ES]=$localisableTitle['title:StudioDisplay']['$']; 
          }
        //  $assets['director']=$localisableTitle['DirectorDisplay'];
          if(!empty($localisableTitle['title:ActorDisplay']['$']))
            $assets['lang']['staring'][$ES]=$localisableTitle['title:ActorDisplay']['$'];
//lang switch

         }//
                           return $assets;
    }


    public function getNewAssetDetails($details){
                   
      $EN='en_US';
      $ES='es_ES';
        $assets=array();
        if(!empty($details['_id'])){
        $title_id=$details['_id'];
        $assets['titleId']=$title_id;
        if((!isset($details["found"]) || $details["found"]) && $details['_source']){
            //$assetrArray=$details['_source']['Assets'][1];
            if(!empty($details['_source']['ADI3']['Asset'])){
            $assetrArray=$details['_source']['ADI3']['Asset'];
                foreach ($assetrArray as $adArr) {
                   if(!empty($adArr['title:LocalizableTitle'])){

                       if(!$this->isAssoc($adArr['title:LocalizableTitle'])){
                           
                        foreach($adArr['title:LocalizableTitle'] as  $localisableTitle){
                          $assets= $this->processLocal($localisableTitle,$assets); 

                        }//end of foreach($adArr['title:LocalizableTitle'] as $localisableTitle)
                        
                         foreach($adArr['title:LocalizableTitle'] as  $localisableTitle){
                           if(!empty($localisableTitle['@xml:lang']) && $localisableTitle['@xml:lang']=='en'){
                             $assets['titleMedium'][$EN]= $localisableTitle["title:TitleMedium"]['$'];
                           }
                           if(!empty($localisableTitle['@xml:lang']) && $localisableTitle['@xml:lang']=='es'){
                             $assets['titleMedium'][$ES]= $localisableTitle["title:TitleMedium"]['$']; 
                           }

                         }//end of foreach($adArr['title:LocalizableTitle'] as $localisableTitle)
                        
                       }else{
                           
                           $assets= $this->processLocal($adArr['title:LocalizableTitle'],$assets);
                           if(!empty($adArr['title:LocalizableTitle']['@xml:lang']) && $adArr['title:LocalizableTitle']['@xml:lang']=='en'){
                             $assets['titleMedium'][$EN]= $adArr['title:LocalizableTitle']["title:TitleMedium"]['$'];
                           }
                           if(!empty($adArr['title:LocalizableTitle']['@xml:lang']) && $adArr['title:LocalizableTitle']['@xml:lang']=='es'){
                             $assets['titleMedium'][$ES]= $adArr['title:LocalizableTitle']["title:TitleMedium"]['$']; 
                           }
                       }
                       
                       

                   }//end of if(!empty($adArr['title:LocalizableTitle']))
                   
                   if(!empty($adArr['content:AudioType'])){
                       $assets['audio']=$adArr['content:AudioType']['$'];
                   }

                   if(!empty($adArr['@xsi:type']) && $adArr['@xsi:type']=="content:PreviewType" ){
                       
                       if(!empty($adArr['embed_codes'])){
                        $embedCodeHD=array_search("HD", $adArr['embed_codes']);
                        $embedCodeSD=array_search("SD", $adArr['embed_codes']);
                         $assets['avail_Quality']=$adArr['embed_codes'];
                         if(isset($embedCodeHD) && !empty($embedCodeHD)){
                             //$assets['embed_codes_hd'] = $embedCodeHD;
                             $assets['trailer_embed_code']=$embedCodeHD;
                         }else if(isset($embedCodeSD) && !empty($embedCodeSD)){
                            // $assets['embed_codes_sd'] = $embedCodeSD;
                             $assets['trailer_embed_code']=$embedCodeSD;
                         }

                       }
                       
                   }
                   if(!empty($adArr['title:ShowType'])){
                       $assets['showtype']=$adArr['title:ShowType']['$'];
                   }

  
                   
                   if(!empty($adArr['title:Year'])){
                       $assets['Year']=$adArr['title:Year']['$'];
                   }
                   if(!empty($adArr['title:Rating'])){
                       $assets['RatingSystem']=$adArr['title:Rating']['@ratingSystem'];
                       $assets['rating']=$adArr['title:Rating']['$'];
                   }
                   if(!empty($adArr['title:DisplayRunTime'])){
                       $assets['duration']=$adArr['title:DisplayRunTime']['$'];
                   }

                   if(!empty($adArr['core:Ext'])){
                      if(isset($adArr['core:Ext']['tier'])) { 
                          if(isset($adArr['core:Ext']['tier']['$']))
                            $assets['entitlements'] = $adArr['core:Ext']['tier']['$'];
                      }
                      if(isset($adArr['core:Ext']['SeasonID'])) { 
                       if(isset($adArr['core:Ext']['SeasonID']['$'])) $assets['SeasonID'] = $adArr['core:Ext']['SeasonID']['$'];
                      }
                      
                      if(isset($adArr['core:Ext']['SeriesID'])) { 
                        if(isset($adArr['core:Ext']['SeriesID']['$']))
                       $assets['SeriesID'] = $adArr['core:Ext']['SeriesID']['$'];
                      }

                      if(isset($adArr['core:Ext']['EpisodeID'])) { 
                        if(isset($adArr['core:Ext']['EpisodeID']['$']))
                       $assets['episodeID'] = $adArr['core:Ext']['EpisodeID']['$'];
                      }
                       if(isset($adArr['core:Ext']['Region'])) { 
                        $assets['region']=array();
                        if(isset($adArr['core:Ext']['Region']['$']))
                          array_push($assets['region'],$adArr['core:Ext']['Region']['$']);
                       //print_r( $assets['region']);
                      }
                      
                   }

                   if(!empty($adArr['embed_codes'])){
                     $embedCodeHD=array_search("HD", $adArr['embed_codes']);
                     $embedCodeSD=array_search("SD", $adArr['embed_codes']);
                      $assets['avail_Quality']=$adArr['embed_codes'];
                      if(isset($embedCodeHD) && !empty($embedCodeHD)) $assets['embed_codes_hd'] = $embedCodeHD;
                      if(isset($embedCodeSD) && !empty($embedCodeSD)) $assets['embed_codes_sd'] = $embedCodeSD;

                   }
                    if(isset($adArr['title:DisplayRunTime'])) { 
                       $assets['duration'] = $adArr['title:DisplayRunTime']['$'];
                      }

                   if(!empty($adArr['title:Genre'])){
                       if(is_array($adArr)){
                           $genreArr=array();
                           foreach($adArr['title:Genre'] as $val){
                               if(!empty($val['$'])){
                                   $genreArr[]=$val['$'];
                               }
                           }
                           $assets['genre']=  implode(',', $genreArr);
                       }
                   }
                }//new end of foreach ($assetrArray as $adArr) 
               $assets['genre']=(!empty($assets['genre']))? $assets['genre']:'';
               $assets['releaseDate']=(!empty($assets['Year']))? $assets['Year']:'NA';
               $assets['airedOnDate']=$assets['releaseDate'];
               $assets['title_id']=$title_id;
               $assets['director']=(!empty($assets['director']))? $assets['director']:'NA';
               $assets['staring']=(!empty($assets['staring']))? $assets['staring']:'NA';
               $assets['company']=(!empty($assets['company']))? $assets['company']:'NA';
               $assets['audio']=(!empty($assets['audio']))? $assets['audio']:'NA';
               $assets['duration']=(!empty($assets['duration']))? $assets['duration']:'NA';


               
            
          }//end of if(!empty($details['_source']['ADI3']['Asset']))
          
          if(!empty($details['_source']['embed_code'])){
            $assets['embed_code']=$details['_source']['embed_code'];
          }
          
        }
        if(!empty($assets['lang']))
        {
        foreach ( $assets['lang'] as $key => $value) {
               if(! isset($assets['lang'][$key][$ES]))
               {
                $assets['lang'][$key][$ES]= $assets['lang'][$key][$EN];
               }
               elseif(! isset($assets['lang'][$key][$EN]))
               {
                $assets['lang'][$key][$EN]= $assets['lang'][$key][$ES];
               }
               }
             }
            return $assets;
        } else {
            return null;
        }
    }
    
    public function is_multi($array) {
        return (count($array) != count($array, 1));
    }
    public function isAssoc($arr){
        return array_keys($arr) !== range(0, count($arr) - 1);
    }
    public function testgetNewAssetDetails($titleId){
        $details = $this->getAssetDataByID($titleId); 
        //echo '<pre>--->>';
        //print_r($details);
        $parsedSingleAssetDetails=  $this->getNewAssetDetails($details);
        return $parsedSingleAssetDetails;
    }

    public function createShackURL($imageMetaDetails)
    {
       $image_shack_url='';
        if(!empty($imageMetaDetails['imageshackBaseurl']))
        {
         $image_shack_url=$imageMetaDetails['imageshackBaseurl'].'/'.$imageMetaDetails['deviceArr']['webDesktop']['rail.small'].'/';
        }
        return  $image_shack_url;
    }

    public function  parseRailsSearchCollectionResults($searchreponseArr, $accountToken = null, $imageMetaDetails = null, $xdrListArray = array())
    {
        if(!empty($accountToken)) $entitlementList = $this->getEntitlements($accountToken);
        if(!is_array($searchreponseArr)){
            return null;
        }
        if(empty($searchreponseArr['Results']['Count'])){
            return array();//empty array
        }
         $baseImageShackUrl = $this->createShackURL($imageMetaDetails);
     // $this->ondemandObj = $this->getServiceLocator()->get('ondemand');  
        $railArray=array();
        $railitem=array();
        
        $searchIDArr=array();
        //used to fetch all asset detail with a single request
        foreach ($searchreponseArr['Results']['Results'] as $dataItem) {
          $searchIDArr[]=$dataItem['Title']['Id'];
        }
        
        //$unparsedAssetDetailArr=$this->getAssetsDataByIDs($searchIDArr);
        //echo '<pre>';
       // print_r($unparsedAssetDetailArr);

        
        $details='';
        foreach ($searchreponseArr['Results']['Results'] as $dataItem) {
     


          $details = $this->getAssetDataByID($dataItem['Title']['Id']); 
       
           //ADDED to fetch extra data from array 
          /*   if(!empty($unparsedAssetDetailArr['docs'])) {
                 foreach($unparsedAssetDetailArr['docs'] as $assetDetails)
                 {
                     if(!empty($assetDetails["_id"]))
                    if($assetDetails["_id"]==$dataItem['Title']['Id'])
                    { $details=$assetDetails;
                      break;
                    }
                 }
             }// end of if(!empty($unparsedAssetDetailArr['docs']))
             else {
                //failure due to search api call with comma seperated titleids  
             }
            */ 
          //$assets=$this->getAssetDetails($details);
      
        $assets=$this->getNewAssetDetails($details);



      
        $showFlag=true;
        //entitlement chack for each rail item------------------------------------
        if(!empty($accountToken)){
          if(isset($assets['entitlements'])) {
            if(!empty($entitlementList)) {
                $showFlag=false;
                if(isset($entitlementList['entitlements'])) {
                  foreach ($entitlementList['entitlements'] as $key => $entitlement) {
                    if($entitlement['id'] === $assets['entitlements']) {
                       $showFlag=true;
                    } 
                  }
                }
            }
          } 
        } 

      
        if($showFlag == true){
          $railitem['titleId']=$dataItem['Title']['Id']; 
           $railitem=$this->GetSPType( $railitem ,$dataItem['Title']['TitleType']);
          $railitem['id']=$dataItem['Title']['Id'];  
          $railitem['TitleTypeId']=$dataItem['Title']['TitleType'];
          //ADDED to fetch extra data     
          if(!empty($assets['genre']))
             $railitem['genre']=$assets['genre'];
          else
             $railitem['genre']='NA'; 
        
          if(!empty($assets['details']))
          {          $railitem["desc"]=$assets['details']; 
              $railitem["details"]=$assets['details'];
              $short=substr($assets['details'], 0, 30);
              $short=$short."...";
              $railitem["short"]=$short;
          }
          if(empty($railitem['desc']))
            $railitem["desc"]="NA";     
          if(empty($railitem['details']))
            $railitem["details"]="NA";
          
          if(empty($railitem["short"]))
            $railitem["short"]='';

          if(empty($assets['details']))
            $railitem["details"]='NA';
                
          if(!empty($assets['rating']))
              $railitem['rating']=$assets['rating'];
          else
              $railitem['rating']='';
        
       
          if(!empty($assets['staring']))
            $railitem["staring"]=$assets['staring'];
          else
            $railitem["staring"]="NA";
           
          if(!empty($assets['audio']))
            $railitem["audio"]=$assets['audio'];
          else
            $railitem["audio"]="NA";  

          if(!empty($assets['duration']))
            $railitem["duration"]=$assets['duration'];
          else
            $railitem["duration"]="NA";               
           
          if(!empty($assets['director']))
            $railitem["director"]=$assets['director'];
          else
            $railitem["director"]="NA"; 
           
           if(!empty($assets['company']))
          $railitem["company"]=$assets['company'];
          else
          $railitem["company"]="NA";  
           
           
          $railitem['title']=$dataItem['Title']['Title'];
           
           
          if(!empty($assets['company']))
              $railitem["creator"]=$assets['company'];
          else
              $railitem["creator"]="NA";
              
              $railitem['Year']=$dataItem['Title']['Year'];
              $railitem['rating']=$dataItem['Title']['AgeRating'];
              $railitem['quality']=array();
              $railitem['region']=array();


          if(!empty($dataItem['Title']['Assets']['Count'])) {
              foreach($dataItem['Title']['Assets']['Assets'] as $dAsset){
              $railitem['AssetType']=$dAsset['Type'];
              $railitem['AssetCatalog']=$dAsset['Catalog'];
              $railitem['duration']=$dAsset['Duration'];
              $railitem['airedOn']=  $this->customDateParser($dAsset['AvailableFrom']);
              $railitem['AvailableUntil']=$this->customDateParser($dAsset['AvailableUntil']);
                         if(!empty($dAsset['Attributes']['Count'])) {
                  
                  foreach( $dAsset['Attributes']['Attribute'] as $attributeArr){
                      if($attributeArr['Key']=='embed_code'){ //'ooyala_embed_code'
                          $railitem['contentID']=$attributeArr['Value'];
                          ////////////////////////XDR EMBEDCODE CHECK STARTS/////////////////////////

                          if(!empty($xdrListArray) && isset($attributeArr['Value'][0])) {
                              foreach ($xdrListArray as $xdrListKey => $xdrListValues) {
                                if($xdrListValues['embed_code'] == $attributeArr['Value'][0]) {
                                  $railitem['xdrContent'] = $xdrListValues;
                                }
                              }
                          }
                          ////////////////////////XDR EMBEDCODE CHECK ENDS/////////////////////////////
                      }
                      if($attributeArr['Key']=='preview_thumb_320x240'){
                         // $railitem['imagePath']=$this->param['railsImgpathBase'].$attributeArr['Value'];
                          //$railitem['imagePath']=$attributeArr['Value'];
                          if(!empty($attributeArr['Value'][0])) {
                              $railitem['imagePath']=$baseImageShackUrl.$attributeArr['Value'][0];        
                          }
                      }
                      else if($attributeArr['Key']=='thumbnail'){
                         // $railitem['imagePath']=$this->param['railsImgpathBase'].$attributeArr['Value'];
                          //$railitem['imagePath']=$attributeArr['Value'];
                          if(!empty($attributeArr['Value'][0])) {
                              $railitem['imagePath']=$baseImageShackUrl.$attributeArr['Value'][0];        
                          }
                      }
                      else if ($attributeArr['Key'] == "region")
                              {
                                array_push($railitem['region'],$attributeArr['Value'][0]);
                              }
                               else if ($attributeArr['Key'] == "format")
                              {
                                array_push($railitem['quality'],$attributeArr['Value'][0]);
                              }
                  }//end of foreach( $dataItem['Title']['Assets']['Asset']['Attributes']['Attribute']
              } else {
                  //no attributes  imgpath and contentID

                               
              }
           }//end of for loop
          } else { //end of if(!empty($dataItem['Title']['Assets']['Count']))
          
              //dummy data to be removed later
              $railitem['AssetType']='NA';
              $railitem['AssetCatalog']='NA';
              $railitem['duration']='NA';
              $railitem['airedOn']='NA';
              $railitem['AvailableUntil']='NA'; 
              //dummy data to be removed later
              
          }
          //dummy data to be removed later 
          //generate a random img from dummy images.
          if(empty($railitem['imagePath'])){
                      $railitem['imagePath']=BASE_URL."/dummy/blank_image.png"; 
                  }
          if(empty($railitem['contentID'])){        
                  $railitem['contentID']='';
          }
          $railArray[]=$railitem;

        }//  endofif(#showFlag)
            
      }
      return $railArray;
    }
    
    
    public function getTitleIds($metaDataArray){
        $titleidArray=array();
        if(!empty($metaDataArray)){
            foreach ($metaDataArray as $metadata){
                if ($metadata && $metadata->NumOfResults > 0 && $metadata->Results->Count > 0) {
                    $value= $metadata->Results->Results[0];
                    $titleidArray["id"]    = $value->Title->Id;
                }
            }
        }
        return $titleidArray;
    }
    
    public function getEntitlements($access_token) {
        $entitlementRoute   = $this->param['entitlements'];
        $url                = OAL.$entitlementRoute."?account_token=".urlencode($access_token);
        $resp               = $this->sendRailsRequest($url);
        $responseData       = json_decode($resp['response'], true);
        $entitlementList    = $responseData ? $responseData : array();
        return $entitlementList;
    }

    public function getShortSearchBytitleIDResult($titleId,$format,$region){
        

            $baseUrl=OAL.$this->param['searchurl'].'?';
        $queryoption='{"id":"'.$titleId.'","format":'.json_encode($format).',"region":'.trim(stripslashes(json_encode($region)),'"').'}';
        if( !isset($queryoption)) {
            return "please provide queryoption json";
        }  
      //  $collectionNameJson=  json_encode(array('collection'=>$collectionName));
        $param=array('q'=>$queryoption);
        //$reponseData=  $this->sendRailsRequest($baseUrl, $param, NULL); 
        $reponseData=  $this->validateSendRequest($baseUrl, $param, NULL);
        return $reponseData;
      //  return ($reponseData==null)? null : json_decode($reponseData, true);
    }

     public function getAssetDataByEmbdCode($embdcode){
        if( isset($embdcode) ){
            $url = OAL.$this->param['searchurl'].'?';
            $queryoption='{"embed_code":["'.$embdcode.'"]}';
            $param=array('q'=>$queryoption);
            //print_r($url);
            return json_decode( $this->sendRequest($url, $param, NULL),TRUE);
        }
        return array();
    }

    public function getRailsSearchCollectionResults($baseUrl, $queryoption){
        
        if(empty($baseUrl)){
            $baseUrl=OAL.$this->param['searchurl'].'?';
        }
        if( !isset($queryoption)) {
            return "please provide queryoption json";
        }  
      //  $collectionNameJson=  json_encode(array('collection'=>$collectionName));
        $param=array('q'=>$queryoption);
        //$reponseData=  $this->sendRailsRequest($baseUrl, $param, NULL); 
        $reponseData=  $this->validateSendRequest($baseUrl, $param, NULL);
        return $reponseData;
      //  return ($reponseData==null)? null : json_decode($reponseData, true);
    }
    
    public function getShortMetadataBy($titleIds){
        //searchpoint_asset
        $searchRes=array();
        $metadataList=array();
        foreach ($titleIds as $titleId){
           $result= $this->getShortMetadataByTitleId($titleId);
           if(isset($result['Results']['Results'])&&!empty($result['Results']['Results'])){
               foreach($result['Results']['Results'] as $asset){
                  array_push($metadataList, $asset);
               }
           }
        }
        $searchRes['Results']['Count']=  count($metadataList);
        $searchRes['Results']['Results']= $metadataList;
        return $searchRes;
    }
                              
    public function getShortMetadataByTitleId($titleId){
       if(!empty($titleId)) {
        $baseUrl      = OAL.$this->param['searchurl'].'?';
        $queryoption  = '{"id":"'.$titleId.'"}';
        $param        = array('q'=>$queryoption);
        $reponseData  = $this->validateSendRequest($baseUrl, $param, NULL);
        $reponseData  = ($reponseData['ApiResponseStatus'] == 200) ? json_decode($reponseData['response'], TRUE) : array();
        return $reponseData;
      }
      return array();
    }

    


    public function getRailsXDRResults($accountToken){
      $baseUrl     = OAL.$this->param['xdrpoint'].'?';
      $param       = array('account_token'=>$accountToken);
      $reponseData =  $this->validateSendRequest($baseUrl, $param, NULL);
      $reponseData =  $reponseData ? $reponseData : array();
      return $reponseData;
    }
    
    public function getXDREmbedcodes($XDRResponse){
        $embdedCodes       = '';
        $embdedCodesArray  = array();
        foreach ($XDRResponse['items'] as $XDRValue){
          array_push($embdedCodesArray, '"'.$XDRValue['embed_code'].'"');
        }
        if(!empty($embdedCodesArray)){
           $embdedCodes=  implode(',', $embdedCodesArray);
           $embdedCodes = str_replace('/', '', $embdedCodes);
        }
        return $embdedCodes;
    }

    public function getDataFromEmbeddedCode($embedCode,$format,$region){
      if($embedCode) {
        $baseUrl      = OAL.$this->param['searchurl'].'?';
        $queryoption  = '{"embed_code":['.$embedCode.'],"format":'.json_encode($format).',"region":'.json_encode($region).'}';
        $param        = array('q'=>$queryoption);
        $reponseData  = $this->validateSendRequest($baseUrl, $param, NULL);
        $reponseData  = ($reponseData['ApiResponseStatus'] == 200) ? json_decode($reponseData['response'], TRUE) : array();
        return $reponseData;
      }
      return array();
    }
    
    
     public function getDataFromEmbeddedCodeSimilar($embedCode,$format,$region,$type=array()){
      if($embedCode) {
        $baseUrl      = OAL.$this->param['searchurl'].'?'; 
        $queryoption  = '{"embed_code":['.$embedCode.'],"format":'.json_encode($format).',"region":'.json_encode($region).',"types":'.json_encode($type).'}';  
        $param        = array('q'=>$queryoption);
        $reponseData  = $this->validateSendRequest($baseUrl, $param, NULL);
        return $reponseData;
      }
      return array();
    }
    
    public function getDataFromMiniEmbeddedCodeSimilar($embedCode,$format,$region,$type=array()){
      if($embedCode) {
        $baseUrl      = OAL.$this->param['searchminiurl'].'?'; 
        $queryoption  = '{"embed_code":['.$embedCode.']}';  
        $param        = array('q'=>$queryoption);
        
        $reponseData  = $this->validateSendRequest($baseUrl, $param, NULL);
        return $reponseData;
      }
      return array();
    }
            
    
    
    protected function sendRailsRequest($url, $param = array(), $opts = null, $method='GET'){
          $response = '';
          if(!empty($param)) {
            foreach($param as $key => $val){
                $url .= "&$key=$val";
            }
          }
      $request = new Request();
      $request->setUri($url);
      $request->setMethod($method); 
      $responseTemp = static::$http->dispatch($request);

     if ($responseTemp->isSuccess()) {
              return array('ApiResponseStatus'=>$responseTemp->getStatusCode(),
                  'response'=>$responseTemp->getContent());

     } else {
      //request unsuccessfull   
      return array('ApiResponseStatus'=>$responseTemp->getStatusCode(),
                  'response'=>$responseTemp->getContent());
     }
   }
    /**
     * A utility function that return a HttpClient for API calls.
     * @return \Zend\Http\Client
     */
    protected function getHttpClient(){
        $config = array(
                'adapter'   => 'Zend\Http\Client\Adapter\Curl',
                'curloptions' => $this->curlOptionParam
        );
        return new Client('', $config);
    }



    /**
     * Send the request to the specific URL. May modify the url based on the given parameters and options.
     * @param string $url
     * @param array $param
     * @param array $opts
     */
    protected function sendRequest($url, $param, $opts){
        $response = '';

        foreach($param as $key => $val){
            $url .= "&$key=$val";
        }

        // caching disabled
        if( static::$cache === NULL ){
            return static::$http->setUri($url)->send()->getContent();
        }
        
        // caching enabled
        $key = $this->calCacheKey($url);

        if( static::$cache->hasItem($key) ){
            $response = static::$cache->getItem($key);
        }
        else{
            $response = static::$http->setUri($url)->send()->getContent();
            static::$cache->addItem($key, $response);
        }
        return $response;
    }
    
    protected function calCacheKey($args){
        $args = func_get_args();
        $key = '';
        
        if( sizeof($args) > 1 ){
            foreach( $args as $arg ){
                if( is_array($arg) ){
                    $key .= md5(json_encode($arg));
                }
                else if( is_string($arg) ){
                    $key .= md5($arg);
                }
            }
            return md5($key);
        }
        else if( sizeof($args) === 1 ){
            $arg = $args[0];
            if( is_array($arg) ){
                $key .= md5(json_encode($arg));
            }
            else if( is_string($arg) ){
                $key .= md5($arg);
            }
            return $key;
        }
        else{
            return FALSE;
        }
    }

    protected function sendRequestWithHeaders($url, $param, $opts){
        $response = '';
        foreach($param as $key => $val){
            $url .= "&$key=$val";
        }
        // caching disabled
        if( static::$cache === NULL ){
            return static::$http->setUri($url)->send()->getContent();
        } 
        // caching enabled
        $key = $this->calCacheKey($url);
     
         $headers = array();

        foreach($opts['headers'] as $key => $val){
             $headers[$key] = $val;
         }
        static::$http->setHeaders($headers);
        if( static::$cache->hasItem($key) ){
            $response = static::$cache->getItem($key);
        }
        else{
            $response = static::$http->setUri($url)->send()->getContent();
            static::$cache->addItem($key, $response);
        }
        return $response;
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
    
    public function  RailsShortCollectionResults($searchreponseArr, $accountToken = null, $xdrListArray = array())
    {
        if(!empty($accountToken)) $entitlementList = $this->getEntitlements($accountToken);
        if(!is_array($searchreponseArr)){
            return null;
        }
        if(empty($searchreponseArr['Results']['Count'])){
            return array();//empty array
        }        
        $railArray=array();
        $railitem=array();
        
        $searchIDArr=array();
        //used to fetch all asset detail with a single request
//        foreach ($searchreponseArr['Results']['Results'] as $dataItem) {
//          $searchIDArr[]=$dataItem['Title']['Id'];
//        }
        
        foreach ($searchreponseArr['Results']['Results'] as $dataItem) {

         $railitem=$this->shortCallSingleItemParser($dataItem);
          
        $showFlag=true;
        //entitlement chack for each rail item------------------------------------
        if(!empty($accountToken)){
          if(isset($railitem['tiers'])) {
            if(!empty($entitlementList)) {
                $showFlag=false;
                if(isset($entitlementList['entitlements'])) {
                  foreach ($entitlementList['entitlements'] as $key => $entitlement) {
                    if($entitlement['id'] === $railitem['tiers']) {
                       $showFlag=true;
                    } 
                  }
                }
            }
          } 
        }                
        if($showFlag == true){
          $railArray[]=$railitem;
        }//  endofif(#showFlag)
            
      }//results for loop end
      return $railArray;
    }
    public function shortCallSingleItemParser($dataItem){
        $railitem=array();
        $railitem["short"]='';
          $railitem['titleId']=$dataItem['Title']['Id'];  
           $railitem['id']=$dataItem['Title']['Id']; 
            $railitem=$this->GetSPType( $railitem ,$dataItem['Title']['TitleType']);
          $railitem['TitleTypeId']=$dataItem['Title']['TitleType'];
          $railitem['title']=$dataItem['Title']['Title'];
              $railitem['Year']=$dataItem['Title']['Year'];
              $railitem['rating']=$dataItem['Title']['AgeRating'];
$railitem['region']=array();
               $railitem['quality']=array();
          if(!empty($dataItem['Title']['Assets']['Count'])) {
              foreach($dataItem['Title']['Assets']['Assets'] as $dAsset){
              $railitem['AssetType']=$dAsset['Type'];
              $railitem['AssetCatalog']=$dAsset['Catalog'];
              $railitem['duration']=$dAsset['Duration'];
              $railitem['airedOn']=  $this->customDateParser($dAsset['AvailableFrom']);
              $railitem['AvailableUntil']=$this->customDateParser($dAsset['AvailableUntil']);

              if(!empty($dAsset['Attributes']['Count'])) {
                  
                  foreach( $dAsset['Attributes']['Attribute'] as $attributeArr){
                      if($attributeArr['Key']=='embed_code'){ //'ooyala_embed_code'
                          $railitem['contentID']=$attributeArr['Value'];
                          ////////////////////////XDR EMBEDCODE CHECK STARTS/////////////////////////

                          if(!empty($xdrListArray) && isset($attributeArr['Value'][0])) {
                              foreach ($xdrListArray as $xdrListKey => $xdrListValues) {
                                if($xdrListValues['embed_code'] == $attributeArr['Value'][0]) {
                                  $railitem['xdrContent'] = $xdrListValues;
                                }
                              }
                          }
                          ////////////////////////XDR EMBEDCODE CHECK ENDS/////////////////////////////
                      }
                      if($attributeArr['Key']=='masthead'){
                          if(!empty($attributeArr['Value'][0])) {
                              $railitem['mastheadImage']=$attributeArr['Value'][0];        
                          }
                      }
                      else if($attributeArr['Key']=='preview_thumb_320x240'){
                          if(!empty($attributeArr['Value'][0])) {
                              $railitem['imagePath']=$attributeArr['Value'][0];        
                          }
                      } else if($attributeArr['Key']=='thumbnail'){
                          if(!empty($attributeArr['Value'][0])) {
                              $railitem['imagePath']=$attributeArr['Value'][0];        
                          }
                      }
                     else if ($attributeArr['Key'] == "region"){
                        array_push($railitem['region'],$attributeArr['Value'][0]);
                      }
                       else if ($attributeArr['Key'] == "format"){
                        array_push($railitem['quality'],$attributeArr['Value'][0]);
                      }
                      
                      if($attributeArr['Key']=='tiers'){
                          if(!empty($attributeArr['Value'][0])) {
                              $railitem['tiers']=$attributeArr['Value'][0];        
                          }
                      }
                  }//end of foreach( $dataItem['Title']['Assets']['Asset']['Attributes']['Attribute']
              } else {
                  //no attributes  imgpath and contentID
              }
           }//end of for loop
          } else { //end of if(!empty($dataItem['Title']['Assets']['Count']))
              $railitem['AssetType']='NA';
              $railitem['AssetCatalog']='NA';
              $railitem['duration']='NA';
              $railitem['airedOn']='NA';
              $railitem['AvailableUntil']='NA'; 
          }

          if(empty($railitem['mastheadImage'])){
                      $railitem['mastheadImage']=BASE_URL."/dummy/blank_image.png"; 
                  }
          if(empty($railitem['imagePath'])){
                      $railitem['imagePath']=BASE_URL."/dummy/blank_image.png"; 
                  }
          if(empty($railitem['contentID'])){        
                  $railitem['contentID']='';
          }
      return $railitem;
    }
    public function getAssetbyIDwithoutParsing($titleid){
      $url = OAL.$this->param['searchpoint_asset'].$titleid;
       return $this->validateSendRequest($url);
    }
    public function longMetaCollection($assets){

        $railitem=array();
        if(!empty($assets['title']))
        $railitem['title']=$assets['title'];
       if(!empty($assets['title']))
        $railitem['id']= $railitem['titleId']=$assets['titleId'];
        if(!empty($assets['showtype']))
        $railitem['showtype']=$assets['showtype'];
        
        if(!empty($assets['trailer_embed_code'])){
            $railitem['showTrailerBtn']=true;
        }else{
            $railitem['showTrailerBtn']=false;
        }
        

        //es
        if(!empty($assets['staring_es']))
          $railitem['staring_es']=$assets['staring_es'];
        
        if(!empty($assets['title_es'])){
            $railitem['title_es']=$assets['title_es'];
        }

        if(!empty($assets['details_es'])){
            $railitem['details_es']=$assets['details_es'];
        }

        if(isset($assets['episodeID_es'])){
            $railitem['episodeID_es']=$assets['episodeID_es'];
        }
        
        if(isset($assets['episodeID'])){
            $railitem['episodeID']=$assets['episodeID'];
        }
        
        if(isset($assets['SeasonID'])){
            $railitem['SeasonID']=$assets['SeasonID'];
        }
        
        if(!empty($assets['company_es'])){
            $railitem['company_es']=$assets['company_es']; 
        }
      //  $assets['director']=$localisableTitle['DirectorDisplay'];
        if(!empty($assets['staring_es']))
          $railitem['staring_es']=$assets['staring_es'];
        //es                                                    
        
          if(!empty($assets['genre']))
             $railitem['genre']=$assets['genre'];
          else
             $railitem['genre']='NA'; 
        
          if(!empty($assets['details']))
          {          $railitem["desc"]=$assets['details']; 
              $railitem["details"]=$assets['details'];
              $short=substr($assets['details'], 0, 30);
              $short=$short."...";
              $railitem["short"]=$short;
          }
          if(empty($railitem['desc']))
            $railitem["desc"]="NA";     
          if(empty($railitem['details']))
            $railitem["details"]="NA";
          
          if(empty($railitem["short"]))
            $railitem["short"]='';

          if(empty($assets['details']))
            $railitem["details"]='NA';
                
          if(!empty($assets['rating']))
              $railitem['rating']=$assets['rating'];
          else
              $railitem['rating']='';
        if(!empty($assets['RatingSystem']))
       $railitem['RatingSystem']=$assets['RatingSystem'];
          if(!empty($assets['staring']))
            $railitem["staring"]=$assets['staring'];
          else
            $railitem["staring"]="NA";
           
          if(!empty($assets['audio']))
            $railitem["audio"]=$assets['audio'];
          else
            $railitem["audio"]="NA";  

          if(!empty($assets['duration']))
            $railitem["duration"]=$assets['duration'];
          else
            $railitem["duration"]="NA";               
           
          if(!empty($assets['director']))
            $railitem["director"]=$assets['director'];
          else
            $railitem["director"]="NA"; 
           
           if(!empty($assets['company']))
          $railitem["company"]=$assets['company'];
          else
          $railitem["company"]="NA"; 
      return $railitem; 
    }
    
    
  public function getEpisodeList($show_id,$show_type){
        if( isset($show_id) ){
            $url = OAL.$this->param['episode_list'].'?series_id="'.$show_id.'"&include='.$show_type;
            return $this->validateSendRequest($url, array(), NULL);
        }
        return array();
    }
    
    public function getShowEpisodes($show_id,$show_type,$seasonNumber,$order){
        $finalList=array();
        $allLists=$this->getEpisodeList($show_id, $show_type);
        
        if(!empty($allLists)){
            if($allLists['ApiResponseStatus']==200){
                $parsedList=  $this->episodeParser(json_decode($allLists['response'],true));  
                
                $finalList=  $this->filter_by_value($parsedList,$seasonNumber,'Episode');
                return $finalList;
            }
        }
        return $finalList;
    }


  public function episodeParser($tvShowDetails){
        $parsedTvShows=array();
        if(!isset($tvShowDetails['_shards']['failed'])||$tvShowDetails['_shards']['failed']!==0){
            return $parsedTvShows;
        }
        if(empty($tvShowDetails['hits'])){
            return $parsedTvShows;
        }
       
        foreach ($tvShowDetails['hits'] as $key=>$showdetail){
            if(!empty($showdetail)){
                $showdetail['found']=true;
                $details=$this->getNewAssetDetails_Basic($showdetail);
                array_push($parsedTvShows, $details);
            }
        }
        return $parsedTvShows;
 }
    
 public function filter_by_value ($array,$seasonNumber,$showType,$order='asc'){ 
       $newarray=array();
        if(is_array($array) && count($array)>0)  
        { 
            $indx=0;
            foreach(array_keys($array) as $key){ 
              
                $temp[$key] = $array[$key]['SeasonID']; 
                $temp2[$key]=$array[$key]['showtype'];
                 
                if ($temp[$key] == $seasonNumber && $temp2[$key]==$showType){ 
                    $newarray[$indx] = $array[$key]; 
                    $indx++;
                } 
            } 
        } 
        
        if(count($newarray)>1){
            usort($newarray,function ($a, $b) use ($order) {
                if(!isset($a['episodeID_es'])){
                    return 1;
                }
                if(!isset($b['episodeID_es'])){
                    return -1;
                }
                if ($a['episodeID_es'] == '' && $b['episodeID_es'] != '') return 1;
                if ($b['episodeID_es'] == '' && $a['episodeID_es'] != '') return -1;
                if($order==='asc'){
                  if($a['episodeID_es']>$b['episodeID_es']) return 1; 
                }else{
                  if($a['episodeID_es']<$b['episodeID_es']) return 1;   
                }
                return 0; 
            });
        }
        
      return $newarray; 
    }   
    
    public function getAllEmbecodes($assetArray){
        $embdedCodes       = '';
        $embedCodesArray=array();
        if(!empty($assetArray)){
            foreach ($assetArray as $asset){
                array_push($embedCodesArray,'"'.$asset['embed_code'].'"');
            }
        }
        
        if(!empty($embedCodesArray)){
           $embdedCodes=  implode(',', $embedCodesArray);
           $embdedCodes = str_replace('/', '', $embdedCodes);
        }
        return $embdedCodes;
        
    }
    
    public function getAllTitleIds($assetArray){
        $ids     = '';
        $idArray = array();
        if(!empty($assetArray)){
            foreach ($assetArray as $asset){
                array_push($idArray,$asset['id']);
            }
        }
        return $idArray;
        
    }
    
    

    public function checkGivenTimestampIsExpired($time) {
        $date = date($this->dateFormat, strtotime($time));
        if($date > date($this->dateFormat)) {
            return false;
        } else {
            return true;
        }
    }

    public function daysUntil($date){
      if(isset($date)) {
          $result = floor((strtotime($date) - time())/60/60/24);
      } else {
          $result = false;
      }
      return $result;
    }
    
    
}