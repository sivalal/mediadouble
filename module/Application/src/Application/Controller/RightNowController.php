<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Directv\Gigya\GigyaWrap;
class RightNowController extends AbstractActionController
{
    
    public function indexAction()
    {
    }
    
    
    public function GetMessage($language, $keyword, $messages)
    {
        foreach ($messages as $key => $value) {
            if ($value['id'] == $keyword)
                return $value[$language];
        }
        return "";
    }
    
    public function footerAction2()
    {
        $appBaseMenu     = "//" . $_SERVER['HTTP_HOST'];
        $currentUid  = strip_tags($this->params()->fromQuery('uid'));
        $currentLang = htmlEntities(strip_tags($this->params()->fromQuery('currentLang')));
        if ($currentLang == "es_ES")
            $langKey = 'es_ES';
        else
            $langKey = 'en_US';

        if(empty($currentLang))  $currentLang = 'es_ES';
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $footer                  = $this->appviewAdapterObj->getFooterDetails();
//        
//        $response     = $this->getResponseWithHeader();
//        $response->setContent($this->getFooterHtml($footer, $langKey,$appBaseMenu));
//        return $response;
        
        
        
        
//        print_r(json_encode($footer));
//        die();
//        $footer_html;
        $footer_large = '<div class="container ng-scope" ng-controller="FooterCtrl">
    <div class="row footer" id="webFooter">
      <div class="col-md-12 col-lg-12">
        <ul class="list-inline">
          <li class="copyright">
            <span class="footerCopy ng-binding">© 2014 DirecTV, LLC |</span>
          </li>';
        
        $footer_small = '   <div class="row footer" id="mobFooter">
      <div class="col-xs-12 footerCopy text-center ng-binding">© 2014 DirecTV, LLC |</div>';
        
        usort($footer['footer'], function($a, $b) {
            return $a['priority'] > $b['priority'];
        });
        
        foreach ($footer['footer'] as $key => $item) {
          if(is_array($item['actionID'])) {
            $actionHref = $item['actionID'][$currentLang]; 
          } else {
            $actionHref = $item['actionID']; 
          }
            $footer_large = $footer_large . '<li ng-repeat="navLink in footerMenus" class="ng-scope">';
          if($item['action']==='iframe_link'){
              
              $footer_large.= '<a href="'.$appBaseMenu.'/content?page_id='.$item['id'].'" class="footerText cursor-pointer ng-scope" >' . $item['title'][$langKey] . '</a>
              </li>';
              
              
//            if(is_array($item['actionID'])){                
////               $footer_large.= '<a href="' . $item['actionID'][$langKey] . '" class="footerText cursor-pointer ng-scope" >' . $item['title'][$langKey] . '</a>
////               </li>';
//                
//                $footer_large.= '<a href="'.$appBaseMenu.'content?page_id='.$item['id'].'" class="footerText cursor-pointer ng-scope" >' . $item['title'][$langKey] . '</a>
//                </li>';
//                
//            }else{
//                $footer_large.= '<a href="' . $item['actionID'] . '" class="footerText cursor-pointer ng-scope" >' . $item['title'][$langKey] . '</a>
//          </li>';
//            }
          }else if($item['action']==='link'){
              $footer_large.= '<a href="' . $actionHref . '" class="footerText cursor-pointer ng-scope" >' . $item['title'][$langKey] . '</a>
                      </li>';
          }else if($item['action']==='page'){
              $footer_large.= '<a href="' .$appBaseMenu. $item['actionID'] . '" class="footerText cursor-pointer ng-scope" >' . $item['title'][$langKey] . '</a>
                      </li>';
          }           
            
            $footer_small = $footer_small . ' <div ng-repeat="navLink in footerMenus" class="col-xs-12 text-center ng-scope">';
             
            if($item['action']==='iframe_link'){
               $footer_small.= '<a href="'.$appBaseMenu.'/content?page_id='.$item['id'].'" class="footerText ng-scope" >' . $item['title'][$langKey] . '</a></div>';
            }else if($item['action']==='link'){
              $footer_small.= '<a href="' . $actionHref . '" class="footerText ng-scope" >' . $item['title'][$langKey] . '</a></div>';
            }else if($item['action']==='page'){
                $footer_small.= '<a href="' .$appBaseMenu. $item['actionID'] . '" class="footerText ng-scope" >' . $item['title'][$langKey] . '</a></div>';
            }
            

//            if(is_array($item['actionID'])){
//               $footer_small.= '<a href="' . $item['actionID'][$langKey] . '" class="footerText ng-scope" >' . $item['title'][$langKey] . '</a></div>';
//            }else{
//                $footer_small.= '<a href="' . $item['actionID'] . '" class="footerText ng-scope" >' . $item['title'][$langKey] . '</a></div>';
//            }
        
        }
        
        $footer_large = $footer_large . '
        <li class="build pull-right">
             <span class="footerCopy ng-binding">' . BUILD_NUMBER . '</span>
        </li></ul></div></div>';
        
        $footer_small = $footer_small . '<div class="col-xs-12 footerCopy text-center ng-binding">' . BUILD_NUMBER . '</div></div></div>';
        $footer_html  = $footer_large . $footer_small;
        $response     = $this->getResponseWithHeader();
        $response->setContent($footer_html);
        return $response;
    }
    

