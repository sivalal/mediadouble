<?php
//------------------------------------------------------------------------------------------------------
// 	GigyaPostHandler.php - 
//		processes AJAX POST requests.
//		The types of requests that are handled here:
//		+ Registration form submission
//		+ Login form submission
//		+ Link Accounts form submission
//		+ Social Login (user clicked on Gigya's Login plugin)
//		+ User submitted missing Email
//		+ User clicked "Logout"
//------------------------------------------------------------------------------------------------------

namespace Directv\Gigya;
use Directv\Gigya\GigyaSDK\GSRequest;
use Directv\Gigya\GigyaSDK\GSObject;
use Directv\Gigya\GigyaSDK\SigUtils;

class GigyaPostHandlerAdapter
{
    protected $param           = null;
    protected $curlOptionParam = null;
    protected $responseObject  = "";
    
    protected $_GSObject       = array();

    public function __construct($param, $curlOptionParam, $logger, $httpUtilityObj) {
        $this->_param           = $param;
        $this->_curlOptionParam = $curlOptionParam;
        $this->_httpUtilityObj  = $httpUtilityObj;
        GSRequest::__constructStatic($curlOptionParam, $logger);
    }

    public function getGSObject() {
        $this->_GSObject  = new GSObject();
        return $this->_GSObject;
    }

    public function postHandler($userObject = array()) {
    	switch ($userObject['action']) {
            case 'nativeRegister':
                $responseObject = $this->nativeRegistrationOfUser($userObject); 
                break;
            case 'socialRegister':
                $responseObject = $this->socialRegistrationOfUser($userObject);                        
                break;
            case "login":                                                                                                          
                $responseObject = $this->notifySiteLogin($userObject);                           
                break;
            case "emailExist":                           
                $email = trim($userObject['email']);                                              
                $responseObject = $this->checkEmailExist($email);             
                break;
            case "logoff": 
                //delete user entitlements
                $this->_httpUtilityObj->deleteHttpOnlyCookie($userObject['cookie_list']);
                $this->_httpUtilityObj->deleteHttpOnlyCookie('newToken');
                $this->_httpUtilityObj->deleteHttpOnlyCookie('subscription_id');
                $this->_httpUtilityObj->deleteHttpOnlyCookie('product_list');
                $responseObject = $this->logoffUser($userObject);                           
                break;
            case "resetPassword":                                                                
                $responseObject = $this->resetUserPassword($userObject);                            
                break;
            case "userInfo":                                                                
                $responseObject = $this->getUserInformationWithUserId($userObject);                            
                break;
            case "setInfo":                                                                
                $responseObject = $this->setAccountInformation($userObject);                            
                break;
            case "linkAccount":                                                                
                $responseObject = $this->linkAccountToSocialNetwork($userObject);                            
                break;
            case "unlinkAccount":                                                                
                $responseObject = $this->unlinkAccountToSocialNetwork($userObject);                            
                break;
            case "deleteAccount":                                                                
                $responseObject = $this->deleteAccountToSocialNetwork($userObject);                            
                break;
            case "setPolicies":                                                                
                $responseObject = $this->accountLoginIdentifierSetPolicies();                            
                break;
            case "searchAccount":                                                                
                $responseObject = $this->searchAccountWithCustomDataField($userObject);                            
                break;
    		default:
    			$responseObject = "unknown action";
    			break;
    	}
    	return json_encode($responseObject);
    }

    /* 
     * Call nativeRegistrationOfUser to register new user in Gigya.
     * On-site registration requires three API calls: 
     * 1. accounts.initRegistration, 
     * 2. accounts.register and 
     * 3. accounts.finalizeRegistration.
     */
    public function nativeRegistrationOfUser($userObject) {
        //$this->accountLoginIdentifierSetPolicies();
        // 1. accounts.initRegistration. A regToken (registration token) is generated by accounts.initRegistration 
        $requestInitRegistration  = new GSRequest("accounts.initRegistration");
        $responseInitRegistration = $requestInitRegistration->send();
        $regToken                 = $responseInitRegistration->getString("regToken");
        // 2. accounts.register. Pass registration token to this method
        $requestRegistration  = new GSRequest("accounts.register"); 
        $profile  = array( 
            "firstName" => isset($userObject['firstName']) ? $userObject['firstName'] : '',
            "lastName" => isset($userObject['lastName']) ? $userObject['lastName'] : '' 
        );

        //set write access for profile schema
        $this->setProfileSchema($profile);

        $data  = array( 
            $userObject["notificationKey"]  => $userObject["notificationValue"],
            "packageList" => $userObject["packageIdArray"] 
        );
        //set write access for data schema
        $this->setDataSchema($data);
        $requestRegistration->setParam("data", json_encode($data));
        $requestRegistration->setParam("profile", json_encode($profile));
        $requestRegistration->setParam("email", $this->validate($userObject['email']));
        //$requestRegistration->setParam("username", $userObject['username']);
        $requestRegistration->setParam("password", $this->validate($userObject['password']));
        $requestRegistration->setParam("regToken", $regToken);
        // 3. accounts.finalizeRegistration. This method is not required if the finalizeRegistration parameter was set to 'true' in accounts.register. 
        $requestRegistration->setParam("finalizeRegistration", true);
        $responseRegistration = $requestRegistration->send();
        $filteredResponse = $this->filterResponseData($responseRegistration);
        return $filteredResponse;
    }

