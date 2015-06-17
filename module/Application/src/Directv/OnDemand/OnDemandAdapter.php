<?php

namespace Directv\OnDemand;

use Zend\Http\Client;
use Zend\Http\Request;
use Zend\Http\Client\Adapter\Curl;
use Directv\Ooyala\OoyalaAPI;
use \DateTime;

class OnDemandAdapter implements OnDemandAdapterInterface
{
    protected $param           = null;
    protected static $http     = null;
    protected static $cache    = null;
    protected $xdrDateFormat   = null;
    protected $curlOptionParam = null;

    public function __construct($param, $curlOptionParam) {
        $this->param           = $param;
        $this->curlOptionParam = $curlOptionParam;
        static::$http          = $this->getHttpClient();
        $this->dateFormat      = "y-m-d h:i:s A T";
        $this->dateFormat2     = "H:i:s";
        $this->dateFormat3     = "y-m-d h:i:s";
        $this->dateFormat4     = "Y-m-d";
        $this->dateFormat5     = "y-m-d H:i:s";
        $this->dateFormat6     = "F j, Y, H:i";
        $this->dateFormat7     = "F j, Y";
        $this->dateFormat8     = "Y-m-d h:i:s";
    }


//////TV
 public function getEpisodeList($show_id,$show_type){
        if( isset($show_id) ){
            $url = OAL.$this->param['episode_list'].'?series_id="'.$show_id.'"&include='.$show_type;
            return json_decode( $this->sendRequest($url, array(), NULL),true );
        }
        return array();
    }
/////////







    /////GENRE
    public function getGenreList($genre,$page,$pagecount,$format,$region,$types=null){
        if( isset($genre) ){
         if($format=="")
             $format=array();
         if($region=="")
             $region=array();
         $url='';
         if($types==null){
            $url = OAL.$this->param['genre'].'?q={"genres":["'.$genre.'"],"format":'.
                    json_encode($format).',"region":'.json_encode($region).
                    ',"page_size":'.$pagecount.',"page_number":'.$page.
                    ' }';
         } else {
             $typesjsonArr=json_decode($types,true);
             $typesArrStr='"types":["'.  implode('","',$typesjsonArr['types']).'"]';
            $url = OAL.$this->param['genre'].'?q={"genres":["'.$genre.'"],"format":'.
                    json_encode($format).',"region":'.json_encode($region).
                    ',"page_size":'.$pagecount.',"page_number":'.$page.','.
                     $typesArrStr.' }';             
         }
         //print_r($url);
            return json_decode( $this->sendRequest($url, array(), NULL) );
        }
        return array();
    }
     public function getAllGenreList($page,$pagecount,$format,$region,$types=null){
        //if( isset($genre) ){
         if($format=="")
             $format=array();
         if($region=="")
             $region=array();
         $url ='';
         
         if($types==null){
            $url = OAL.$this->param['genre'].'?q={"genres":[],"format":'.json_encode($format).
                    ',"region":'.json_encode($region).
                    ',"page_size":'.$pagecount.
                    ',"page_number":'.$page.
                    ' }';
         }else{
             $typesjsonArr=json_decode($types,true);
             $typesArrStr='"types":["'.  implode('","',$typesjsonArr['types']).'"]';
             
            $url = OAL.$this->param['genre'].'?q={"genres":[],"format":'.json_encode($format).
                    ',"region":'.json_encode($region).
                    ',"page_size":'.$pagecount.
                    ',"page_number":'.$page.','.
                    $typesArrStr.
                    ' }';             
         }
         //print_r($url);
            return json_decode( $this->sendRequest($url, array(), NULL) );
        //}
        return array();
    }

    /////////GENRE/////////////////////////

    public function getAllDataBySearchValue($searchKey){
        if( isset($searchKey) ){
            $url = OAL.$this->param['searchpoint'].'?term= {"query":"'.$searchKey.'"}';
            return json_decode( $this->sendRequest($url, array(), NULL) );
        }
        return array();
    }

     public function getLiveDataBySearchValue($searchKey){
        if( isset($searchKey) ){
            $url = OAL.$this->param['searchpointlive'].'?term='.$searchKey.'';
            return json_decode( $this->sendRequest($url, array(), NULL),true );
        }
        return array();
    }
       public function getPeopleDataBySearchValue($searchKey){
        if( isset($searchKey) ){
            $url = OAL.$this->param['searchpointpeople'].'?term='.$searchKey.'';
            return json_decode( $this->sendRequest($url, array(), NULL),true );
        }
        return array();
    }

