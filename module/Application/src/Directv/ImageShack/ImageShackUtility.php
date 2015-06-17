<?php
namespace Directv\ImageShack;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ImageShackUtility
 *
 * @author jacob
 */
class ImageShackUtility {
   /**
    * 
    * @param \Directv\AppConfig\AppviewAdapter $appviewAdapterObj
    * @param type $railImageType
    * @return string
    * @throws Exception\InvalidArgumentException
    * 
    * $railImageType: eg: 'rail.small'
    * 
    * usage: ImageShackUtility::CreateShackURL($appviewAdapterObj,$railImageType)
    * 
    */
    public static function CreateShackURL($appviewAdapterObj,$railImageType){
        if(! $appviewAdapterObj instanceof \Directv\AppConfig\AppviewAdapter){
            throw new Exception\InvalidArgumentException('Invalid Argument AppviewAdapter Instance');
        }
        $imageMetaDetails = $appviewAdapterObj->getImageMetaDetails();
        $image_shack_url='';
        if(!empty($imageMetaDetails['imageshackBaseurl']))
        {
         $image_shack_url=$imageMetaDetails['imageshackBaseurl'].'/'.$imageMetaDetails['deviceArr']['webDesktop'][$railImageType].'/';
        }
        return  $image_shack_url;
    }
}
