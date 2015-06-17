<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use \Exception;
use Zend\Http\Client;
use Zend\Http\Request;
use Zend\Http\Client\Adapter\Curl;


class VindiciaController extends AbstractActionController
{
  public function createAccountAction() {
    $config          = $this->getServiceLocator()->get('Config');
    $externalApiObj  = $this->getServiceLocator()->get('externalApi');
    $data   = $this->fromJson();
    $dataJson = array(
        "account" => array(
            "email" => isset($data["email"]) ? $data["email"] : '',
            "name" => isset($data["name"]) ?  $data["name"] : '',
            "billing_address" => array(
                "name" =>       isset($data["name"]) ?  $data["name"] : '',
                "addr1" =>      isset($data["billingAddress"]["addr1"]) ?  $data["billingAddress"]["addr1"] : '',
                "addr2" =>      isset($data["billingAddress"]["addr2"]) ?  $data["billingAddress"]["addr2"] : '',
                "city" =>       isset($data["billingAddress"]["city"]) ?  $data["billingAddress"]["city"] : '',
                "district" =>   isset($data["billingAddress"]["district"]) ?  $data["billingAddress"]["district"] : '',
                "postal_code" =>  isset($data["billingAddress"]["postal_code_string"]) ? intval($data["billingAddress"]["postal_code_string"]) : '',
                "postal_code_string" => isset($data["billingAddress"]["postal_code_string"]) ? strval($data["billingAddress"]["postal_code_string"]) : '',
                "country" =>    isset($data["billingAddress"]["country"]) ? $data["billingAddress"]["country"] : ''
            ),
            "shipping_address" => array(
                "name" =>       isset($data["name"]) ?  $data["name"] : '',
                "addr1" =>      isset($data["billingAddress"]["addr1"]) ?  $data["billingAddress"]["addr1"] : '',
                "addr2" =>      isset($data["billingAddress"]["addr2"]) ?  $data["billingAddress"]["addr2"] : '',
                "city" =>       isset($data["billingAddress"]["city"]) ?  $data["billingAddress"]["city"] : '',
                "district" =>   isset($data["billingAddress"]["district"]) ?  $data["billingAddress"]["district"] : '',
                "postal_code" =>  isset($data["billingAddress"]["postal_code_string"]) ? intval($data["billingAddress"]["postal_code_string"]) : '',
                "postal_code_string" => isset($data["billingAddress"]["postal_code_string"]) ? strval($data["billingAddress"]["postal_code_string"]) : '',
                "country" =>    isset($data["billingAddress"]["country"]) ? $data["billingAddress"]["country"] : ''
            )
        )
    );
    $rawJsonData = json_encode($dataJson);
    $url = OAL . "/commerce/accounts/new";
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    //$accountToken = $data["accountToken"];
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function createPaymentMethodAction() {
    $config          = $this->getServiceLocator()->get('Config');
    $externalApiObj  = $this->getServiceLocator()->get('externalApi');
    $data            = $this->fromJson();
    $params = array(
        "payment_method" => isset($data["paymentMethodType"]) ? $data["paymentMethodType"] : ''
    );
    $dataJson = array(
        "payment_method" => array(
            "type" =>  isset($data["paymentMethodType"]) ? $data["paymentMethodType"] : '',
            "account_holder_name" =>  isset($data["name"]) ? $data["name"] : ''
        ),
        "billing_address" => array(
              "name" =>       isset($data["name"]) ?  $data["name"] : '',
              "addr1" =>      isset($data["billingAddress"]["addr1"]) ?  $data["billingAddress"]["addr1"] : '',
              "addr2" =>      isset($data["billingAddress"]["addr2"]) ?  $data["billingAddress"]["addr2"] : '',
              "city" =>       isset($data["billingAddress"]["city"]) ?  $data["billingAddress"]["city"] : '',
              "district" =>   isset($data["billingAddress"]["district"]) ?  $data["billingAddress"]["district"] : '',
              "postal_code" =>  isset($data["billingAddress"]["postal_code_string"]) ? intval($data["billingAddress"]["postal_code_string"]) : '',
              "postal_code_string" => isset($data["billingAddress"]["postal_code_string"]) ? strval($data["billingAddress"]["postal_code_string"]) : '',
              "country" =>    isset($data["billingAddress"]["country"]) ? $data["billingAddress"]["country"] : ''
          ),
        "callback_urls" => array(
            "success" => CLIENT_BASE_URL.'/'.$data["successUrl"].'?' . http_build_query($params),
            "failure" => CLIENT_BASE_URL.'/'.$data["failureUrl"].'?' . http_build_query($params),
        )
    );
    $rawJsonData = json_encode($dataJson);
    $url = OAL . "/commerce/accounts/payment-methods";
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    //$accountToken = $data["accountToken"];
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function confirmPaymentMethodAction() {
    $config          = $this->getServiceLocator()->get('Config');
    $externalApiObj  = $this->getServiceLocator()->get('externalApi');
    $authId          = $this->params()->fromQuery('authId');
    $paymentMethod   = $this->params()->fromQuery('paymentMethod');
    $dataJson = array(
      "payment_method" => array(
          "type" => $paymentMethod
      )
    );
    $rawJsonData = json_encode($dataJson);
    $url = OAL . "/commerce/accounts/payment-methods/" . $authId;
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    //$accountToken = $this->params()->fromQuery('accountToken');
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function createSubscriptionAction() {
    $config          = $this->getServiceLocator()->get('Config');
    $externalApiObj  = $this->getServiceLocator()->get('externalApi');
    $data            = $this->fromJson();
    $items           = array();
    if(isset($data["products"]) && !empty($data["products"])) {
      $data["products"] = json_decode($data["products"], true);
      foreach ($data["products"] as $k => $p) {
        $product_id = $p["id"];
        if($p["type"] == "package" && $data["hasUsedFreeTrial"]) {
          $p["is_free_trial_enabled"] = false;
          // If free trial is not available for this user, use "id_returning_customer" instead if set.
          if (isset($p["id_returning_customer"]) && $p["id_returning_customer"] != "null") {
            $product_id = $p["id_returning_customer"];
          }
        }
        $items[] = array(
            "product" => array(
                "id" => $product_id
            ),
            "promo_code"=> $p["is_free_trial_enabled"] ? $p["promo_code_id"] : "",
        );
      }
    }

    $dataJson = array(
        "dryrun" => false,
        "target_account_id" => "", // Max: what value is expected here???
        "ignore_credits" => false, // Max: What does this do???
        "subscription" => array(
            "payment_method" => array(
                "id" => $data["paymentMethod"]
            ),
            "items" => $items
        )

    );
    $rawJsonData = json_encode($dataJson);
    $url = OAL . "/commerce/subscriptions";
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    //$accountToken = $data["accountToken"];
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function assignPaymentMethodToSubscriptionAction() {

    $config          = $this->getServiceLocator()->get('Config');
    $externalApiObj  = $this->getServiceLocator()->get('externalApi');
    $paymentMethodID = $this->params()->fromQuery('payment_method_id');
    $subscriptionID  = $this->params()->fromQuery('subscription_id');
    $data = array(
        "payment_method" => array(
            "id" => $paymentMethodID
        )
    );
    $rawJsonData = json_encode($data);
    $url = OAL . "/commerce/subscriptions/" . $subscriptionID . "/payment-method";
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    //$accountToken = $this->params()->fromQuery('accountToken');
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'PUT', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function initializeTransactionAction() {
    $config          = $this->getServiceLocator()->get('Config');
    $externalApiObj  = $this->getServiceLocator()->get('externalApi');
    $transData       = $this->fromJson();
    $initializeTrans = $config['general_routes']['vindicia']['initialize_request'];
    $url             = OAL.$initializeTrans;
    //transaction josn body
    $rawJsonData = json_encode(array(
      'transaction' => array(
          "type"                 => "subscribe",
          "user_id"              => isset($transData['userId']) ? $transData['userId'] : '',
          "payment_method_type"  => isset($transData['paymentMethodType']) ? $transData['paymentMethodType'] : '',
          "new_product_id"       => isset($transData['packages']) ? $transData['packages'] : '',
          "old_product_id"       => "",
          "promo_code"           => isset($transData['promoCode']) ? $transData['promoCode'] : '',
          "callback_urls"=> array(
              "return_url"=> CLIENT_BASE_URL.'/',
              "error_url" => CLIENT_BASE_URL.'/signupError'
          )
      )
    ));
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    //log user details---------------------------------------------------
    $userAgent     = $_SERVER['HTTP_USER_AGENT'];
    $logger        = $this->getServiceLocator()->get('Zend\Log\Logger');
    $userdata      =  "\r\nUser Information:- \r\nuserid: ".(isset($transData['userId']) ? $transData['userId'] : '').
                      "\r\nemail: ".(isset($transData['emailId']) ? $transData['emailId'] : '').
                      "\r\nusername: ".(isset($transData['username']) ? $transData['username'] : '').
                      "\r\nuser_agent: ".$userAgent.
                      "\r\nbrowser: ".(isset($transData['browser']) ? $transData['browser'] : '')."\r\n";
    $logger->log(\Zend\Log\Logger::INFO, $userdata);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function reviewTransactionAction() {
    $config         = $this->getServiceLocator()->get('Config');
    $externalApiObj = $this->getServiceLocator()->get('externalApi');
    $transData      = $this->fromJson();
    $reviewTrans    = $config['general_routes']['vindicia']['review_request'];
    $url            = OAL.$reviewTrans;
    //transaction json body
    $rawJsonData = json_encode(array(
      'transaction' => array(
        "session"=> array(
          "id" => $transData['sessionId']
        ),
        "type" => isset($transData['type']) ? $transData['type'] : ''
      )
    ));
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function confirmTransactionAction() {
    $config         = $this->getServiceLocator()->get('Config');
    $externalApiObj = $this->getServiceLocator()->get('externalApi');
    $confirmTrans   = $config['general_routes']['vindicia']['confirm_request'];
    $transData      = $this->fromJson();
    $rawJsonData    = '';
    $url            = OAL.$confirmTrans;
    //transaction json body
    $rawBody           = $this->fromJson($transData);
    if(isset($rawBody['reviewResponse'])) {
      if(isset($rawBody['reviewResponse']['transaction']['session']['id']))  {
        $rawBody['reviewResponse']['transaction']['session']['id'] = isset($rawBody['sessionId']) ? $rawBody['sessionId'] : '';
      }
      $rawJsonData = json_encode($rawBody['reviewResponse']);
    }
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function cancelTransactionAction() {
    $config          = $this->getServiceLocator()->get('Config');
    $externalApiObj  = $this->getServiceLocator()->get('externalApi');
    $transData       = $this->fromJson();
    $initializeTrans = $config['general_routes']['vindicia']['initialize_request'];
    $url             = OAL.$initializeTrans;
    //transaction josn body
    $rawJsonData = json_encode(array(
      'transaction' => array(
         "target_account_id" => "",
         "type"              => "cancel",
         "new_product_id"    => isset($transData['packages']) ? $transData['packages'] : '',
         "old_product_id"    => "",
         "promo_code"        => "",
         "callback_urls"     => array(
              "return_url" => CLIENT_BASE_URL.'/',
              "error_url"  => CLIENT_BASE_URL.'/updateError'
          ),
         "pricing"              => null,
         "session"              => null,
         "subscription_id"      => isset($transData['subscriptionId']) ? $transData['subscriptionId'] : '',
         "payment_method_type"  => "",
         "payment_method_id"    => ""

      )
    ));

    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function cancelConfirmTransactionAction() {
    $config             = $this->getServiceLocator()->get('Config');
    $externalApiObj     = $this->getServiceLocator()->get('externalApi');
    $confirmTrans       = $config['general_routes']['vindicia']['confirm_request'];
    $transData          = $this->fromJson();
    $rawJsonData        = '';
    $url                = OAL.$confirmTrans;
    //transaction json body
    $rawBody           = $this->fromJson($transData);
    if(isset($rawBody['initResponse'])) {
      $rawJsonData = json_encode($rawBody['initResponse']);
    }
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function updateSubscriptionPaymentAction() {
    $config             = $this->getServiceLocator()->get('Config');
    $externalApiObj     = $this->getServiceLocator()->get('externalApi');
    $transData          = $this->fromJson();
    $initializeTrans    = $config['general_routes']['vindicia']['initialize_request'];
    $url                = OAL.$initializeTrans;
    //transaction josn body
    $rawJsonData = json_encode(array(
      'transaction' => array(
          "type"                 => "updateSubscriptionPayment",
          "userId"               => isset($transData['userId']) ? $transData['userId'] : '',
          "subscription_id"      => isset($transData['subscriptionId']) ? $transData['subscriptionId'] : '',
          "payment_method_type"  => isset($transData['paymentMethodType']) ? $transData['paymentMethodType'] : '',
          "new_product_id"       => isset($transData['packages']) ? $transData['packages'] : '',
          "old_product_id"       => "",
          "callback_urls"=> array(
              "return_url"=> CLIENT_BASE_URL.'/',
              "error_url" => CLIENT_BASE_URL.'/updateError'
          )
      )
    ));
    $opts         = array("headers" => array("Content-Type" => "application/json"));
    $accountToken = $externalApiObj->decryptAndGetCookie('newToken');
    $params       = array("account_token" => $accountToken);
    $responseData = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    //log user details---------------------------------------------------
    $userAgent     = $_SERVER['HTTP_USER_AGENT'];
    $logger        = $this->getServiceLocator()->get('Zend\Log\Logger');
    $userdata      =  "\r\nUser Information:- \r\nuserid: ".(isset($transData['userId']) ? $transData['userId'] : '').
                      "\r\nemail: ".(isset($transData['emailId']) ? $transData['emailId'] : '').
                      "\r\nusername: ".(isset($transData['username']) ? $transData['username'] : '').
                      "\r\nuser_agent: ".$userAgent.
                      "\r\nbrowser: ".(isset($transData['browser']) ? $transData['browser'] : '')."\r\n";
    $logger->log(\Zend\Log\Logger::INFO, $userdata);
    $response     = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function getUserPackageDetailsAction() {
    $config               = $this->getServiceLocator()->get('Config');
    $ondemandObj          = $this->getServiceLocator()->get('ondemand');
    $externalApiObj       = $this->getServiceLocator()->get('externalApi');
    $transData            = $this->fromJson();
    //get all user related products
    $accountProductRoute  = $config['general_routes']['vindicia']['account_product_request'];
    $url                  = OAL.$accountProductRoute;
    $opts                 = array("headers" => array("Content-Type" => "application/json"));
    $accountToken         = $externalApiObj->decryptAndGetCookie('newToken');
    $params               = array("account_token" => $accountToken);
    $responseData         = $externalApiObj->callHttpUtilityService($url, $params, 'GET', $opts);
    if($responseData['responseStatus'] == 200) {
      if(!empty($responseData['responseContent']['subscriptions'])) {
        foreach ($responseData['responseContent']['subscriptions'] as $key => $subscriptions) {
          $expirationTimestamp = $ondemandObj->convertDateTime6WithAtomFormat($subscriptions['expiration_timestamp']);
          $responseData['responseContent']['subscriptions'][$key]['expiration_timestamp']             =  $expirationTimestamp;
          $responseData['responseContent']['subscriptions'][$key]['display_popup']                    =  (strtotime($expirationTimestamp) < strtotime('+30 days')) ? true : false;
          $responseData['responseContent']['subscriptions'][$key]['is_expirydate_cross_currentdate']  =  $ondemandObj->compareDate($expirationTimestamp);
        }
      }
    }
    $response             = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function getUserPackageByStatusAction() {
    $config               = $this->getServiceLocator()->get('Config');
    $ondemandObj          = $this->getServiceLocator()->get('ondemand');
    $externalApiObj       = $this->getServiceLocator()->get('externalApi');
    //get all user related products
    $accountProductRoute  = $config['general_routes']['vindicia']['account_product_request'];
    $url                  = OAL.$accountProductRoute;
    $opts                 = array("headers" => array("Content-Type" => "application/json"));
    $accountToken         = $externalApiObj->decryptAndGetCookie('newToken');
    $params               = array("account_token" => $accountToken);
    $responseData         = $externalApiObj->callHttpUtilityService($url, $params, 'GET', $opts);
    $data                 = array();
    if($responseData['responseStatus'] == 200) {
      if(!empty($responseData['responseContent']['subscriptions'])) {
        $subscriptionContent = $responseData['responseContent']['subscriptions'];
        $subscriptionCount   = count($subscriptionContent);
        $found = false;
        if($subscriptionCount > 1) {
          $subscriptionValue = $ondemandObj->searchMultidimensionalArray($subscriptionContent, "status", "Active");
          if(empty($subscriptionValue)) {
            $subscriptionValue = $ondemandObj->searchMultidimensionalArray($subscriptionContent, "status", "Cancelled");
            if(empty($subscriptionValue)) {
              $subscriptionValue = $ondemandObj->searchMultidimensionalArray($subscriptionContent, "status", "Suspended");
            }
          }
          $data = $subscriptionValue[0];
        } else {
          $data = $subscriptionContent[0];
        }
        if(!empty($data)) {
          $responseData['responseContent']['subscriptions']                         =  $data;
          $responseData['responseContent']['subscriptions']['expiration_timestamp'] =  $ondemandObj->convertDateTime6WithAtomFormat($data['expiration_timestamp']);
        }
      }
    }
    $response             = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }


  public function getUserPackageByPurcahseAction() {
    $config               = $this->getServiceLocator()->get('Config');
    $ondemandObj          = $this->getServiceLocator()->get('ondemand');
    $externalApiObj       = $this->getServiceLocator()->get('externalApi');
    //get all user related products
    $accountProductRoute  = $config['general_routes']['vindicia']['account_product_purchase'];
    $url                  = OAL.$accountProductRoute;
    $opts                 = array("headers" => array("Content-Type" => "application/json"));
    $accountToken         = $externalApiObj->decryptAndGetCookie('newToken');
    //$accountToken         =  $this->params()->fromQuery('accountToken');
    $params               = array("account_token" => $accountToken);
    $responseData         = $externalApiObj->callHttpUtilityService($url, $params, 'GET', $opts);

    $subscriptionItems = array();
    $entitlements = array();
    $paymentMethods = array();
    $productResp = array();
    $productList = array();
    $productObj = array();
    if($responseData['responseStatus'] == 200) {
      if(!empty($responseData['responseContent']['subscriptions'])) {
        $subscriptions = $subscriptionContent = $responseData['responseContent']['subscriptions'];
        foreach ($subscriptions as $subscriptionContent) {
          $basicPackExpDate = $ondemandObj->convertDateTime6WithAtomFormat($subscriptionContent['end_timestamp']);
          $subscriptionStatus = $subscriptionContent['status'];
          if($subscriptionStatus=="Active"){
            $nextBillingDate = $subscriptionContent['next_billing']['timestamp'];
            $totalPrice = $subscriptionContent['next_billing']['amount'].$subscriptionContent['next_billing']['currency'];
          }
          $paymentMethods=$subscriptionContent['payment_method'];
          $subscription_id=$subscriptionContent['id'];
          $items = (isset($subscriptionContent['items']))? $subscriptionContent['items']:[];
          foreach ($items as $key =>$item){
              $dat=  isset($item['expiration_date'])?$item['expiration_date']:'';
              $exp=$ondemandObj->convertDateTime8WithAtomFormat($dat);
              $item['expiration_time']=$exp;
              $items[$key]=$item;
          }

          $subscriptionItems  = array_merge($subscriptionItems, $items);
          $entitlements       = array_merge($entitlements, $ondemandObj->getUserEntitlements($items));
          $productResp        = array_merge($productResp, $ondemandObj->getUserProducts($items));
          $productList        = array_merge($productList, $productResp['productlist']);
          $productObj         = array_merge($productObj, $productResp['productObj']);
        }

        $productListForCookie = '"'.implode('","',array_unique($productList)).'"';
        $tiersqueryoptions = '"tiers":["'.implode('","',$entitlements).'"]';
        $externalApiObj->encryptAndSetCookie('product_list', $productListForCookie);
        $externalApiObj->encryptAndSetCookie('entitlement_list', $tiersqueryoptions);
        $externalApiObj->encryptAndSetCookie('subscription_id', $subscription_id);


        $responseData['responseContent']['subscriptions']= $subscriptionItems;
        $responseData['responseContent']['entitlements']= $entitlements;
        $responseData['responseContent']['productList']= $productList;
        $responseData['responseContent']['paymentMethods']= $paymentMethods;
        $responseData['responseContent']['cookieEntitlements']= $tiersqueryoptions;
        $responseData['responseContent']['cookieProductList']= $productListForCookie;
        $responseData['responseContent']['productObj']= $productObj;
        $responseData['responseContent']['subscription_id']=$subscription_id;
        $responseData['responseContent']['basicPackExpiryDate']=$basicPackExpDate;
        $responseData['responseContent']['subscriptionStatus']=$subscriptionStatus;
        if($subscriptionStatus=="Active"){
          $responseData['responseContent']['nextBillingDate']=$nextBillingDate;
          $responseData['responseContent']['totalPrice']=$totalPrice;
        }
      }
    }
    $response             = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function getPurchasesAction() {
    $config               = $this->getServiceLocator()->get('Config');
    $ondemandObj          = $this->getServiceLocator()->get('ondemand');
    $externalApiObj       = $this->getServiceLocator()->get('externalApi');
    //get all user related products
    $accountProductRoute  = $config['general_routes']['vindicia']['account_product_purchase'];
    $url                  = OAL.$accountProductRoute;
    $opts                 = array("headers" => array("Content-Type" => "application/json"));
    $accountToken         = $externalApiObj->decryptAndGetCookie('newToken');
    //$accountToken         =  $this->params()->fromQuery('accountToken');
    $params               = array("account_token" => $accountToken);
    $responseData         = $externalApiObj->callHttpUtilityService($url, $params, 'GET', $opts);
    $response             = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }


  public function billingHistoryAction() {
    $fromDate             = $this->params()->fromQuery('from_date');
    $toDate               = $this->params()->fromQuery('to_date');
    $config               = $this->getServiceLocator()->get('Config');
    $externalApiObj       = $this->getServiceLocator()->get('externalApi');
    $billingHistoryRoute  = $config['general_routes']['vindicia']['billing_history'];
    $accountToken         = $externalApiObj->decryptAndGetCookie('newToken');
    $params               = array("account_token" => $accountToken, "start_date" => $fromDate, "end_date"  => $toDate);
    $url                  = OAL.$billingHistoryRoute;
    $billingHistoryList   = $externalApiObj->callHttpUtilityService($url, $params);
    $response             = $this->getResponseWithHeader();
    $response->setContent(json_encode($billingHistoryList));
    return $response;
  }

  public function transactionHistoryAction() {
    $data                 = array();
    $fromDate             = $this->params()->fromQuery('from_date');
    $toDate               = $this->params()->fromQuery('to_date');
    $config               = $this->getServiceLocator()->get('Config');
    $ondemandObj          = $this->getServiceLocator()->get('ondemand');
    $externalApiObj       = $this->getServiceLocator()->get('externalApi');
    $billingHistoryRoute  = $config['general_routes']['vindicia']['transaction_history'];
    $accountToken         = $externalApiObj->decryptAndGetCookie('newToken');
    $parameters           = array("account_token" => $accountToken, "start_date" => $fromDate, "end_date"  => $toDate);
    $url                  = OAL.$billingHistoryRoute;
    $transactionHistory   = $externalApiObj->callHttpUtilityService($url, $parameters);
    if($transactionHistory['responseStatus'] == 200) {
      $transactions = $transactionHistory['responseContent']['transactions'];
      if(!empty($transactionHistory['responseContent']['transactions'])) {
        foreach ($transactionHistory['responseContent']['transactions'] as $key => $transactions) {
          $transactionHistory['responseContent']['transactions'][$key]['timestamp'] =  $ondemandObj->convertDateTime3WithAtomFormat($transactions['timestamp']);
          if(isset($transactions['transaction_items'])) {
            foreach ($transactions['transaction_items'] as $transactionItemKey => $transactionItemValue) {
              $transactionHistory['responseContent']['transactions'][$key]['transaction_items'][$transactionItemKey]['service_period_start_date'] =  !empty($transactionItemValue['service_period_start_date']) ? $ondemandObj->convertDateTime3WithAtomFormat($transactionItemValue['service_period_start_date']) : '';
              $transactionHistory['responseContent']['transactions'][$key]['transaction_items'][$transactionItemKey]['service_period_end_date'] =  !empty($transactionItemValue['service_period_end_date']) ? $ondemandObj->convertDateTime3WithAtomFormat($transactionItemValue['service_period_end_date']) : '';
            }
          }
        }
      }
    }
    $response            = $this->getResponseWithHeader();
    $response->setStatusCode($transactionHistory['responseStatus'])->setContent(json_encode($transactionHistory));
    return $response;
  }

  public function getPaymentMethodAction() {
    $config               = $this->getServiceLocator()->get('Config');
    $externalApiObj       = $this->getServiceLocator()->get('externalApi');
    $paymentMethodRoute   = $config['general_routes']['vindicia']['payment_methods'];
    $accountToken         = $externalApiObj->decryptAndGetCookie('newToken');
    $params               = array("account_token" => $accountToken);
    $url                  = OAL.$paymentMethodRoute;
    $paymentMethodsList   = $externalApiObj->callHttpUtilityService($url, $params);
    $result               = array();
    if($paymentMethodsList['responseStatus'] == 200) {
      if(!empty($paymentMethodsList['responseContent']['paymentMethods'])) {
        $paymentMethodsList['responseContent']['paymentMethods'] = $paymentMethodsList['responseContent']['paymentMethods'][0];
      }
    }
    $response             = $this->getResponseWithHeader();
    $response->setContent(json_encode($paymentMethodsList));
    return $response;
  }

  public function updateAccountAction() {
    $config              = $this->getServiceLocator()->get('Config');
    $externalApiObj      = $this->getServiceLocator()->get('externalApi');
    $accountUpdateRoute  = $config['general_routes']['vindicia']['account_update'];
    $transData           = $this->fromJson();
    $url                 = OAL.$accountUpdateRoute;
    $rawJsonData         = $transData['paymentMethod'];
    $opts                = array("headers" => array("Content-Type" => "application/json"));
    $accountToken        = $externalApiObj->decryptAndGetCookie('newToken');
    //$accountToken        = $transData["accountToken"];
    $params              = array("account_token" => $accountToken);
    $responseData        = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $rawJsonData);
    $response            = $this->getResponseWithHeader();
    $response->setContent(json_encode($responseData));
    return $response;
  }

  public function isExpiredProduct($expirationTimestamp) {
    $expDate  = date("Y-m-d H:i", strtotime($expirationTimestamp));
    $today    = strtotime(date("Y-m-d H:i"));
      if(strtotime($expDate) > $today) {
          return false;
      } else {
          return true;
      }
    }

  public function validatePromocodeAction() {
      $promocode           = $this->params()->fromQuery('promocode');
      $config              = $this->getServiceLocator()->get('Config');
      $externalApiObj      = $this->getServiceLocator()->get('externalApi');
      $campaignsRoute      = $config['general_routes']['vindicia']['campaigns'];
      $url                 = OAL.$campaignsRoute."/".$promocode;
      $accountToken        = $externalApiObj->decryptAndGetCookie('newToken');
      $params              = array("account_token" => $accountToken);
      //$params              = array("account_token" => $this->params()->fromQuery('accountToken'));
      $campaignsResponse   = $externalApiObj->callHttpUtilityService($url, $params);
      $response            = $this->getResponseWithHeader();
      $response->setContent(json_encode($campaignsResponse));
      return $response;
  }

  public function getEntitlementListAction() {
    $result            = array("success" => false);
    $config            = $this->getServiceLocator()->get('Config');
    $externalApiObj    = $this->getServiceLocator()->get('externalApi');
    $entitlementRoute  = $config['general_routes']['vindicia']['entitlements'];
    $url               = OAL.$entitlementRoute;
    $accountToken      = $externalApiObj->decryptAndGetCookie('newToken');
    $params            = array("account_token" => $accountToken);
    $entitlementList   = $externalApiObj->callHttpUtilityService($url, $params);
    if($entitlementList['responseStatus'] == 200) {
      if(!empty($entitlementList['responseContent']['entitlements'])) {
        $tiers        = array();
        $productList  = array();
        $tiersqueryoptions = '';
        foreach($entitlementList['responseContent']['entitlements'] as $entitlement) {
          $tiers[]       = $entitlement['id'];
          $productList[] = $entitlement['product_id'];
        }
        if(!empty($tiers) && !empty($productList)) {
          $productList = '"'.implode('","',array_unique($productList)).'"';
          $tiersqueryoptions = '"tiers":["'.implode('","',$tiers).'"]';
          $externalApiObj->encryptAndSetCookie('product_list', $productList);
          $externalApiObj->encryptAndSetCookie('entitlement_list', $tiersqueryoptions);
          if(!empty($productList) && !empty($tiers)) {
            $result  = array("success" => true, "tiers" => $tiersqueryoptions, "product_list" => $productList);
          }
        }
      }
    }
    $response          = $this->getResponseWithHeader();
    $response->setContent(json_encode($result));
    return $response;
  }

    //Adds new packages to the user.
  public function addSubPackagesAction() {
    // $productList       = $this->params()->fromQuery('productList');
    // $uid               = $this->params()->fromQuery('uid');
    // $prodListDecoded   = json_decode($productList,true);
    // $data = array(
    //   "dryrun" => false,
    //   "target_account_id" => $uid,
    //   "ignore_credits" => true,
    //   "items" => $prodListDecoded
    // );
    // $data_json = json_encode($data);
    // $config            = $this->getServiceLocator()->get('Config');
    // $externalApiObj    = $this->getServiceLocator()->get('externalApi');
    // $processPackages   = $config['general_routes']['vindicia']['processPackages'];
    // $subscriptionId    = $externalApiObj->decryptAndGetCookie('subscription_id');
    // $procPackages      = str_replace("{{subId}}",$subscriptionId,$processPackages);
    // $url               = OAL.$procPackages;
    // $accountToken      = $externalApiObj->decryptAndGetCookie('newToken');
    // $params            = array("account_token" => $accountToken);
    // $opts              = array("headers" => array("Content-Type" => "application/json"));
    // $addedPackagesList = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $data_json);
    // $response          = $this->getResponseWithHeader();
    // $response->setContent(json_encode($addedPackagesList));
    // return $response;

    ////////////////////////////
    $successArray      = array();
    $errorArray        = array();
    $existingArray     = array();
    $productList       = $this->params()->fromQuery('productList');
    $uid               = $this->params()->fromQuery('uid');
    $prodListDecoded   = json_decode($productList,true);
    $config            = $this->getServiceLocator()->get('Config');
    $externalApiObj    = $this->getServiceLocator()->get('externalApi');
    $processPackages   = $config['general_routes']['vindicia']['processPackages'];
    $subscriptionId    = $externalApiObj->decryptAndGetCookie('subscription_id');
    $procPackages      = str_replace("{{subId}}",$subscriptionId,$processPackages);
    $url               = OAL.$procPackages;
    $accountToken      = $externalApiObj->decryptAndGetCookie('newToken');
    $params            = array("account_token" => $accountToken);
    $opts              = array("headers" => array("Content-Type" => "application/json"));
    for ($x = 0; $x < count($prodListDecoded); $x++) {
      $data = array(
        "dryrun" => false,
        "target_account_id" => $uid,
        "ignore_credits" => true,
        "items" => array($prodListDecoded[$x])
      );
      $data_json = json_encode($data);
      $addedPackagesList = $externalApiObj->callHttpUtilityService($url, $params, 'POST', $opts, $data_json);
      if($addedPackagesList['responseStatus'] == 200) {
        array_push($successArray,$prodListDecoded[$x]["product"]["id"]);
        //continue;
      }else if($addedPackagesList['responseStatus'] == 500){
        array_push($errorArray,$prodListDecoded[$x]["product"]["id"]);
        //break;
      }else if($addedPackagesList['responseStatus'] == 400){
        array_push($existingArray,$prodListDecoded[$x]["product"]["id"]);
        //continue;
      }
    }
    $resultArray = array(
      'addedArray'=>$successArray,
      'unAddedArray'=>$errorArray,
      'existingArray'=>$existingArray
    );
    $response          = $this->getResponseWithHeader();
    $response->setContent(json_encode($resultArray));
    return $response;
    ///////////////////////////////
  }

  //Removes a package/packages from the user.
  public function removeSubPackagesAction() {
    $successArray      = array();
    $errorArray        = array();
    $existingArray     = array();
    $products          = $this->params()->fromQuery('products');
    $products          = json_decode($products);
    $config            = $this->getServiceLocator()->get('Config');
    $externalApiObj    = $this->getServiceLocator()->get('externalApi');
    $accountToken      = $externalApiObj->decryptAndGetCookie('newToken');
    $params            = array("account_token" => $accountToken);
    $opts              = array("headers" => array("Content-Type" => "application/json"));
    $processPackages   = $config['general_routes']['vindicia']['packagesRemove'];
    $subscriptionId    = $externalApiObj->decryptAndGetCookie('subscription_id');
    $procPackages      = str_replace("{{subId}}",$subscriptionId,$processPackages);
    for ($x = 0; $x < count($products); $x++) {
      $procPackageId     = str_replace("{{productId}}",$products[$x],$procPackages);
      $url               = OAL.$procPackageId;
      $removedPackagesList = $externalApiObj->callHttpUtilityService($url, $params, 'DELETE', $opts);
      if($removedPackagesList['responseStatus'] == 200) {
        array_push($successArray,$products[$x]);
        //continue;
      }else if($removedPackagesList['responseStatus'] == 500){
        array_push($errorArray,$products[$x]);
        //break;
      }else if($removedPackagesList['responseStatus'] == 400){
        array_push($existingArray,$products[$x]);
        //continue;
      }
    }
    $resultArray = array(
      'deletedArray'=>$successArray,
      'unDeletedArray'=>$errorArray,
      'existingArray'=>$existingArray
    );
    $response          = $this->getResponseWithHeader();
    $response->setContent(json_encode($resultArray));
    return $response;
  }

  public function getResponseWithHeader() {
      $response = $this->getResponse();
      $response->getHeaders()
               ->addHeaderLine('Access-Control-Allow-Origin','*')
               ->addHeaderLine('Access-Control-Allow-Methods','POST, GET')
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
