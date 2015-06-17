<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SingleAssetService
 *
 * @author AsishAP
 */
namespace Hott\Services\SingleAsset;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Hott\Services\SingleAsset\SingleAssetAdapter;
class SingleAssetService  implements FactoryInterface{
     protected $_configParam;
     protected $longSearchParser;
     public function createService(ServiceLocatorInterface $serviceLocator) {
        if($this->_configParam === null) {
            $configuration = $serviceLocator->get('Config');
            // Looking for 'configuration' in the merged configuration
            if (!isset($configuration)) {
                throw new Exception\InvalidArgumentException('Could not find configuration params');
            }
            $this->_configParam        = $configuration;
            $this->longSearchParser = $serviceLocator->get('longSearchParser');
            
        }
        
        return new SingleAssetAdapter($this->_configParam,$this->longSearchParser);
     }
}