    public function footerAction(){
        $appBaseMenu     = "//" . $_SERVER['HTTP_HOST'];
        $currentUid  = strip_tags($this->params()->fromQuery('uid'));
        $currentLang = htmlEntities(strip_tags($this->params()->fromQuery('currentLang')));
        if ($currentLang == "es_ES")
            $langKey = 'es_ES';
        else
            $langKey = 'en_US';
        
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $footer                  = $this->appviewAdapterObj->getFooterDetails();
        $response     = $this->getResponseWithHeader();
        $response->setContent($this->getFooterHtml($footer, $langKey, $appBaseMenu));
        return $response;
    }

    

    public function getFooterHtml($footerDetails,$currentLang,$appBaseMenu){
        
        $footerMenu='<div class="container" ><span class="yelloworangeloader"></span>';
        $footerMenu.='<div class="row footer" id="webFooter"><div class="col-md-12 col-lg-12">';
        $footerMenu.='<ul class="list-inline"><li class="copyright">';
        $footerMenu.='<ul class="list-inline"><li class="copyright">';
        $footerMenu.='<span class="footerCopy">'.$footerDetails['copyRight'][$currentLang].'</span></li>';
        usort($footerDetails['footer'], function($a, $b) {
            return $a['priority'] > $b['priority'];
        });
        foreach($footerDetails['footer'] as $footerchild){
            $footerMenu.='<li>';
            if($footerchild['action']=='iframe_link'){
                $footerMenu.='<a href="'.$appBaseMenu.'/content?page_id='.$footerchild['id'].'"   class="footerText" >'.$footerchild['title'][$currentLang].'</a>';
            }else if($footerchild['action']=='link'){
                $footerMenu.='<a href="'.$footerchild['actionID'][$currentLang].'"   class="footerText" >'.$footerchild['title'][$currentLang].'</a>';
            }else if($footerchild['action']=='page'){
                $footerMenu.='<a href="'.$appBaseMenu.'/'.$footerchild['actionID'].'"   class="footerText" >'.$footerchild['title'][$currentLang].'</a>';
            }
            $footerMenu.='</li>';
        }
        $footerMenu.='<li class="build pull-right">';
        $footerMenu.='<span class="footerCopy">'.BUILD_NUMBER.'</span></li>';        
        $footerMenu.='</div></div>';
        return $footerMenu; 
        
    }

    
    