    /* 
     * Set profile schema
     */
    public function setProfileSchema($profile = array()) 
    { 
        $result = array();
        $request  = new GSRequest("accounts.setSchema");
        foreach ($profile as $key => $value) {
            $result[$key]['writeAccess'] = "clientModify";
        }
        $profileSchema = array(
            'fields' => $result
        );
        $request->setParam("profileSchema", json_encode($profileSchema));
        $response = $request->send();
        return;
    }

    /* 
     * Set dataschema
     */
    public function setDataSchema($data = array()) 
    { 
        $result = array();
        $request  = new GSRequest("accounts.setSchema");

        foreach ($data as $key => $value) {
            $result[$key]['writeAccess'] = "clientModify";
        }
        $dataSchema = array(
            'fields' => $result
        );
        $request->setParam("dataSchema", json_encode($dataSchema));
        $response = $request->send();
        return;
    }

    public function searchAccountWithCustomDataField($userObject) 
    {
        $request  = new GSRequest("accounts.search");
        $request->setParam("query", 'select UID, data.vid, profile.email from accounts where data.vid="'.$userObject["vid"].'" limit 1');
        $response = $request->send();
        return $this->filterResponseData($response);
    }

    public function getUserInformationWithUserId($userObject) 
    {
        $request  = new GSRequest("accounts.getAccountInfo");
        $request->setParam("UID", $userObject["userId"]);
        $response = $request->send();
        return $this->filterResponseData($response);
    }

    public function setAccountInformation($userObject) 
    { 
        $request   = new GSRequest("accounts.setAccountInfo");
        $request->setParam("UID", $userObject["UID"]);
        switch ($userObject['type']) {
            case 'username':
                $profile  = array( 
                    "firstName" => $userObject["firstName"],
                    "lastName" => $userObject["lastName"] 
                );
                $request->setParam("profile", json_encode($profile));
                break;
            case 'email':
                if(isset($userObject["removeLoginEmails"])) $request->setParam("removeLoginEmails", $this->validate($userObject["removeLoginEmails"]));
                if(isset($userObject["addLoginEmails"])) {
                    $request->setParam("addLoginEmails", $this->validate($userObject["addLoginEmails"]));
                    $profile  = array( 
                        "email" => $this->validate($userObject["addLoginEmails"]) 
                    );
                    $request->setParam("profile", json_encode($profile));
                }
                break;
            case 'password':
                if(isset($userObject["password"])) $request->setParam("password", $this->validate($userObject["password"]));
                if(isset($userObject["newPassword"])) $request->setParam("newPassword", $this->validate($userObject["newPassword"]));
                break;
            case 'subsriberStatus':
                $request->setParam("isActive", $userObject["isActiveValue"]);
                break;
            case 'newsletter':
                $request->setParam("data", json_encode(array($userObject["newsletterKey"] => $userObject["newsletterValue"])));
                break;
            case 'notification':
                $request->setParam("data", json_encode(array($userObject["notificationKey"]=>$userObject["notification"])));
                break;
            case 'cancelStatementAndFeedBack':
                $request->setParam("data", json_encode($userObject["cancel_account"]));
                break;
            case 'cancelStatementAndFeedBack':
                $request->setParam("data", json_encode($userObject["cancel_account"]));
                break;
            case 'setVindiciaId':
                $request->setParam("data", json_encode(array("vid"=>$userObject["vid"])));
                break;
            case 'setAccountInVindicia':
                $request->setParam("data", json_encode(array("isAccountCreatedInVindicia"=>$userObject["isAccountCreatedInVindicia"])));
                break;
            default:
                # code...
                break;
        }
        $response  = $request->send();
        return $this->filterResponseData($response);
    }

    public function checkEmailExist($email) 
    { 
        $request   = new GSRequest("accounts.isAvailableLoginID");
        $request->setParam("loginID", $email);
        $response  = $request->send();
        return $this->filterResponseData($response);
    }

