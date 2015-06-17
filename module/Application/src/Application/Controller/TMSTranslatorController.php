<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TMSTranslator
 *
 * @author jacob
 */
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Directv\TMS\TypeOoyalaEnums;
class TMSTranslatorController extends AbstractActionController {
    protected   $base = BASE_URL;
    public function indexAction(){
        $xmlContent='<?xml version="1.0" encoding="UTF-8"?><EPG>
	<BROADCAST_DAY>
		<TX_DAY>2014-02-06</TX_DAY>
		<PROGRAM>
			<VIRTUAL_ASSET_ID>VASSET_ID_1234</VIRTUAL_ASSET_ID>
			<TRACK_SEGMENT_ID>TRACK_SEGMENT_12456</TRACK_SEGMENT_ID>
			<NETWORK>PROGRAMMER_1</NETWORK>
			<SHORT_TITLE>A short movie first1</SHORT_TITLE>
			<LONG_TITLE>A Short Movie - theatrical cut first1</LONG_TITLE>
			<DESCRIPTION>This is a description of the movie.</DESCRIPTION>
			<PROGRAM_TYPE>MOVIE</PROGRAM_TYPE>
			<EPISODE_NAME>Only used for TV shows</EPISODE_NAME>
			<EPISODE_NUMBER>24</EPISODE_NUMBER>
			<SEASON_NUMBER>1</SEASON_NUMBER>
			<START_TIME>2014-02-06T14:00Z</START_TIME>
			<END_TIME>2014-02-06T16:00Z</END_TIME>
			<TV_RATING>NA</TV_RATING>
			<PROGRAM_STATUS>R</PROGRAM_STATUS>
			
			<REGION>Mexico</REGION>
			<CLOSED_CAPTIONS>True</CLOSED_CAPTIONS>
			<ACTOR_DISPLAY>Kate Winslet,Leonardo DiCaprio, Billy Zane</ACTOR_DISPLAY>
			<ACTOR_1 >Kate Winslet</ACTOR_1>
			<ACTOR_2>Leonardo DiCaprio</ACTOR_2>
			<ACTOR_3>Billy Zane</ACTOR_3>
			<WRITER_DISPLAY>James Cameron</WRITER_DISPLAY>
			<WRITER_1>James Cameron</WRITER_1>
			<DIRECTOR_DISPLAY>James Cameron</DIRECTOR_DISPLAY>
			<DIRECTOR_1>James Cameron</DIRECTOR_1>
			<PRODUCER_DISPLAY>James Cameron</PRODUCER_DISPLAY>
			<PRODUCER_1>James Cameron</PRODUCER_1>
			<STUDIO_DISPLAY>Paramount</STUDIO_DISPLAY>
			<YEAR>1970</YEAR>
			<ORIGINALLY_AIRED>2014-02-06</ORIGINALLY_AIRED>
			<COUNTRY_OF_ORIGIN>US</COUNTRY_OF_ORIGIN>
			<GENRE_1>Drama</GENRE_1>
			<GENRE_2>Romance</GENRE_2>
			<AUDIO_TYPE>Stereo</AUDIO_TYPE>
			<SCREEN_FORMAT>Widescreen</SCREEN_FORMAT>
			<LANGUAGE>en</LANGUAGE>
		</PROGRAM>
                <PROGRAM>
			<VIRTUAL_ASSET_ID>VASSET_ID_5678</VIRTUAL_ASSET_ID>
			<TRACK_SEGMENT_ID>TRACK_SEGMENT_5678</TRACK_SEGMENT_ID>
			<NETWORK>PROGRAMMER_2</NETWORK>
			<SHORT_TITLE>A short movie second1</SHORT_TITLE>
			<LONG_TITLE>A Short Movie - theatrical cut second1</LONG_TITLE>
			<DESCRIPTION>This is a description of the movie.</DESCRIPTION>
			<PROGRAM_TYPE>MOVIE</PROGRAM_TYPE>
			<EPISODE_NAME>Only used for TV shows</EPISODE_NAME>
			<EPISODE_NUMBER>24</EPISODE_NUMBER>
			<SEASON_NUMBER>1</SEASON_NUMBER>
			<START_TIME>2015-02-06T10:00Z</START_TIME>
			<END_TIME>2015-02-06T16:00Z</END_TIME>
			<TV_RATING>NA</TV_RATING>
			<PROGRAM_STATUS>R</PROGRAM_STATUS>
			
			<REGION>Mexico</REGION>
			<CLOSED_CAPTIONS>True</CLOSED_CAPTIONS>
			<ACTOR_DISPLAY>Kate Winslet,Leonardo DiCaprio, Billy Zane</ACTOR_DISPLAY>
			<ACTOR_1 >Kate Winslet</ACTOR_1>
			<ACTOR_2>Leonardo DiCaprio</ACTOR_2>
			<ACTOR_3>Billy Zane</ACTOR_3>
			<WRITER_DISPLAY>James Cameron</WRITER_DISPLAY>
			<WRITER_1>James Cameron</WRITER_1>
			<DIRECTOR_DISPLAY>James Cameron</DIRECTOR_DISPLAY>
			<DIRECTOR_1>James Cameron</DIRECTOR_1>
			<PRODUCER_DISPLAY>James Cameron</PRODUCER_DISPLAY>
			<PRODUCER_1>James Cameron</PRODUCER_1>
			<STUDIO_DISPLAY>Paramount</STUDIO_DISPLAY>
			<YEAR>1974</YEAR>
			<ORIGINALLY_AIRED>2015-02-06</ORIGINALLY_AIRED>
			<COUNTRY_OF_ORIGIN>US</COUNTRY_OF_ORIGIN>
			<GENRE_1>Drama</GENRE_1>
			<GENRE_2>Romance</GENRE_2>
			<AUDIO_TYPE>Stereo</AUDIO_TYPE>
			<SCREEN_FORMAT>Widescreen</SCREEN_FORMAT>
			<LANGUAGE>en</LANGUAGE>
		</PROGRAM>



	</BROADCAST_DAY>
        
</EPG>';
        //echo APPLICATION_PATH;

        $tmsService   = $this->getServiceLocator()->get('tmsFactory');
        $doc = new \DOMDocument();
        //$doc->load( APPLICATION_PATH.'/schedule.xml');
        $doc->loadXML($xmlContent);
        $broadCastArray=$this->parseXmlToArray($doc);
        $tmsService->createTMSPrograms($broadCastArray);
        $tmsService->createTMSSchedule($broadCastArray);
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($broadCastArray));
        return $response;
    }
    
    public function parseXmlToArray($XmlDomObj){
        $broadCastArray=array();
        $tmsService   = $this->getServiceLocator()->get('tmsFactory');
        if(! $XmlDomObj instanceof \DOMDocument){
            throw new Exception\InvalidArgumentException('Not an instance of DOMDocument.');
        }
        $EPG=$XmlDomObj->getElementsByTagName(TypeOoyalaEnums::TYPE_EPG);
        $BROADCAST_DAYS=$XmlDomObj->getElementsByTagName(TypeOoyalaEnums::TYPE_BROADCAST_DAY);
        if(empty($BROADCAST_DAYS)){
            return $broadCastArray;
        }
        foreach ($BROADCAST_DAYS as $key=>$BROADCAST_DAY){
            $TX_DAY=$BROADCAST_DAY->getElementsByTagName(TypeOoyalaEnums::TYPE_TX_DAY);
            $PROGRAMS=$BROADCAST_DAY->getElementsByTagName(TypeOoyalaEnums::TYPE_PROGRAM);
            $broadCastArray[$key][TypeOoyalaEnums::TYPE_TX_DAY]=$TX_DAY->item(0)->nodeValue;
            $arrayValues=$tmsService->getAllPrograms($PROGRAMS);
            $broadCastArray[$key]['Programs']=$arrayValues;
        }
        return $broadCastArray;
    }

    public function getResponseWithHeader(){
        $response = $this->getResponse();
        $response->getHeaders()->addHeaderLine('Access-Control-Allow-Origin', '*')
                ->addHeaderLine('Access-Control-Allow-Methods', 'POST GET')
                ->addHeaderLine('Content-type', 'application/json');
        return $response;
    }
}


