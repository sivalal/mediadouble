<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;

use Zend\Http\Client;

class HomeController extends AbstractRestfulController
{

    protected static $http = null;

    public function getData() {
        
    }
    /**
     * GET method
     * @see \Zend\Mvc\Controller\AbstractRestfulController::getList()
     */
    public function getList(){
        static::$http = $this->getHttpClient();
        $config = $this->getServiceLocator()->get('Config');
        $base = BASE_URL;
        $baseURL =  "${base}/dummy/banner1.png";
        $data = array( "mainCarouselArr"=>array(
            "images1" => array(
                "ImageID"=> 1,
                "Title"=> "Banner One",
                "Summary"=> "This is summary of Wolverine",
                "Path"=> $baseURL,
                "Showcase_content_url"=>SHOW_CASE_CONTENT_URL
                
            ),
            "images2" => array(
                "ImageID"=> 2,
                "Title"=> "Banner Two",
                "Summary"=> "This is summary of Wolverine",
                "Path"=> $baseURL,
                "Showcase_content_url"=>SHOW_CASE_CONTENT_URL
            ),
            "images3" => array(
                "ImageID"=> 3,
                "Title"=> "Banner Three",
                "Summary"=> "This is summary of Wolverine",
                "Path"=> $baseURL,
                "Showcase_content_url"=>SHOW_CASE_CONTENT_URL
            ),
            "images4" => array(
                "ImageID"=> 4,
                "Title"=> "Banner Four",
                "Summary"=> "This is summary of Tulips",
                "Path"=> $baseURL,
                "Showcase_content_url"=>SHOW_CASE_CONTENT_URL
            )
        ),
 "thumblistCarouselOneArr"=>array(
            array(
                "ImageID"=> 1,
                "title"=> "World War Z",
                "desc"=> "World war Z is a",
                "imagePath"=> "dummy/1.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"x2OGtpMzqR06BmdwuWB5kgE0jmDIeGV1"
            ),
            array(
                "ImageID"=> 2,
                "title"=> "Banner Two",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "dummy/2.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"ZwOGtpMzqTeEXRHRHStgUzmO264zROvj"
            ),
            array(
                "ImageID"=> 3,
                "title"=> "Banner Three",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "dummy/3.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"45NmtpMzoPg3Y9gftSgGyhmuFFmNHFsT"
            ),
            array(
                "ImageID"=> 4,
                "title"=> "Banner Four",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/4.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"43NmtpMzoNSkvstTPSMTKLkoCCDpgClj"
            ),
            array(
                "ImageID"=>5 ,
                "title"=> "Banner Five",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/1.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"dwdmppMzpMY7Kfz9aUVwwLi71sLk0LQ6"
            ),
            array(
                "ImageID"=> 6,
                "title"=> "Banner Six",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/4.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"dqdmppMzo1jXrfriWwjunmvFo7CzSN4D"
            ),
            array(
                "ImageID"=> 7,
                "title"=> "Banner Seven",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/2.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"ZhN3FzMjrM4FqEZ0ASgipMxJ9INmzfxl"
            ),
            array(
                "ImageID"=> 8,
                "title"=> "Banner Eight",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/3.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"dsdmppMzoay1syr1bF6FUS5PI1LfPqrI"
            ),
            array(
                "ImageID"=> 9,
                "title"=> "Banner Nine",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/4.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"43NmtpMzoNSkvstTPSMTKLkoCCDpgClj"
            ),
            array(
                "ImageID"=>10 ,
                "title"=> "Banner ten",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/1.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"dwdmppMzpMY7Kfz9aUVwwLi71sLk0LQ6"
            ),
            array(
                "ImageID"=> 11,
                "title"=> "Banner Eleven",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/4.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"dqdmppMzo1jXrfriWwjunmvFo7CzSN4D"
            ),
            array(
                "ImageID"=> 12,
                "title"=> "Banner12",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/2.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"ZhN3FzMjrM4FqEZ0ASgipMxJ9INmzfxl"
            ),
            array(
                "ImageID"=> 13,
                "title"=> "Banner13",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "dummy/3.png",
                "duration"=>"1hr 30 minutes",
                "airedOn"=>"1-03-2014",
                "staring"=>"mike,alex,joe",
                "creator"=>"steve",
                "audio"=>"Hans Zimmer",
                "contentID"=>"dsdmppMzoay1syr1bF6FUS5PI1LfPqrI"
            )
            ),
            "networkListArr"=>array(
            array(
                "ImageID"=> 1,
                "title"=> "World War Z",
                "desc"=> "World war Z is a",
                "imagePath"=> "${base}/dummy/TNT.png"
            ),
            array(
                "ImageID"=> 2,
                "title"=> "Banner Two",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/NBC.png"
            ),
            array(
                "ImageID"=> 3,
                "title"=> "Banner Three",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/ABC.png"
            ),
            array(
                "ImageID"=> 4,
                "title"=> "Banner Four",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/TNT.png"
            ),
            array(
                "ImageID"=>5 ,
                "title"=> "Banner Five",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/ABC.png"
            ),
            array(
                "ImageID"=> 6,
                "title"=> "Banner Six",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/NBC.png"
            ),
            array(
                "ImageID"=> 7,
                "title"=> "Banner Seven",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/TNT.png"
            ),
            array(
                "ImageID"=> 8,
                "title"=> "Banner Eight",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/ABC.png"
            ),
            array(
                "ImageID"=> 9,
                "title"=> "World War Z",
                "desc"=> "World war Z is a",
                "imagePath"=> "${base}/dummy/NBC.png"
            ),
            array(
                "ImageID"=> 10,
                "title"=> "Banner Two",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/TNT.png"
            ),
            array(
                "ImageID"=> 11,
                "title"=> "Banner Three",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/ABC.png"
               
            ),
            array(
                "ImageID"=> 12,
                "title"=> "Banner Four",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/TNT.png"
            ),
            array(
                "ImageID"=> 13,
                "title"=> "World War Z",
                "desc"=> "World war Z is a",
                "imagePath"=> "${base}/dummy/ABC.png"
            ),
            array(
                "ImageID"=> 14,
                "title"=> "Banner Two",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/TNT.png"
            ),
            array(
                "ImageID"=> 15,
                "title"=> "Banner Three",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/NBC.png"
            ),
            array(
                "ImageID"=> 16,
                "title"=> "Banner Four",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/ABC.png"
            )
        ),
         "networkShowsListArr"=>array(
            array(
                "ImageID"=> 1,
                "title"=> "World War Z",
                "desc"=> "World war Z is a",
                "imagePath"=> "${base}/dummy/1.png"
            ),
            array(
                "ImageID"=> 2,
                "title"=> "Banner Two",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/2.png"
            ),
            array(
                "ImageID"=> 3,
                "title"=> "Banner Three",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/3.png"
            ),
            array(
                "ImageID"=> 4,
                "title"=> "Banner Four",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/2.png"
            ),
            array(
                "ImageID"=>5 ,
                "title"=> "Banner Five",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/4.png"
            ),
            array(
                "ImageID"=> 6,
                "title"=> "Banner Six",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/3.png"
            ),
            array(
                "ImageID"=> 7,
                "title"=> "Banner Seven",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/1.png"
            ),
            array(
                "ImageID"=> 8,
                "title"=> "Banner Eight",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/2.png"
            ),
            array(
                "ImageID"=> 9,
                "title"=> "World War Z",
                "desc"=> "World war Z is a",
                "imagePath"=> "${base}/dummy/3.png"
            ),
            array(
                "ImageID"=> 10,
                "title"=> "Banner Two",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/4.png"
            ),
            array(
                "ImageID"=> 11,
                "title"=> "Banner Three",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/1.png"
               
            ),
            array(
                "ImageID"=> 12,
                "title"=> "Banner Four",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/2.png"
            ),
            array(
                "ImageID"=> 13,
                "title"=> "World War Z",
                "desc"=> "World war Z is a",
                "imagePath"=> "${base}/dummy/1.png"
            ),
            array(
                "ImageID"=> 14,
                "title"=> "Banner Two",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/4.png"
            ),
            array(
                "ImageID"=> 15,
                "title"=> "Banner Three",
                "desc"=> "This is summary of Wolverine",
                "imagePath"=> "${base}/dummy/3.png"
            ),
            array(
                "ImageID"=> 16,
                "title"=> "Banner Four",
                "desc"=> "This is summary of Tulips",
                "imagePath"=> "${base}/dummy/1.png"
            )
        )
            );
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
        return $response;
    }