    /* 
     * Call notifySiteLogin for native login.
     */
    public function notifySiteLogin($userObject)
    {
        $email       = isset($userObject['email']) ? $this->validate($userObject['email']) : '';
        $password    = isset($userObject['password']) ? $this->validate($userObject['password']) : '';                                                     
        $request   = new GSRequest("accounts.login");
        $request->setParam("loginID", $email);
        $request->setParam("password", $password);
        if($userObject['rememberme'] == false) {
            $request->setParam("sessionExpiration", 0);
        } 
        $request->setParam("password", $password);
        $response  = $request->send();
        return $this->filterResponseData($response);
    }

     /* 
     * This method serves as an end point for connecting the user to a specified* social network.
     */
    public function linkAccountToSocialNetwork($userObject)
    { 
        if(isset($userObject['userIds']) && !empty($userObject['userIds'])) {
            foreach ($userObject['userIds'] as $key => $userid) {
                $request   = new GSRequest("accounts.linkAccounts");
                $request->setParam("UID", $userid);
                $request->setParam("loginID", $this->validate($userObject['loginID']));
                $request->setParam("password", $this->validate($userObject['password']));
                $response  = $request->send();
            }  
        } 
        return $this->filterResponseData($response);
    }

    /* 
     * This method disconnects the current user from one or all of the connected providers
     */
    public function unlinkAccountToSocialNetwork($userObject)
    { 
        $request   = new GSRequest("socialize.removeConnection");
        $request->setParam("UID", $userObject['UID']);
        $request->setParam("provider", $userObject['provider']);
        $request->setParam("removeLoginID", true);
        $response  = $request->send();
        return $this->filterResponseData($response);
    }

    public function deleteAccountToSocialNetwork($userObject)
    { 
        $request   = new GSRequest("accounts.deleteAccount");
        $request->setParam("UID", $userObject['UID']);
        $response  = $request->send();
        return $this->filterResponseData($response);
    }

    /* 
     * log out user from gigya.
     */
    public function logoffUser($userObject)
    {
        $method  = ($userObject['provider'] == 'site') ? "accounts.logout": "socialize.logout";
        $request = new GSRequest($method);
        $request->setParam("UID", $userObject['UID']);
        $response  = $request->send();
        return $this->filterResponseData($response);
    }

    /* 
     * This API method notifies the Gigya service that the user has completed the registration process at your site.
     */
    public function socialRegistrationOfUser($userObject)
    {
        $request   = new GSRequest('socialize.notifyRegistration');
        $request->setParam("UID", $userObject['UID']);
        $response  = $request->send();
        return $this->filterResponseData($response);
    }

    /* 
     * reset user password.
     */
    public function resetUserPassword($userObject)
    {
        $request   = new GSRequest("accounts.resetPassword");
        $request->setParam("loginID", $this->validate($userObject['email']));
        $response  = $request->send();
        return $this->filterResponseData($response);
    }

    public function accountLoginIdentifierSetPolicies() {
        $loginIdentifiers = array(
            "loginIdentifiers" => "email"
        );
        $loginIdentifiers = json_encode($loginIdentifiers);
        $request   = new GSRequest("accounts.setPolicies");
        $request->setParam("accountOptions", $loginIdentifiers);
        $response  = $request->send();
        return $this->filterResponseData($response);
    }


    /* 
     * A Gigya utility method for verifying the authenticity of the signature received from Gigya
     */
    public function validateSignature($UID, $signatureTimestamp,$UIDSignature){
        return SigUtils::validateUserSignature($UID, $signatureTimestamp, SECRET_KEY,$UIDSignature);
    }

    /* 
     * Filter response data by error code and set cookie
     */
    public function filterResponseData($response) 
    {
        $responseJsonDecode =json_decode($response->getData());
        if(isset($response) && $response->getErrorCode()==0) { 
            $responseJsonDecode->errorStatus = 0;
            return $responseJsonDecode;
        } else {
            if(empty($responseJsonDecode)){
                //http://stackoverflow.com/questions/8900701/creating-default-object-from-empty-value-in-php
                $responseJsonDecode = new \stdClass();
                $responseJsonDecode->responseData=$response->getData();
                $responseJsonDecode->completeResponse=$response;
            }
            
            $responseJsonDecode->errorStatus  = 1;
            return $responseJsonDecode;
        }
    }

    /**
     * htmlspecialchars function-----------
     * ‘&’ (ampersand) becomes ‘&amp;’
     * ‘”‘ (double quote) becomes ‘&quot;’ when ENT_NOQUOTES is not set.
     * “‘” (single quote) becomes ‘&#039;’ (or &apos;) only when ENT_QUOTES is set.
     * ‘<’ (less than) becomes ‘&lt;’
     * ‘>’ (greater than) becomes ‘&gt;’
     * strip_tags-------------------------
     * remove PHP and HTML tags from a string
     */
    public function validate($string){
        $string = htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
        $string = strip_tags($string);
        return $string;
    }

    
}