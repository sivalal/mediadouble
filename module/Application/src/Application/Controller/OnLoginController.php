<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Http\Client;

class OnLoginController extends AbstractActionController
{
  protected $_config;
  protected $_ondemandObj;

  public function tokenGenerationAction() {
    $config         = $this->getServiceLocator()->get('Config');
    $externalApiObj = $this->getServiceLocator()->get('externalApi');
    $userObject     = $this->fromJson();
    $pcode          = $config['general_routes']['pcode'];
    $url            = OAL."/authentication/v1/providers/".$pcode."/gigya";
    $result         = array();
    $postData       = array(
      "uid"                => $userObject['UID'],
      "UIDSignature"       => $userObject['UIDSignature'],
      "signatureTimestamp" => $userObject['signatureTimestamp']
    );
    $responseData   = $externalApiObj->callHttpUtilityService($url, $postData, 'POST');
    if($responseData['responseStatus'] == 200) {
      if(!empty($responseData['responseContent'])) { 
        $oldToken     = isset($_COOKIE['newToken'] ) ? $_COOKIE['newToken'] : '';
        $accountToken = $responseData['responseContent']['account_token'];
        $externalApiObj->encryptAndSetCookie('newToken', $accountToken, (time() + (60 * 4)));
        $newToken     = isset($_COOKIE['newToken'] ) ? $_COOKIE['newToken'] : '';
        $result = array(
          "responseStatus"  => $responseData['responseStatus'],
          "responseContent" => array(
            "success" => true,
            "currentAccountToken" => $accountToken,
            "oldcookieValue" => $oldToken,
            "newcookieValue" => $newToken
          )
        );
        
      } 
    } else {
      $result = $responseData;
    } 
    $response  = $this->getResponseWithHeader();
    $response->setStatusCode(200)->setContent(json_encode($result));
    return $response;
  }

  
 
  public function getResponseWithHeader() {
      $response = $this->getResponse();
      $response->getHeaders()
               ->addHeaderLine('Access-Control-Allow-Origin','*')
               ->addHeaderLine('Access-Control-Allow-Methods','POST GET')
               ->addHeaderLine('Content-type', 'application/json');
      return $response;
  }

  public function fromJson() {
      $body = $this->getRequest()->getContent();
      if (!empty($body)) {
          $json = json_decode($body, true);
          if (!empty($json)) {
              return $json;
          }
      }

      return false;
  }
}
