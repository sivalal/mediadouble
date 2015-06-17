<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class GenreController extends AbstractActionController
  {
    
    public function GenreListAction()
      {
        try
          {
            $genre                = $this->params()->fromQuery('genre');
            $account_token        = $this->params()->fromQuery('account_token');
            $count                = 10;
            $this->ondemandObj    = $this->getServiceLocator()->get('ondemand');
            $image_shack_url      = $this->CreateShackURL();
            if($genre=="all")
            {
              $details              = $this->ondemandObj->getAllGenreList(1,$count);
            }
            else
            $details              = $this->ondemandObj->getGenreList($genre, 1, $count);
            $searchResultArray    = array();
            $entitlement_contents = array();

            if ($account_token)
              {
                $this->searchObj = $this->getServiceLocator()->get('search');
                $entitlementList = $this->searchObj->getEntitlements($account_token);
                if (!empty($entitlementList) && isset($entitlementList['entitlements']))
                  {
                    $entitlement_contents = $entitlementList['entitlements'];
                  }
              }            
            if ($details && $details->Results->Count > 0)
              {
                foreach ($details->Results->Results as $key => $result)
                  {
                    $showFlag = true;
                   $item_details["id"]    = $result->Title->Id;
                   $item_details["title"] = $result->Title->Title;
                    $item_details["source"]        = $this->GetSPType($result->Title->TitleType);
                    $item_details['imagePath'] = $image_shack_url . BASE_URL . '/dummy/blank_image.png';
                    if ($details->Results->Results[0]->Title->Assets->Count > 0)
                      {
                        $assets = $result->Title->Assets->Assets[0]->Attributes;
                        if ($assets->Count > 0)
                          {
                            
                            foreach ($assets->Attribute as $videoAsset)
                              {
                                // if ($videoAsset->Key == "embed_code" && !empty($videoAsset->Value[0]))
                                //   {
                                //     $item_details['content_id'] = $videoAsset->Value[0];
                                //   }else
                                 if ($videoAsset->Key == "preview_thumb_320x240" && !empty($videoAsset->Value[0]))
                                  {
                                    $item_details['imagePath'] = $image_shack_url . $videoAsset->Value[0];
                                    
                                  }
                                else if ($videoAsset->Key == "thumbnail" && !empty($videoAsset->Value[0]))
                                  {
                                    $item_details['imagePath'] = $image_shack_url . $videoAsset->Value[0];
                                    
                                  }
                                   else if ($videoAsset->Key == "tiers" && !empty($videoAsset->Value[0]))
                              {
                                $tier = $videoAsset->Value[0];
                                foreach ($entitlement_contents as $key1 => $entitlement)
                                  {
                                    $showFlag = false;
                                    if ($entitlement['id'] == $tier)
                                      {
                                        $showFlag = true;
                                        break;
                                      }
                                  }
                                
                              }
                              }
                          }
                      }
if($showFlag)
  $searchResultArray[$key]=$item_details;

                  }
              }
            
            $response = $this->getResponseWithHeader();
            $response->setContent(json_encode($searchResultArray));
            return $response;
          }
        catch (\Exception $e)
          {
            
          }
      }
    
    public function CreateShackURL()
      {
        $this->appviewAdapterObj = $this->getServiceLocator()->get('appconfig');
        $imageMetaDetails        = $this->appviewAdapterObj->getImageMetaDetails();
        $image_shack_url         = '';
        if (!empty($imageMetaDetails['imageshackBaseurl']))
          {
            $image_shack_url = $imageMetaDetails['imageshackBaseurl'] . '/' . $imageMetaDetails['deviceArr']['webDesktop']['rail.small'] . '/';
          }
        return $image_shack_url;
      }
    
    
    public function GetSPType($TitleType)
      {
        
        switch ($TitleType)
        {
            case '1':
                $content_type = "feature film";
                $category     = "movie";
                break;
            case '2':
                $content_type = "tv series";
                $category     = "tvShow";
                break;
            case '3':
                $content_type = "short film";
                $category     = "movie";
                break;
            case '4':
                $content_type = "tv season";
                $category     = "tvShow";
                break;
            case '5':
                $content_type = "tv episode";
                $category     = "tvShow";
                break;
            case '6':
                $content_type = "tv show";
                $category     = "tvShow";
                break;
            default:
                $content_type = "movie";
                $category     = "movie";
                break;
        }
        return $category;
      }
    
    
    public function GenrePosterListAction()
      {
        try
          {
            $this->ondemandObj = $this->getServiceLocator()->get('ondemand');
            $this->searchObj   = $this->getServiceLocator()->get('search');
            //to be replaced with value from appgrid
            $image_shack_url   = "http://imagizer.imageshack.us/256x144/";
            $searchResultArray = array();
            $details           = $this->ondemandObj->getDataByID('9mM3V4bTqvwI0l0t2_kMS6souT9MuxvR');
            for ($key = 0; $key < 5; $key++)
              {
                $searchResultArray[$key] = $this->searchObj->GenericSearchParser_SingleResult($details, $image_shack_url);
                // $searchResultArray[$key]=$this->GenreicSearchParser_SingleResult($details);
              }
            $response = $this->getResponseWithHeader();
            $response->setContent(json_encode($searchResultArray));
            return $response;
          }
        catch (\Exception $e)
          {
            print_r($e);
            die();
          }
      }
    
    
    
    public function getResponseWithHeader()
      {
        $response = $this->getResponse();
        $response->getHeaders()->addHeaderLine('Access-Control-Allow-Origin', '*')->addHeaderLine('Access-Control-Allow-Methods', 'POST GET')->addHeaderLine('Content-type', 'application/json');
        return $response;
      }
  }