    public function topnav2Action()
    {
        $response                = $this->getResponseWithHeader();
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $mainMenu                = $this->appviewAdapterObj->getMenuDetails();
        
        
        $newmenu                 = array();
        if (!empty($mainMenu)) {
            if (!empty($mainMenu['menu'])) {
                foreach ($mainMenu['menu'] as $value) {
                    if (!empty($value['actionID']) && $value['actionID'] != 'home')
                        $newmenu[] = $value;
                    else if(empty($value['actionID']))
                    {
                         $newmenu[] = $value;
                    }
                }
            }
        }
        //  $appBaseMenu     = RIGHTNOW;
        $appBaseMenu     = "//" . $_SERVER['HTTP_HOST'];
        $currentUid      = $this->params()->fromQuery('uid');
        $currentLang     = $this->params()->fromQuery('currentLang');
        $rightNowTopMenu = $this->rightNowTopNav($newmenu, $currentUid, $currentLang, $appBaseMenu);
        $response->setContent($this->getTopNav($rightNowTopMenu, $currentLang, $currentUid, $appBaseMenu));
        return $response;
    }
    
    public function siteintegrationAction()
    {
        $response = $this->getResponseWithHeader();
        $response->setContent(file_get_contents(APPLICATION_PATH . "/views/rightnow/siteintegration.html"));
        return $response;
    }
    
