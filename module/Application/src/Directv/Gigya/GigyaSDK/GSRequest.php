<?php

namespace Directv\Gigya\GigyaSDK;

use \Exception;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Log\Logger;

/**
 * A Request to Gigya Socialize API
 *
 */

class GSRequest {    
    private static $cafile;
    private static $curlOptions;
    private static $loggerObj;
    const DEFAULT_API_DOMAIN = "gigya.com";
    const version = "2.15";
    
    private $host;
    private $domain;
    private $path;
    private $traceLog = array();
    protected $method;
    private $proxy;
    
    private $apiKey;    
    private $secretKey; 
    private $params; //GSObject 
    private $useHTTPS; 
    private $apiDomain = self::DEFAULT_API_DOMAIN;
    private static $instance = null;

    static function __constructStatic($curlOptionParam, $logger) 
    {
//        GSRequest::$cafile = realpath(DOC_ROOT.'/src/Directv/Gigya/GigyaSDK/cacert.pem');
        GSRequest::$curlOptions = $curlOptionParam;
        GSRequest::$loggerObj   = $logger;
    }

    
    /**
     * Constructs a request using an apiKey and secretKey. 
     * You must provide a user ID (UID) of the tage user.
     * Suitable for calling our old REST API
     * @param apiKey
     * @param secretKey                                                            
     * @param apiMethod the api method (including namespace) to call. for example: socialize.getUserInfo
     * If namespaces is not supplied "socialize" is assumed
     * @param params the request parameters
     * @param useHTTPS useHTTPS set this to true if you want to use HTTPS. 
     */
    public function __construct($apiMethod, $params = null, $useHTTPS = true) 
    {
        if (!isset($apiMethod) || strlen($apiMethod)==0)
            return;
        
        if (substr($apiMethod,0,1) == "/")
            $apiMethod = substr($apiMethod,1);
            
        if (strrpos($apiMethod,".")==0)
        {
            $this->domain = "socialize.gigya.com";
            $this->path = "/socialize." . $apiMethod;
        } else
        {
            $tokens =  explode(".",$apiMethod);
            $this->domain = $tokens[0].".gigya.com";
            $this->path = "/".$apiMethod;
        }
        
        $this->method = $apiMethod;

        if (empty($params))
            $this->params = new GSObject();
        else
            $this->params = clone $params;
        
        // use "_host" to override domain, if available
        $this->domain = $this->params->getString("_host", $this->domain);
        
        $this->useHTTPS = $useHTTPS;
        
        $this->apiKey    = API_KEY;
        $this->secretKey = SECRET_KEY;
        
        $this->traceField("apiMethod",$apiMethod);
        $this->traceField("apiKey",API_KEY);  
    }  

    public function setParam($param, $val) {
        $this->params->put($param, $val);
    }
    
    public function getParams()
    {
        return $this->params;
    }   
    
    /**
     * Sets the domain used for making API calls. This method provides the option to override the default domain "gigya.com" and specify an alternative data center to be used.
     * Parameters:
     *    $apiDomain - the domain of the data center to be used. For example: "eu1.gigya.com" for Europe data center.
     */
    public function setAPIDomain($apiDomain)
    {
        if(!isset($apiDomain) || strlen($apiDomain)==0)
            $this->apiDomain = self::DEFAULT_API_DOMAIN;
        else
            $this->apiDomain = $apiDomain;
    }

    public static function setCAFile($filename)
    {
        GSRequest::$cafile = $filename;
    }
    
    public function setProxy($proxy)
    {
        $proxy = "127.0.0.1";
        $this->proxy = $proxy;
        $this->traceField("proxy",$proxy);
    }
    
    /**
     * Send the request synchronously
     */
    public function send($timeout=null) 
    {
        $format = $this->params->getString("format",null);

        if (!strrpos($this->method, ".")) {
            $this->host = "socialize.".$this->apiDomain;
            $this->path = "/socialize.".$this->method;
        } else {
            $tokens = explode( ".", $this->method );
            $this->host = $tokens[0].".".$this->apiDomain;
            $this->path = "/".$this->method;
        }
        
        //set json as default format.
        if (empty($format))
        {
            $format =  "json";
            $this->setParam("format", $format);
        }
        if(!empty($timeout))
        {
            $this->traceField("timeout",$timeout);
        }
        
        if (    (empty($this->apiKey))
             || (empty($this->method))
         )
         {
            return new GSResponse($this->method,null,$this->params,400002,null,$this->traceLog);
         }
        
        try 
        {
            $this->setParam("httpStatusCodes", "false");
            
            $this->traceField("apiKey", $this->apiKey);
            $this->traceField("apiMethod", $this->method);
            $this->traceField("params",$this->params);
            $this->traceField("useHTTPS", $this->useHTTPS);

            $responseStr = $this->sendRequest("POST", $this->host, $this->path, $this->params, $this->apiKey, $this->secretKey, $this->useHTTPS,$timeout);
            return new GSResponse($this->method,$responseStr,null,0,null,$this->traceLog);
        }
        catch (Exception $ex) {
            $errcode = 500000;
            $errMsg = $ex->getMessage();
            $length = strlen("Operation timed out");
            if((substr($ex->getMessage(), 0, $length) === "Operation timed out"))
            {
                 $errcode = 504002;
                 $errMsg = "Request Timeout";
            }
    
            return new GSResponse($this->method,null,$this->params,$errcode,$errMsg, $this->traceLog);
        }
    }

