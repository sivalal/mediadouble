<?php

namespace Hott\Utility;

use Zend\Http\Client;
use Zend\Http\Request;
use Zend\Http\Client\Adapter\Curl;
use Zend\Log\Logger;

class HttpService  {

    protected $_curlOptionParam;
    protected $_logger;
    protected $_cookieSecretKey;
    protected static $http = null;
    protected $iv; //initialization vector

	public function __construct($curlOptionParam, $cookieSecretKey, $logger) {
        $this->_curlOptionParam = $curlOptionParam;
		    $this->_logger          = $logger;
        static::$http           = $this->getHttpClient();
        $this->_cookieSecretKey = $cookieSecretKey;
        $this->iv               = '1234567890abcdef'; //initialization vector
	}
        
      /*
       * to encript using AES256
       */
      public function fnEncrypt($sValue)
        {
            return rtrim(
                base64_encode(
                    mcrypt_encrypt(
                        MCRYPT_RIJNDAEL_128,
                        $this->_cookieSecretKey, $sValue, 
                        MCRYPT_MODE_CBC, 
                        $this->iv
                        )
                    ), "\0"
                );
        }
        
      /*
       * to decrypt AES256
       */
     public  function fnDecrypt($sValue)
      {
            return rtrim(
                mcrypt_decrypt(
                    MCRYPT_RIJNDAEL_128, 
                    $this->_cookieSecretKey, 
                    base64_decode($sValue), 
                    MCRYPT_MODE_CBC,
                    $this->iv
                ), "\0"
            );
       }  

    
    /*
     * SetHttpOnlyCookie
     */
    public function SetHttpOnlyCookie($key, $value, $duration=NULL){
       setcookie($key, $value, $duration, '/', NULL, NULL, TRUE); 
       setcookie($key, $value, $duration, '/', NULL, NULL, TRUE);
       $_COOKIE[$key]=$value;
    }

    /*
     * deleteHttpOnlyCookie
     */
    public function deleteHttpOnlyCookie($key){
       if (isset($_COOKIE[$key])) {
          unset($_COOKIE[$key]);
          setcookie($key, null, -1, '/');
          setcookie($key, "", time() - 3600);
          return true;
      } else {
          return false;
      }
    }

    public function encryptAndSetCookie($key, $value, $duration=NULL) {
        $encriptedValue = $this->fnEncrypt($value);
        $this->SetHttpOnlyCookie($key, $encriptedValue);
        return;
    }

    public function decryptAndGetCookie($key) {
        if(isset($_COOKIE[$key])){
            $value = $_COOKIE[$key];
            $decryptedValue = $this->fnEncrypt($value);
            return $decryptedValue; 
        } 
        return NULL;
    }


	/**
     * A utility function that return a HttpClient for API calls.
     * @return \Zend\Http\Client
     */
    protected function getHttpClient(){
        $config = array(
                'adapter'     => 'Zend\Http\Client\Adapter\Curl',
                'curloptions' => $this->_curlOptionParam
        );
        return new Client('', $config);
    }

	/**
     * Send the request to the specific URL. May modify the url based on the given parameters and options.
     * @param string $url
     * @param array $param
     * @param string $method
     * @param array $opts
     * @param json $rawJsonData
     */
    public function sendRequest($url, $param = array(), $method = 'GET', $opts = array(), $rawJsonData=null){
        $response = '';
        $baseUrl  = $url;
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
            /**
             * Error Logger
             */
            $this->_logger->log(\Zend\Log\Logger::CRIT, $d ."\r\n");
            return array(
                'responseStatus'  => 500,
                'responseContent' => $d
            );
        }
        $responseContent = json_decode($content, true); 
        $responseContent = empty($responseContent) ? $content : $responseContent;
        if($response->getStatusCode() == 200) {
            $this->_logger->log(\Zend\Log\Logger::INFO, "\r\nSuccess on API call:" . $baseUrl ."\r\n");
        } else {
            $this->_logger->log(\Zend\Log\Logger::WARN, "\r\nError on API call:" . $baseUrl ."\r\n");
        }
        return array(
            'responseStatus'  => $response->getStatusCode(),
            'responseContent' => $responseContent
        );

    }
}