    public function getResponseWithHeader()
    {
        $response = $this->getResponse();
        $response->getHeaders()->addHeaderLine('Access-Control-Allow-Origin', '*')->addHeaderLine('Access-Control-Allow-Methods', 'POST GET')->addHeaderLine('Content-type', 'text/html');
        return $response;
    }
    
    
    public function getTopNav($rightNowTopMenu, $currentLang, $uid, $appBaseMenu)
    {
        $messages       = $this->appviewAdapterObj->getMessages();
        $appgrid_assets = $this->appviewAdapterObj->getAppAssets();
        $footer                  = $this->appviewAdapterObj->getFooterDetails();
        $langBasedUrl='';
        $langUrl='';
        if(isset($footer['footer'])&&!empty($footer['footer'])){
            foreach ($footer['footer'] as $foo){
                if($foo['id']=='help'){
                    $langBasedUrl=$foo['actionID'];
                }
            }
        }
       
        $logo='';
        if (isset($appgrid_assets['logo-yaveo-web']))
            $logo = $appgrid_assets['logo-yaveo-web'];
        $es_color = $en_color = "style='color:#BCBEC0'";
        if ($currentLang === 'es_ES') {
            $langKey  = "es_ES";
            $es_color = "style='color:#e28c05'";
            //$langUrl=$langBasedUrl['es_ES'];
            
        } else {
            $langKey  = "en_US";
            $en_color = "style='color:#e28c05'";
            //$langUrl=$langBasedUrl['en_US'];
            
        }
       
        $tpoNavHtml = '<div id="menu" class="navbar navbar-inverse navbar-fixed-top clearfix navbar-custom" ng-style="navmenuStyle">  
      <div id="logo" class="navbar-header navbar-left" style="float: left; height:55px; margin-top:0px;">   

        <!-- LOGO IMAGE -->
        <a href="' . $appBaseMenu . '"><img src="' . $logo . '"></a>
      </div>
      <button class="btn menu-toggle-btn btn-primary navbar-toggle navbar-left navbar-toggle" data-toggle="collapse" data-target="#collasible" ng-click="collapsingMenu()">
        <span>' . $this->GetMessage($langKey, "MENU", $messages) . '</span>
      </button> 
      <div class="navbar-collapse navbar-left navbarMenu collapse" id="collasible" collapse="isCollapsed" style="height: 0px;">
          <ul class="nav navbar-nav">';
        
        
        
        foreach ($rightNowTopMenu as $menu) {
            // echo $menu['href'];
if($menu['actionID']== 'notdefined')
$main_menu_link='<a class="nav ng-scope" show-sub-menu="" translate="" active-link="menu-font-color">' . strtoupper($menu['title'][$langKey]) . '</a>';
else
$main_menu_link='<a class="nav ng-scope" show-sub-menu="" translate="" active-link="menu-font-color" href="' . $menu['actionID'] . '">' . strtoupper($menu['title'][$langKey]) . '</a>';

            $tpoNavHtml = $tpoNavHtml . '<li class="ng-scope dropdown">'.$main_menu_link;
      
            if (!empty($menu['children'])) {

                $tpoNavHtml = $tpoNavHtml . '<ul ng-if="menu.children !=undefined" class="dropdown-menu" mousable >
                      <span class="navlink"></span>';
                foreach ($menu['children'] as $submenu) {

if($submenu['actionID'] != 'notdefined')
$sub_menu_link='<a  class="dropdown-toggle" href="' . $submenu['actionID'] . '">' . strtoupper($submenu['title'][$langKey]) . '</a></li>';
else
$sub_menu_link='<a  class="dropdown-toggle">' . strtoupper($submenu['title'][$langKey]) . '</a></li>';


                    $tpoNavHtml = $tpoNavHtml . '<li>'.$sub_menu_link;
                }
                $tpoNavHtml = $tpoNavHtml . '</ul>';
            }
            
            $tpoNavHtml = $tpoNavHtml . '</li>';
        }
        
        
        
        $tpoNavHtml  = $tpoNavHtml . '<li class="search-icon"><a href="' . $appBaseMenu . '?action=search' . '" ><span class="icon-custom-search"></span></a></li>         
          </ul>
          <div class="navbar-right hidden-xs">
              <button class="btn btnOrange btn-default navbar-btn signup" id="signupERT">' . $this->GetMessage($langKey, "SIGN UP", $messages) . '</button>
          </div>  
      </div>        
      <div class="navbar-header pull-right">

<ul class="nav navbar-nav pull-left">
            <li id="languageSelect">
              <span>
                <a   onclick="ChangeLanguage(\'es_ES\',\''.$langBasedUrl['es_ES'].'\''.')"'. $es_color .' >ESP</a>
                &nbsp;
                <a onclick="ChangeLanguage(\'en_US\',\''.$langBasedUrl['en_US'].'\''.')"' . $en_color .'>ENG</a>
              </span>
            </li>
          </ul>
          <ul class="nav navbar-nav pull-left navBarIcons help-lang-icons">
             <li class="search-icon searchMobile"><a href="#" ng-click="searchModal()"><span class="icon-custom-search"></span></a></li>
             <li class="help-icon"><a style="padding:20px 18px;" href="/"><span class="icon-custom-help"></span></a></li> 
          </ul>';
        $profileName = "";
        if (!empty($uid)) {
            $result = $this->getUserObjectAction($uid);
            if (!array_key_exists("errorMessage", $result)) {
                //print_r($result);
                $profileName = $this->getUsernameOrEmail($result['profile']);
            } else {
                
                $this->redirect()->toUrl($appBaseMenu);
            }
            //print_r($appBaseMenu)  ;
            $logoutUrl  = $appBaseMenu . '?action=logout';
            $adminUrl   = $appBaseMenu . '?action=admin';
            $tpoNavHtml = $tpoNavHtml . '<ul class="nav navbar-nav pull-left navBarIcons"   style="background-color:#2E332F;border-right:#3F4548;">
                <li id="selectable" class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <span class="icon-custom-user"></span>
                  <label style="padding-left:10px" class="ng-binding">' . $profileName . '</label>
                  </a>
                  <ul class="dropdown-menu" id="logoutmenu">
                    <span class="navlink"></span>                   
                    <li><a href="' . $logoutUrl . '" >Logout</a></li>
                  </ul>
                </li>
          </ul>
          <ul class="nav navbar-nav pull-left navBarIcons hidden-xs" style="background-color:#2E332F">
              <li style=" display: inline; border-left: 2px solid;border-color:#4D5459; padding-left: 0.3em;">
                <a href="' . $adminUrl . '" >
                  <span class="icon-custom-admin"></span>
                </a>
              </li>
          </ul>';
        } else {
            $loginUrl   = $appBaseMenu . '?action=login';
            $signUpUrl  = $appBaseMenu . '?action=signup';
            $tpoNavHtml = $tpoNavHtml . '<ul style="display:none" class="nav navbar-nav pull-left navBarIcons hidden-xs" style="background-color:#2E332F">
              <li style=" display: inline; border-left: 2px solid;border-color:#4D5459; padding-left: 0.3em;">
                <a href="#" >
                  <span class="icon-custom-admin"></span>
                </a>
              </li>
          </ul>
          <div class="nav navbar-nav pull-left visible-md visible-lg visible-sm" >
              <a class="btn btnGrey btn-default navbar-btn login" href="' . $loginUrl . '" id="login">' . $this->GetMessage($langKey, "BTN_ADMIN_LOGIN_WATCHLIST", $messages) . '</a>
              <a class="btn btnOrange btn-default navbar-btn signup" href="' . $signUpUrl . '" id="signup">' . $this->GetMessage($langKey, "TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNT", $messages) . '</a>
            
          </div>';
        }
        $tpoNavHtml = $tpoNavHtml . '</div>     
    </div>';
        return $tpoNavHtml;
    }
    
