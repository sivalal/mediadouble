<?php

namespace Hott\CustomParser;

class ShortSearch {
    public function __construct() {
        $this->dateFormat      = "y-m-d h:i:s A T";
    }
 //Identifies the single page and content type from title type value returned by MINI data call
  public function GetSPType($result,$TitleType) {
    switch ($TitleType) {
      case '1':
          $content_type = "feature film";
          $category     = "movie";
          $show_type="movie";
          break;
      case '2':
          $content_type = "tv series";
          $category     = "tvShow";
          $show_type="series";
          break;
      case '3':
          $content_type = "short film";
          $category     = "movie";
          $show_type="short_film";
          break;
      case '4':
          $content_type = "tv season";
          $category     = "tvShow";
          $show_type="tv_season";
          break;
      case '5':
          $content_type = "tv episode";
          $category     = "tvShow";
          $show_type="tv_episode";
          break;
      case '6':
          $content_type = "tv show";
          $category     = "tvShow";
          $show_type="tv_show";
          break;
      default:
          $content_type = "movie";
          $category     = "movie";
          $show_type="movie";
          break;
    }
    $result["source"]=$category;
    $result["content_type"]=$content_type ;
    $result["show_type"]=$show_type ;
    return  $result;
  }

  public function GetContentTypeByTitleType($TitleType) {
    switch ($TitleType) {
      case '1':
          $result['content_type'] = "feature film";
          $result['category']     = "movie";
          break;
      case '2':
          $result['content_type'] = "tv series";
          $result['category']     = "tvShow";
          break;
      case '3':
          $result['content_type'] = "short film";
          $result['category']     = "movie";
          break;
      case '4':
          $result['content_type'] = "tv season";
          $result['category']     = "tvShow";
          break;
      case '5':
          $result['content_type'] = "tv episode";
          $result['category']     = "tvShow";
          break;
      case '6':
          $result['content_type'] = "tv show";
          $result['category']     = "tvShow";
          break;
      default:
          $result['content_type'] = "movie";
          $result['category']     = "movie";
          break;
    }
    return  $result;
  }

    public function checkGivenTimestampIsExpired($time) {
        $date = date($this->dateFormat, strtotime($time));
        if($date > date($this->dateFormat)) {
            return false;
        } else {
            return true;
        }
    }
    
