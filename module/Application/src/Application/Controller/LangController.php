<?php
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class LangController extends AbstractActionController
{

  public function indexAction() {
  }

  public function enUSAction() {

    $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
    $data      = $this->appviewAdapterObj->parsedMessages();
    $response  = $this->getResponseWithHeader();
    $response->setContent(json_encode($data));
    return $response;
  }
  public function esESAction() {
    $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
    $data      = $this->appviewAdapterObj->parsedMessages('es');
    $response  = $this->getResponseWithHeader();
    $response->setContent(json_encode($data));
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
