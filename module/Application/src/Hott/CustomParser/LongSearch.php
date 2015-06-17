<?php

namespace Hott\CustomParser;

use \DateTime;

class LongSearch {

    public function __construct() {
        
    }

     //Identifies the single page from title type value
  public function GetSingleAssetPageType($TitleType) {
    switch ($TitleType) {
      case 'Movie':
          $category     = "movie";
          break;
      default:
          $category     = "tvShow";
          break;
    }
    return  $category;
  }
  
    //filter and parser LongCallSingleHitDataArr calls response $assets=['hits'][0]
    public function RecentlyAddedSingleHitparser($assets){
        $railitem=array();
        //$assets['title_medium']="showname:s01 ep02";
        //$assets['title_medium_es']="showname es:s01 ep02";
        if(!empty($assets['title_medium'])){
            //$railitem['title']=$assets['title_medium'];
            $spiltedValue=  explode(';',$assets['title_medium']);
            $railitem['title']['en_US']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $railitem['title']['en_US']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';            
        }       
        if(!empty($assets['title_medium_es'])){
           // $railitem['title_es']=$assets['title_medium_es'];
            $spiltedValue=  explode(':',$assets['title_medium_es']);
            $railitem['title']['es_ES']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $railitem['title']['es_ES']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:''; 
        }    
       if(!empty($assets['titleId']))
        $railitem['id']= $railitem['titleId']=$assets['titleId'];
       
       if(!empty($assets['show_type'])){
           $railitem['showtype']=$assets['show_type'];
           $railitem['source']=$this->GetSingleAssetPageType($railitem['showtype']);
       }
       
       if(!empty($assets['thumbnail']))
          $railitem['imagePath']=$assets['thumbnail'];
       else
          $railitem['imagePath']=BASE_URL."/dummy/blank_image.png"; 
       
       return $railitem; 
    }  
    
    
    public function checkLiveVideoItem($videos){
        $HasLiveVideoItem=false;
        if(empty($videos))
            return $HasLiveVideoItem;
        
        foreach ($videos as $video){
            if(isset($video['status'])){
                if($video['status']=='live'){
                    $HasLiveVideoItem=true;
                    break;
                }
            }            
        }
        return $HasLiveVideoItem;
    } 
    
    public function LongCallDataArr($responseArr){
        $dataArr=array();
        if(!empty($responseArr['_shards'])){
          $dataArr['_shards']=  $responseArr['_shards'];
        } 

        if(!empty($responseArr['hits'])){
          $dataArr['hits_total']=  $responseArr['hits']['total'];
        }
        
        if(!empty($responseArr['hits']['hits'])){
         foreach ($responseArr['hits']['hits'] as $singleHitArr) {
             
             if(!empty($this->LongCallSingleHitDataArr($singleHitArr)))
               $dataArr['hits'][]=$this->LongCallSingleHitDataArr($singleHitArr);
         }
        }
        
        return $dataArr;
    }
    
