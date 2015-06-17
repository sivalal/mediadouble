<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class XDRController extends AbstractActionController
{
    public function getListAction(){
        $result          = array();
        $ondemandObj     = $this->getServiceLocator()->get('ondemand');
        $searchObj       = $this->getServiceLocator()->get('search');
        $externalApiObj  = $this->getServiceLocator()->get('externalApi');
        $accountToken    = $externalApiObj->decryptAndGetCookie('newToken');
        $data            = $ondemandObj->getXDRlist($accountToken);
        $response        = $this->getResponseWithHeader();
        if($data['responseStatus'] == 200) {  
            if(!empty($data['responseContent']) && isset($data['responseContent']['items']) && !empty($data['responseContent']['items']))
            {
                $contentItems = $data['responseContent']['items'];
                usort($contentItems, function($a, $b) {
                    return $a['timestamp'] < $b['timestamp'];
                });
                foreach ($contentItems as $key => $value) {
                    $miniDataResult    = $ondemandObj->getDataFromEmbeddedCode('"'.$value['embed_code'].'"','','');
                    $parseSearchResult = $searchObj->GenericSearchParser_SingleResult_New($miniDataResult, array());
                    if(!empty($parseSearchResult)) {
                        $result[$key]                     = $parseSearchResult;
                        $result[$key]['playhead_seconds'] = $value['playhead_seconds'];
                        $result[$key]['timestamp']        = $value['timestamp'];
                        $result[$key]['expired']          = $ondemandObj->checkGivenTimestampIsExpired($value['timestamp']);
                    }
                }
                usort($result, function($a, $b) {
                    return $a["timestamp"] < $b["timestamp"];
                });
            }
        } else {
            $response->setStatusCode($data['responseStatus'])->setContent(json_encode($data['responseContent']));
            return $response;
        }
        $response->setStatusCode($data['responseStatus'])->setContent(json_encode($result));
        return $response;
    }

    public function deleteListAction()
    {
        $data           = array();
        $embedCode      = $this->params()->fromQuery('embed_code');
        $externalApiObj = $this->getServiceLocator()->get('externalApi');
        $accountToken   = $externalApiObj->decryptAndGetCookie('newToken');
        $type           = $this->params()->fromQuery('type');
        $ondemandObj    = $this->getServiceLocator()->get('ondemand');
        $response       = $this->getResponseWithHeader();
        if($type=="item")
        {
            $data = $ondemandObj->deleteItemFromXDR($accountToken, $embedCode);

        } else {
            $data = $ondemandObj->deleteAllItemsFromXDR($accountToken);
        }
        $response->setStatusCode($data['responseStatus'])->setContent(json_encode($data['responseContent']));
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