    public function getMobileMenu($rightNowTopMenu,$currentLang){
        $es_color = $en_color = "style='color:#FFF'";
        if ($currentLang === 'es_ES') {
            $langKey  = "es_ES";
            $es_color = "style='color:#165477'";
        } else {
            $langKey  = "en_US";
            $en_color = "style='color:#165477'";
        }
        $mobileMenu='<div class="navbar-collapse navbar-left navbarMenu mob_menu_drop" id="collapsibleMob">
        <ul class="nav navbar-nav">';
        foreach ($rightNowTopMenu as $menu){
            if($menu['children']!=null && $menu['has_children']==TRUE){
                $mobileMenu.='<li '.'class="dropdown">';
            }else{
                $mobileMenu.='<li class="">';
            }
            if($menu['actionID']!='notdefined'){               
                $mobileMenu.='<a  href="'.$menu['actionID'].'" class="nav" '.($menu['action']=='link'?'target="_blank"':"").' >'.strtoupper($menu['title'][$langKey]).'</a>';
            }else{
                $mobileMenu.='<a class="nav" >'.strtoupper($menu['title'][$langKey]).'</a>';
            }
            if($menu['children']!=null && $menu['has_children']==TRUE){
                $subMenu='';
                $subMenu.='<span class="menuDropArrow" ></span>';
                $subMenu.='<ul class="dropdown-menu"  ><span class="navlink"></span>';
                foreach($menu['children'] as $child){
                   $subMenu.='<li>';
                   if($child['actionID']!='notdefined'){               
                        $subMenu.='<a  href="'.$child['actionID'].'" class="nav"  '.($child['action']=='link'?'target="_blank"':"").' >'.strtoupper($child['title'][$langKey]).'</a>';
                    }else{
                        $subMenu.='<a  href="'.$child['actionID'].'" class="nav"  >'.strtoupper($child['title'][$langKey]).'</a>';
                    }
                    $subMenu.='</li>';
                }
                $subMenu.='</ul>';
            }else{
               $subMenu=''; 
            }
            $mobileMenu.=$subMenu.'</li>';
        }
        $mobileMenu.='</ul></div>';
        return $mobileMenu;
        
    }
    
    