    private function sendRequest($method,$domain,$path,$params,$token,$secret,$useHTTPS=false,$timeout=null)
    {
        $params->put("sdk", "php_".GSRequest::version);
        //prepare query params
        $protocol = $useHTTPS || empty($secret) ? "https" : "http";
        $resourceURI = $protocol."://".$domain.$path;

        
        //UTC timestamp.
        $timestamp = (string) time();
        
        //timestamp in milliseconds
        $nonce  = (string)SigUtils::currentTimeMillis();
        $httpMethod = "POST";

        
        if (!empty($secret))
        {
            $params->put("apiKey", $token);
            
            if ($useHTTPS)
            {
                $params->put("secret", $secret);
            } else
            {
                $params->put("timestamp", $timestamp);
                $params->put("nonce", $nonce);
                
                //signature
                $signature = self::getOAuth1Signature($secret, $httpMethod, $resourceURI, $useHTTPS, $params);
                $params->put("sig", $signature);
            }
        }
        else {
            
            $params->put("oauth_token", $token);
        }
        
        //get rest response.
        $res = $this->curl($resourceURI, $params, $timeout);
        return $res;
    }


    private function curl($url, $params, $timeout=null, $options = array())
    {     

        foreach($params->getKeys() as $key)
        {
            $value = $params->getString($key);
            $postData[$key] = $value;
        }
        
        $qs = http_build_query($postData);
        $this->traceField("URL",$url);
        $this->traceField("postData",$qs);

        /* POST */
        $defaults = array(
            CURLOPT_URL => $url,
            CURLOPT_POST=>1,
            CURLOPT_HEADER => 1,
            CURLOPT_POSTFIELDS=>$postData,
            CURLOPT_HTTPHEADER => array( 'Expect:'),
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => FALSE, 
            //CURLOPT_SSL_VERIFYHOST => 2,
          //  CURLOPT_CAINFO => GSRequest::$cafile ,
            //CURLOPT_PROXY => $this->proxy,
            CURLOPT_TIMEOUT_MS => $timeout
        );
        $ch = curl_init();
        curl_setopt_array($ch, ($defaults + GSRequest::$curlOptions + $options));
        if(!$result = curl_exec($ch))
        {
            $err = curl_error($ch) ;
            GSRequest::$loggerObj->log(\Zend\Log\Logger::CRIT, "\r\nException:" . $err ."\r\n");
            throw new \Exception($err);
        }
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if($httpcode == 200) {
            GSRequest::$loggerObj->log(\Zend\Log\Logger::INFO, "\r\nSuccess on gigya call:" . $this->method ."\r\n");
        } else {
            GSRequest::$loggerObj->log(\Zend\Log\Logger::WARN, "\r\nError on gigya call :" . $this->method ."\r\n");
        }
        curl_close($ch);

        list($header, $body) = explode("\r\n\r\n", $result, 2); 
        $headers = explode("\r\n", $header);

        if(count($headers) == 1) {
            list($header, $body) = explode("\r\n\r\n", $body, 2); 
            $headers = explode("\r\n", $header);
        }       
        foreach($headers as $value) 
        {
            $kvp = explode(":", $value);
            if($kvp[0] == "x-server")
            {
                $this->traceField("server",$kvp[1]);
                break;  
            }
        }   
        return $body;
    } 

    /**
    * Converts a GSObject to a query string
    * @param params
    * @return
    */
    public static function buildQS($params) 
    {
        $val;
        $ret = "";
        foreach($params->getKeys() as $key) 
        {
            $val = $params->getString($key);
            if (isset($val))
            {
                $ret .="$key=".$val;
            }
            $ret .='&';
        }
        return $ret;
    }

    private static function getOAuth1Signature($key, $httpMethod, $url, $isSecureConnection, $requestParams) 
    {
        // Create the BaseString.
        $baseString = self::calcOAuth1BaseString($httpMethod, $url, $isSecureConnection, $requestParams);
        return SigUtils::calcSignature($baseString,$key);
    }
    
    private static function calcOAuth1BaseString($httpMethod, $url, $isSecureConnection, $requestParams) 
    {

        
        $normalizedUrl = "";
        $u = parse_url($url);
        $protocol = strtolower($u["scheme"]);
        
        if(array_key_exists('port',$u))
        {
            $port = $u['port'];
        }
        else        
            $port = null;
        
        $normalizedUrl .= $protocol."://";
        $normalizedUrl .= strtolower($u["host"]);
        
        if  ( $port != ""  && (($protocol=="http" && $port!=80) || ($protocol=="https" && $port!=443))) 
        {
            $normalizedUrl .= ':'.$port;
        }           
        $normalizedUrl .= $u["path"];
        
        // Create a sorted list of query parameters
        $amp = "";
        $queryString = "";
        $keys = $requestParams->getKeys();
        sort($keys);
        foreach($keys as $key) 
        {
            $value = $requestParams->getString($key);
            if ($value !== false && $value != "0" && empty($value))
            {
                $value = "";
            }
            
            //curl is sending 1 and 0 when the value is boolean.
            //so in order to create a valid signature we're changing false to 0 and true to 1.
            if($value === false)$value = "0"; 
            if($value === true)$value = "1";
            $queryString .= $amp.$key."=".self::UrlEncode($value);
            $amp = "&";
        }
        
        // Construct the base string from the HTTP method, the URL and the parameters 
        $baseString = strtoupper($httpMethod)."&".self::UrlEncode($normalizedUrl)."&".self::UrlEncode($queryString);
        return $baseString;

    }   
    
    public static function UrlEncode($value) 
    {
        if ($value === false)
        {
            return $value;
        }
        else
        {
            return str_replace('%7E', '~', rawurlencode($value));
        }
    }
    
    private function traceField($name,$value)
    {
        array_push($this->traceLog,$name."=". $value);
    }
    
}
