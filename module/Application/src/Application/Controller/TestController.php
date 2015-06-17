<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TestController
 *
 * @author AsishAP
 */
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class TestController extends AbstractActionController{
   
    
/**********Different Types of Long Metadata call examples*****************/    
   
    /**
     * 
     * 
     * /search/v1/full/providers/75212/docs/kzZGE4bjrdj-Z4qB8pykDyK58QEiDRpe
     * 
     */
    public function indexAction(){
        $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser   = $this->getServiceLocator()->get('longSearchParser');
        $response           = $this->getResponseWithHeader();
        //$titleId='kzZGE4bjrdj-Z4qB8pykDyK58QEiDRpe';
        $titleId = 'RzZmxnbjqEodOvBhxpnbqocCtj0Svqp0';
        $longMetadataResp = $externalApiAdapter->constructUrlForLongSearchAndCallApiService($titleId);
        if($longMetadataResp['responseStatus']!=200){
            $response->setContent(json_encode($longMetadataResp));      
            return $response;
        }
        $longParserResp=$longSearchParser->LongCallDataArr($longMetadataResp['responseContent']);
        $singleAssetMetadata=  $longSearchParser->getSingleAssetMetadata($longMetadataResp['responseContent']);
        $response->setContent(json_encode($singleAssetMetadata));      
        return $response;
    }
    
    /**
     * eg: Long Metadata
     * /search/v1/full/providers/75212/docs/last_added?show_type=Movie
     * 
     */
    
    public function recentlyaddedAction(){
        $ExternalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $lastPart='last_added';
        $longMetadataResp=$ExternalApiAdapter->constructUrlForLongSearchAndCallApiService($lastPart,array('show_type'=>'Movie'));
        $response  = $this->getResponseWithHeader();
        $response->setContent(json_encode($longMetadataResp));      
        return $response;
    }
    /*
     * eg: with long metadata call
     * /search/v1/full/providers/75212/docs?ids=BsbjRhbjrfmdMjMQX_dnM6HGFdjH22mA
     */
     public function listofLongCallAssetsAction() {       
        $ExternalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser = $this->getServiceLocator()->get('longSearchParser');
        $listids=array('BsbjRhbjrfmdMjMQX_dnM6HGFdjH22mA','5qb2Zhbjq5wUIY4P0-ld_sn5QSmIWg-H','91bTFkbjrdB9h9pwdLcsIq-wg5m9Du-a','szYnM1bzqfnHvO0_N37ZkYfEHq7dd-bG','xhZjNnbjp-QK6643E2kUfydhwc0NJTZE');
        $longMetadataResp=$ExternalApiAdapter->constructUrlForLongSearchAndCallApiService('',array('ids'=>  implode(',', $listids)),'');
        $singleAssetMetadata=  $longSearchParser->getSingleAssetMetadata($longMetadataResp['responseContent']);
        $response  = $this->getResponseWithHeader();
        $response->setContent(json_encode($singleAssetMetadata));      
        return $response;
    }
    
    
/***********************************************************************/
    
/*************Short Mini call***********************/
    
    /**
     * 
     * eg:
     * /search/v1/full/providers/75212/mini?q={"id":"ZmaWRnbzrI3muZQiTSzpu72ssO0lphzs"}
     */
    public function minicallAction(){
        $ExternalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $queryParams=array('id'=>'kzZGE4bjrdj-Z4qB8pykDyK58QEiDRpe');
        //$queryParams='';
        $longMetadataResp=$ExternalApiAdapter->constructUrlForShortSearchAndCallApiService($queryParams);
        $response  = $this->getResponseWithHeader();
        $response->setContent(json_encode($longMetadataResp));      
        return $response;
    }
    
    public function getAssetByEmbedCodeAction(){
        $ExternalApiAdapter = $this->getServiceLocator()->get('externalApi');
        $longSearchParser = $this->getServiceLocator()->get('longSearchParser');
        $shortSearchParser = $this->getServiceLocator()->get('shortSearchParser');
        $response  = $this->getResponseWithHeader();
        $queryParams=array('embed_code'=>'k5ZGE4bjpdeR9siN6Ky56SwYKNGNsmcW');
        $shortMetadataResp=$ExternalApiAdapter->shortMiniMetadataCall($queryParams);
        $titleId=$shortSearchParser->getTitleIdByEmbedCode($shortMetadataResp['responseContent']);
        if($titleId ==null){
            $error=array('errors'=>array(array('error_message'=>'Title Id not found.','error_code'=>'HOTT_NFT')));
            return array('responseStatus'=>'HOTT_NFT','responseContent'=>$error);
        }
        $longMetadataResp=$ExternalApiAdapter->longMetadataCall($titleId);
        $singleAssetMetadata=  $longSearchParser->getSingleAssetMetadata($longMetadataResp['responseContent']);
        $response->setContent(json_encode($singleAssetMetadata));      
        return $response;
    }

    

    public function getResponseWithHeader()
    {
        $response = $this->getResponse();
        $response->getHeaders()
                 ->addHeaderLine('Access-Control-Allow-Origin','*')
                 ->addHeaderLine('Access-Control-Allow-Methods','POST GET')
                 ->addHeaderLine('Content-type', 'application/json');
        return $response;
    }
}
