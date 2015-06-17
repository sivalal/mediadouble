<?php
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Directv\Ooyala\OoyalaAPI;
use Directv\Mailer;

class LiveController extends AbstractActionController
{
  public function getTrackAction() {
    $data              = array();
    $trackParams       = array();
    $trackAssestParams = array();
    $parameters        = array();
    $missingIds        = array();
    $baseUrl           = BASE_URL;
    $ondemandObj       = $this->getServiceLocator()->get('ondemand');
    $config            = $this->getServiceLocator()->get('Config');
    $externalApiObj    = $this->getServiceLocator()->get('externalApi');
    $apiKey            = $config['ooyala']['backlot_api_key'];
    $secretKey         = $config['ooyala']['backlot_secret_key'];
    $response          = $this->getResponseWithHeader();

    //get tracks-----------------------------------------------------------------------------------------------------------------------------------
    $requestPathForTracks = $config['general_routes']['liveStream']['tracks'];
    $tracksUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTracks, $parameters, EPG);//OAL_LIVE --> EPG
    $tracksResponse       = $externalApiObj->callHttpUtilityService($tracksUrl);

    //get tracks assest-----------------------------------------------------------------------------------------------------------------------------------
    $requestPathForTrackAssest  = $config['general_routes']['liveStream']['track_assets']['path'];
    $trackAssestParams["where"] = $config['general_routes']['liveStream']['track_assets']['query_param'];
    $tracksAssestUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTrackAssest, $trackAssestParams, EPG);//OAL_LIVE --> EPG
    $tracksAssestResponse       = $externalApiObj->callHttpUtilityService($tracksAssestUrl);
    $requiredChannels           = $this->listEntitledLiveChannels($tracksResponse['responseContent']['items']);

    if($tracksAssestResponse['responseStatus'] == 200) {
      if(!empty($tracksAssestResponse['responseContent']['items'])) {
        foreach ($tracksAssestResponse['responseContent']['items'] as $trackAssetKey => $trackAssetValue) {
          if(!empty($tracksResponse['responseContent']['items'])) {

            foreach ($requiredChannels as $trackKey => $trackValue) {
              if(isset($trackValue['live_stream_asset_id'])) {
                if($trackAssetValue['embed_code'] == $trackValue['live_stream_asset_id']) {

                  $data['thumblistCarouselOneArr'][$trackAssetKey]['title']      = isset($trackAssetValue['name']) ? $trackAssetValue['name'] : '';
                  $data['thumblistCarouselOneArr'][$trackAssetKey]['channelId']  = isset($trackValue['id']) ? $trackValue['id'] : '';
                  $data['thumblistCarouselOneArr'][$trackAssetKey]['embed_code'] = isset($trackAssetValue['embed_code']) ? $trackAssetValue['embed_code']: '';
                  $data['thumblistCarouselOneArr'][$trackAssetKey]['imagePath']  = isset($trackAssetValue['preview_image_url']) ? $trackAssetValue['preview_image_url']: "dummy/blank_image.png";
                  $data['thumblistCarouselOneArr'][$trackAssetKey]['show_type']  = "live";
                  $data['thumblistCarouselOneArr'][$trackAssetKey]['isEntitled']  = isset($trackValue['isEntitled']) ? $trackValue['isEntitled'] : false;

                }
              }else if(isset($trackValue['error'])){
                if(!in_array($trackValue['error'],$missingIds)){
                  array_push($missingIds,$trackValue['error']);
                }
                $data['error'] = $missingIds;
              }
            }
          }
        }
      }
    } else {
      $data = array(
        'error' => 'no results form channel api',
        'response' => $tracksAssestResponse['responseContent']
      );
    }
    $response->setContent(json_encode($data));
    return $response;
  }

   public function getEntitlements($asset_id) {
       //$asset_id="k0MXBwcTrFGLh2HWZJ4VqPOZdYDm9MB2";
       $requestPath="/v2/assets/" . $asset_id . "/labels";
       $externalApiAdapter = $this->getServiceLocator()->get('externalApi');
       $url=$externalApiAdapter->generateOoyalaApiUrlWithSignature($requestPath);
       $res=$externalApiAdapter->callHttpUtilityService($url);
       return $res['responseContent'];
    }


    public function listEntitledLiveChannels($live_channels) {
        // get list of tier label the user has entitlements to
        //$entitled_tiers = $this->listEntitlementsForUserPerLabel();
        //$entitled_tiers=["11fb87ee7a5544ce9261b6cc71afa8fe","20e8583806ba463e96bb8831df8e7f7e","26166739c83648938a6932ef8d89955a","32186ba7bcdd466aa89d9dcdfbbe8ec7","91e2e878e0d44595a70e6d2d59345fe3"];
        $externalApiObj        = $this->getServiceLocator()->get('externalApi');
        $tiersqueryoptions = $externalApiObj->decryptAndGetCookie('entitlement_list');
        $tiers="";
        if(!empty($tiersqueryoptions)){
            $tiers="{".$tiersqueryoptions."}";
        }
        $entitled_tiers_val=json_decode($tiers);
        $entitled_tiers=(!empty($entitled_tiers_val->tiers))?$entitled_tiers_val->tiers:array();//["20e8583806ba463e96bb8831df8e7f7e" ];

        //$entitled_tiers=["20e8583806ba463e96bb8831df8e7f7e" ];
        foreach ($live_channels as $Key =>  $channel) {
          // get a list of labels associated to the asset
          if(isset($channel['live_stream_asset_id'])){
            $channel_labels = $this->getEntitlements($channel['live_stream_asset_id']);
            // Check if any of the labels is in the list of users tier labels
            if($channel_labels!="" && $channel_labels!=null &&!empty($channel_labels['items'])){
              foreach ($channel_labels['items'] as $channel_label) {
                  foreach ($entitled_tiers as $entitled_tier) {
                      if ($channel_label['id'] == $entitled_tier) {
                          //echo "User has entitlements for " . $channel->name;
                          $channel['isEntitled']=true;
                          break;
                      }else{
                          $channel['isEntitled']=false;
                      }
                  }
                  if(isset($channel['isEntitled']) && $channel['isEntitled'] == true){
                      break;
                  }
              }
              $live_channels[$Key]=$channel;
            }
          }else{
            $channel['error'] = "live_stream_asset_id missing for ".$channel['name']." with ID : ".$channel['id'] ;
            $live_channels[$Key]=$channel;
          }
        }
        return $live_channels;
    }





  public function getTrackSegmentsAction() {
    $channelData       = array();
    $parameters        = array();
    $date              = $this->params()->fromQuery('date');
    $startTime         = $this->params()->fromQuery('startTime');
    $endTime           = $this->params()->fromQuery('endTime');
    $ondemandObj       = $this->getServiceLocator()->get('ondemand');
    $externalApiObj    = $this->getServiceLocator()->get('externalApi');
    $config            = $this->getServiceLocator()->get('Config');
    $apiKey            = $config['ooyala']['backlot_api_key'];
    $secretKey         = $config['ooyala']['backlot_secret_key'];
    $response          = $this->getResponseWithHeader();

    //get tracks-----------------------------------------------------------------------------------------------------------------------------------
    $requestPathForTracks = $config['general_routes']['liveStream']['tracks'];
    $tracksUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTracks, $parameters, EPG);
    $tracksResponse       = $ondemandObj->genericSendRequest($tracksUrl);
    //get tracks assest-----------------------------------------------------------------------------------------------------------------------------------
    $requestPathForTrackAssest  = $config['general_routes']['liveStream']['track_assets']['path'];
    $trackAssestParams["where"] = $config['general_routes']['liveStream']['track_assets']['query_param'];
    $tracksAssestUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTrackAssest, $trackAssestParams, EPG);
    //$tracksAssestResponse       = $ondemandObj->genericSendRequest($tracksAssestUrl);

    //get track segments---------------------------------------------------------------------------------------------------------------------------
    $requestPathForTrackSegments = $config['general_routes']['liveStream']['track_segments'];
    $parameters["include"]       = "virtual_asset,virtual_asset.metadata";
    $parameters["from_time"]     = $date.'T'.$startTime.'Z';
    $parameters["to_time"]       = $date.'T'.$endTime.'Z';
    $trackSegmentsUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTrackSegments, $parameters, EPG);//OAL_LIVE --> EPG
    //$trackSegmentsResponse       = $externalApiObj->callHttpUtilityService($trackSegmentsUrl);
    $trackSegmentsResponse   = $ondemandObj->genericSendRequest($trackSegmentsUrl);

    if($tracksResponse['responseStatus'] == 200 && $trackSegmentsResponse['responseStatus'] == 200) {

              if(!empty($tracksResponse['responseContent']['items'])) {
            foreach ($tracksResponse['responseContent']['items'] as $trackKey => $trackValue) {

             if(isset($trackValue['id'])) {
                  if(!empty($trackSegmentsResponse['responseContent']['items'])) {
                    foreach ($trackSegmentsResponse['responseContent']['items'] as $segmentKey => $segmentValue) {

                      if(isset($segmentValue['track_id'])) {
                        if($segmentValue['track_id'] == $trackValue['id']) {

                          $segmentValue['start_time'] = $ondemandObj->convertDateTimeWithAtomFormat($segmentValue['start_time']);
                          $segmentValue['end_time']   = $ondemandObj->convertDateTimeWithAtomFormat($segmentValue['end_time']);
                          if($segmentValue['end_time'] < $segmentValue['start_time']) {
                            $segmentValue['end_time']  = date("H:i:s", strtotime('+30 mins', strtotime($segmentValue['start_time'])));
                          }
                          $channelData[$trackKey]['segments'][$segmentKey] = $segmentValue;
                          $timeSlotGroupArr[]  = $ondemandObj->timeSlotCalculation($segmentValue['start_time'], $segmentValue['end_time']);
                        }
                      }
                    }
                  }
                }
              }
            }

    // if(!empty($trackSegmentsResponse['responseContent']['items'])) {
    //   foreach ($trackSegmentsResponse['responseContent']['items'] as $segmentKey => $segmentValue) {
    //     $channelData[$segmentKey]  = $segmentValue;
    //   }
    // }
  }
  $slot_ref = 0;
  $data['max_time_slot']=null;
      if(!empty($timeSlotGroupArr)) {
      $maxTimeSlot = $ondemandObj->getMaximumTimeSlots($timeSlotGroupArr);
      if(!empty($channelData)) {
        //to parse segments based on track--------------------------------------------------------------------------
        foreach ($channelData as $channelKey => $channelValue) {
          if(!empty($channelValue['segments'])) {
            for($slot = reset($maxTimeSlot); $slot <= end($maxTimeSlot); $slot = strtotime('+30 minutes', $slot)){
              foreach ($channelValue['segments'] as $segmentKey => $segmentValue) {
                if(isset($segmentValue['track_id'])) {
                  $segmentStartTime = strtotime($segmentValue['start_time']);
                  $segmentEndTime   = strtotime($segmentValue['end_time']);
                  $data['channels'][$channelKey]['channel_id']  = $segmentValue['track_id'];

                    if($slot == $segmentStartTime) {

                      $segmentStartTime2 = $segmentStartTime;
                      $segmentEndTime2   = $segmentEndTime;

                      $slot_time_diff = $segmentEndTime - $segmentStartTime;
                      $remainder = $slot_time_diff % 1800;
                      $remainder2=0;
                      if(($remainder > 0) && ($remainder > 900)){
                        $slot_ref = 1;
                        $remainder2 = $remainder % 900;
                        $segmentEndTime2 = $segmentEndTime-$remainder2;
                      }
                      else if(($remainder > 0) && ($remainder2 < 900)){
                        $slot_ref = 2;
                        $segmentStartTime2 = $segmentStartTime-$remainder2;
                      }

                      $data['channels'][$channelKey]['programs'][$slot]          = $segmentValue;
                      $data['channels'][$channelKey]['programs'][$slot]['rows']  = $ondemandObj->rowCalculation($segmentStartTime2, $segmentEndTime2);
                      $slot = $segmentEndTime;
                     } else {
                        if($slot_ref == 1){
                           $data['channels'][$channelKey]['programs'][$segmentEndTime2]['rows'] = $ondemandObj->rowCalculation($segmentEndTime2,$segmentStartTime);
                           $slot_ref = 0;
                        }
                      $data['channels'][$channelKey]['programs'][$slot]['rows'] = 1;
                    }
                }
              }
            }
          }
        }
        array_pop($maxTimeSlot);
      }
      $data['max_time_slot'] = $ondemandObj->convertStrtotimeToSpecifiedTimeFormat($maxTimeSlot);
    }
    $response->setStatusCode($trackSegmentsResponse['responseStatus'])->setContent(json_encode($data));
   // $response->setContent(json_encode($channelData));
    return $response;
  }

  public function getTrackSegmentsTestAction() {
    $channelData       = array();
    $parameters        = array();
    $date              = $this->params()->fromQuery('date');
    $startTime         = $this->params()->fromQuery('startTime');
    $endTime           = $this->params()->fromQuery('endTime');
    $ondemandObj       = $this->getServiceLocator()->get('ondemand');
    $config            = $this->getServiceLocator()->get('Config');
    $apiKey            = $config['ooyala']['backlot_api_key'];
    $secretKey         = $config['ooyala']['backlot_secret_key'];
    $response          = $this->getResponseWithHeader();
    //get tracks-----------------------------------------------------------------------------------------------------------------------------------
    $requestPathForTracks = $config['general_routes']['liveStream']['tracks'];
    $tracksUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTracks, $parameters, EPG);//OAL_LIVE --> EPG
    $tracksResponse       = $ondemandObj->genericSendRequest($tracksUrl);

    //get tracks assest-----------------------------------------------------------------------------------------------------------------------------------
    $requestPathForTrackAssest  = $config['general_routes']['liveStream']['track_assets']['path'];
    $trackAssestParams["where"] = $config['general_routes']['liveStream']['track_assets']['query_param'];
    $tracksAssestUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTrackAssest, $trackAssestParams, EPG);//OAL_LIVE --> EPG
    $tracksAssestResponse       = $ondemandObj->genericSendRequest($tracksAssestUrl);

    //get track segments---------------------------------------------------------------------------------------------------------------------------
    $requestPathForTrackSegments = $config['general_routes']['liveStream']['track_segments'];
    $parameters["include"]       = "virtual_asset,virtual_asset.metadata";
    $parameters["from_time"]     = $date.'T'.$startTime.'Z';
    $parameters["to_time"]       = $date.'T'.$endTime.'Z';
    $trackSegmentsUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTrackSegments, $parameters, EPG);//OAL_LIVE --> EPG
    $trackSegmentsResponse       = $ondemandObj->genericSendRequest($trackSegmentsUrl);

    //to parse tracks based on assest--------------------------------------------------------------------------
    if($tracksAssestResponse['responseStatus'] == 200 && $tracksResponse['responseStatus'] == 200 && $trackSegmentsResponse['responseStatus'] == 200) {
      if(!empty($tracksAssestResponse['responseContent']['items'])) {
        $date = strtotime($date);
        foreach ($tracksAssestResponse['responseContent']['items'] as $trackAssetKey => $trackAssetValue) {
          if(!empty($tracksResponse['responseContent']['items'])) {
            foreach ($tracksResponse['responseContent']['items'] as $trackKey => $trackValue) {
              if(isset($trackValue['live_stream_asset_id'])) {
                if($trackAssetValue['embed_code'] == $trackValue['live_stream_asset_id']) {
                  $channelData[$trackAssetKey]['track']['title']      = isset($trackAssetValue['name']) ? $trackAssetValue['name'] : '';
                  $channelData[$trackAssetKey]['track']['id']         = isset($trackValue['id']) ? $trackValue['id'] : '';
                  $channelData[$trackAssetKey]['track']['embed_code'] = isset($trackAssetValue['embed_code']) ? $trackAssetValue['embed_code']: '';
                  $channelData[$trackAssetKey]['track']['img']        = isset($trackAssetValue['preview_image_url']) ? $trackAssetValue['preview_image_url']: "dummy/blank_image.png";
                  if(!empty($trackSegmentsResponse['responseContent']['items'])) {
                    foreach ($trackSegmentsResponse['responseContent']['items'] as $segmentKey => $segmentValue) {
                      if(isset($segmentValue['track_id'])) {
                        if($segmentValue['track_id'] == $trackValue['id']) {
                          $channelData[$trackAssetKey]['segment']['short_title']  = $segmentValue['virtual_asset']['metadata']['short_title'];
                          $channelData[$trackAssetKey]['segment']['program_type'] = $segmentValue['virtual_asset']['metadata']['program_type'];
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    $response->setStatusCode($trackSegmentsResponse['responseStatus'])->setContent(json_encode($channelData));
    return $response;
  }

  public function getSegmentsTestAction() {
    $channelData       = array();
    $data              = array();
    $parameters        = array();
    $timeSlotGroupArr  = array();
    $maxTimeSlot       = array();
    $baseUrl           = BASE_URL;
    $date              = $this->params()->fromQuery('date');
    $time              = $this->params()->fromQuery('time');
    $ondemandObj       = $this->getServiceLocator()->get('ondemand');
    $config            = $this->getServiceLocator()->get('Config');
    $apiKey            = $config['ooyala']['backlot_api_key'];
    $secretKey         = $config['ooyala']['backlot_secret_key'];
    $response          = $this->getResponseWithHeader();
    //get tracks-----------------------------------------------------------------------------------------------------------------------------------
    $requestPathForTracks = $config['general_routes']['liveStream']['tracks'];
    $tracksUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTracks, $parameters, EPG);//OAL_LIVE --> EPG
    $tracksResponse       = $ondemandObj->genericSendRequest($tracksUrl);

    //get tracks assest-----------------------------------------------------------------------------------------------------------------------------------
    $requestPathForTrackAssest  = $config['general_routes']['liveStream']['track_assets']['path'];
    $trackAssestParams["where"] = $config['general_routes']['liveStream']['track_assets']['query_param'];
    $tracksAssestUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTrackAssest, $trackAssestParams, EPG);//OAL_LIVE --> EPG
    $tracksAssestResponse       = $ondemandObj->genericSendRequest($tracksAssestUrl);

    //get track segments---------------------------------------------------------------------------------------------------------------------------
    $requestPathForTrackSegments = $config['general_routes']['liveStream']['track_segments'];
    $parameters["include"]       = "virtual_asset,virtual_asset.metadata";
    $parameters["from_time"]     = $date.'T00:00:00Z';
    $parameters["to_time"]       = $date.'T24:00:00Z';
    $trackSegmentsUrl            = $ondemandObj->generateUrlWithValidSignature('GET', $apiKey, $secretKey, $requestPathForTrackSegments, $parameters, EPG);//OAL_LIVE --> EPG
    $trackSegmentsResponse       = $ondemandObj->genericSendRequest($trackSegmentsUrl);

    //to parse tracks based on assest--------------------------------------------------------------------------
    if($tracksAssestResponse['responseStatus'] == 200 && $tracksResponse['responseStatus'] == 200 && $trackSegmentsResponse['responseStatus'] == 200) {
      if(!empty($tracksAssestResponse['responseContent']['items'])) {
        $date = strtotime($date);
        foreach ($tracksAssestResponse['responseContent']['items'] as $trackAssetKey => $trackAssetValue) {
          $channelData[$trackAssetKey]  = $trackAssetValue;
          if(!empty($tracksResponse['responseContent']['items'])) {
            foreach ($tracksResponse['responseContent']['items'] as $trackKey => $trackValue) {
              if(isset($trackValue['live_stream_asset_id'])) {
                if($trackAssetValue['embed_code'] == $trackValue['live_stream_asset_id']) {
                  if(!empty($trackSegmentsResponse['responseContent']['items'])) {
                    foreach ($trackSegmentsResponse['responseContent']['items'] as $segmentKey => $segmentValue) {
                      if(isset($segmentValue['track_id'])) {
                        if($segmentValue['track_id'] == $trackValue['id']) {
                          $startDatetime = $ondemandObj->convertDateTime5WithAtomFormat($segmentValue['start_time']);
                          $endDatetime   = $ondemandObj->convertDateTime5WithAtomFormat($segmentValue['end_time']);
                          if($startDatetime['date'] != $date){
                            $startDatetime['time'] = strtotime('00:00:00');
                          }
                          if($endDatetime['date'] != $date){
                            $endDatetime['time'] = strtotime('24:00:00');
                          }
                          if($endDatetime['time'] < $startDatetime['time']) {
                            $endDatetime['time']  = strtotime(date("H:i:s", strtotime('+30 mins', $startDatetime['time'])));
                          }
                          $segmentValue['start_time']       = $startDatetime['time'];
                          $segmentValue['end_time']         = $endDatetime['time'];
                          $channelData[$trackAssetKey]['segments'][$segmentKey]    = $segmentValue;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      $maxTimeSlot = $ondemandObj->timeSlotCalculation(strtotime($time), strtotime('24:30:00'));


      if(!empty($channelData)) {
        //to parse segments based on track--------------------------------------------------------------------------
        foreach ($channelData as $channelKey => $channelValue) {
          $data['channels'][$channelKey]['embed_code']  = $channelValue['embed_code'];
          if(!empty($channelValue['segments'])) {$data['channels'][$channelKey]['isSegment']  = false;
          $data['channels'][$channelKey]['isSegment']  = true;
            for($slot = reset($maxTimeSlot); $slot <= end($maxTimeSlot); $slot = strtotime('+30 minutes', $slot)){
              foreach ($channelValue['segments'] as $segmentKey => $segmentValue) {
                if(isset($segmentValue['track_id'])) {
                  if($slot >= $segmentValue['start_time'] && $slot <= $segmentValue['end_time']) {
                    $data['channels'][$channelKey]['programs'][$slot]          = $segmentValue;
                    $data['channels'][$channelKey]['programs'][$slot]['new_start_time']  = date("h:i:s", $segmentValue['start_time']);
                    $data['channels'][$channelKey]['programs'][$slot]['new_end_time']  = date("h:i:s", $segmentValue['end_time']);
                    $data['channels'][$channelKey]['programs'][$slot]['rows']  = $ondemandObj->rowCalculation($slot, $segmentValue['end_time']);
                    $slot = $segmentValue['end_time'];
                  } else {
                    $data['channels'][$channelKey]['programs'][$slot]['rows']    = 1;
                  }
                }
              }
            }
          } else {
            $data['channels'][$channelKey]['isSegment']  = false;
          }
        }
      }
      if(isset($data['channels']) && !empty($data['channels'])) {
        $isSegmentExistInAnyChannel = $ondemandObj->searchMultidimensionalArray($data['channels'], "isSegment", true);
        if(empty($isSegmentExistInAnyChannel)) {
          $data = array();
        }
      }
      array_pop($maxTimeSlot);
      $data['max_time_slot'] = $ondemandObj->convertStrtotimeToSpecifiedTimeFormat($maxTimeSlot);
    }
    $response->setStatusCode($trackSegmentsResponse['responseStatus'])->setContent(json_encode($data));
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
