<?php

namespace Directv\ErrorHandling;

use Zend\Stdlib\Exception;

class ErrorHandling  
{
    private static $instance = null;
    
    private function __construct()
    {

    }

    public static function getInstance() {
        if(!isset(self::$instance)) {
            self::$instance = new ErrorHandling();
        }
        return self::$instance;
    }

    public function error($param, $opts=NULL){
        if($param['errorMessage'] == 'Connection Error'){
            $this->connectionError($param);
        }else if($param['errorMessage'] == 'Service Not Available'){
            $this->serviceNotAvailable($param);
        }else if($param['errorMessage'] == 'Service Error'){
            $this->serviceError($param);
        }else if($param['errorMessage'] == 'Service Maintenance'){
            $this->serverMaintenance($param);
        }
    }

    private function connectionError($param){
        echo '<script type="text/javascript">$("#errorAlertFrame").css("visibility", "visible");</script>';
    }

    private function serviceNotAvailable($param){
        header("Location: ".'maintenance.html');
        exit();
    }

    private function serviceError($param){
        header("Location: ".'maintenance.html');
        exit();
    }
    
    private function serverMaintenance($param){
        $text = '';
        if(isset($param['text'])){
            $text = '?msg='.$param['text'];
        }
        header("Location: ".'maintenance.html'.$text);
        exit();
    }    
}