     public function getPeopleDetail($peopleList){
        if( isset($peopleList) ){
            $url = OAL.$this->param['searchpoint'].'?term={"people":[{"name":'.$peopleList.'}]}';
            return json_decode( $this->sendRequest($url, array(), NULL),true );
        }
        return array();
    }

    //get people details------------------------------
    public function getPeopleDetailByName($name){
        if( isset($name) ){
            $url = OAL.$this->param['searchpoint'].'?q={"people":[{"name":"'.$name.'"}],'
                    . '"types":["tv_series","tv_episode","tv_show","feature_film","short_film"]}';
            return json_decode( $this->sendRequest($url, array(), NULL) );
        }
        return array();
    }

       public function getTVDataBySearchValue($searchKey){
        if( isset($searchKey) ){
            $url = OAL.$this->param['searchpointvod'].'?term= '.$searchKey.'';
            return json_decode( $this->sendRequest($url, array(), NULL) ,true);
        }
        return array();
    }

     public function getDataByID($searchID){
        if( isset($searchID) ){
            $url = OAL.$this->param['searchpoint'].'?q= {"id":"'.$searchID.'"}';
            return json_decode( $this->sendRequest($url, array(), NULL, 'GET') );
        }
        return array();
    }

    public function getDataFromEmbeddedCode($embedCode,$format,$region){
        if( isset($embedCode) ){
            if($format=="")
                $format=array();
            if($region=="")
                $region=array();
            $url = OAL.$this->param['searchpoint'].'?q= {"embed_code":['.$embedCode.'],"format":'.json_encode($format).',"region":'.json_encode($region).'}';
            //print_r($url);
            return json_decode( $this->sendRequest($url, array(), NULL, 'GET') );
        }
        return array();
    }

     public function getAssetDataByID($searchID){

        if( isset($searchID) ){
            $url = OAL.$this->param['searchpoint_asset'].$searchID;
            //return json_decode( $this->sendRequest($url, array(), NULL, 'GET') );
            $resp=$this->sendRailsRequest($url, array(), NULL);
            if(!empty($resp['ApiResponseStatus']))
               return $resp['response'];
        }
        return array();
    }

//Watchlist----------start

    public function getWatchlist($accountToken){
        $parameter    = array("account_token" => $accountToken);
        $url          = OAL.$this->param['watchlistlist'];
        
        $responseData = $this->genericSendRequest($url, $parameter);
        return $responseData ? $responseData : array();
    }

    public function checkItemExistInWatchlist($accountToken, $titleId){
        $url = OAL.$this->param['watchlisthasItem']."?account_token=".$accountToken."&embed_code=".$titleId;
      // echo $url;
        $responseData = json_decode( $this->sendRequest($url, array(), NULL), true);
        return $responseData ? $responseData : array();
    }
    
    public function addWatchlist($watchlistData){
        $resp = array();
        if(isset($watchlistData['account_token'])) {
            $itemExistInWatchlist = $this->checkItemExistInWatchlist($watchlistData['account_token'], $watchlistData['title_id']);
            if(isset($itemExistInWatchlist['response'])){
                if($itemExistInWatchlist['response']) {
                    $resp['response']['success']=true;
                    $resp['response']['isExist']=true;
                    return json_decode(json_encode( $resp ));
                } else {
                    $url = OAL.$this->param['watchlistlist']."?account_token=".urlencode($watchlistData['account_token'])."&embed_code=".urlencode($watchlistData['title_id']);
                    $responseData = $this->sendRailsRequest($url,array(), null,"POST");
                    if(!empty($responseData['response'])){
                      $resp['response']['success']=true;
                      $resp['response']['isExist']=false;
                    }
                    return json_decode(json_encode($resp ));
                }
                
            } else {
                return json_decode(json_encode($itemExistInWatchlist));
            }
        } 
        return $resp;
    }

    public function deleteItemFromWatchlist($accountToken, $titleId) {
        $url = OAL.$this->param['watchlistlist']."?account_token=".$accountToken."&embed_code=".$titleId;
        return json_decode( $this->sendRequest($url, null, null, 'DELETE') );
    }

