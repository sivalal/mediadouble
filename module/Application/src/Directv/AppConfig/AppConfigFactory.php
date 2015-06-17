<?php

namespace Directv\AppConfig;

use Directv\AppConfig\AppConfig;
use Zend\Config;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AppConfigFactory implements FactoryInterface
{
    protected $appConfigParam;
    
    /**
     * @param ServiceLocatorInterface $serviceLocator
     * @return Directv\AppConfig\AppviewAdapter
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        
        if ($this->appConfigParam === null) {
            $configuration = $serviceLocator->get('Config');
            
            // Looking for 'appconfig' in the merged configuration
            if (!isset($configuration['appconfig'])) {
                throw new Exception\InvalidArgumentException('Could not find appconfig configuration key');
            }
            
            if (!is_array($configuration['appconfig'])) {
                throw new Exception\InvalidArgumentException('appconfig must be a Travsable');
            }

            if (!is_array($configuration['curloptions'])) {
                throw new Exception\InvalidArgumentException('Could not find curl options');
            }
            
            $this->appConfigParam  = $configuration['appconfig'];
            $this->curlOptionParam = $configuration['curloptions'];
            $this->adapterType     = $this->appConfigParam["adapter"];
        }   
        
        return new $this->adapterType($this->appConfigParam, $this->curlOptionParam);
    }
    
    
}
