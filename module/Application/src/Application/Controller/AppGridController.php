<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

use Zend\View\Model\JsonModel;



class AppGridController extends AbstractActionController
{

    public function testSHMAction() {
              $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
            $this->appviewAdapterObj->testSHM();
            $response  = $this->getResponseWithHeader();
            $response->setContent(json_encode(array('testing'=>'ok')));      
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
    
  public function pageMetaDataAction() {
 
        $response  = $this->getResponseWithHeader();
        $pageName  = $this->params()->fromQuery('p');
        /*
        $config = $this->getServiceLocator()->get('Config');
        $appConfig_PageName_PageId_arr = array_flip($config['mainmenu']);
        
        if(!isset($appConfig_PageName_PageId_arr["/".$pageName]))
        {
           $data = array('error' => 'Invalid pageName');
           $response->setStatusCode(500)->setContent(json_encode($data));
           return $response;
        }
        
        $pageId=$appConfig_PageName_PageId_arr["/".$pageName];
         
         */
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');

        $pageId=$pageName;
        $pagedataArr = $this->appviewAdapterObj
                ->getRailsApiCallDetailsList($pageId);

   /*     if(empty($raildataArr['railsArr'])){
            $msg=$pageId.'pageID not found in appgrid "pages" json array';
            $data = array('error' => $msg);
           $response->setStatusCode(500)->setContent(json_encode($data));
           return $response;            
        }
     */   
        $data=array(
         "railList"=>$pagedataArr['railsArr'],
         "showcaseQuery"=>$pagedataArr['showcaseQuery']
        );
        $response->setContent(json_encode($data));      
        return $response;
  }

  public function appgridAssetDataTestAction(){
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $asset  = $this->params()->fromQuery('assetkey');
        $respdata = $this->appviewAdapterObj->appgridAssetData($asset);
         //$response = $this->getResponseWithHeader();
        $response = $this->getResponse();
        $response->getHeaders()
                 ->addHeaderLine('Access-Control-Allow-Origin','*')
                 ->addHeaderLine('Access-Control-Allow-Methods','POST GET');
         $response->setContent($respdata);
        return $response;
  }
  

  
  public function statusAction(){
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $appStatusArr = $this->appviewAdapterObj->getAppStatus();  
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($appStatusArr));
        return $response;
  }