    public function deleteAllItemsFromWatchlist($accountToken) {
        $url = OAL.$this->param['watchlistdeleteAllItem']."?account_token=".$accountToken;
        return json_decode( $this->sendRequest($url, null, null, 'DELETE') );
    }


//Watchlist----------stop

//XDR----------start

    public function getXDRlist($accountToken){
        $url = OAL.$this->param['xdrpoint']."?account_token=".$accountToken;
        return $this->genericSendRequest($url, array(), NULL);
    }

     public function getXDRitem($accountToken,$itemId){
        $url = OAL.$this->param['xdrpoint']."?account_token=".$accountToken."&id=".$itemId;
        return $this->genericSendRequest($url, array(), NULL);
    }

    public function deleteItemFromXDR($accountToken, $embedCode) {
        $url = OAL.$this->param['xdrpoint']."?account_token=".$accountToken."&embed_code=".$embedCode;
        return $this->genericSendRequest($url, null, null, 'DELETE');
    }

    public function deleteAllItemsFromXDR($accountToken) {
        $url = OAL.$this->param['xdrpointDeleteAllItem']."?account_token=".$accountToken;
        return $this->genericSendRequest($url, null, null, 'DELETE');
    }


//-----XRD end


    public function getAllLiveContent(){
        $url = $this->param['livepoint'];
        return json_decode( $this->sendRequest($url, array(), NULL) );
    }
    

////////////////////////group
  public function getGroupItemList($url){
        return json_decode( $this->sendRequest($url, array(), NULL) );
    }

    ////////////////////////group end    
        
    ///recently added

    public function getRecentlyAddedList($queryoptions)
    {
         $url ='';
        if($queryoptions=='NA'){
          $url = OAL.$this->param['recently_added']."?amount=10";
          return json_decode( $this->sendRequest($url, array(), NULL), true );
        }else{
            if(empty($queryoptions['amount']))
                $url = OAL.$this->param['recently_added']."?amount=10";
            else
                $url = OAL.$this->param['recently_added']."?";
          return json_decode( $this->sendRequest($url, $queryoptions, NULL), true );
        }
       
    }
    ////////////

    
     public function getEmbeddedTokenUrl($contentID,$access_token){
        $currentAcc=$access_token;
        $contentID="all";
        $requestParamsArr=  array('embed_codes'=>$contentID,'account_token'=>$currentAcc);
        $url = OAL."/commerce/tokens?";
        $responseObj=$this->sendRequest($url,$requestParamsArr,NULL);
        if(!empty($responseObj)){
            
        }
        
     //   $optRes=json_decode($responseObj,TRUE);
      //  $embbdedUrl=$optRes['tokens']['all']['embed_token'];
       // print_r($embbdedUrl);
       // die();
       // $responseObj2=$this->sendRequest($embbdedUrl,array(),NULL);
        
        
        return json_decode($responseObj,TRUE);
    }

     public function getEmbeddedTokenUrlAll($contentID,$access_token){
        $currentAcc=$access_token;
        $requestParamsArr=  array('embed_codes'=>$contentID,'account_token'=>$currentAcc);
        $url = OAL."/commerce/tokens/all?";
        $responseObj=$this->sendRequest($url,$requestParamsArr,NULL);
        if(!empty($responseObj)){
            
        }
        return json_decode($responseObj,TRUE);
    }

    /**
     * A utility function to generate signature
     *
     */
    public function generateUrlWithValidSignature($method, $apiKey, $secretKey, $requestPath, $parameter=array(), $baseUrl) {
        $ooyalaApiObject = new OoyalaAPI();
        $generatedUrl    = $ooyalaApiObject->generateURL($method, $apiKey, $secretKey, $this->getDataTimeTwoDaysAfter(), $requestPath, "", $parameter, $baseUrl);
        return $generatedUrl;
    }

    protected function getDataTimeTwoDaysAfter()
    {
        //$date                = mktime(0, 0, 0, date("m"), date("d")+2, date("Y"));
        //$dateTimeInStrtotime = date('Y-m-d h:m:s', $date);
        $dateTimeInStrtotime = strtotime(date('Y-m-d h:m:s') . ' +2 day');
        return $dateTimeInStrtotime;
    }
    

    /**
     * A utility function that return a HttpClient for API calls.
     * @return \Zend\Http\Client
     */
    protected function getHttpClient(){
        $config = array(
                'adapter'     => 'Zend\Http\Client\Adapter\Curl',
                'curloptions' => $this->curlOptionParam
        );
        return new Client('', $config);
    }

