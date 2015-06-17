<?php

namespace Directv\OnDemand;

use Zend\Config;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class OnDemandFactory implements FactoryInterface
{
    protected $ondemandParam;
    protected $ondemandType;
    public $curlOptionParam;
    
    /**
     * @param ServiceLocatorInterface $serviceLocator
     * @return Directv\Search\SearchAdapter
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        
        if ($this->ondemandParam === null) {
            $configuration = $serviceLocator->get('Config');
            
            // Looking for 'ondemand' in the merged configuration
            if (!isset($configuration['ondemand'])) {
                throw new Exception\InvalidArgumentException('Could not find ondemand configuration key');
            }
            
            if (!is_array($configuration['ondemand'])) {
                throw new Exception\InvalidArgumentException('ondemand must be a Traversable');
            }

            if (!is_array($configuration['curloptions'])) {
                throw new Exception\InvalidArgumentException('Could not find curl options');
            }
            
            $this->ondemandParam   = $configuration['ondemand'];
            $this->curlOptionParam = $configuration['curloptions'];
            $this->ondemandType    = $this->ondemandParam["adapter"];
        }
        return new $this->ondemandType($this->ondemandParam, $this->curlOptionParam);
    }   
}