    public function getUserObjectAction($uid)
    {
        
        $userObject['userId'] = $uid;
        $this->gigyaWrapObj   = $this->getServiceLocator()->get('gigya');
        $userObj              = $this->gigyaWrapObj->getUserInformationWithUserId($userObject);
        $result               = json_decode(json_encode($userObj), TRUE);
        return $result;
    }
    
    
    public function getUsernameOrEmail($userProfile)
    {
        $profileName = "";
        if (array_key_exists("firstName", $userProfile)) {
            $profileName = $userProfile['firstName'];
            // if (array_key_exists("lastName", $userProfile)) {
            //     $profileName = $profileName . " " . $userProfile['lastName'];
            // }
        } elseif (array_key_exists("email", $userProfile)) {
            $profileName = $userProfile['email'];
        }
        return $profileName;
    }
    
    
    public function rightNowTopNav($mainMenu, $currentUid, $currentLang, $appBaseMenu)
    {
        $topNavMenu = array();
        
        
        
        foreach ($mainMenu as $menu) {
            if (isset($menu['actionID']) && $menu['actionID']!='') {
                if (isset($menu['action']) && $menu['action'] == 'custom') {
                    $menuHref         = $menu['actionID'];
                    $menu['actionID'] = $appBaseMenu . htmlentities('/page?pageid=' . $menuHref);
                } else if (isset($menu['action']) && $menu['action'] == 'filter') {
                    $menuHref         = $menu['actionID'];
                    $menu['actionID'] = $appBaseMenu . htmlentities('/filterpage?pageid=' . $menuHref);
                } else {
                    $tempHref         = $menu['actionID'];
                    $menu['actionID'] = $appBaseMenu . htmlentities('/' . $tempHref);
                }
            }
            else
            {
                $menu['actionID'] ='notdefined';
            }
            if (!empty($menu['children']) && $menu['has_children']==TRUE ) {
                $tempSubMenu = array();
                foreach ($menu['children'] as $submenu) {
                    if (isset($submenu['actionID'])) {
                        if (isset($submenu['action']) && $submenu['action'] == 'custom') {
                            $menuHref            = $submenu['actionID'];
                            $submenu['actionID'] = $appBaseMenu . htmlentities('/page?pageid=' . $menuHref);
                        } else if (isset($submenu['action']) && $submenu['action'] == 'filter') {
                            $menuHref            = $submenu['actionID'];
                            $submenu['actionID'] = $appBaseMenu . htmlentities('/filterpage?pageid=' . $menuHref);
                        } else {
                            $tempHref            = $submenu['actionID'];
                            $submenu['actionID'] = $appBaseMenu . htmlentities('/' . $tempHref);
                        }
                    }
                    else {
                    $submenu['actionID'] ='notdefined';
                }
                    
                    // $tempSubmenuHref     = $submenu['actionID'];
                    // $submenu['actionID'] = $appBaseMenu . htmlentities('/' . $tempSubmenuHref);
                    // //echo '<pre>';
                    // //print_r($submenu['href']."\n");
                    
                    array_push($tempSubMenu, $submenu);
                }
                $menu['children'] = $tempSubMenu;
            }
            
            
            array_push($topNavMenu, $menu);
        }
        
        //echo '<pre>';
        // print_r($topNavMenu);
        return $topNavMenu;
    }
    
    
    function DesktopmenuHtml($rightNowTopMenu,$currentLang){

        $menuHtml="";
        foreach ($rightNowTopMenu as $menu) {
            // echo $menu['href'];
            if($menu['actionID']== 'notdefined'){
            $main_menu_link='<a class="nav ng-scope" >' . strtoupper($menu['title'][$currentLang]) . 
                    '</a>';
            }else{
            $main_menu_link='<a class="nav ng-scope"'.
                    (($menu['action']=='link')? 'target="_blank"':""). ' href="' . $menu['actionID'] 
                    . '">' . strtoupper($menu['title'][$currentLang]) . '</a>';
            }
            $menuHtml = $menuHtml . '<li class="ng-scope dropdown">'.$main_menu_link;
      
            if (!empty($menu['children'])&& $menu['has_children']==TRUE) {

                $menuHtml = $menuHtml . '<ul  class="dropdown-menu" mousable >
                      <span class="navlink"></span>';
                foreach ($menu['children'] as $submenu) {

               if($submenu['actionID'] != 'notdefined'){
                $sub_menu_link='<li><a collapse-sub-menu ng-cloak onclick="scrolltotop()"'
                    . ' class="dropdown-toggle" href="' .
                    $submenu['actionID'] . '">'
                    . (($submenu['action']=='link')? 'target="_blank"':''). strtoupper($submenu['title'][$currentLang]) . '</a></li>';
                            }else{
                $sub_menu_link='<li><a collapse-sub-menu ng-cloak onclick="scrolltotop()"'
                    . ' class="dropdown-toggle">' 
                    . strtoupper($submenu['title'][$currentLang]) . '</a></li>';
                            }

                    $menuHtml = $menuHtml . $sub_menu_link;
                }
                $menuHtml = $menuHtml . '</ul>';
            }
            
            $menuHtml = $menuHtml . '</li>';
        }
        
        return $menuHtml;
    }
    