    public function LongCallSingleHitDataArr($singleHitArr){
       $ParsedDataArr=array();
       $ParsedDataArr['titleId']=$singleHitArr['_id'];
       $ParsedDataArr['_score']=$singleHitArr['_score'];
        //------------------------
       if(isset($singleHitArr['_source']['status'])){
        $ParsedDataArr['_sourceStatus']=$singleHitArr['_source']['status'];    
       }
       if(isset($singleHitArr['_source']['provider_qa_contact']))
           $ParsedDataArr['provider_qa_contact']=$singleHitArr['_source']['provider_qa_contact'];
       if(isset($singleHitArr['_source']['content_provider']))
           $ParsedDataArr['content_provider']=$singleHitArr['_source']['content_provider'];
       
           
       $ParsedDataArr['regions']=is_array($singleHitArr['_source']['regions'])?
                               implode(",",$singleHitArr['_source']['regions']):NULL;      
       if(isset($singleHitArr['_source']['series_id']))
         $ParsedDataArr['series_id']=$singleHitArr['_source']['series_id'];
       if(isset($singleHitArr['_source']['season_id']))
         $ParsedDataArr['season_id']=$singleHitArr['_source']['season_id'];      
       if(isset($singleHitArr['_source']['episode_id']))
         $ParsedDataArr['episode_id']=$singleHitArr['_source']['episode_id'];      
       if(isset($singleHitArr['_source']['ratings'])){
         $ParsedDataArr['ratings']=  $this->ratingDisplay($singleHitArr['_source']['ratings']);
         $ParsedDataArr['rating']=  $this->ratingWithSystemDisplay($singleHitArr['_source']['ratings']);
       }                       /* [
                               *      {
                               *       rating: "TV-14",
                               *       system: "TV"
                               *      }
                               * ]
                               */
       if(isset($singleHitArr['_source']['display_run_time']))
         $ParsedDataArr['display_run_time']=$singleHitArr['_source']['display_run_time'];
       
       if(isset($singleHitArr['_source']['year']))
         $ParsedDataArr['year']=$singleHitArr['_source']['year'];
       
       if(isset($singleHitArr['_source']['country_of_origin']))
         $ParsedDataArr['country_of_origin']=$singleHitArr['_source']['country_of_origin'];
       
       if(isset($singleHitArr['_source']['genres'])){
           
    $singleHitArr['_source']['genres']=  $this->ConvertAlltoCamelCase($singleHitArr['_source']['genres']);
           
        $ParsedDataArr['genres']=is_array($singleHitArr['_source']['genres'])?
                               implode(", ",$singleHitArr['_source']['genres']):NULL;
         
       }
       
       if(isset($singleHitArr['_source']['show_type']))
         $ParsedDataArr['show_type']=$singleHitArr['_source']['show_type'];
       
       if(isset($singleHitArr['_source']['is_season_premiere']))
         $ParsedDataArr['is_season_premiere']=$singleHitArr['_source']['is_season_premiere'];
       
       if(isset($singleHitArr['_source']['is_season_finale']))
         $ParsedDataArr['is_season_finale']=$singleHitArr['_source']['is_season_finale'];
              
       if(isset($singleHitArr['_source']['masthead']['url']))
         $ParsedDataArr['masthead']=$singleHitArr['_source']['masthead']['url'];
       
       if(isset($singleHitArr['_source']['thumbnail']['url']))
         $ParsedDataArr['thumbnail']=$singleHitArr['_source']['thumbnail']['url'];
       
       if(isset($singleHitArr['_source']['videos']))
         $ParsedDataArr['videos']=$singleHitArr['_source']['videos'];       

       if(isset($singleHitArr['_source']['previews']))
         $ParsedDataArr['previews']=$singleHitArr['_source']['previews'];       

       foreach ($singleHitArr['_source']['localizable_titles'] as $key=>$value) {
           
        if($value['language']=='en') { 
           if(isset($value['title_brief'])){
             $ParsedDataArr['title_brief']=  $value['title_brief'];
           }
           if(isset($value['title_medium'])){
             $ParsedDataArr['title_medium']=  $value['title_medium'];
           }
           if(isset($value['title_long'])){
             $ParsedDataArr['title_long']=  $value['title_long'];
           }
           if(isset($value['summary_short'])){
             $ParsedDataArr['summary_short']=  $value['summary_short'];
           }
           if(isset($value['summary_medium'])){
             $ParsedDataArr['summary_medium']=  $value['summary_medium'];
           }
           if(isset($value['summary_long'])){
             $ParsedDataArr['summary_long']=  $value['summary_long'];
           }
           
           
           
           if(isset($value['actors'])){
             $ParsedDataArr['actors']=  $this->createCrewDisplay($value['actors']);
           }
           if(isset($value['writers'])){
             $ParsedDataArr['writers']=  $this->createCrewDisplay($value['writers']);
           }
           if(isset($value['directors'])){
             $ParsedDataArr['directors']=  $this->createCrewDisplay($value['directors']);
           }
           if(isset($value['producers'])){
             $ParsedDataArr['producers']=  $this->createCrewDisplay($value['producers']);
           }
           if(isset($value['studio_display'])){
             $ParsedDataArr['studio_display']= $value['studio_display'];
           }
           
         } 
         else if($value['language']=='es') { 
           if(isset($value['title_brief'])){
             $ParsedDataArr['title_brief_es']=  $value['title_brief'];
           }
           if(isset($value['title_medium'])){
             $ParsedDataArr['title_medium_es']=  $value['title_medium'];
           }
           if(isset($value['title_long'])){
             $ParsedDataArr['title_long_es']=  $value['title_long'];
           }
           if(isset($value['summary_short'])){
             $ParsedDataArr['summary_short_es']=  $value['summary_short'];
           }
           if(isset($value['summary_medium'])){
             $ParsedDataArr['summary_medium_es']=  $value['summary_medium'];
           }
           if(isset($value['summary_long'])){
             $ParsedDataArr['summary_long_es']=  $value['summary_long'];
           }
           if(isset($value['actors'])){
             $ParsedDataArr['actors_es']=  $this->createCrewDisplay($value['actors']);
           }
           if(isset($value['writers'])){
             $ParsedDataArr['writers_es']=  $this->createCrewDisplay($value['writers']);
           }
           if(isset($value['directors'])){
             $ParsedDataArr['directors_es']=  $this->createCrewDisplay($value['directors']);
           }
           if(isset($value['producers'])){
             $ParsedDataArr['producers_es']=  $this->createCrewDisplay($value['producers']);
           }
           if(isset($value['studio_display'])){
             $ParsedDataArr['studio_display_es']= $value['studio_display'];
           }
         }//end of if($value['language']=='es')
       }//end of   foreach ($singleHitArr['_source']['localizable_titles'] as $key=>$value)
     
       
       if($ParsedDataArr['show_type']=="Series"||$ParsedDataArr['show_type']=="Season"){//if series donot check for live videos
           return $ParsedDataArr;
       } else if( !empty($ParsedDataArr['videos']) && $this->checkLiveVideoItem($ParsedDataArr['videos'])){ //check for live videos          
           return $ParsedDataArr;
       } else {
           return array();
       }
    }
    
    /* 
     * ConvertAlltoCamelCase
     * 
     * converts an array of string to
     * array of CamelCase string
     */    
    public function ConvertAlltoCamelCase($strArr){
        if(!is_array($strArr)){
            return NULL;
        }        
        $CamelCaseStrArr=array();
        foreach ($strArr as $str) {
           $CamelCaseStrArr[]= ucwords(strtolower($str));
        }
        return $CamelCaseStrArr;
    }
    
