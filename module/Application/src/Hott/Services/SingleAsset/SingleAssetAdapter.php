<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SingleAssetAdapter
 *
 * @author AsishAP
 */
namespace Hott\Services\SingleAsset;
class SingleAssetAdapter{
    protected $config=null;
    protected $longSearchParser=null;
  
	public function __construct($config, $longSearchParser) {
		$this->config          = $config;
                $this->longSearchParser = $longSearchParser;
	}
        
        public function getSingleAssetMetadata() {
            echo "test";
        }
         
}
