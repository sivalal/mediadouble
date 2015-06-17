<?php

namespace Directv\AppConfig;

use Zend\Http\Client;
use Zend\Http\Request;
use Zend\Http\Response;
use Directv\AppConfig\UuidGeneratorUtility;
use Hott\Utility\HttpService;
use Directv\Block;
class AppviewAdapter implements AppConfigAdapterInterface
{   
    protected $param = null;
    protected static $http = null;
    protected static $cache = null;
    protected $appGridMetaDataSessionObj=null;
    public $httpServiceObj=null;


    public function __construct($param, $curlOptionParam) {
      $this->param                     = $param;
      $this->curlOptionParam           = $curlOptionParam;
      static::$http                    = $this->getHttpClient();
      $this->appGridMetaDataArr        = array();
    
      
      $this->domain = ($_SERVER['HTTP_HOST'] != 'localhost' && $_SERVER['HTTP_HOST'] != '127.0.0.1' ) ? $_SERVER['HTTP_HOST'] : false;
//      $this->appGridMetaDataSessionObj = new Container('appGridMetaData');
//      $this->appGridSessionObj         = new Container('appGridSession');
//      $this->appGridMessageSessionObj  = new Container('appGridMessageSession'); 
      if( isset($this->param['cache']) && isset($this->param['cache']['enabled']) && $this->param['cache']['enabled'] ){
          static::$cache = \Zend\Cache\StorageFactory::factory(array(
              'adapter' => array(
                  'name' => 'filesystem',
                  'options' => array(
                      'ttl' => $this->param['cache']['ttl']
                  )
              ),
              'plugins' => array(
                  // Don't throw exceptions on cache errors
                  'exception_handler' => array(
                      'throw_exceptions' => false
                  ),
              )
          ));
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

    protected function sendRailsRequest($url, $param, $opts){
      $response = '';

      foreach($param as $key => $val){
          $url .= "&$key=$val";
      }
      $request = new Request();
      $request->setUri($url);
      $request->setMethod('GET');
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
     * Send the request to the specific URL.
     * May modify the url based on the given parameters and options.
     * @param string $url
     * @param array $param
     * @param array $opts
     */
    protected function sendRequest($url, $param, $opts){
      $response = '';

      foreach($param as $key => $val){
          $url .= "&$key=$val";
      }
    //  print_r($url);
      $request = new Request();
      $request->setUri($url);
      $request->setMethod('GET');
      $responseTemp = static::$http->dispatch($request);
      if ($responseTemp->isSuccess()) {
            return $responseTemp->getContent();     
      } else { 
        return null; 
      }
 }
     public function getResponseWithHeader()
    {
        $response = new Response();
        $response->getHeaders()
                 ->addHeaderLine('Access-Control-Allow-Origin','*')
                 ->addHeaderLine('Access-Control-Allow-Methods','POST GET')
                 ->addHeaderLine('Content-type', 'application/json');
        return $response;
    }
    /*
     * get UUID from cookie if not found, it is generated 
     * and set to cookie
     */
    public function getUUID()
    {     //   print_r($_COOKIE);
        if(!isset($_COOKIE['appgrid_uuid'])) {
            $uuid=UuidGeneratorUtility::v4();
            $year = 365*86400;
            $domain = ($_SERVER['HTTP_HOST'] != 'localhost' && $_SERVER['HTTP_HOST'] != '127.0.0.1' ) ? $_SERVER['HTTP_HOST'] : false;
         //setcookie('appgrid_uuid', $uuid,time()+10*$year,"/", $domain,false);
         setcookie('appgrid_uuid',$uuid, time()+15*$year,"/",$this->domain,false,true);
         $_COOKIE['appgrid_uuid'] = $uuid;
         return $uuid;
        }
        return $_COOKIE['appgrid_uuid'];
    }  
    
    /*
     * Creates an appgrid session key
     */
    public function createAppGridSession(){

        //get uuid
        $uuid=  $this->getUUID();
        //get gid
        $gid = $this->getIp();

        if( isset($uuid) ){
            
            if(!empty($_COOKIE['appgrid_sessionKey'])){
                
                return $_COOKIE['appgrid_sessionKey'];
            }
            
            
            $url = $this->param['baseUrl'].'session?';

            $requestParamsArr=array('appKey'=>$this->param['appKey'],
              'uuid'=>$uuid,
              'gid'=>$gid
              );

            $responseObj=$this->sendRequest($url,$requestParamsArr,NULL);
            if(!empty($responseObj)){
                $appSessionAssocArr= json_decode($responseObj , true );
                if(!empty($appSessionAssocArr['sessionKey']) && !empty($appSessionAssocArr['expiration'])) {

                    $expirationEpoch = strtotime($appSessionAssocArr['expiration']);
                    if (!is_int($expirationEpoch)) {
                      $expirationEpoch = 0;
                    }
                    setcookie('appgrid_sessionKey',$appSessionAssocArr['sessionKey'],$expirationEpoch,"/",$this->domain,false,true);
                    $_COOKIE['appgrid_sessionKey'] =$appSessionAssocArr['sessionKey'] ;
                    return $appSessionAssocArr['sessionKey'];

                }
            } 
        }  else {
            echo '<pre>';
            print_r("uuid missing");
            die();
        }
        return NULL;
    
    }

  public function resetAppGridSession() {
    $_COOKIE['appgrid_sessionKey'] = NULL;
    setcookie('appgrid_sessionKey', NULL, -1, $this->domain);
  }

  public function appgridAssetData($appgridAssetkey){
      $AppassetUrlArray=$this->getAppAssets();
      if(empty($AppassetUrlArray)){
          return NULL;
      }
      $assetURL=( (!empty($AppassetUrlArray[$appgridAssetkey]))? 
              $AppassetUrlArray[$appgridAssetkey] : NULL   
          );
      
      if(empty($assetURL)){
          return NULL;
      }   
      $fileContent=file_get_contents($assetURL);
      return  $fileContent;    
  }

  public function appgridAssetUrl($appgridAssetkey){
      $AppassetUrlArray=$this->getAppAssets();
      if(empty($AppassetUrlArray)){
          return NULL;
      }
      $assetURL=( (!empty($AppassetUrlArray[$appgridAssetkey]))? 
              $AppassetUrlArray[$appgridAssetkey] : NULL   
          );
      
      if(empty($assetURL)){
          return NULL;
      }   
      return  $assetURL;    
  }
  
    
    public function getAppAssets(){
     $sessionKey=  $this->createAppGridSession();    
        if(isset($sessionKey)) {            
            $requestParamsArr=array('sessionKey'=>$sessionKey); 
            $Url=$this->param['baseUrl'].'/asset?';
             $responseObj=$this->sendRequest($Url,$requestParamsArr,NULL);
            if(!empty($responseObj)){  
                $appAssetArr= json_decode($responseObj,true);
    
  //get current $protocol
//  $protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ?
//              'https://' : 'http://';
  
       // if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off')
       //  {
         $protocol = 'https://';//connection is secure 
        // }
        // else
        // {
        //   $protocol = 'http://';//http is used
        // }
  
                foreach ($appAssetArr as $key => $value) {
                  $url = parse_url($value);
                  //generate url based on SERVER_PROTOCOL
                  if($url['scheme'] == "http" || $url['scheme'] == "https") {                      
                    $appAssetArr[$key] = str_replace($url['scheme']."://", $protocol, $value);
                  }                    
                }
                return $appAssetArr;
            } else {
                return NULL;
            }
        }
        return NULL;        
    }

    public function testAppStatus($sessionKey){
         
        if(isset($sessionKey)) {            
            $requestParamsArr=array('sessionKey'=>$sessionKey); 
            $Url=$this->param['baseUrl'].'status?';
             $responseObj=$this->sendRequest($Url,$requestParamsArr,NULL);
            if(!empty($responseObj)){       
                $appstatusArr= json_decode($responseObj,true);          
                return $appstatusArr;
            } else {
                return NULL;
            }
        }
        return NULL;        
    }
    
    public function getAppStatus(){
         $sessionKey=  $this->createAppGridSession();
        if(isset($sessionKey)) {
            
            $requestParamsArr=array('sessionKey'=>$sessionKey); 
            $Url=$this->param['baseUrl'].'status?';
             $responseObj=$this->sendRequest($Url,$requestParamsArr,NULL);
            if(!empty($responseObj)){       
                $appstatusArr= json_decode($responseObj,true);          
                return $appstatusArr;
            } else {
                return NULL;
            }
        }
        return NULL;        
    }
    
    /* 
     * get geodetails from appgrid from sessionkey
     */
    public function getGeodetails() {
         $sessionKey=  $this->createAppGridSession();
        if(isset($sessionKey)) {
            $ip=  $this->getIp();
            $requestParamsArr=array('sessionKey'=>$sessionKey,'ipAddress'=>$ip); 
            $geoIpUrl=$this->param['baseUrl'].$this->param['geoIpUrl'].'?';
             $responseObj=$this->sendRequest($geoIpUrl,$requestParamsArr,NULL);
            if(!empty($responseObj)){       
                $geoArr= json_decode($responseObj,true);          
                return $geoArr;
            } else {
                return NULL;
            }
        }
        return NULL;
    }
    
    /**
     * Get the real Client Ip address.
     * @return type
     */
    function getIp() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $x_forward_ips = $_SERVER['HTTP_X_FORWARDED_FOR'];
            $seperateIps=  explode(',', $x_forward_ips);
            $ip=$seperateIps[0];
        }else{
            $ip = $_SERVER['REMOTE_ADDR'];
        }
       return $ip;
    }
    
    
    
    /* 
     * get geoIp from appgrid from sessionkey
     */
    public function getGeoip($sessionKey) {
        
        if(isset($sessionKey)) {
            if(isset($_COOKIE['appgrid_gid'])){
                return $_COOKIE['appgrid_gid'];
            }
            
            $requestParamsArr=array('sessionKey'=>$sessionKey, 'gid'=>$this->getIp()); 
            $geoIpUrl=$this->param['baseUrl'].$this->param['geoIpUrl'].'?';
             $responseObj=$this->sendRequest($geoIpUrl,$requestParamsArr,NULL);
            if(!empty($responseObj)){      
                $geoArr= json_decode($responseObj,true);
                    if(!empty($geoArr)){
                    setcookie('appgrid_gid',$geoArr['ipAddress'], 0,"/",$this->domain,false,true);
                    $_COOKIE['appgrid_gid'] =$geoArr['ipAddress'];
                    return $geoArr['ipAddress'];
                    }
                return NULL;
            } else {
                $this->resetAppGridSession();
                return NULL;
            }
        }
        return NULL;
    }
    
    /*
     * get metadata with sessionkey and geoip
     */
    public function getMetadata($decode=true) {
        $sessionKey=  $this->createAppGridSession();
        if(!empty($sessionKey)) {
            $requestParamsArr=array('sessionKey'=>$sessionKey,
              'gid'=>$this->getIp());
            
            $url=$this->param['baseUrl'].$this->param['metadata'].'?';
        
             $responseObj=$this->sendRequest($url,$requestParamsArr,NULL);
            if(!empty($responseObj)){
                if($decode==true){
                $metaDataArr= json_decode($responseObj,true);          
                return $metaDataArr;
                }else {
                   // print_r('nonparsed');
                    return $responseObj;
                }
            } else {
                $this->resetAppGridSession();
                return $this->getMetadata();
            }
        }
        return NULL;
    }

    public function getGateways(){
      $sessionKey=  $this->createAppGridSession();     
      if(!empty($sessionKey)) {
        $geoIp            = $this->getGeoip($sessionKey);
        $url              = $this->param['baseUrl'].$this->param['gateways'].'?';
        $requestParamsArr = array('sessionKey'=>$sessionKey, 'gid'=>$geoIp ); 
        $responseObj      = $this->sendRequest($url,$requestParamsArr, NULL);
        if(!empty($responseObj)){
            
          $responseArr   = json_decode($responseObj, true);
          if(is_array($responseArr['gateways'])){
              $gatewaysArray=$responseArr['gateways'];
          }else if(is_string($responseArr['gateways'])){
              $gatewaysArray = json_decode($responseArr['gateways'], true);      
          }
          return $gatewaysArray;
        } else {
          $this->resetAppGridSession();
          return $this->getGateways();
        }
      }
      return NULL;
    }

    public function getPlayerErrors(){
      $sessionKey=  $this->createAppGridSession();     
      if(!empty($sessionKey)) {
        $geoIp            = $this->getIp();
        $url              = $this->param['baseUrl'].$this->param['player_errors'].'?';
        $requestParamsArr = array('sessionKey'=>$sessionKey, 'gid'=>$geoIp ); 
        $responseObj      = $this->sendRequest($url,$requestParamsArr, NULL);
        if(!empty($responseObj)){
          $responseArr   = json_decode($responseObj, true);
          $playerErrArray = json_decode($responseArr['player_errors'], true);         
          return $playerErrArray;
        } else {
          $this->resetAppGridSession();
          return $this->getPlayerErrors();
        }
      }
      return NULL;
    }

    public function getIpRanges(){
      $sessionKey=  $this->createAppGridSession();     
      if(!empty($sessionKey)) {
        $geoIp            = $this->getGeoip($sessionKey);
        $url              = $this->param['baseUrl'].$this->param['ip_ranges'].'?';
        $requestParamsArr = array('sessionKey'=>$sessionKey, 'gid'=>$geoIp ); 
        $responseObj      = $this->sendRequest($url,$requestParamsArr, NULL);
        if(!empty($responseObj)){
          $responseArr   = json_decode($responseObj, true);
          $ipRangesArray = json_decode($responseArr['ip_ranges'], true);         
          return $ipRangesArray;
        } else {
          $this->resetAppGridSession();
          return $this->getIpRanges();
        }
      }
      return NULL;
    }

    public function getEmailTemplate(){
      $sessionKey=  $this->createAppGridSession();     
      if(!empty($sessionKey)) {
        $geoIp            = $this->getIp();
        $url              = $this->param['baseUrl'].$this->param['email_template'].'?';
        $requestParamsArr = array('sessionKey'=>$sessionKey, 'gid'=>$geoIp ); 
        $responseObj      = $this->sendRequest($url,$requestParamsArr, NULL);
        if(!empty($responseObj)){
          $responseArr   = json_decode($responseObj, true);
          $templateArray = json_decode($responseArr['emailtemplate'], true);         
          return $templateArray;
        } else {
          $this->resetAppGridSession();
          return $this->getEmailTemplate();
        }
      }
      return NULL;
    }

    
    public function parseAndSaveMetadata(){       

           
     /*  if (isset($this->appGridMetaDataSessionObj->pagesArr)) {

         
       } else {*/
    // not in session so get metadata 
    // and save in session for $this->param['appgridTimeout'] seconds
        
        $metadataArr=$this->getMetadata();  
        /*while(empty($metadataArr['pages'])){
           $metadataArr=$this->getMetadata(); 
        }*/
        
        try {
            $pagesArr=  ((is_string($metadataArr['pages']))? 
                              json_decode($metadataArr['pages'],true) : 
                           $metadataArr['pages']);

            $menuArr=  ((is_string($metadataArr['menu']))? 
                              json_decode($metadataArr['menu'],true) : 
                           $metadataArr['menu']);
                    
                   
            
            $gatewaysArr=  ((is_string($metadataArr['gateways']))? 
                              json_decode($metadataArr['gateways'],true) : 
                           $metadataArr['gateways']);
            

            $footerArr=  ((is_string($metadataArr['footer']))? 
                              json_decode($metadataArr['footer'],true) : 
                           $metadataArr['footer']);
            
            
            $this->appGridMetaDataArr['device']=NULL;
            if(!empty($metadataArr['device']))
            {
              $deviceArr=((is_string($metadataArr['device']))?
                            json_decode($metadataArr['device'],true) :
                         $metadataArr['device']);
              $this->appGridMetaDataArr['device']=$deviceArr;
            }

            //$this->appGridMetaDataSessionObj->pagesArr = $pagesArr;
            $this->appGridMetaDataArr['pagesArr']=$pagesArr;

            //$this->appGridMetaDataSessionObj->menuArr = $menuArr;
            $this->appGridMetaDataArr['menuArr']=$menuArr;

             $this->appGridMetaDataArr['footerArr']=$footerArr;
            
            //$this->appGridMetaDataSessionObj->gatewaysArr = $gatewaysArr;
            $this->appGridMetaDataArr['gatewaysArr']=$gatewaysArr;
            
            //$this->appGridMetaDataSessionObj->messagesArr = json_decode($metadataArr['messages'],true);
            $this->appGridMetaDataArr['messagesArr']=  ((is_string($metadataArr['messages']))? 
                              json_decode($metadataArr['messages'],true) : 
                           $metadataArr['messages']);
            //=json_decode($metadataArr['messages'],true);

            if(isset($metadataArr['errorcode']) && !empty($metadataArr['errorcode'])) {
              $this->appGridMetaDataArr['errorCodeArr']=  ((is_string($metadataArr['errorcode']))? 
                              json_decode($metadataArr['errorcode'],true) : 
                           $metadataArr['errorcode']);
              //=json_decode($metadataArr['error_code'],true);
            }
         //   $this->appGridMessageSessionObj->CachedmessagesArr=$this->appGridMetaDataArr['messagesArr'];
         //$this->appGridMessageSessionObj->setExpirationSeconds(300);  //timeout seconds   
//set time out
         //   $this->appGridMetaDataSessionObj
           //         ->setExpirationSeconds(1);  //timeout seconds
            //set time out
            //$this->appGridMetaDataSessionObj
              //      ->setExpirationSeconds(1);  //timeout seconds

        } catch (Exception $exc) {
            echo 'Message: ' .$exc->getMessage();
            throw new \Exception("unable to fetch Page or menu details from appgrid");
        }
       //}
    }

    //get menu details as Array from json metadata
    public function getImageMetaDetails() {
        $this->parseAndSaveMetadata();
       
        return array('imageshackBaseurl'=>IMAGES,'deviceArr'=>$this->appGridMetaDataArr['device']);
    }
    //get menu details as Array from json metadata
    public function getMenuDetails() {
        $menuArray=array();
        $this->parseAndSaveMetadata();
        if(!empty($this->appGridMetaDataArr['menuArr'])){
            $menuArray['menu']=$this->appGridMetaDataArr['menuArr'];
        }
       // return $this->appGridMetaDataSessionObj->menuArr;
        return $menuArray;
    }

     //get menu details as Array from json metadata
    public function getFooterDetails() {
        $this->parseAndSaveMetadata();
       // return $this->appGridMetaDataSessionObj->menuArr;
        return $this->appGridMetaDataArr['footerArr'];
    }
    
    // public function getGateways(){
    //     $this->parseAndSaveMetadata();
    //    // return $this->appGridMetaDataSessionObj->gatewaysArr;
    //     return $this->appGridMetaDataArr['gatewaysArr'];
    // }
    public function getPageDetails($pageId) {
        $this->parseAndSaveMetadata();
        if(!empty($this->appGridMetaDataArr['pagesArr'])){
            foreach ($this->appGridMetaDataArr['pagesArr'] as $page) {
               if($pageId==$page['id']) {
                  return $page;
               }
            }
        }
        return null;
    }
 
    /*
     * get getAppgridMessages
     */
    public function getAppgridMessages($decode=true) {
        $sessionKey=  $this->createAppGridSession();
               
        if(!empty($sessionKey)) {
            $requestParamsArr=array('sessionKey'=>$sessionKey,
               'gid'=>$this->getIp() ); 
            
            $url=$this->param['baseUrl'].$this->param['metadata'].'/messages?';
           // print_r($url);
             $responseObj=$this->sendRequest($url,$requestParamsArr,NULL);
            if(!empty($responseObj)){
                if($decode==true){
                $metaDataArr= json_decode($responseObj,true);          
                return $metaDataArr;
                }else {
                   // print_r('nonparsed');
                    return $responseObj;
                }
            } else {
                return NULL;
            }
        }
        return NULL;
    }
    
    /*
     *  getAppgridErrorcodesAndmessagesObj
     */
    public function getAppgridErrorcodesAndmessagesObj() {
        $sessionKey=  $this->createAppGridSession();

        if(!empty($sessionKey)) {
        $geoIp=$this->getIp();

            $requestParamsArr=array(
              'sessionKey'=>$sessionKey,
              'gid'=>$geoIp
            );
            $metaDataArr=array();
            $messagesurl=$this->param['baseUrl'].$this->param['metadata'].'/messages,errorcode?';
             $messagesresponseObj=$this->sendRequest($messagesurl,$requestParamsArr,NULL);
            if(!empty($messagesresponseObj)){   
                try{
                  $temp= json_decode($messagesresponseObj,true);
                  $metaDataArr['messages']=$temp['messages'];
                  $metaDataArr['errorcode']=$temp['errorcode'];
                } catch (\Exception $e) {
                  $metaDataArr['messages']= NULL;
                  $metaDataArr['errorcode']= NULL;
                }
            } else {
                $metaDataArr['messages']= NULL;
                $metaDataArr['errorcode']= NULL;
            }
            return $metaDataArr;
        }
        return NULL;
    }

    /*
     * get getAppgriderrorcodesandmessages
     */
    public function getAppgridErrorcodes($decode=true) {
        $sessionKey=  $this->createAppGridSession();
               
        if(!empty($sessionKey)) {
        $geoIp=$this->getIp();
        
            $requestParamsArr=array('sessionKey'=>$sessionKey,
               'gid'=>$geoIp ); 
            
            $url=$this->param['baseUrl'].$this->param['metadata'].'/errorcode?';
           // print_r($url);
             $responseObj=$this->sendRequest($url,$requestParamsArr,NULL);
            if(!empty($responseObj)){
                if($decode==true){
                $metaDataArr= json_decode($responseObj,true);          
                return $metaDataArr;
                }else {
                   // print_r('nonparsed');
                    return $responseObj;
                }
            } else {
                return NULL;
            }
        }
        return NULL;
    }    
    
    public function getMessages() {
           //$this->parseAndSaveMetadata();
        //return $this->appGridMetaDataSessionObj->messagesArr;
        //return $this->appGridMetaDataArr['messagesArr'];
       $metadataArr= $this->getAppgridMessages();
       if(!empty($metadataArr['messages'])){
                    $this->appGridMetaDataArr['messagesArr']=  ((is_string($metadataArr['messages']))? 
                              json_decode($metadataArr['messages'],true) : 
                           $metadataArr['messages']);
           return $this->appGridMetaDataArr['messagesArr'];       
       } else{
           return NULL;          
       }
    }

    public function getErrorCodes() {
         /*  $this->parseAndSaveMetadata();
        //return $this->appGridMetaDataSessionObj->messagesArr;
           if(!empty($this->appGridMetaDataArr['errorCodeArr']))
        return $this->appGridMetaDataArr['errorCodeArr'];
           else
               return NULL;
         
          */
      $metadataArr= $this->getAppgridErrorcodes();
      if(isset($metadataArr['errorcode']) && !empty($metadataArr['errorcode'])) {
              $this->appGridMetaDataArr['errorCodeArr']=  ((is_string($metadataArr['errorcode']))? 
                              json_decode($metadataArr['errorcode'],true) : 
                           $metadataArr['errorcode']);
           return $this->appGridMetaDataArr['errorCodeArr'];    
        }else {
            return NULL;
        }
    }

    public function parsedMessages($lang=NULL){
       
        $preferedLang='en_US';
        if($lang=='es'){
          $preferedLang='es_ES';
        }
        $AppgridErrorcodesAndmessagesObj=$this->getAppgridErrorcodesAndmessagesObj();
        //messages-----------------------------
        //$parsedMsg=$this->getMessages();
        $parsedMsg=(!empty($AppgridErrorcodesAndmessagesObj)?json_decode($AppgridErrorcodesAndmessagesObj['messages'],true):NULL);
        //Error codes--------------------------
        //$parsedErrorCode = $this->getErrorCodes();
        $parsedErrorCode=(!empty($AppgridErrorcodesAndmessagesObj)?json_decode($AppgridErrorcodesAndmessagesObj['errorcode'],true):NULL);

        if(!empty($parsedMsg) && !empty($parsedErrorCode)){
        //combine arrays
        $newCombinedMsg = array_merge($parsedMsg, $parsedErrorCode);
        
        } else {
            $newCombinedMsg = $parsedMsg;
        }
        
        $messages=array();
        if(!empty($newCombinedMsg)) {  
          foreach ($newCombinedMsg as $msgArr) {
                 if(!empty($msgArr[$preferedLang])){
                   $messages[$msgArr['id']]=$msgArr[$preferedLang];               
                 }
          }
        }
        return $messages;
    }
    
    public function getShowcaseApiCallDetails($pageId){
        $pageDts=$this->getPageDetails($pageId);
        if(!isset($pageDts)) {
          return null;// invalid pageid
        }
        if(empty($pageDts['showcase'])) {
             return "NoShowcase";
         } else {
             return $pageDts['showcase'];
         }
    }

    public function getRailsApiCallDetailsList($pageId){
        $pageDts=$this->getPageDetails($pageId);
        if(!isset($pageDts)){
            return null;// invalid pageid
        }
        
        if(empty($pageDts['items'])) {
            return "NoRails"; //no rails component
        }
        $showcaseData='';
        if(empty($pageDts['showcase'])) {
              $showcaseData="NoShowcase";
         } else {
             $showcaseData=$pageDts['showcase'];
         }
        $imgdetails=$this->getImageMetaDetails();
            $railsArr=array();
            $gatewaysArr=  $this->getGateways();
            foreach ($pageDts['items'] as $railsDts) {
                if(empty($railsDts['query'])) {
                   // throw new \Exception("'query' missing in 'items' of 'pages'");
                }
                
                if($railsDts['query']=='manual')
                {
                   
                } else {
                    
                 /*   if(empty($gatewaysArr[$railsDts['query']])){
                     // throw new \Exception("'query' missing in 'gateways'");
                    }
                    
                    $baseUrl=$gatewaysArr[$railsDts['query']];
                    
                    
                    if(empty($railsDts['queryoptions'])){
                      //throw new \Exception("'queryoptions' missing in 'items' of 'pages'");
                    }                    
                  */  
                    $requestParamsArr=$railsDts['queryoptions'];
                    
                    //$railsDts['header_link']="/channels?q=network";
                    if(!empty($railsDts['header_link']))
                        $railsDts['hasHeader_link']=true;
                    else
                        $railsDts['hasHeader_link']=false;
                    
                    
                   // $railsDts['railBaseURL']=$baseUrl;
                    $railsDts['railParams']=$requestParamsArr;
                    $railsDts['imageMetaData']= $imgdetails; 
                }
                    
                    $railsArr[]=$railsDts;  
            }
            return  array('railsArr'=>$railsArr,'showcaseQuery'=>$showcaseData);
        
    }
    
    /*
     * get all directv menus.
     */
    public function directvMenus($appConfigMainmenu){
        $resultantMenu=array();
        $TopMenuArr=  $this->getMenuDetails();//get menus from appgrid.
        $menuArr=$TopMenuArr['menu'];
        
       
        //$string = file_get_contents(APPLICATION_PATH."/app/mainmenu.json");
        //$json_a = json_decode($string, true);
       // $menuArr=$json_a['menu'];
        foreach ($menuArr as $menu){
            $this->getMenu($menu,$appConfigMainmenu,$resultantMenu);
        } 
        return $resultantMenu;
    }
  
    /**
     * 
     * @param type $menu
     * @param type $appConfigMainmenu
     * @param type $resultantMenu
     */
    public function getMenu($menu,$appConfigMainmenu,&$resultantMenu){
        if($menu['action']==='page'){
                if(array_key_exists($menu['actionID'], $appConfigMainmenu)
                        && $menu['actionID']!="home" //To avoid featured menu from appgrid data.
                  ){
                    $mainNav=array();
                    if($appConfigMainmenu[$menu['actionID']]==="null"){
                        $mainNav["href"]="#";
                    }else {
                        $mainNav["href"]=$appConfigMainmenu[$menu['actionID']];
                    }
                    $mainNav["label"]=$menu['title'];
                    $mainNav["dropdown"]=  $this->getChildMenu($menu,$appConfigMainmenu);
                    array_push($resultantMenu, $mainNav);
                }
            }
    }
    /**
     * 
     * @param type $menu
     * @return type Description
     */
    public function getChildMenu($menu,$appConfigMainmenu){
        $submenus=array();      
        if($menu['children']!=null){
           foreach($menu['children'] as $smenu){
                 $childMenu=array();
                 if(array_key_exists($smenu['actionID'], $appConfigMainmenu)){
                     if($appConfigMainmenu[$smenu['actionID']]==="null"){
                        $childMenu["href"]="#";
                    }else {
                        $childMenu["href"]=$appConfigMainmenu[$smenu['actionID']];
                    }
                    $childMenu["label"]=$smenu['title'];
                    $childMenu["dropdown"]=null;
                 } 
                 array_push($submenus, $childMenu);
           }   
        }else{
            $submenus=null;
        }
        return $submenus;
    }
    
    public function getIpAddress() {
        $IPAdress = '';
        if (getenv('HTTP_CLIENT_IP')) {
            $IPAdress = array("ip" => getenv('HTTP_CLIENT_IP'), "env" => "HTTP_CLIENT_IP");
        } else if(getenv('HTTP_X_FORWARDED_FOR')) {
            $IPAdress = array("ip" => getenv('HTTP_X_FORWARDED_FOR'), "env" => "HTTP_X_FORWARDED_FOR");
        } else if(getenv('HTTP_X_FORWARDED')) {
            $IPAdress = array("ip" => getenv('HTTP_X_FORWARDED'), "env" => "HTTP_X_FORWARDED");
        } else if(getenv('HTTP_FORWARDED_FOR')) {
            $IPAdress = array("ip" => getenv('HTTP_FORWARDED_FOR'), "env" => "HTTP_FORWARDED_FOR");
        } else if(getenv('HTTP_FORWARDED')) {
           $IPAdress  = array("ip" => getenv('HTTP_FORWARDED'), "env" => "HTTP_FORWARDED");
        } else if(getenv('REMOTE_ADDR')) {
            $IPAdress = array("ip" => getenv('REMOTE_ADDR'), "env" => "REMOTE_ADDR");
        } else {
            $IPAdress = array("ip" => 'UNKNOWN', "env" => "NONE");
        }
        return $IPAdress;
    }

    public function getIpTest() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $IPAdress = array("ip" => $_SERVER['HTTP_CLIENT_IP'], "env" => "HTTP_CLIENT_IP");
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $xForwardIps = $_SERVER['HTTP_X_FORWARDED_FOR'];
            $seperateIps = explode(',', $xForwardIps);
            $IPAdress   = array("ip" => $seperateIps[0], "env" => "HTTP_X_FORWARDED_FOR");
        } else {
            $IPAdress = array("ip" => $_SERVER['REMOTE_ADDR'], "env" => "REMOTE_ADDR");
        }
       return $IPAdress;
    }
 
    public function testSHM() {
    
    /**
    * Creating new block, with a random ID
    */
        try{
   print_r('initiating block');   
    $memory = new Block('Sample');
    print_r('first read check   __');
    $k=$memory->read();
    if($k===false ){
        print_r('writing to memory --');
        //for testing
    $memory->write('test');
    } else {
       print_r('from memory --');
    }
    echo '<pre>';
    print_r("Writing '' ");
    print_r("Reading 'json':--->");
    var_dump($memory->read());
    
        } catch (\Exception $e){
            echo $e;
        }



        
    }
 }