    public function longMetaforPopover($assets){

        if(empty($assets['hits'][0])){
            return array();
        }
        $railitem=$assets['hits'][0];
        $assets=$assets['hits'][0];
        if(!empty($assets['title_brief'])){
            $railitem['title']=$assets['title_brief'];
        }
        
        if(!empty($assets['title_brief_es'])){
            $railitem['title_es']=$assets['title_brief_es'];
        }
        
       if(!empty($assets['titleId']))
        $railitem['id']= $railitem['titleId']=$assets['titleId'];
       
       if(!empty($assets['show_type']))
       $railitem['showtype']=$assets['show_type']; 
       
       if(!empty($assets['actors']))
        $railitem["staring"]=$assets['actors'];
        //es
       if(!empty($assets['actors_es']))
        $railitem['staring_es']=$assets['actors_es'];


        if(!empty($assets['previews'][0]['embed_code'])){
            $railitem['showTrailerBtn']=true;
        }else{
            $railitem['showTrailerBtn']=false;
        }

        if(!empty($assets['company']))
          $railitem["company"]=$assets['company'];
        
        if(!empty($assets['company_es'])){
            $railitem['company_es']=$assets['company_es']; 
        }
        
        if(!empty($assets['genres']))
            $railitem['genre']=$assets['genres'];
        
          if(!empty($assets['summary_short']))
          {          $railitem["desc"]=$assets['summary_short']; 
              $railitem["details"]=$assets['summary_short'];
              $short=substr($railitem["details"], 0, 30);
              $short=$short."...";
              $railitem["short"]=$short;
          }
        if(!empty($assets['summary_short_es'])){
            $railitem['details_es']=$assets['summary_short_es'];
        }
                
//          if(!empty($assets['rating']))
//              $railitem['rating']=$assets['rating'];
//          else
//              $railitem['rating']='';
//          
//        if(!empty($assets['RatingSystem']))
//            $railitem['RatingSystem']=$assets['RatingSystem'];

           
//          if(!empty($assets['audio']))
//            $railitem["audio"]=$assets['audio'];
//          else
//            $railitem["audio"]="NA";  

          if(!empty($assets['display_run_time']))
            $railitem["duration"]= $this->getTotalMinutes($assets['display_run_time']);
   
      return $railitem; 
    }
    
    public function createCrewDisplay($members){
        
        $displayValueArr=array();
        $displayValue='';
        if(!$this->is_multi($members)){
            $displayValue=$members['full_name'];
            return $displayValue;
        }
        foreach ($members as $member){
            array_push($displayValueArr,$member['full_name']);
        }
        $displayValue=  implode(", ", $displayValueArr);
        return $displayValue;
    }
    public function ratingDisplay($ratings){
        $displayValueArr=array();
        $displayValue='';
        if(!$this->is_multi($ratings)){
            $displayValue=$ratings['rating'];
            return $displayValue;
        }
        foreach ($ratings as $rating){
            array_push($displayValueArr,$rating['rating']);
        }
        $displayValue=  implode(',', $displayValueArr);
        return $displayValue;
    }

    public function ratingWithSystemDisplay($ratings){
        $ratingWithSystemDisplayArr=array();
        if(!is_array($ratings)){
            return $ratings;
        }
        foreach ($ratings as $rating){
            array_push($ratingWithSystemDisplayArr,($rating['system'].":".$rating['rating']));
        }
        $displayValue=  implode(',', $ratingWithSystemDisplayArr);
        return $displayValue;
    }
    
    public function is_multi($array) {
        return (count($array) != count($array, 1));
    }
    public function getTotalMinutes($time){
        if(empty($time)){
            $time="00:00:00";
        }else{
            $splitTime=  explode(':',$time);
            if(count($splitTime)!=3){
                $time="00:".$time;
            }
        }
        $totalSec=strtotime($time) - strtotime('today');
        $totalMin=floor($totalSec/60);
        return $totalMin;
    }
    /**
     * Single Asset metadata caller
     * 
     */
    public function getSingleAssetMetadata($responseArr){
        $assetMetadata=array();
        $longDataParseResponse=$this->LongCallDataArr($responseArr);
        $totalAssets=(isset($longDataParseResponse['hits']))?$longDataParseResponse['hits']:array();
        foreach ($totalAssets as $assetData){
            $metadataParserResp=  $this->metadataParser($assetData);
            array_push($assetMetadata, $metadataParserResp);
        }
        return $assetMetadata;           
    }
    /**
     * 
     * @param type $responseArr
     * @return type
     * 
     * Metadata of Episode list caller 
     */
    public function getSeriesEpisodesMetadata($responseArr,$XDRArray=array()){
        $seasonDetails=array();  
        $episodesDetails=array();  
        $episodesListDetails=array();
        $seasonListDetails=array();
        $longDataParseResponse=$this->LongCallDataArr($responseArr);
        $totalAssets=(isset($longDataParseResponse['hits']))?$longDataParseResponse['hits']:array();
        foreach ($totalAssets as $episodeAsset){
            $episodeAssetData=  $this->episodeMetadataParser($episodeAsset);
            if(!empty($episodeAssetData)){
                if(isset($episodeAssetData['show_type'])&&$episodeAssetData['show_type']=='Season'){
                    $season=array();
                    $season['season_title_id']=(isset($episodeAssetData['titleId']))?$episodeAssetData['titleId']:'';
                    $season['season_id']=(isset($episodeAssetData['season_id']))?$episodeAssetData['season_id']:'';
                    if(!$this->in_multiarray($season['season_id'], $seasonDetails,'season_id')){
                       array_push($seasonDetails, $season);
                    }
                }elseif(isset($episodeAssetData['show_type'])&&$episodeAssetData['show_type']=='Episode'){
                    if(empty($XDRArray)){
                      $episodeAssetData['playhead_seconds']=0;
                    }else{
                      $episodeAssetData['playhead_seconds']= $this->findPlayHeadPosition($episodeAssetData['embed_code'],$XDRArray);  
                    }
                    //if(!$this->avoidRepeatedEpisodes($episodeAssetData['season_id'],$episodeAssetData['episode_id'],$episodesDetails,'season_id','episode_id')){
                      array_push($episodesDetails, $episodeAssetData);
                   // }
                } 
            }
        }
        if(!empty($episodesDetails)){
            $episodesListDetails=$this->array_orderby($episodesDetails, 'season_id', SORT_DESC, 'episode_id', SORT_DESC);
        }
        if(!empty($seasonDetails)&& count($seasonDetails)>1){
            $seasonListDetails=$this->array_orderby($seasonDetails, 'season_id',SORT_ASC);
        }else{
            $seasonListDetails=$seasonDetails;
        }
        $seriesEpisodes=array('seasons'=>$seasonListDetails,'episodes'=>$episodesListDetails);
        return $seriesEpisodes;
    }
    
