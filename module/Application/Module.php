<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Http\Request;

class Module
{
    private $sm;

    public function onBootstrap(MvcEvent $e)
    {
        $config        = $this->getConfig();
        $phpSettings   = $config['phpSettings'];
        if($phpSettings) {
            foreach($phpSettings as $key => $value) {
                ini_set($key, $value);
            }
        }
        date_default_timezone_set('UTC');
        $gigyaSettings = $config['gigya_constants'];
        if($gigyaSettings) {
            foreach($gigyaSettings as $key => $value) {
                define($key, $value);
            }
        }
        define('DOC_ROOT', realpath(dirname(__FILE__) ));
        //-------------------GET THE APPGRID GATEWAYS
        $sm       = $e->getApplication()->getServiceManager();
        if(isset($_COOKIE['gateways'])){
              $gatewaysSTR= $sm->get('externalApi')
                    ->decryptAndGetCookie('gateways');
             $gateways = json_decode($gatewaysSTR,true);
        }else{
            $gateways = $sm->get('appconfig')->getGateways();
            if(!empty($gateways)){
             $sm->get('externalApi')->encryptAndSetCookie('gateways',
                    json_encode($gateways), time() + 3600);
            }
        }
        if(!empty($gateways)) {
            foreach($gateways as $key => $value) {
                $gatewayKeyInUppercase = strtoupper($key);
                define($gatewayKeyInUppercase, $value);
            }
        }
        /**
         * Log any Uncaught Exceptions, including all Exceptions in the stack
         */
        ini_set("error_log", './data/log/'.date('Y-m-d').'-error.log');
        return;
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }
    
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                    'Directv' => __DIR__. '/src/Directv',
                    'Hott'    => __DIR__. '/src/Hott' 
                ),
                'fallback_autoloader' => true,
            ),
        );
    }
}