    public function topnavAction()
    {
        $response                = $this->getResponseWithHeader();
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $mainMenu                = $this->appviewAdapterObj->getMenuDetails();
        
        
        
        $newmenu                 = array();
        if (!empty($mainMenu)) {
            if (!empty($mainMenu['menu'])) {
                foreach ($mainMenu['menu'] as $value) {
                    if (!empty($value['actionID']) && $value['actionID'] != 'home')
                        $newmenu[] = $value;
                    else if(empty($value['actionID']))
                    {
                         $newmenu[] = $value;
                    }
                }
            }
        }
        //  $appBaseMenu     = RIGHTNOW;
        $appBaseMenu     = "//" . $_SERVER['HTTP_HOST'];
        $currentUid      = $this->params()->fromQuery('uid');
        
        //$currentLang     = $this->params()->fromQuery('currentLang');
        $currentLang = htmlEntities(strip_tags($this->params()->fromQuery('currentLang')));
        if ($currentLang == "es_ES")
            $currentLang = 'es_ES';
        else
            $currentLang = 'en_US';
        $rightNowTopMenu = $this->rightNowTopNav($newmenu, $currentUid, $currentLang, $appBaseMenu);
        
        
        
//             echo "<pre>"; print_r($rightNowTopMenu);
//             echo "-----------<code>";
//            echo $this->DesktopmenuHtml($rightNowTopMenu,$currentLang);
//            echo "-----------</code>";
//        die();
        $response->setContent($this->getTopNav2($rightNowTopMenu, $currentLang, $currentUid, $appBaseMenu));
        return $response;
    }
    