  public function customDateParser($dateStr) {
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
    
  public function shortCallData($responseArr,$tiersArr=null,$xdrListArray=array()) {
    if(empty($responseArr['Results']['Count'])){
        return array();//empty array
    }        
    $railArray=array();
    $railitem=array();
    foreach ($responseArr['Results']['Results'] as $dataItem) {
      $railitem=$this->shortCallSingleItemParser($dataItem,$xdrListArray);
     
      if(!empty($railitem)){
        if(!empty($railitem['tiers']) && !empty($tiersArr)){
           $railitem["entitled"]=in_array($railitem['tiers'], $tiersArr);           
        }
        $railArray[]=$railitem;
      }
      
    }//results for loop end
    return $railArray;
  }
  

    public function shortCallSingleItemParser($dataItem,$xdrListArray=array()){
    $railitem=array();
    //$dataItem['Title']['Title']="showname:S01 Ep02";
    $railitem["short"]='';
    $railitem['titleId']=$dataItem['Title']['Id'];  
    $railitem['id']=$dataItem['Title']['Id']; 
    $railitem=$this->GetSPType( $railitem ,$dataItem['Title']['TitleType']);
    $railitem['TitleTypeId']=$dataItem['Title']['TitleType'];
    $railitem['title']=$dataItem['Title']['Title'];
    $splitTitle=explode(';',$railitem['title']);
    $railitem['title_showname']=(isset($splitTitle[0])?$splitTitle[0]:'');
    $railitem['title_season_episode']=(isset($splitTitle[1])?$splitTitle[1]:'');
    $railitem['Year']=$dataItem['Title']['Year'];
    $railitem['rating']=$dataItem['Title']['AgeRating'];
    $railitem['region']=array();
    $railitem['quality']=array();
    if(!empty($dataItem['Title']['Assets']['Count'])) {
            $railitem['FTcontentID']='';
            $railitem['FormatcontentID']=array();
        foreach($dataItem['Title']['Assets']['Assets'] as $dAsset){
            $videoType='NA';
        $railitem['AssetType']=$dAsset['Type'];
        $railitem['AssetCatalog']=$dAsset['Catalog'];
        $railitem['duration']=$dAsset['Duration'];
        $railitem['airedOn']=  $this->customDateParser($dAsset['AvailableFrom']);
        $railitem['AvailableUntil']=$this->customDateParser($dAsset['AvailableUntil']);
        if(!empty($dAsset['Attributes']['Attribute'])) {     
            foreach( $dAsset['Attributes']['Attribute'] as $attributeArr){

                if($attributeArr['Key']=='embed_code'){ //'ooyala_embed_code'
                    $railitem['contentID']=$attributeArr['Value'];
                    
                    $railitem['FTcontentID']=$attributeArr['Value'];
                   if( $videoType!='NA' )
                   {                      
                       $railitem['FormatcontentID'][$videoType]=$attributeArr['Value']; 
                   } 
                    ////////////////////////XDR EMBEDCODE CHECK STARTS/////////////////////////

                    if(!empty($xdrListArray) && isset($attributeArr['Value'][0])) {
                        foreach ($xdrListArray as $xdrListKey => $xdrListValues) {
                          if($xdrListValues['embed_code'] == $attributeArr['Value'][0]) {
                            $railitem['xdrContent'] = $xdrListValues;
                            if(!empty($railitem['xdrContent']['timestamp']))
                                $railitem['xdrContent']['expired']=  $this->checkGivenTimestampIsExpired ($railitem['xdrContent']['timestamp']);
                          }
                        }
                    }
                    ////////////////////////XDR EMBEDCODE CHECK ENDS/////////////////////////////
                }
                
                if($attributeArr['Key']=='format'){
                   $videoType=$attributeArr['Value'][0];//set video type
                   if(!empty($railitem['FTcontentID']))
                   { 
                       $railitem['FormatcontentID'][$videoType]=$railitem['FTcontentID'];
                   }
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
                if($attributeArr['Key']=='season_id'){
                    if(!empty($attributeArr['Value'][0])) {
                        $railitem['season_id']=  $this->findNumericOrStringValue($attributeArr['Value'][0]);        
                    }
                } 
                if($attributeArr['Key']=='episode_id'){
                    if(!empty($attributeArr['Value'][0])) {
                        $railitem['episode_id']=$this->findNumericOrStringValue($attributeArr['Value'][0]);        
                    }
                }
                if($attributeArr['Key']=='genres'){
                    if(!empty($attributeArr['Value'][0])) {
                        $railitem['genres']=implode(", ",$attributeArr['Value']);        
                    }
                } 
            }//end of foreach( $dataItem['Title']['Assets']['Asset']['Attributes']['Attribute']
        } else {
            //no attributes  imgpath and contentID
        }
     }//end of for loop
     
        if(!empty($railitem['FormatcontentID']["HD"])){ 
            //print_r("\r\nFormatcontentIDarray");
            //print_r($railitem['FormatcontentID']);
            $railitem['contentID']=$railitem['FormatcontentID']["HD"];
        }
     
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
    
    //set of conditions to remove items if
    // 1) asset is null
    // 2) titleType not equal to 2(Series) and embedcode is missing
    if(empty($dataItem['Title']['Assets']['Assets']))
    {    return null;
    }
    
    if( $railitem['TitleTypeId']!=2 && empty($railitem['contentID']) ){
      return null;
    }else{
      return $railitem;
    }
  }

  
  
  public function findNumericOrStringValue($value){
      if(is_numeric($value)){
          return (int)$value;
      }else{
          return $value;
      }
  }

  /*
   * 
   * Get TitleId by passing embed code in 
   * short mini API call
   * 
   */
  public function getTitleIdByEmbedCode($miniDataCallRespArr){
    if(isset($miniDataCallRespArr['Results']['Results'])){
      $miniAsset=$miniDataCallRespArr['Results']['Results'];
      if(isset($miniAsset[0]['Title']['Id'])){
          return $miniAsset[0]['Title']['Id'];
      }
    }
    return null;
  }  

  public function getShortSearchParser($miniDataCallRespArr){
    $result = array();
    if(isset($miniDataCallRespArr['Results']['Results'])){
      $miniAssets = $miniDataCallRespArr['Results']['Results'];
      foreach ($miniAssets as $key => $miniAsset) {
        if(isset($miniAsset['Title']['Id'])){
          $result[$key] = $this->GetContentTypeByTitleType($miniAsset['Title']['TitleType']); 
          $result[$key]['id'] = $miniAsset['Title']['Id'];
        }
      }
    }
    return $result;
  }  
  
  public function getEmbedCodesFromSimilarDiscoveryCall($similarResults){
      $embedCodeArr=array();
      foreach ($similarResults as $similarAsset){
          array_push($embedCodeArr, $similarAsset['embed_code']);
      }
      return $embedCodeArr;
  }
  
  
  
  
  
  
}