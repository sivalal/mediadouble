<?php

namespace Hott\ExternalApi;

use Zend\Config;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Hott\Utility\HttpService;
use Hott\Ooyala\OoyalaAPI;

class ExternalApiFactory implements FactoryInterface {
    protected $_externalApiParam;
    protected $_externalApiClass;
    protected $_httpUtilityService;
    protected $_OoyalaApi;


    /**
     * @param ServiceLocatorInterface $serviceLocator
     * @return Hott\ExternalApi\ExternalApiAdapter
     */
    public function createService(ServiceLocatorInterface $serviceLocator) {
        if($this->_externalApiParam === null) {
            $configuration = $serviceLocator->get('Config');
            $logger        = $serviceLocator->get('Zend\Log\Logger');
            // Looking for 'configuration' in the merged configuration
            if (!isset($configuration)) {
                throw new Exception\InvalidArgumentException('Could not find configuration params');
            }
            $this->_externalApiParam   = $configuration["externalApi"];
            $this->_externalApiClass   = $this->_externalApiParam["adapter"];
            $this->_httpUtilityService = new HttpService($configuration['curloptions'], $configuration['cookieSecretKey'], $logger);
            $this->_OoyalaApi          = new OoyalaAPI();
        }
        return new $this->_externalApiClass($this->_externalApiParam, $this->_httpUtilityService, $this->_OoyalaApi);
    }   
}
