<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Directv\Gigya\GigyaHandler;
use Directv\Mailer;

class GigyaController extends AbstractActionController
{
    protected $_userObject = array();

    public function postHandlerAction()
    {
        $this->_userObject         = $this->fromJson();
        $this->gigyaPostHandlerObj = $this->getServiceLocator()->get('gigya');
        $data                      = $this->gigyaPostHandlerObj->postHandler($this->_userObject);
        $response                  = $this->getResponseWithHeader();
        $response->setContent($data);
        return $response;
    }

    public function checkIfUserIPExistAction() {
        //get ip ranges from appgrid
        $appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $getIpAddressArray = $appviewAdapterObj->getIpAddress();
        $getIpTestArray    = $appviewAdapterObj->getIpTest();
        $userIPAddress     = ip2long($getIpAddressArray['ip']);
        
        $ipRangeArray      = $appviewAdapterObj->getIpRanges();
        $result            = array("isExist" => false, $getIpAddressArray['env'].'_1' => $getIpAddressArray['ip'], $getIpTestArray['env'].'_Test_1' => $getIpTestArray['ip']);
        if(!empty($userIPAddress) && isset($ipRangeArray) && !empty($ipRangeArray)) {
            foreach ($ipRangeArray as $key => $value) {
                $filterRange = filter_var(
                    $userIPAddress, 
                    FILTER_VALIDATE_INT, 
                    array(
                        'options' => array(
                            'min_range' => ip2long($value['min_range']), 
                            'max_range' => ip2long($value['max_range'])
                        )
                    )
                );
                if(!empty($filterRange)) {
                    $result  = array("isExist" => true, $getIpAddressArray['env'].'_2' => $getIpAddressArray['ip'], $getIpTestArray['env'].'_Test_2' => $getIpTestArray['ip']);
                    break;
                } 
            }
        }
        $response  = $this->getResponseWithHeader();
        $response->setContent(json_encode($result));
        return $response;
    }

    /**
     * Get the real Client Ip address.
     * @return type
     */
    public function getIp() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = array("ip" => $_SERVER['HTTP_CLIENT_IP'], "env" => "HTTP_CLIENT_IP");
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $x_forward_ips = $_SERVER['HTTP_X_FORWARDED_FOR'];
            $seperateIps=  explode(',', $x_forward_ips);
            $ip=array("ip" => $seperateIps[0], "env" => "HTTP_X_FORWARDED_FOR");
        }else{
            $ip = array("ip" => $_SERVER['REMOTE_ADDR'], "env" => "REMOTE_ADDR");
        }
       return $ip;
    }

    /**
     * Generic email notification function
     */
    public function emailNotificationAction() {
        $appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $config            = $this->getServiceLocator()->get('Config')['smtp'];
        $email             = $this->params()->fromQuery('email');
        $firstname         = $this->params()->fromQuery('firstname'); 
        $lastname          = $this->params()->fromQuery('lastname'); 
        $currentLang       = $this->params()->fromQuery('lang');  
        $emailTemplate     = $appviewAdapterObj->getEmailTemplate();
        $response          = $this->getResponseWithHeader();
        $reminderTemplate  = $emailTemplate['welcome_email'];
        $images            = $this->getImageAssetUrlAction($reminderTemplate["images"], $currentLang);
        $serverPort        = !empty($_SERVER['HTTPS']) ? $_SERVER['HTTPS'] : "http";
        $shortcodesArray = array(
          '{$firstname}'           => !empty($firstname) ? $firstname : '',
          '{$lastname}'            => !empty($lastname) ? $lastname : '',
          '{$email}'               => !empty($email) ? $email : '',
          '{$from_name}'           => $reminderTemplate['from_address'],
          '{$url}'                 => !empty($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $emailTemplate['site_url'],
          '{$url_link}'            => !empty($_SERVER['HTTP_HOST']) ? "https://".$_SERVER['HTTP_HOST'] : $emailTemplate['site_url_link']
        );
        $newShortcodesArray          = array_merge($images, $shortcodesArray);
        $reminderTemplate['altbody'] = strtr($reminderTemplate['altbody'][$currentLang], $newShortcodesArray);
        $reminderTemplate['subject'] = strtr($reminderTemplate['subject'][$currentLang], $newShortcodesArray);
        $bodyTemplate                = $appviewAdapterObj->appgridAssetData($reminderTemplate['body'][$currentLang]);
        $reminderTemplate['body']    = strtr($bodyTemplate, $newShortcodesArray);
        $firstname                   = isset($firstname) ? $firstname : '';
        try {
          $mail = new Mailer(true); //New instance, with exceptions enabled
          $mail->IsSMTP();                           
          $mail->SMTPDebug  = $config['smtp_debug']; 
          $mail->SMTPAuth   = $config['smtp_auth']; // enable SMTP authentication
          $mail->SMTPSecure = $config['smtp_secure']; // secure transfer enabled REQUIRED for GMail
          $mail->Port       = $config['port']; // set the SMTP server port
          $mail->Host       = $config['host']; // SMTP server
          $mail->Username   = $config['username']; // SMTP server username
          $mail->Password   = $config['password']; // SMTP server password
          $mail->IsSendmail();
          $mail->AddReplyTo($email, $firstname);
          $mail->From       = $reminderTemplate['from_address'];
          $mail->FromName   = $reminderTemplate['from_name'];
          $body             = $reminderTemplate['body'];
          $to               = $email;
          $mail->AddAddress($to);
          $mail->Subject    = $reminderTemplate['subject'];
          $mail->AltBody    = $reminderTemplate['altbody']; // optional, comment out and test
          $mail->WordWrap   = 500; // set word wrap
          $mail->MsgHTML($body);
          $mail->IsHTML(true); // send as HTML
          $mail->Send();
          $response->setContent(json_encode(array("success" => true)));
        } catch (phpmailerException $e) {
          $response->setContent(json_encode(array("success" => false)));
        }
        return $response;
    }

    public function getImageAssetUrlAction($imageArray, $currentLang) {
      $appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
      $data = array();
      if($imageArray) {
        foreach ($imageArray as $key => $value) {
          $data[$key] = $appviewAdapterObj->appgridAssetUrl($value[$currentLang]);
        }
      }
      return $data;
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
