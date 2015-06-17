<?php

namespace Directv\Search;

use Zend\Config;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class SearchFactory implements FactoryInterface
{
    protected $searchParam;
    
    /**
     * @param ServiceLocatorInterface $serviceLocator
     * @return Directv\Search\SearchAdapter
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        
        if ($this->searchParam === null) {
            $configuration = $serviceLocator->get('Config');
            
            // Looking for 'search' in the merged configuration
            if (!isset($configuration['search'])) {
                throw new Exception\InvalidArgumentException('Could not find search configuration key');
            }
            
            if (!is_array($configuration['search'])) {
                throw new Exception\InvalidArgumentException('Search must be a Traversable');
            }

            if (!is_array($configuration['curloptions'])) {
                throw new Exception\InvalidArgumentException('Could not find curl options');
            }
            
            $this->searchParam     = $configuration['search'];
            $this->curlOptionParam = $configuration['curloptions'];
            $this->searchType      = $this->searchParam["adapter"];
        }
        return new $this->searchType($this->searchParam, $this->curlOptionParam);
    }
}