    /**
     * GET method
     * @see \Zend\Mvc\Controller\AbstractRestfulController::get()
     */
    public function get($id){
        $data = array('msg' => 'Invalid method');
        $response = $this->getResponseWithHeader();
        $response->setStatusCode(405)->setContent(json_encode($data));
        return $response;
    }

    /**
     * POST method
     * @see \Zend\Mvc\Controller\AbstractRestfulController::create()
     */
    public function create($data){
        $auth = $this->getServiceLocator()->get('auth');
        
        $username = $data['username'];
        $password = $data['password'];
        $response = $this->getResponseWithHeader();
        $data = array();
        
        $auth->getAdapter()
            ->setIdentity($username)
            ->setCredential($password);
        $result = $auth->authenticate();
        
        if( $result->isValid() ){
            $data['username'] = $username;
        }
        else{
            $data['msg'] = $result->getMessages();
            $response->setStatusCode(401);
        }
        
        $response->setContent(json_encode($data));
        return $response;
    }

    /**
     * PUT method
     * @see \Zend\Mvc\Controller\AbstractRestfulController::update()
     */
    public function update($id, $data){
        $data = array('msg' => 'Invalid method');
        $response = $this->getResponseWithHeader();
        $response->setStatusCode(405)->setContent(json_encode($data));
        return $response;
    }

    /**
     * DELETE method
     * @see \Zend\Mvc\Controller\AbstractRestfulController::delete()
     */
    public function delete($id){
        $auth = $this->getServiceLocator()->get('auth');
//         if( $auth->hasIdentity() ){
            $auth->clearIdentity();
//         }
        $data = array('msg' => 'Logged out');
        $response = $this->getResponseWithHeader();
        $response->setContent(json_encode($data));
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