    protected function sendRailsRequest($url, $param, $opts=null,$method="GET"){
        $response = '';

        foreach($param as $key => $val){
            $url .= "&$key=$val";
        }

        $request = new Request();
        $request->setUri($url);
        $request->setMethod($method);
        
        $clientConfig = array(
            'adapter'     => 'Zend\Http\Client\Adapter\Curl',
            'curloptions' => $this->curlOptionParam
        );
        $client = new Client();
        $client->setOptions($clientConfig);
        $responseTemp = $client->dispatch($request);
        $respTemp = json_decode($responseTemp->getContent(), true);
       if ($responseTemp->isSuccess()) {
                return array('ApiResponseStatus'=>$responseTemp->getStatusCode(),
                    'response'=>$respTemp);

       } else {
        //request unsuccessfull   
        return array('ApiResponseStatus'=>$responseTemp->getStatusCode(),
                    'response'=>$respTemp);
       }
    }
    /**
     * Send the request to the specific URL. May modify the url based on the given parameters and options.
     * @param string $url
     * @param array $param
     * @param array $opts
     */
    public function sendRequest($url, $param = null, $opts = null, $method = 'GET'){
        $response = '';
        if($param != null) {
            foreach($param as $key => $val){
                $url .= "&".$key."=".urlencode($val);
            }    
        }
        $request = new Request();
        $request->setUri($url);
        $request->setMethod($method);
        $responseTemp = static::$http->dispatch($request);
        if ($responseTemp->isSuccess()) {
            return $responseTemp->getContent();
        } else {
            return null;
        }
    }

    /**
     * Send the request to the specific URL. May modify the url based on the given parameters and options.
     * @param string $url
     * @param array $param
     * @param array $opts
     * @param string $method
     * @param json $rawJsonData
     */
    public function genericSendRequest($url, $param = array(), $opts = array(), $method = 'GET', $rawJsonData=null){
        $response = '';
        if(!empty($param)) {
            $i=0;
            foreach($param as $key => $val){
                if($i == 0) {
                    $url .= "?".$key."=".urlencode($val);
                } else {
                    $url .= "&".$key."=".urlencode($val);
                }
                $i++;
            }   
        }
        $client = static::$http;
        $client->setUri($url);
        $client->setMethod($method);
        if($rawJsonData != null) {
            $client->setRawBody($rawJsonData);
        }
        if(!empty($opts)) {
            foreach($opts['headers'] as $key => $val){
                $headers[$key] = $val;
            }
            $client->setHeaders($headers);
        }

        try{
            $response = $client->send();
            $content   = $response->getContent();
        } catch (\Exception $e){
            $d = $e->getMessage();
            return array(
              'responseStatus'  => 500,
              'responseContent' => $d
            );
        }
        $responseContent = json_decode($content, true); 
        return array(
            'responseStatus'  => $response->getStatusCode(),
            'responseContent' => empty($responseContent) ? $content : $responseContent
        );
    }

    /**
    * A utility function that divides time slots by 30mins
    */
    public function timeSlotCalculation($startTime, $endTime)
    {
        $timeslots = array();
        $t1 = strtotime($startTime);
        $t2 = strtotime($endTime);
        while ($t1 < $t2) {
            $timeslots[] = $t1;
            $t1 = strtotime('+30 mins', $t1);
        }
        return $timeslots;
    }

    /**
    * A utility function that converts 24-hour time to 12-hour time 
    */
    public function timeFormat($time)
    {
        $timeInTwelveHourFormat  = date("h:i a", strtotime($time));
        return $timeInTwelveHourFormat;
    }

    public function rowCalculation($startTime, $endTime) {
        $startTime = $this->roundTime($startTime);
        $endTime   = $this->roundTime($endTime);
        $timeDiff  = $endTime - $startTime;
        $totalMins = $timeDiff/60;
        $timeSlice = $this->param['timeSlice'];
        $rowCountToNearestInteger = $totalMins/$timeSlice;
        return $rowCountToNearestInteger;
    }

    public function roundTime($time) {
        $round  = 30*60; 
        $result = round($time / $round) * $round;
        return $result;
    }

    public function roundDurationUp($duration_string='') {
     $parts = explode(':', $duration_string);
     // only deal with valid duration strings
     if (count($parts) != 3)
       return 0;

     // round the seconds up to minutes
     if ($parts[2] > 30)
       $parts[1]++;

     // round the minutes up to hours
     if ($parts[1] > 30)
       $parts[0]++;

     return $parts[0];
    }