  public function playerErrorAction(){
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $playerErrorArr = $this->appviewAdapterObj->getPlayerErrors();  
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($playerErrorArr));
        return $response;
  }
  
  public function appAssetsAction(){
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $appStatusArr = $this->appviewAdapterObj->getAppAssets();
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($appStatusArr));
        return $response;
  }  
  public function getImageMetaDetailsAction()
  {
     $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $appStatusArr = $this->appviewAdapterObj->getImageMetaDetails();  
  

        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($appStatusArr));
        return $response;
  }
  public function regionAction(){
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $getGeodetailsArr = $this->appviewAdapterObj->getGeodetails();  
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($getGeodetailsArr));
        return $response;
  }
    public function indexAction(){
        // $paramsKey         = $this->params()->fromQuery('q');
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $metadataArr = $this->appviewAdapterObj->getMetadata(false);
   //$menuArr=$this->appviewAdapterObj->getMenuDetails();
     //   print_r($this->appviewAdapterObj->getRailsApiCallDetailsList(2)); //2-->featured page home
           //echo '<pre>';
           //print_r($metadataArr);
           //die();
        $response         = $this->getResponseWithHeader();
        $response->setContent($metadataArr);
        return $response;
    }
    
    public function getMainNavMenuAction(){
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $config = $this->getServiceLocator()->get('Config');
        //$appConfigMainmenu = $config['mainmenu'];
        //$mainMenu=  $this->appviewAdapterObj->directvMenus($appConfigMainmenu);
        $mainMenu=$this->appviewAdapterObj->getMenuDetails();
        $newmenu=array();
        if(!empty($mainMenu)){
            if(!empty($mainMenu['menu'])){
                foreach ($mainMenu['menu'] as $value) {
                    if(isset($value['actionID']) && !empty($value['actionID']) && $value['actionID']!='home')
                        $newmenu[]=$value;
                }
            }
        }
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($newmenu));
        return $response;
        
    }

        public function getPageDetailsAction(){
        $pageName  = $this->params()->fromQuery('page');
        $this->appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
         $pageData=  $this->appviewAdapterObj->getPageDetails($pageName);
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($pageData));
        return $response;
    }
    
    
    public function getMovieRailsAction(){
        $data = array( 
            "thumblistCarouselOneArr"=>array(
            array(
                "ImageID"=> 1,
                "title"=> "Super 8",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"RicmZxbTrbyLXMGzmZn1JOPhwGeZZSkF"
            ),
            array(
                "ImageID"=> 2,
                "title"=> "Iron Man",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/4.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"I3dGgzbTq4mQhs61caOJmQD5hMLH8mTc"
            ),
            array(
                "ImageID"=> 3,
                "title"=> "Iron Man 3",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "dummy/3.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"pvN3VkbTr9lW55HthYbx964rQbObLDkx"
            ),
            array(
                "ImageID"=> 4,
                "title"=> "Ghost Rider",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/4.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=>5 ,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/2.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=> 6,
                "title"=> "Super 8",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=> 7,
                "title"=> "Iron Man 3",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=> 8,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=> 9,
                "title"=> "Super 8",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/2.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=>10 ,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=> 11,
                "title"=> "Iron Man",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/4.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=> 12,
                "title"=> "Iron Man 3",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            ),
            array(
                "ImageID"=> 13,
                "title"=> "Super 8",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"41NmEzbTotdjZ9ybkuaukVZpaJhAJ-x1"
            )
           )
         );
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }
    
    public function getTvRailsAction(){
        $data = array( 
            "thumblistCarouselOneArr"=>array(
            array(
                "ImageID"=> 1,
                "title"=> "Game of Thrones",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"0wMXQ2bToyWjz30DrA8QdjmMeBLbPTf6"
            ),
            array(
                "ImageID"=> 2,
                "title"=> "The Walking Dead",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/4.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"8zMWhoazqrxaey7_aflsYm0v0pM8bUOS"
            ),
            array(
                "ImageID"=> 3,
                "title"=> "Fargo",
                "desc"=> "This is summary of Fargo",
                "imagePath"=> "dummy/3.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            ),
            array(
                "ImageID"=> 4,
                "title"=> "Arrow",
                "desc"=> "This is summary of Arrow",
                "imagePath"=> "dummy/4.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"0wMXQ2bToyWjz30DrA8QdjmMeBLbPTf6"
            ),
            array(
                "ImageID"=>5 ,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/2.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"8zMWhoazqrxaey7_aflsYm0v0pM8bUOS"
            ),
            array(
                "ImageID"=> 6,
                "title"=> "Arrow",
                "genre"=> "ADVENTURE",
                "desc"=> "Arrow (2012 TV Series) ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            ),
            array(
                "ImageID"=> 7,
                "title"=> "Iron Man 3",
                "genre"=> "ACTION",
                "desc"=> "Arrow (2012 TV Series ) ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            ),
            array(
                "ImageID"=> 8,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            ),
            array(
                "ImageID"=> 9,
                "title"=> "Super 8",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/2.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            ),
            array(
                "ImageID"=>10 ,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            ),
            array(
                "ImageID"=> 11,
                "title"=> "Iron Man",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/4.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            ),
            array(
                "ImageID"=> 12,
                "title"=> "Iron Man 3",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            ),
            array(
                "ImageID"=> 13,
                "title"=> "Super 8",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"NqMWhoazopb0NegiYSj02bKu2YKsXK7P"
            )
           )
         );
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }

    public function getLiveRailsAction(){
        $data = array( 
            "thumblistCarouselOneArr"=>array(
            array(
                "ImageID"=> 1,
                "title"=> "Ghost Rider",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=> 2,
                "title"=> "The Walking Dead",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/4.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"V3cmw0bTriNveZHhHWunrwLghvioXBwz"
            ),
            array(
                "ImageID"=> 3,
                "title"=> "Fargo",
                "desc"=> "This is summary of Fargo",
                "imagePath"=> "dummy/3.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"9rbnI0bTpTR-vlvr7zafpKaI8_L-n6bb"
            ),
            array(
                "ImageID"=> 4,
                "title"=> "Arrow",
                "desc"=> "This is summary of Arrow",
                "imagePath"=> "dummy/4.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=>5 ,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/2.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"V3cmw0bTriNveZHhHWunrwLghvioXBwz"
            ),
            array(
                "ImageID"=> 6,
                "title"=> "Arrow",
                "genre"=> "ADVENTURE",
                "desc"=> "Arrow (2012 TV Series) ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=> 7,
                "title"=> "Iron Man 3",
                "genre"=> "ACTION",
                "desc"=> "Arrow (2012 TV Series ) ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=> 8,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=> 9,
                "title"=> "Super 8",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/2.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=>10 ,
                "title"=> "Ghost Rider",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=> 11,
                "title"=> "Iron Man",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/4.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=> 12,
                "title"=> "Iron Man 3",
                "genre"=> "ACTION",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/1.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-04-2014",
                "staring"=>"Mike,Alex,Joe",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            ),
            array(
                "ImageID"=> 13,
                "title"=> "Super 8",
                "genre"=> "ADVENTURE",
                "desc"=> "Sample description ",
                "details"=> "Sample description for the movie Super 8. Sample description for the movie Super 8.Sample description for the movie Super 8.",
                "imagePath"=> "dummy/3.png",
                "duration"=>"114",
                "rating"=> "PG 13",
                "airedOn"=>"1-03-2014",
                "staring"=>"Nicholas Hoult, Stanley Tucci, Evan McGregor",
                "director"=> "Bryan Singer",
                "creator"=>"steve",
                "audio"=>"Spanish, English",
                "company"=> "WARNER BROS",
                "contentID"=>"A1b3I0bTo5QOVWPyWD1Mnp12BVzVsxsM"
            )
           )
         );
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }
}