//            
//            
//            $VIRTUAL_ASSET_ID=$PROGRAM->getElementsByTagName("VIRTUAL_ASSET_ID");
//            $broadCastPgmArray['VIRTUAL_ASSET_ID']=$VIRTUAL_ASSET_ID->item(0)->nodeValue;
//            
//            $TRACK_SEGMENT_ID=$PROGRAM->getElementsByTagName("TRACK_SEGMENT_ID");
//            $broadCastPgmArray['TRACK_SEGMENT_ID']=$TRACK_SEGMENT_ID->item(0)->nodeValue;
//            
//            $NETWORK=$PROGRAM->getElementsByTagName("NETWORK");
//            $broadCastPgmArray['NETWORK']=$NETWORK->item(0)->nodeValue;
//            
//            $SHORT_TITLE=$PROGRAM->getElementsByTagName("SHORT_TITLE");
//            $broadCastPgmArray['SHORT_TITLE']=$SHORT_TITLE->item(0)->nodeValue;
//            
//            $LONG_TITLE=$PROGRAM->getElementsByTagName("LONG_TITLE");  
//            $broadCastPgmArray['LONG_TITLE']=$LONG_TITLE->item(0)->nodeValue;
//            
//            $DESCRIPTION=$PROGRAM->getElementsByTagName("DESCRIPTION");
//            $broadCastPgmArray['DESCRIPTION']=$DESCRIPTION->item(0)->nodeValue;
//            
//            $PROGRAM_TYPE=$PROGRAM->getElementsByTagName("PROGRAM_TYPE");
//            $broadCastPgmArray['PROGRAM_TYPE']=$PROGRAM_TYPE->item(0)->nodeValue;
//            
//            $EPISODE_NAME=$PROGRAM->getElementsByTagName("EPISODE_NAME");
//            $broadCastPgmArray['EPISODE_NAME']=$EPISODE_NAME->item(0)->nodeValue;
//           
//            $EPISODE_NUMBER=$PROGRAM->getElementsByTagName("EPISODE_NUMBER");
//            $broadCastPgmArray['EPISODE_NUMBER']=$EPISODE_NUMBER->item(0)->nodeValue;
//            
//            $SEASON_NUMBER=$PROGRAM->getElementsByTagName("SEASON_NUMBER");
//            $broadCastPgmArray['SEASON_NUMBER']=$SEASON_NUMBER->item(0)->nodeValue;
//            
//            $START_TIME=$PROGRAM->getElementsByTagName("START_TIME");
//            $broadCastPgmArray['START_TIME']=$START_TIME->item(0)->nodeValue;
//            
//            $END_TIME=$PROGRAM->getElementsByTagName("END_TIME");
//            $broadCastPgmArray['END_TIME']=$END_TIME->item(0)->nodeValue;
//            
//            $TV_RATING=$PROGRAM->getElementsByTagName("TV_RATING");
//            $broadCastPgmArray['TV_RATING']=$TV_RATING->item(0)->nodeValue;
//            
//            $PROGRAM_STATUS=$PROGRAM->getElementsByTagName("PROGRAM_STATUS");
//            $broadCastPgmArray['PROGRAM_STATUS']=$PROGRAM_STATUS->item(0)->nodeValue;
//            
//            $CLOSED_CAPTIONS=$PROGRAM->getElementsByTagName("CLOSED_CAPTIONS");
//            $broadCastPgmArray['CLOSED_CAPTIONS']=$CLOSED_CAPTIONS->item(0)->nodeValue;
//            
//            $ACTOR_DISPLAY=$PROGRAM->getElementsByTagName("ACTOR_DISPLAY");
//            $broadCastPgmArray['ACTOR_DISPLAY']=$ACTOR_DISPLAY->item(0)->nodeValue;
//            
//            $REGION=$PROGRAM->getElementsByTagName("REGION");
//            $broadCastPgmArray['REGION']=$REGION->item(0)->nodeValue;
//            
//            $ACTOR_1=$PROGRAM->getElementsByTagName("ACTOR_1");
//            $broadCastPgmArray['ACTOR_1']=$ACTOR_1->item(0)->nodeValue;
//            
//            $ACTOR_2=$PROGRAM->getElementsByTagName("ACTOR_2");
//            $broadCastPgmArray['ACTOR_2']=$ACTOR_2->item(0)->nodeValue;
//            
//            $ACTOR_3=$PROGRAM->getElementsByTagName("ACTOR_3");
//            $broadCastPgmArray['ACTOR_3']=$ACTOR_3->item(0)->nodeValue;
//            
//            $WRITER_DISPLAY=$PROGRAM->getElementsByTagName("WRITER_DISPLAY");
//            $broadCastPgmArray['WRITER_DISPLAY']=$WRITER_DISPLAY->item(0)->nodeValue;
//            
//            $WRITER_1=$PROGRAM->getElementsByTagName("WRITER_1");
//            $broadCastPgmArray['WRITER_1']=$WRITER_1->item(0)->nodeValue;
//            
//            $DIRECTOR_DISPLAY=$PROGRAM->getElementsByTagName("DIRECTOR_DISPLAY");
//            $broadCastPgmArray['DIRECTOR_DISPLAY']=$DIRECTOR_DISPLAY->item(0)->nodeValue;
//            
//            $DIRECTOR_1=$PROGRAM->getElementsByTagName("DIRECTOR_1");
//            $broadCastPgmArray['DIRECTOR_1']=$DIRECTOR_1->item(0)->nodeValue;
//            
//            $PRODUCER_DISPLAY=$PROGRAM->getElementsByTagName("PRODUCER_DISPLAY");
//            $broadCastPgmArray['PRODUCER_DISPLAY']=$PRODUCER_DISPLAY->item(0)->nodeValue;
//            
//            $PRODUCER_1=$PROGRAM->getElementsByTagName("PRODUCER_1");
//            $broadCastPgmArray['PRODUCER_1']=$PRODUCER_1->item(0)->nodeValue;
//            
//            $STUDIO_DISPLAY=$PROGRAM->getElementsByTagName("STUDIO_DISPLAY");
//            $broadCastPgmArray['STUDIO_DISPLAY']=$STUDIO_DISPLAY->item(0)->nodeValue;
//            
//            $YEAR=$PROGRAM->getElementsByTagName("YEAR");
//            $broadCastPgmArray['YEAR']=$YEAR->item(0)->nodeValue;
//            
//            $ORIGINALLY_AIRED=$PROGRAM->getElementsByTagName("ORIGINALLY_AIRED");
//            $broadCastPgmArray['ORIGINALLY_AIRED']=$ORIGINALLY_AIRED->item(0)->nodeValue;
//            $COUNTRY_OF_ORIGIN=$PROGRAM->getElementsByTagName("COUNTRY_OF_ORIGIN");
//            $broadCastPgmArray['COUNTRY_OF_ORIGIN']=$COUNTRY_OF_ORIGIN->item(0)->nodeValue;
//            $GENRE_1=$PROGRAM->getElementsByTagName("GENRE_1");
//            $broadCastPgmArray['GENRE_1']=$GENRE_1->item(0)->nodeValue;
//            $GENRE_2=$PROGRAM->getElementsByTagName("GENRE_2");
//            $broadCastPgmArray['GENRE_2']=$GENRE_2->item(0)->nodeValue;
//            $AUDIO_TYPE=$PROGRAM->getElementsByTagName("AUDIO_TYPE");
//            $broadCastPgmArray['AUDIO_TYPE']=$AUDIO_TYPE->item(0)->nodeValue;
//            $SCREEN_FORMAT=$PROGRAM->getElementsByTagName("SCREEN_FORMAT");
//            $broadCastPgmArray['SCREEN_FORMAT']=$SCREEN_FORMAT->item(0)->nodeValue;
//            $LANGUAGE=$PROGRAM->getElementsByTagName("LANGUAGE");
//            $broadCastPgmArray['LANGUAGE']=$LANGUAGE->item(0)->nodeValue;