   /*
     * getSeasonListDetails Array
     */
    public function getSeasonListDetails($responseArr){
        $seasonDetails=array();  
        $seasonListDetails=array();
        $longDataParseResponse=$this->LongCallDataArr($responseArr);
        $totalAssets=(isset($longDataParseResponse['hits']))?$longDataParseResponse['hits']:array();
        foreach ($totalAssets as $episodeAsset){
            $episodeAssetData=  $this->episodeMetadataParser($episodeAsset);
            if(!empty($episodeAssetData)){
                if(isset($episodeAssetData['show_type'])&&$episodeAssetData['show_type']=='Season'){
                    $season=array();
                    $season['season_title_id']=(isset($episodeAssetData['titleId']))?$episodeAssetData['titleId']:'';
                    $season['season_id']=(isset($episodeAssetData['season_id']))?$episodeAssetData['season_id']:'';
                    if(!$this->in_multiarray($season['season_id'], $seasonDetails,'season_id')){
                       array_push($seasonDetails, $season);
                    }
                }
            }
        }
        if(!empty($seasonDetails)&& count($seasonDetails)>1){
            $seasonListDetails=$this->array_orderby($seasonDetails, 'season_id',SORT_ASC);
        }else{
            $seasonListDetails=$seasonDetails;
        }        
        return $seasonListDetails;
    }    
    
     /**
     * 
     * 
     * Metadata of Episode list
     */
    public function getEpisodeListofaSeasonMetadata($responseArr,$XDRArray=array()){
 
        $episodesDetails=array();  
        $episodesListDetails=array();
        $longDataParseResponse=$this->LongCallDataArr($responseArr);
        $totalAssets=(isset($longDataParseResponse['hits']))?$longDataParseResponse['hits']:array();
        foreach ($totalAssets as $episodeAsset){
            $episodeAssetData=  $this->episodeMetadataParser($episodeAsset);
            if(!empty($episodeAssetData)){
                if(isset($episodeAssetData['show_type'])&&$episodeAssetData['show_type']=='Episode'){
                    if(empty($XDRArray)){
                      $episodeAssetData['playhead_seconds']=0;
                    }else{
                      $episodeAssetData['playhead_seconds']= $this->findPlayHeadPosition($episodeAssetData['embed_code'],$XDRArray);  
                    }
                    //if(!$this->avoidRepeatedEpisodes($episodeAssetData['season_id'],$episodeAssetData['episode_id'],$episodesDetails,'season_id','episode_id')){
                      array_push($episodesDetails, $episodeAssetData);
                   // }
                } 
            }
        }
        if(!empty($episodesDetails)){
            $episodesListDetails=$this->array_orderby($episodesDetails, 'season_id', SORT_DESC, 'episode_id', SORT_DESC);
        }
        return $episodesListDetails;
    }
    
    /**
     * 
     * @param type $episodeEmbedCode
     * @param type $XDrArray
     * @return type
     * 
     * Find th play head position
     */
    public function findPlayHeadPosition($episodeEmbedCode,$XDrArray){
        $playHeadPosition=0;
        foreach($XDrArray as $item){
            if($episodeEmbedCode==$item['embed_code']){
                $playHeadPosition=$item['playhead_seconds'];
                return $playHeadPosition;
            }
        }
        return $playHeadPosition;
    }
    
    
    public function in_multiarray($elem, $array,$field){
        $top = sizeof($array) - 1;
        $bottom = 0;
        while($bottom <= $top)
        {
            if($array[$bottom][$field] == $elem)
                return true;
            else 
                if(is_array($array[$bottom][$field]))
                    if(in_multiarray($elem, ($array[$bottom][$field])))
                        return true;

            $bottom++;
        }        
        return false;
    }
    
    
    public function avoidRepeatedEpisodes($season_elem,$episode_elem, $array,$season_field,$episode_field){
        $top = sizeof($array) - 1;
        $bottom = 0;
        while($bottom <= $top){
            if(($array[$bottom][$season_field] == $season_elem) && ($array[$bottom][$episode_field] == $episode_elem) )
                return true;
            else 
                if(is_array($array[$bottom][$season_field]) && is_array($array[$bottom][$episode_field]))
                        return false;

            $bottom++;
        }        
        return false;
    }
    

