<?php
namespace Hott\ExternalApi;

class ExternalApiAdapter {
	protected $_httpUtilityObj = null;
    protected $_param          = null;
    protected $_OoyalaApi      = null;

    /**
     * @param array  $param           - defining url endpoints 
     * @param object $httpUtilityObj  - http request/response utility object
     */
	public function __construct($param, $httpUtilityObj, $_OoyalaApi) {
		$this->_param          = $param;
        $this->_httpUtilityObj = $httpUtilityObj;
        $this->_OoyalaApi      = $_OoyalaApi;
	}
    /**
     * Short metadata API call 
     * Error_code : HOTT_QNF -> Query Param Not Found 
     * Error_code : HOTT_QNA -> Query Param is not an array 
     * 
     * @param array $queryOption after ( ?q= )
     * @param 
     * @return url
     */
    public function basicShortSearchAndCallApiService($queryOption){
        if(!is_array($queryOption)){
            $error = array('errors'=>array(array('error_message'=>'Query params of long call should be an array','error_code'=>'HOTT_QNA')));
            return array("responseStatus"=>'HOTT_QNA','responseContent'=>$error);
        }
        $qparams                =  json_encode($queryOption);
        $shortSearchApi         =  OAL.$this->_param['endpoints']['search']['shortMetadata'].'?q='.$qparams;
        $shortSearchApiResponse =  $this->_httpUtilityObj->sendRequest($shortSearchApi);
        return $shortSearchApiResponse;           
    }        
    /**
     * Long metadata API call 
     * Error_code : HOTT_QNF -> Query Param Not Found 
     * Error_code : HOTT_QNA -> Query Param is not an array 
     * 
     * @param string $urlEndPart
     * @param array $queryOption
     * @param string $seperator
     * @return url
     */
    public function constructUrlForLongSearchAndCallApiService($lastPart='', $queryOption=array(), $seperator="/"){
        if(!is_array($queryOption)){
            $error=array('errors'=>array(array('error_message'=>'Query params of long call should be an array','error_code'=>'HOTT_QNA')));
            return array("responseStatus"=>'HOTT_QNA','responseContent'=>$error);
        } 
        $longSearchApi         =  OAL.$this->_param['endpoints']['search']['longMetadata'].$seperator.$lastPart;
        $longSearchApiResponse =  $this->_httpUtilityObj->sendRequest($longSearchApi, $queryOption); 
        return $longSearchApiResponse;     
    }
    
    
    
    /**
     * Short metadata API call 
     * Error_code : HOTT_QNF -> Query Param Not Found 
     * Error_code : HOTT_QNA -> Query Param is not an array 
     * 
     * @param string $urlEndPart
     * @param array $queryOption
     * @param string $seperator
     * @return url
     */
    public function constructUrlForShortSearchAndCallApiService($queryOption){
        if(!is_array($queryOption)){
            $error = array('errors'=>array(array('error_message'=>'Query params of long call should be an array','error_code'=>'HOTT_QNA')));
            return array("responseStatus"=>'HOTT_QNA','responseContent'=>$error);
        }
        $shortSearchApi         =  OAL.$this->_param['endpoints']['search']['shortMetadata'];
        $shortSearchApiResponse =  $this->_httpUtilityObj->sendRequest($shortSearchApi, $queryOption);
        return $shortSearchApiResponse;           
    }

    /**
     * API call using term search
     * Error_code : HOTT_UNF -> Url not found
     */
    public function instantSearchOnDemand($type, $searchKey){
        if(!$searchKey || !$type){
            $error = array('errors'=>array(array('error_message'=>'Search text/type query param not found','error_code'=>'HOTT_QNF')));
            return array("responseStatus"=>'HOTT_QNF','responseContent'=>$error);
        }
        $param          = array('term' => $searchKey);
        if($type=='vod'){
            $param          = array('term' => $searchKey,
                                    'include' => 'Movie'
                                   );
        }
        $searchUrl      =  OAL.$this->_param['endpoints']['instant_search'][$type];
        $searchResponse =  $this->_httpUtilityObj->sendRequest($searchUrl, $param); 
        return $searchResponse;     
    }

    /**
     * API call for watchlist
     * Error_code : HOTT_UNF -> Url not found
     */
    public function watchlistCallOnDemand($type, $queryOption = array(), $method = 'GET'){
        if(!$type){
            $error = array('errors'=>array(array('error_message'=>'Type not defined','error_code'=>'HOTT_QNF')));
            return array("responseStatus"=>'HOTT_QNF','responseContent'=>$error);
        }
        $watchlistUrl      =  OAL.$this->_param['endpoints']['watchlist'][$type];
        $watchlistResponse =  $this->_httpUtilityObj->sendRequest($watchlistUrl, $queryOption, $method); 
        return $watchlistResponse;     
    }

    /**
     * call http utlility function
     */
    public function callHttpUtilityService($url, $param = array(), $method = 'GET', $opts = array(), $rawJsonData=null){
        if(!is_array($param)){
            $error = array('errors'=>array(array('error_message'=>'Query option should be in array format','error_code'=>'HOTT_QNA')));
            return array("responseStatus"=>'HOTT_QNA','responseContent'=>$error);
        }
        if(empty($url)) {
            $error = array('errors'=>array(array('error_message'=>'no url provided','error_code'=>'HOTT_UNF')));
            return array("responseStatus"=>'HOTT_UNF','responseContent'=>$error);
        }
        $searchResponse =  $this->_httpUtilityObj->sendRequest($url, $param, $method, $opts, $rawJsonData); 
        return $searchResponse;     
    }
    
    /*
     * Discovery API- Similar Assets.
     * 
     * 
     */
    