    public function getTopNav2($rightNowTopMenu, $currentLang, $uid, $appBaseMenu)
    {
        $messages       = $this->appviewAdapterObj->getMessages();
        $appgrid_assets = $this->appviewAdapterObj->getAppAssets();
        $footer                  = $this->appviewAdapterObj->getFooterDetails();
        $langBasedUrl='';
        $langUrl='';
        if(isset($footer['footer'])&&!empty($footer['footer'])){
            foreach ($footer['footer'] as $foo){
                if($foo['id']=='help'){
                    $langBasedUrl=$foo['actionID'];
                }
            }
        }
       
        $logo='';
        if (isset($appgrid_assets['logo-yaveo-web']))
            $logo = $appgrid_assets['logo-yaveo-web'];
        $es_color = $en_color = "style='color:#FFF'";
        if ($currentLang === 'es_ES') {
            $langKey  = "es_ES";
            $es_color = "style='color:#165477'";
        } else {
            $langKey  = "en_US";
            $en_color = "style='color:#165477'";
        }
       
        $tpoNavHtml = '<div id="menu" class="navbar navbar-inverse clearfix navbar-custom main_header" ng-style="navmenuStyle">
      <div id="logo" class="navbar-header navbar-left"> 
              <!-- LOGO IMAGE -->
<a href="' . $appBaseMenu . '" onclick="scrolltotop()"><img src="' . $logo . '" ng-show="showlogo" ></a>
      </div>
      <button class="btn menu-toggle-btn btn-primary navbar-toggle navbar-left" ng-click="collapsingMenu()" >
        <span>' . $this->GetMessage($langKey, "MENU", $messages) . '</span>
      </button>
      <div id="menuDesktop" class="navbar-collapse navbar-left navbarMenu desk_menu_drop">
        <ul class="nav navbar-nav ">';
        
        $tpoNavHtml  = $tpoNavHtml .$this->DesktopmenuHtml($rightNowTopMenu,$currentLang);

        $tpoNavHtml  = $tpoNavHtml . '<li class="search-icon"><a href="' . $appBaseMenu . '?action=search' . '" ><span class="icon-custom-search"></span></a></li>         
        </ul>
      </div>';
        
      $tpoNavHtml  = $tpoNavHtml .$this->getMobileMenu($rightNowTopMenu,$currentLang);
      
     $tpoNavHtml  = $tpoNavHtml . '<div class="navbar-header pull-right">

<ul class="nav navbar-nav pull-left">
            <li id="languageSelect">
              <span>
                <a   onclick="ChangeLanguage(\'es_ES\',\''.$langBasedUrl['es_ES'].'\''.')"'. $es_color .' >ESP</a>
                &nbsp;
                <a onclick="ChangeLanguage(\'en_US\',\''.$langBasedUrl['en_US'].'\''.')"' . $en_color .'>ENG</a>
              </span>
            </li>
          </ul>
          <ul class="nav navbar-nav pull-left navBarIcons help-lang-icons">
             <li class="search-icon searchMobile"><a href="#" ng-click="searchModal()"><span class="icon-custom-search"></span></a></li>
             <li class="help-icon"><a style="padding:20px 18px;" href="/"><span class="icon-custom-help"></span></a></li> 
          </ul>';
        $profileName = "";
        if (!empty($uid)) {
            $result = $this->getUserObjectAction($uid);
            if (!array_key_exists("errorMessage", $result)) {
                //print_r($result);
                $profileName = $this->getUsernameOrEmail($result['profile']);
            } else {
                
                $this->redirect()->toUrl($appBaseMenu);
            }
            //print_r($appBaseMenu)  ;
            $logoutUrl  = $appBaseMenu . '?action=logout';
            $adminUrl   = $appBaseMenu . '?action=admin';
            $tpoNavHtml = $tpoNavHtml . '<ul class="nav navbar-nav pull-left navBarIcons"   style="background-color:#2E332F;border-right:#3F4548;">
                <li id="selectable" class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <span class="icon-custom-user"></span>
                  <label style="padding-left:10px" class="ng-binding">' . $profileName . '</label>
                  </a>
                  <ul class="dropdown-menu" id="logoutmenu">
                    <span class="navlink"></span>                   
                    <li><a href="' . $logoutUrl . '" >Logout</a></li>
                  </ul>
                </li>
          </ul>
          <ul class="nav navbar-nav pull-left navBarIcons hidden-xs" style="background-color:#2E332F">
              <li style=" display: inline; border-left: 2px solid;border-color:#4D5459; padding-left: 0.3em;">
                <a href="' . $adminUrl . '" >
                  <span class="icon-custom-admin"></span>
                </a>
              </li>
          </ul>';
        } else {
            $loginUrl   = $appBaseMenu . '?action=login';
            $signUpUrl  = $appBaseMenu . '?action=signup';
            $tpoNavHtml = $tpoNavHtml . '<ul style="display:none" class="nav navbar-nav pull-left navBarIcons hidden-xs" style="background-color:#2E332F">
              <li style=" display: inline; border-left: 2px solid;border-color:#4D5459; padding-left: 0.3em;">
                <a href="#" >
                  <span class="icon-custom-admin"></span>
                </a>
              </li>
          </ul>
          <div class="nav navbar-nav pull-left visible-md visible-lg visible-sm" >
              <a class="btn btnGrey btn-default navbar-btn login" href="' . $loginUrl . '" id="login">' . $this->GetMessage($langKey, "BTN_ADMIN_LOGIN_WATCHLIST", $messages) . '</a>
              <a class="btn btnOrange btn-default navbar-btn signup" href="' . $signUpUrl . '" id="signup">' . $this->GetMessage($langKey, "TXT_TOP_TOOLBAR_LIVE_SIGNUP_EXISTING_ACCOUNT", $messages) . '</a>
            
          </div>';
        }
        $tpoNavHtml = $tpoNavHtml . '</div>     
    </div>';
        return $tpoNavHtml;
    }         
    
}