<?php

namespace Directv\Gigya;

use Zend\Config;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Hott\Utility\HttpService;

class GigyaHandlerFactory implements FactoryInterface
{
    protected $gigyaParam;
    protected $gigyaType;
    protected $curlOptionParam;
    protected $_httpUtilityService;
    
    /**
     * @param ServiceLocatorInterface $serviceLocator
     * @return Directv\Gigya\PostHandlerAdapter
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        
        if ($this->gigyaParam === null) {
            $configuration = $serviceLocator->get('Config');
            $logger        = $serviceLocator->get('Zend\Log\Logger');
            
            // Looking for 'gigya' in the merged configuration
            if (!isset($configuration['gigya'])) {
                throw new Exception\InvalidArgumentException('Could not find gigya configuration key');
            }
            
            if (!is_array($configuration['gigya'])) {
                throw new Exception\InvalidArgumentException('Gigya must be a Traversable');
            }

            if (!is_array($configuration['curloptions'])) {
                throw new Exception\InvalidArgumentException('Could not find curl options');
            }
            
            $this->gigyaParam          = $configuration['gigya'];
            $this->curlOptionParam     = $configuration['curloptions'];
            $this->gigyaType           = $this->gigyaParam["adapter"];
            $this->_httpUtilityService = new HttpService($configuration['curloptions'], $configuration['cookieSecretKey'], $logger);
        }
        return new $this->gigyaType($this->gigyaParam, $this->curlOptionParam, $logger, $this->_httpUtilityService);
    }
}