    /**
     * 
     * @return type
     * 
     * sorting
     * 
     */
    public function array_orderby(){
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
       
       
   /**
    * 
    * @param type $episodeAsset
    * @return array
    * 
    * Episode List matadata parser
    */    
    public function episodeMetadataParser($episodeAsset){
       // $episodeAsset['title_medium']="Show Name:S01 E01";
       // $episodeAsset['title_medium_es']="Show Name:S01 E01";
        $episodeMetadata=array();
        if(empty($episodeAsset)){
            return $episodeMetadata;
        }      
        $episodeMetadata['titleId']=$episodeAsset['titleId'];
        if(isset($episodeAsset['series_id'])){
         $episodeMetadata['series_id']=$episodeAsset['series_id'];
        }
        if(isset($episodeAsset['season_id'])){
         $episodeMetadata['season_id']=$episodeAsset['season_id']; 
        }else{
            $episodeMetadata['season_id']='';
        }
        if(isset($episodeAsset['episode_id'])){
         $episodeMetadata['episode_id']=$episodeAsset['episode_id']; 
        }else{
          $episodeMetadata['episode_id']='' ; 
        }
        if(isset($episodeAsset['title_medium'])){
            $episodeMetadata['en_US']['title_medium']=$episodeAsset['title_medium'];
            $spiltedValue=  explode(';',$episodeMetadata['en_US']['title_medium']);
            $episodeMetadata['en_US']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $episodeMetadata['en_US']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';
        }else{
            $episodeMetadata['en_US']['title_medium']=(isset($episodeAsset['title_medium_es']))?$episodeAsset['title_medium_es']:"";
            $spiltedValue=  explode(';',$episodeMetadata['en_US']['title_medium']);
            $episodeMetadata['en_US']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $episodeMetadata['en_US']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';
        }
        if(isset($episodeAsset['title_medium_es'])){
            $episodeMetadata['es_ES']['title_medium']=$episodeAsset['title_medium_es'];
            $spiltedValue=  explode(';',$episodeAsset['title_medium_es']);
            $episodeMetadata['es_ES']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $episodeMetadata['es_ES']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';
        }else{
            $episodeMetadata['es_ES']['title_medium']=(isset($episodeAsset['title_medium']))?$episodeAsset['title_medium']:"";
            $spiltedValue=  explode(';',$episodeMetadata['es_ES']['title_medium']);
            $episodeMetadata['es_ES']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $episodeMetadata['es_ES']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';
        }
        if(isset($episodeAsset['show_type'])){
            $episodeMetadata['show_type']=$episodeAsset['show_type']; 
        }
        if(isset($episodeAsset['thumbnail'])){
            $episodeMetadata['thumbnail']=$episodeAsset['thumbnail'];
        }else{
            $episodeMetadata['thumbnail']=BASE_URL."/dummy/blank_image.png";
        }
        if(isset($episodeAsset['display_run_time'])){
            $parsed   = date_parse($episodeAsset['display_run_time']);
            $duration = ($parsed['hour'] * 60 * 60) + ($parsed['minute'] * 60) + $parsed['second'];
            $episodeMetadata['duration']=  $duration;
        }
        if(isset($episodeAsset['videos'])){
            $videoData=  $this->parseVideoItem($episodeAsset['videos']);
            if(isset($videoData['embed_code'])){
                $episodeMetadata['embed_code']=$videoData['embed_code'];
            }    
        }
        return $episodeMetadata;
    }
    
    /**
     * 
     * @param type $assetData
     * @return array
     * 
     * Single Asset metadata Parser
     * 
     */
    public function metadataParser($assetData){
        //$assetData['title_medium']="Show Name;S01 E01";
        //$assetData['title_medium_es']="Show Name_es;S01 E01";       
                
        $assetMetadata=array();
        if(empty($assetData)){
            return $assetMetadata;
        }      
        $assetMetadata['titleId']=$assetData['titleId'];
        if(isset($assetData['series_id'])){
         $assetMetadata['series_id']=$assetData['series_id'];
        }
        if(isset($assetData['season_id'])){
         $assetMetadata['season_id']=$assetData['season_id']; 
        }
        if(isset($assetData['episode_id'])){
         $assetMetadata['episode_id']=$assetData['episode_id']; 
        }
        if(isset($assetData['genres'])){
            $assetMetadata['genres']=$assetData['genres']; 
        }
        if(isset($assetData['show_type'])){
            $assetMetadata['show_type']=$assetData['show_type']; 
        }
        if(isset($assetData['year'])){
            $assetMetadata['airedon']=$assetData['year']; 
        }
        if(isset($assetData['ratings'])){
            $assetMetadata['ratings']=  strtoupper($assetData['ratings']); 
        }
        if(isset($assetData['masthead'])){
            $assetMetadata['masthead']=$assetData['masthead']; 
        }else{
            $assetMetadata['masthead']=BASE_URL."/dummy/blank_image.png"; 
        }
        if(isset($assetData['thumbnail'])){
            $assetMetadata['thumbnail']=$assetData['thumbnail'];
        }else{
            $assetMetadata['thumbnail']=BASE_URL."/dummy/blank_image.png"; 
        }
        if(isset($assetData['display_run_time'])){
            $assetMetadata['display_run_time']=  $this->getTotalMinutes($assetData['display_run_time']);
        }
        if(isset($assetData['content_provider'])){
            //$assetMetadata['programer_studioname']=$assetData['content_provider']; 
            $assetMetadata['content_provider']=$assetData['content_provider']; 
        }else{
            $assetMetadata['content_provider']=''; 
        }
        if(isset($assetData['studio_display'])){
            $assetMetadata['studio_display']['en_US']=$assetData['studio_display']; 
        }else{
            $assetMetadata['studio_display']['en_US']=''; 
        }
        if(isset($assetData['studio_display_es'])){
            $assetMetadata['studio_display']['es_ES']=$assetData['studio_display_es']; 
        }else{
            $assetMetadata['studio_display']['es_ES']=''; 
        }
        if(isset($assetData['actors'])){
            $assetMetadata['en_US']['actors_display']=$assetData['actors']; 
        }
        if(isset($assetData['actors_es'])){
            $assetMetadata['es_ES']['actors_display']=$assetData['actors_es']; 
        }
        if(isset($assetData['writers'])){
            $assetMetadata['en_US']['writers_display']=$assetData['writers']; 
        }
        if(isset($assetData['writers_es'])){
            $assetMetadata['es_ES']['writers_display']=$assetData['writers_es']; 
        }
        if(isset($assetData['directors'])){
            $assetMetadata['en_US']['directors_display']=$assetData['directors']; 
        }
        if(isset($assetData['directors_es'])){
            $assetMetadata['es_ES']['directors_display']=$assetData['directors_es']; 
        }
        if(isset($assetData['title_long'])){
            $assetMetadata['en_US']['title_long']=$assetData['title_long'];
        }
        if(isset($assetData['title_long_es'])){
            $assetMetadata['es_ES']['title_long']=$assetData['title_long_es'];
        }
        if(isset($assetData['title_medium'])){
            $assetMetadata['en_US']['title_medium']=$assetData['title_medium'];
            $spiltedValue=  explode(';',$assetMetadata['en_US']['title_medium']);
            $assetMetadata['en_US']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $assetMetadata['en_US']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';
        }else{
            $assetMetadata['en_US']['title_medium']=(isset($assetData['title_medium_es']))?$assetData['title_medium_es']:'';
            $spiltedValue=  explode(';',$assetMetadata['en_US']['title_medium']);
            $assetMetadata['en_US']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $assetMetadata['en_US']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';
            
        }
        if(isset($assetData['title_medium_es'])){
            $assetMetadata['es_ES']['title_medium']=$assetData['title_medium_es'];
            $spiltedValue=  explode(';',$assetMetadata['es_ES']['title_medium']);
            $assetMetadata['es_ES']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $assetMetadata['es_ES']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';
        }else{
            $assetMetadata['es_ES']['title_medium']=(isset($assetData['title_medium']))?$assetData['title_medium']:'';
            $spiltedValue=  explode(';',$assetMetadata['es_ES']['title_medium']);
            $assetMetadata['en_US']['show_name']=(isset($spiltedValue[0]))?$spiltedValue[0]:'';
            $assetMetadata['en_US']['season_episode_name']=(isset($spiltedValue[1]))?$spiltedValue[1]:'';
            
        }
        if(isset($assetData['title_brief'])){
            $assetMetadata['en_US']['title_brief']=$assetData['title_brief'];
        }
        if(isset($assetData['title_brief_es'])){
            $assetMetadata['es_ES']['title_brief']=$assetData['title_brief_es'];
        }
        if(isset($assetData['summary_long'])){
            $assetMetadata['en_US']['summary_long']=$assetData['summary_long'];
        }else{
            $assetMetadata['en_US']['summary_long']=(isset($assetData['summary_long_es']))?$assetData['summary_long_es']:"";
        }
        if(isset($assetData['summary_long_es'])){
            $assetMetadata['es_ES']['summary_long']=$assetData['summary_long_es'];
        }else{
            $assetMetadata['es_ES']['summary_long']=(isset($assetData['summary_long']))?$assetData['summary_long']:"";
        }
        if(isset($assetData['summary_medium'])){
            $assetMetadata['en_US']['summary_medium']=$assetData['summary_medium'];
        }else{
            $assetData['summary_medium_es'] = isset($assetData['summary_medium_es']) ? $assetData['summary_medium_es'] : '';
            $assetMetadata['en_US']['summary_medium']=isset($assetMetadata['en_US']['summary_long']) ? $assetMetadata['en_US']['summary_long'] : $assetData['summary_medium_es'];
        }
        if(isset($assetData['summary_medium_es'])){
            $assetMetadata['es_ES']['summary_medium']=$assetData['summary_medium_es'];
        }else{
            $assetData['summary_medium'] = isset($assetData['summary_medium']) ? $assetData['summary_medium'] : '';
            $assetMetadata['es_ES']['summary_medium']=isset($assetMetadata['es_ES']['summary_long']) ? $assetMetadata['es_ES']['summary_long'] : $assetData['summary_medium'];
        }
        
        if(isset($assetData['videos'])){
            $videoData=  $this->parseVideoItem($assetData['videos']);
            if(isset($videoData['embed_code'])){
                $assetMetadata['embed_code']=$videoData['embed_code'];
            }
            if(isset($videoData['audio_type'])){
                $assetMetadata['audio_type']=$videoData['audio_type'];
            }
        }
        if(isset($assetData['previews'])){
            $previewVideo=$this->parseVideoItem($assetData['previews']);
            if(isset($previewVideo['embed_code'])){
                $assetMetadata['preview_embedcode']=$previewVideo['embed_code'];
            }
        }
        
        
        
        return $assetMetadata;
    }
   
    public function getRailsMetadataFormLong($longMetaDataArr,$tiers=array()){
        $thumblistCarouselOneArr['thumblistCarouselOneArr']=array();
        $longDataParseResponse=$this->LongCallDataArr($longMetaDataArr);
        $totalAssets=(isset($longDataParseResponse['hits']))?$longDataParseResponse['hits']:array();
        foreach ($totalAssets as $assetData){
            $longMetadata=$this->railParserFromLong($assetData,$tiers);  
            if(!empty($longMetadata)){
                array_push($thumblistCarouselOneArr['thumblistCarouselOneArr'], $longMetadata);
            }
        }
       
        return $thumblistCarouselOneArr;
    }

    public function railParserFromLong($assetData,$tiers=array()){
        $isTierFiltering=true;
        if(empty($tiers)){
            $isTierFiltering=false;
        }
        $assetMetadata=array();
        if(empty($assetData)){
            return $assetMetadata;
        }      
        $assetMetadata['titleId']=$assetData['titleId'];
        $assetMetadata['id']=$assetData['titleId'];        
        if(isset($assetData['show_type'])){
            $assetMetadata['TitleTypeId']=  $this->getAssetTypeId($assetData['show_type']); 
        }
        if(isset($assetData['year'])){
            $assetMetadata['Year']=$assetData['year']; 
        }
        if(isset($assetData['ratings'])){
            $assetMetadata['ratings']=$assetData['ratings']; 
        }
        if(isset($assetData['masthead'])){
            $assetMetadata['masthead']=$assetData['masthead']; 
        }else{
            $assetMetadata['masthead']=BASE_URL."/dummy/blank_image.png"; 
        }
        if(isset($assetData['thumbnail'])){
            $assetMetadata['imagePath']=$assetData['thumbnail'];
        }else{
            $assetMetadata['imagePath']=BASE_URL."/dummy/blank_image.png"; 
        }       
        if(isset($assetData['title_long'])){
            $assetMetadata['title']=$assetData['title_long'];
        }
        if(isset($assetData['videos'])){
            $videoData=  $this->parseVideoItem($assetData['videos']);
            if(isset($videoData['embed_code'])){
                $assetMetadata['contentID']=$videoData['embed_code'];
            }
            if(isset($videoData['tiers'])){
                $assetMetadata['tiers']=$videoData['tiers'];
            }
        }
        if($isTierFiltering){
            if(isset($assetMetadata['tiers'])){
            }    
        }
        
        return $assetMetadata;     
      }

        public function parseVideoItem($videos){
        $videoParse=array();
        if(empty($videos)){
            return $videoParse;
        }
        $video=$this->findObject('HD', $videos,'transcoded_resolution');
        if($video!=null){
            
        }else{
           $video=$this->findObject('SD', $videos,'transcoded_resolution'); 
           if($video==null){
               $video=$this->findObject('Preview', $videos,'transcoded_resolution');
           }
        }
       // print_r($video);
       // die();
        //foreach ($videos as $video){
            if(isset($video['transcoded_resolution'])){
                if($video['transcoded_resolution']=='HD' && isset($video['status']) && $video['status']=='live'){
                    if(isset($video['embed_code'])){
                        $videoParse['embed_code']=$video['embed_code'];
                    }
                    if(isset($video['audio_type'])){
                        $videoParse['audio_type']=$video['audio_type'];
                    }
                    if(isset($video['tiers'])){
                        $videoParse['tiers']=$video['tiers'];
                    }
                    if(isset($video['start_time'])){
                        $videoParse['start_time']=$video['start_time'];
                    }
                    if(isset($video['end_time'])){
                        $videoParse['end_time']=$video['end_time'];
                    }
                    
                }else if($video['transcoded_resolution']=='SD'&& isset($video['status']) && $video['status']=='live'){
                    if(isset($video['embed_code'])){
                        $videoParse['embed_code']=$video['embed_code'];
                    }
                    if(isset($video['audio_type'])){
                        $videoParse['audio_type']=$video['audio_type'];
                    }
                    if(isset($video['tiers'])){
                        $videoParse['tiers']=$video['tiers'];
                    }
                    if(isset($video['start_time'])){
                        $videoParse['start_time']=$video['start_time'];
                    }
                    if(isset($video['end_time'])){
                        $videoParse['end_time']=$video['end_time'];
                    }
                }else if($video['transcoded_resolution']=='Preview'&& isset($video['status']) && $video['status']=='live'){
                    if(isset($video['embed_code'])){
                        $videoParse['embed_code']=$video['embed_code'];
                    }
                    if(isset($video['audio_type'])){
                        $videoParse['audio_type']=$video['audio_type'];
                    }
                    if(isset($video['tiers'])){
                        $videoParse['tiers']=$video['tiers'];
                    }
                    if(isset($video['start_time'])){
                        $videoParse['start_time']=$video['start_time'];
                    }
                    if(isset($video['end_time'])){
                        $videoParse['end_time']=$video['end_time'];
                    }
                }
            }
            
        //}
        return $videoParse;
    }
    
    public function findObject($elem, $array,$field){
        $top = sizeof($array) - 1;
        $bottom = 0;
        while($bottom <= $top){
            if(isset($array[$bottom][$field])){
                if($array[$bottom][$field] == $elem && isset($array[$bottom]['status']) && $array[$bottom]['status']=='live'){
                    return $array[$bottom];
                }
            }
            $bottom++;
        }        
        return null;
    }

    
    public function longMetadataParser($longDataParseResponse){
        $assetMetadata=array();
        $totalAssets=(isset($longDataParseResponse['hits'])) ? $longDataParseResponse['hits'] : array();
        foreach ($totalAssets as $assetData){
            $metadataParserResp=  $this->reconstructAssetData($assetData);
            array_push($assetMetadata, $metadataParserResp);
        }
        return $assetMetadata;           
    }  

    public function reconstructAssetData($assetData) {
      $assetMetadata=array();
      if(!empty($assetData)) {
        if(isset($assetData['title_medium'])){
          $assetMetadata['title_medium']['en_US'] = $assetData['title_medium'];
        } else {
          $assetMetadata['title_medium']['en_US'] = (isset($assetData['title_medium_es']) && !empty($assetData['title_medium_es'])) ? $assetData['title_medium_es'] : '';
        }
        if(isset($assetData['title_medium_es'])){
          $assetMetadata['title_medium']['es_ES'] = $assetData['title_medium_es'];
        } else {
          $assetMetadata['title_medium']['es_ES'] = (isset($assetData['title_medium']) && !empty($assetData['title_medium'])) ? $assetData['title_medium'] : '';
        }
        if(isset($assetData['summary_short'])){
          $assetMetadata['summary_short']['en_US'] = $assetData['summary_short'];
        } else {
          $assetMetadata['summary_short']['en_US'] = (isset($assetData['summary_short_es']) && !empty($assetData['summary_short_es'])) ? $assetData['summary_short_es'] : '';
        }
        if(isset($assetData['summary_short_es'])){
            $assetMetadata['summary_short']['es_ES'] = $assetData['summary_short_es'];
        } else {
          $assetMetadata['summary_short']['es_ES'] = (isset($assetData['summary_short']) && !empty($assetData['summary_short'])) ? $assetData['summary_short'] : '';
        }
        $assetMetadata['id']         = isset($assetData['titleId']) ? $assetData['titleId'] : '';
        $assetMetadata['imagePath']  = isset($assetData['thumbnail']) ? $assetData['thumbnail'] : 'dummy/blank_image.png';
        $assetMetadata['showtype']   = isset($assetData['show_type']) ? $assetData['show_type'] : '';

        if(!empty($assetMetadata['showtype'])){
          $assetMetadata['source']   = $this->GetSingleAssetPageType($assetMetadata['showtype']);
        }
        $assetMetadata['seriesId']   = isset($assetData['series_id']) ? $assetData['series_id'] : '';
        $assetMetadata['seasonId']   = isset($assetData['season_id']) ? $assetData['season_id'] : '';
        $assetMetadata['episodeId']  = isset($assetData['episode_id']) ? $assetData['episode_id'] : '';
        if(isset($assetData['videos'])){
            $videoData                             =  $this->parseVideoItem($assetData['videos']);
            $assetMetadata['contentID']            = isset($videoData['embed_code']) ? $videoData['embed_code'] : '';
            $assetMetadata['end_time']            = isset($videoData['end_time']) ? $videoData['end_time'] : '';
            if($videoData['end_time']) {
              $assetMetadata['isExpired']            = $this->checkGivenTimestampIsExpired($videoData['end_time']);
              $assetMetadata['expiration_days_left'] = $this->daysUntil($videoData['end_time']);
            }
            $assetMetadata['tiers']      = isset($videoData['tiers']) ? $videoData['tiers'][0] : '';
        }
        return $assetMetadata;
      }
    }

    public function convertDateTimeWithAtomFormat($datetime) {
        $dto           = new \DateTime($datetime);
        $formattedDate = $dto->format('Y-m-d h:i:s');
        return $formattedDate;
    }

    public function checkGivenTimestampIsExpired($datetime) {
        $date = $this->convertDateTimeWithAtomFormat($datetime);
        if(strtotime($date) > strtotime(date('Y-m-d h:i:s'))) {
            return 'available';
        } else {
            return 'expired';
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
    
    public function getAssetTypeId($TitleType){
        $assetTypeNumber=0;
        switch ($TitleType) {
        case 'Movie':
            $assetTypeNumber     = 1;
            break;    
        case 'Series':
            $assetTypeNumber     = 2;
            break;    
        case 'feature_film':
            $assetTypeNumber     = 1;
            break;
        case 'tv_series':
            $assetTypeNumber     = 2;
            break;
        case 'short_film':
            $assetTypeNumber     = 3;
            break;
        case 'tv_season':
            $assetTypeNumber     = 4;
            break;
        case 'tv_episode':
            $assetTypeNumber     = 5;
            break;
        case 'tv_show':
            $assetTypeNumber     = 6;
            break;
        default:
            $assetTypeNumber     = 0;
            break;
    }
    return  $assetTypeNumber;
  }
  
  public function getAllTitleIdsFromLongCall($discoveryData){
      $titleIdsArr=array();
      $titleIds='';
      if(!isset($discoveryData['results'])|| empty($discoveryData['results'])){
          return $titleIds;
      }
      foreach ($discoveryData['results'] as $data){
          array_push($titleIdsArr, $data['id']);
      }
      $titleIds=  implode(',', $titleIdsArr);
      return $titleIds;
  }

  public function searchMultidimensionalArray($array, $key, $value, $filterKey = '', $filterValue = '', $filterArray = array())
  {
      $results = array();
      if (is_array($array)) {
          if (isset($array[$key]) && $array[$key] == $value) {
            $results[] = $array;
          }
          foreach ($array as $subarray) {
            if(!empty($filterKey) && !empty($filterValue)) {
              if($subarray[$filterKey] == $filterValue) {
                if(in_array($subarray['id'], $filterArray)) {
                  $subarray['isExistInWatchlistItem'] = true;
                } 
                $results = array_merge($results, $this->searchMultidimensionalArray($subarray, $key, $value));
              }
            } else {
                $results = array_merge($results, $this->searchMultidimensionalArray($subarray, $key, $value));   
            }
        
          }
      }
      return $results;
  }
  
  
    
}