    public function getMaximumTimeSlots($timeSlotGroupArr) {
        $timeSlotGroupArr = array_map("array_values", $timeSlotGroupArr);
        $timeSlotGroupArr = array_unique(array_reduce($timeSlotGroupArr, "array_merge", array()), SORT_REGULAR);
        sort($timeSlotGroupArr);
        $t1 = reset($timeSlotGroupArr);
        $t2 = end($timeSlotGroupArr);
        while ($t1 <= $t2) {
           $timeslots[] = $t1;
           $t1 = strtotime('+30 mins', $t1);
        }
        return $timeslots;
    }

    public function checkGivenTimestampIsExpired($time) {
        $date = date($this->dateFormat, strtotime($time));
        if($date > date($this->dateFormat)) {
            return false;
        } else {
            return true;
        }
    }

    public function convertDateTimeWithAtomFormat($datetime) {
        $dto           = new \DateTime($datetime);
        $formattedDate = $dto->format($this->dateFormat2);
        return $formattedDate;
    }

    public function convertDateTime2WithAtomFormat($datetime) {
        $dto           = new \DateTime($datetime);
        $formattedDate = $dto->format($this->dateFormat3);
        return $formattedDate;
    }
    public function convertDateTime8WithAtomFormat($datetime) {
        $dto           = new \DateTime($datetime);
        $formattedDate = $dto->format($this->dateFormat8);
        return $formattedDate;
    }

    public function convertDateTime6WithAtomFormat($datetime) {
        $dto           = new \DateTime($datetime);
        $formattedDate = $dto->format($this->dateFormat6);
        return $formattedDate;
    }

    public function convertDateTime7WithAtomFormat($datetime) {
        $dto           = new \DateTime($datetime);
        $formattedDate = $dto->format($this->dateFormat7);
        return $formattedDate;
    }

    public function compareDate($givenDate) {
        $givenDate = strtotime($givenDate);
        $currentDate = strtotime(date($this->dateFormat6));
        if($givenDate >= $currentDate) {
            return true;
        } else {
            return false;
        }
    }

    public function convertDateTime5WithAtomFormat($datetime) {
        $dto           = new \DateTime($datetime);
        $formattedDateTime['date'] = strtotime($dto->format($this->dateFormat4));
        $formattedDateTime['time'] = strtotime($dto->format($this->dateFormat2));
        return $formattedDateTime;
    }

    public function convertStrtotimeToSpecifiedTimeFormat($timeArray) {
        if(!empty($timeArray)) {
            foreach ($timeArray as $key => $value) {
                $timeArray[$key] = date('h:i a', $value);
            }
            return $timeArray;
        }
    }

    public function convertDateTime3WithAtomFormat($datetime) {
        $dto           = new \DateTime($datetime);
        $formattedDate = $dto->format($this->dateFormat4);
        return $formattedDate;
    }

    public function searchMultidimensionalArray($array, $key, $value) {
      $results = array();

      if (is_array($array)) {
          if (isset($array[$key]) && $array[$key] == $value) {
              $results[] = $array;
          }

          foreach ($array as $subarray) {
              $results = array_merge($results, $this->searchMultidimensionalArray($subarray, $key, $value));
          }
      }

      return $results;
    }
    public function getUserEntitlements($packages) {
      $results = array();
      if (is_array($packages)) {
          for($i=0;$i<count($packages);$i++){
              $entitlements=$packages[$i]['product']['entitlements'];            
              $results=array_merge($results, $entitlements);
          }
      }
      return $results;
    }
    public function getUserProducts($packages) {
      $results = array();
      $productObj=array();
      $respo=array();
      if (is_array($packages)) {
          for($i=0;$i<count($packages);$i++){
              $packageid=$packages[$i]['product']['id'];  
              $product['id']=$packages[$i]['product']['id'];
              $product['ExpireDate']=  $this->convertDateTime8WithAtomFormat($packages[$i]['expiration_date']);
              $product['ActualExpireDate']=  $packages[$i]['expiration_date'];
              array_push($productObj, $product);
              array_push($results, $packageid);
          }
      }
      $respo['productlist']=$results;
      $respo['productObj']=$productObj;
      return $respo;
    }

}