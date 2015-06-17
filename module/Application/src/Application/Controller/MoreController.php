<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

use Zend\Http\Client;

class MoreController extends AbstractActionController
{

    public function getChannelsAction(){
        $page = $this->params()->fromQuery('q');
        switch ($page) {
            case 'network':
                $bannerTitle = "Networks";
                break;
            case 'news':
                $bannerTitle = "News";
                break;
            case 'entertainment':
                $bannerTitle = "Entertainment";
                break;            
            case 'sports':
                $bannerTitle = "Sports";
                break;            
            case 'kids':
                $bannerTitle = "Kids";
                break;            
            default:
                $bannerTitle = "Unknown";
                break;
        }


        $appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $pageDetails = $appviewAdapterObj->getPageDetails('network_channels');
    //    echo "<pre>"; print_r($pageDetails["items"]); die;
        $data = $pageDetails["items"];
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }

    public function getProgramsAction(){
        $appviewAdapterObj   = $this->getServiceLocator()->get('appconfig');
        $imageMetaDetails = $appviewAdapterObj->getImageMetaDetails();
        $queryoptions           = $this->params()->fromQuery('queryoptions');
        $accountToken           = $this->params()->fromQuery('accountToken');
        $qParams = json_decode($queryoptions,true);
        if(!empty($qParams["network"]))
            $page = $qParams["network"];
        elseif(!empty($qParams["collections"][0]))
            $page = $qParams["collections"][0];
        else
            $page = '';
        switch ($page) {
            case 'Univision':
                $bannerTitle = "Univision";
                break;
            case 'Flixlatino':
                $bannerTitle = "Flixlatino";
                break;            
            case 'Olympusat':
                $bannerTitle = "Olympusat";
                break;            
            case 'Sports':
                $bannerTitle = "Sports";
                break;            
            case 'All_Kids_All_All':
                $bannerTitle = "Kids";
                break;            
            case 'All_Entertainment_All_All':
                $bannerTitle = "Entertainment";
                break;            
            case 'News':
                $bannerTitle = "News";
                break;            
            default:
                $bannerTitle = "Unknown";
                break;
        }


        $config = $this->getServiceLocator()->get('Config');
        $base = BASE_URL;
/**************************/
        if(!isset($accountToken)){
            $accountToken=NULL;
        }
        $this->searchAdapterObj = $this->getServiceLocator()->get('search');
        $response               = $this->getResponseWithHeader();
        if (empty($queryoptions)){
            $queryoptions = "";
        }
        
        $searchContentArr = $this->searchAdapterObj->getRailsSearchCollectionResults(NULL, $queryoptions);
        if($searchContentArr['ApiResponseStatus']!=200) {
            $response->setStatusCode($searchContentArr['ApiResponseStatus']);
            $response->setContent($searchContentArr['response']);
            return $response;
        }
        $decodedSearchContentArr=json_decode($searchContentArr['response'],true);
        if(!empty($decodedSearchContentArr['errors'])){ //200 with errors from search api
            $data = array(
                'error' => 'error from search api',
                'response'=> $searchContentArr['response']
            );

            $response->setStatusCode(200)->setContent(json_encode($data));
            return $response;            
        }
        $parsedResponse = $this->searchAdapterObj
                ->RailsShortCollectionResults($decodedSearchContentArr, $accountToken, array());

        
        if ($parsedResponse == NULL) {
            $data = array(
                'error' => 'no results for current query from search api',
                'response'=> $searchContentArr['response']
            );
        } else{
            $data = "";
        }
        
        $dataListArr = array(
            "programListArr"=>array(
                "bannerTitle"=>$bannerTitle,
                "bannerImg"=>"${base}/dummy/banner_promotion.jpg",
                "programs" => $parsedResponse,
                "error" => $data
            )
        );
        $response->setContent(json_encode($dataListArr));
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