    public function constructUrlForDiscoverySearchSimilarApiService($lastPart='', $queryOption=array(), $seperator="/"){
        if(!is_array($queryOption)){
            $error=array('errors'=>array(array('error_message'=>'Query params of discovery call should be an array','error_code'=>'HOTT_QNA')));
            return array("responseStatus"=>'HOTT_QNA','responseContent'=>$error);
        } 
        $discoverySearchApi         = $this->_param['endpoints']['discovery_search']['similar'].$seperator.$lastPart;
        $discoverySearchApiUrl=  $this->generateOoyalaApiUrlWithSignature($discoverySearchApi,$queryOption,$method='GET');
        $discoverySearchApiResponse =  $this->_httpUtilityObj->sendRequest($discoverySearchApiUrl); 
        return $discoverySearchApiResponse;     
    }
    
    /*
     * Discover API- Recommended/Most Popular , both
     * TV and Movie Assets
     * 
     * For Recommended window=day
     * For Most Popular window=month
     * 
     * 
     */
    public function constructUrlForDiscoverySearchApiService($lastPart='', $queryOption=array(), $seperator="/"){
        if(!is_array($queryOption)){
            $error=array('errors'=>array(array('error_message'=>'Query params of discovery call should be an array','error_code'=>'HOTT_QNA')));
            return array("responseStatus"=>'HOTT_QNA','responseContent'=>$error);
        } 
        $discoverySearchApi         = $this->_param['endpoints']['discovery_search']['discovery'].$seperator.$lastPart;
        $discoverySearchApiUrl=  $this->generateOoyalaApiUrlWithSignature($discoverySearchApi,$queryOption,$method='GET');
        $discoverySearchApiResponse =  $this->_httpUtilityObj->sendRequest($discoverySearchApiUrl); 
        return $discoverySearchApiResponse;     
    }
    
    
    
    /*
     * Discover API- Personal 
     * 
     * 
     */
    public function constructUrlForDiscoveryPersonalApiService($lastPart='', $queryOption=array(), $seperator="/"){
        if(!is_array($queryOption)){
            $error=array('errors'=>array(array('error_message'=>'Query params of discovery call should be an array','error_code'=>'HOTT_QNA')));
            return array("responseStatus"=>'HOTT_QNA','responseContent'=>$error);
        } 
        $discoverySearchApi         = $this->_param['endpoints']['discovery_search']['personal'].$seperator.$lastPart;
        $discoverySearchApiUrl=  $this->generateOoyalaApiUrlWithSignature($discoverySearchApi,$queryOption,$method='GET');
        $discoverySearchApiResponse =  $this->_httpUtilityObj->sendRequest($discoverySearchApiUrl); 
        return $discoverySearchApiResponse;     
    }
    
    
    public function constructUrlForXDRApiService($lastPart='', $queryOption=array(), $seperator="/"){
        if(!is_array($queryOption)){
            $error=array('errors'=>array(array('error_message'=>'Query params of discovery call should be an array','error_code'=>'HOTT_QNA')));
            return array("responseStatus"=>'HOTT_QNA','responseContent'=>$error);
        } 
        $XDRApi         =  OAL.$this->_param['endpoints']['xdr']['xdrpoint'].$seperator.$lastPart;
       // $XDRApi         =  "https://player.ooyala.com".$this->_param['endpoints']['xdr']['xdrpoint'].$seperator.$lastPart;
        $XDRApiResponse =  $this->_httpUtilityObj->sendRequest($XDRApi,$queryOption); 
        return $XDRApiResponse;     
    }
    
    
    

    /**
     * Get list of embed codes as array
     */
    public function getAllTitleId($assetArray){
        $ids     = '';
        $idArray = array();
        if(!empty($assetArray)){
            foreach ($assetArray as $asset){
                array_push($idArray,$asset['id']);
            }
        }
        return $idArray;
        
    }

    public function generateOoyalaApiUrlWithSignature($requestPath,$param=array(),$method='GET') {
        if(empty($param)){
            $param="";
        }
        $apiKey          = $this->_param['endpoints']['ooyala_backlot']['backlot_api_key'];
        $secretKey       = $this->_param['endpoints']['ooyala_backlot']['backlot_secret_key'];
        $generatedUrl    = $this->_OoyalaApi->generateURL($method, $apiKey, $secretKey, $this->getDataTimeTwoDaysAfter(), $requestPath, "",$param, DISCOVERY); //OAL_PLAYER --> DISCOVERY
        return $generatedUrl;
    }  
    
    protected function getDataTimeTwoDaysAfter(){
        $dateTimeInStrtotime = strtotime(date('Y-m-d h:m:s', strtotime(date('Y-m-d h:m:s') . ' +2 day')));
        return $dateTimeInStrtotime;
    }

    public function encryptAndSetCookie($key, $value, $duration=NULL) {
        $encriptedValue = $this->_httpUtilityObj->fnEncrypt($value);
        $this->_httpUtilityObj->SetHttpOnlyCookie($key, $encriptedValue,$duration);
        return;
    }

    public function decryptAndGetCookie($key) {
        if(isset($_COOKIE[$key])){
            $value = $_COOKIE[$key];
            $decryptedValue = $this->_httpUtilityObj->fnDecrypt($value);
            return $decryptedValue; 
        } 
        return NULL;
    }

    public function getEntitlementAndProductsPerUser() {
        $result          = array();
        $productList     = $this->decryptAndGetCookie('product_list');
        $entitlementList = $this->decryptAndGetCookie('entitlement_list');
        if(!empty($productList) && !empty($entitlementList)) {
          $result  = array("tiers" => $entitlementList, "product_list" => $productList);
        }
        return $result;
    }

}