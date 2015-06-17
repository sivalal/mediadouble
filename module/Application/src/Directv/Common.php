<?php

namespace Directv;

class Common
{
	protected static $_instance;

	/**
	 * Create an instance 
	 *
	 */
	public static function getInstance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * A utility function that return a HttpClient for API calls.
     * @return \Zend\Http\Client
     */
    protected function getHttpClient($curlOptionParam){
        $config = array(
                'adapter'     => 'Zend\Http\Client\Adapter\Curl',
                'curloptions' => $curlOptionParam
        );
        return new Client('', $config);
    }

    /**
     * Send the request to the specific URL. May modify the url based on the given parameters and options.
     * @param string $url
     * @param array $param
     * @param array $opts
     */
    public function sendRequest($url, $param = null, $method = 'GET', $cacheKey = null){
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

    protected function sendRequestForGateways($url, $param, $cacheKey = null){
        $response = array();
        foreach($param as $key => $val){
            $url .= "&$key=$val";
        }
        $request = new Request();
        $request->setUri($url);
        $request->setMethod('GET');

        // caching disabled
        if( static::$cache === NULL ){
          $responseTemp = static::$http->dispatch($request);
          return $responseTemp->getContent();
        } 
        // caching enabled
        $key = $this->calCacheKey($cacheKey);
        if( static::$cache->hasItem($key) ){
            $response = static::$cache->getItem($key);
        }
        else{
            $responseTemp = static::$http->dispatch($request);
            if ($responseTemp->isSuccess()) {
                  $response = $responseTemp->getContent();     
                  static::$cache->addItem($key, $response);
            } else { 
              return $response; 
            }
        }
        return $response;
    }

    public function checkCacheEnabled($param) {
    	if( isset($param['cache']) && isset($param['cache']['enabled']) && $param['cache']['enabled'] ){
          static::$cache = \Zend\Cache\StorageFactory::factory(array(
              'adapter' => array(
                  'name' => 'filesystem',
                  'options' => array(
                      'ttl' => $param['cache']['ttl']
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
}