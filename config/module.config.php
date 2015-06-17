<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

return array(
    'router' => array(
        'routes' => array(
            'home' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'tvShowR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/tvShow',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'movieR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/movie',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'pageR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/page',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'channelsR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/channels',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'loggedinSubscriberR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/loggedinSubscriber',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'mwelcomeR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/m.welcome',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'signupErrorR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/signupError',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'updateErrorR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/updateError',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'programsR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/programs',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'liveListOldR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/liveListOld',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'liveListR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/liveList',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'liveShowR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/liveShow',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'promotionsR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/promotions',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'promotions-visitorR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/promotions-visitor',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'contentR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/content',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'notcookieR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/notcookie',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'requireCookieR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/requireCookie',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'aboutUsR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/aboutUs',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'privacyPolicyR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/privacyPolicy',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'systemRequirementsR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/systemRequirements',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'sitemapR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/sitemap',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'helpR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/help',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'backR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/back',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'filterpageR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/filterpage',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'loginR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/login',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'forgotPasswordR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/forgotPassword',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'forgotMailR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/forgotMail',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'healthR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/health',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'homeR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/home',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'notfoundR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/notfound',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'resetpwdR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/resetpwd',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'signupR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/signup',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'selectPackageR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/selectPackage',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'finalCheckoutR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/finalCheckout',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'signupSuccessR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/signupSuccess',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'updatePaymentSuccessR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/updatePaymentSuccess',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'signupErrorR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/signupError',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'updatePaymentErrorR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/updatePaymentError',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'updatePaymentError' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/updatePaymentError',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'cancelAccountR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/cancelAccount',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'cancelledAccountConfirmationR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/cancelledAccountConfirmation',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'mmanageAccountR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/m.manageAccount',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'mpersonalInformationR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/m.personalInformation',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'mbillingInformationR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/m.billingInformation',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'msubscriptionDetailsR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/m.subscriptionDetails',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'mprofileSettingsR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/m.profileSettings',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'createAccountR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/createAccount',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'searchR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/search',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'filterR' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/filter',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'manageAccount' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/manageAccount',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'billingHistory' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/billingHistory',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),

            'noSearchResult' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/noSearchResult',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'welcome' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/welcome',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'more' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/more[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\More',
                        'action'     => 'index',
                    ),
                ),
            ),
            'singleasset' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/singleasset[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\SingleAsset',
                        'action'     => 'index',
                    ),
                ),
            ),
            'movie' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/movieasset',
                    'defaults' => array(
                        'controller' => 'Application\Controller\SingleAsset',
                        'action'     => 'getMovieAsset',

                    ),
                ),
            ),
            'tvshow' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/tvasset',
                    'defaults' => array(
                        'controller' => 'Application\Controller\SingleAsset',
                        'action'     => 'getTVAsset',

                    ),
                ),
            ),
            'getopt' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/getopt',
                    'defaults' => array(
                        'controller' => 'Application\Controller\SingleAsset',
                        'action'     => 'getOpt',

                    ),
                ),
            ),
            'watchplayer' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/watchplayer',
                    'defaults' => array(
                        'controller' => 'Application\Controller\SingleAsset',
                        'action'     => 'watchplayer',

                    ),
                ),
            ),

            'rightnow' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/rightnow[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\RightNow',
                        'action'     => 'index',
                    ),
                ),
            ),

            'tv' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/tv[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\TV',
                        'action'     => 'index',
                    ),
                ),
            ),


            'search' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/search[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Search',
                        'action'     => 'index',

                    ),
                ),
            ),
            'searchApi' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/searchApi[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\SearchApi',
                        'action'     => 'index',

                    ),
                ),
            ),
            'tms' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/tms[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\TMSTranslator',
                        'action'     => 'index',

                    ),
                ),
            ),
             'group' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/group[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Group',
                        'action'     => 'index',

                    ),
                ),
            ),
               'genre' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/genre[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Genre',
                        'action'     => 'index',

                    ),
                ),
            ),
            'index' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/test[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'gigya' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/gigya[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Gigya',
                        'action'     => 'index',
                    ),
                ),
            ),
            'vindicia' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/vindicia[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Vindicia',
                        'action'     => 'index',
                    ),
                ),
            ),
            'onlogin' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/onlogin[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\OnLogin',
                        'action'     => 'index',
                    ),
                ),
            ),
            'live' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/live[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Live',
                        'action'     => 'index',
                    ),
                ),
            ),
            'watchlist' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/watchlist[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\WatchList',
                        'action'     => 'index',

                    ),
                ),
            ),
            'xdr' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/xdr[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\XDR',
                        'action'     => 'index',

                    ),
                ),
            ),
            'lang' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'       => '/lang[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults'    => array(
                        'controller' => 'Application\Controller\Lang',
                        'action'     => 'index',
                    ),
                ),
            ),
            'appgrid' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'       => '/appgrid[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults'    => array(
                        'controller' => 'Application\Controller\AppGrid',
                        'action'     => 'index',
                    ),
                ),
            ),
            'social' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/social[/:titleId][/:lang]',
                    'constraints' => array(
                        'titleId'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'titleId'     => '[a-zA-Z_]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Social',
                        'action'     => 'index',

                    ),
                ),
            ),
            'homeshare' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/homeshare[/:lang]',
                    'defaults' => array(
                        'controller' => 'Application\Controller\HomeShare',
                        'action'     => 'index',
                    ),
                ),
            ),
            'test' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/test[/:action]',
                    'constraints' => array(
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Test',
                        'action'     => 'index',

                    ),
                ),
            ),
            // The following is a route to simplify getting started creating
            // new controllers and actions without needing to create a new
            // module. Simply drop new controllers in, and you can access them
            // using the path /application/:controller/:action
        ),
    ),
    'service_manager' => array(
        'factories'   => array(
            'search'          => 'Directv\Search\SearchFactory',
            /**
             * loading the AppConfigFactory
             */
            'appconfig'       => 'Directv\AppConfig\AppConfigFactory',
            'gigya'           => 'Directv\Gigya\GigyaHandlerFactory',
            'ondemand'        => 'Directv\OnDemand\OnDemandFactory',
            'tmsFactory'      =>'Directv\TMS\TMSTranslatorFactory',
            'Zend\Log\Logger' => function($sm){
                $logger = new Zend\Log\Logger;
                $writer = new Zend\Log\Writer\Stream('./data/log/'.date('Y-m-d').'-error.log');
                $logger->addWriter($writer);
                return $logger;
            },
            'externalApi'     => 'Hott\ExternalApi\ExternalApiFactory',
            'singleAssetService'=>'Hott\Services\SingleAsset\SingleAssetService'
        ),
        'invokables' => array(
            'httpUtility'         => 'Hott\Utility\HttpService',
            'ViewHelperCaptcha'   => 'Hott\Utility\ViewHelperCaptcha',
            'longSearchParser'    => 'Hott\CustomParser\LongSearch',
            'shortSearchParser'   => 'Hott\CustomParser\ShortSearch',
            'instantSearchParser' => 'Hott\CustomParser\InstantSearch'
        ),
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'aliases' => array(
            'translator' => 'MvcTranslator',
        ),
    ),
    'translator' => array(
        'locale' => 'en_US',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo',
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Application\Controller\Index'          => 'Application\Controller\IndexController',
            'Application\Controller\Search'         => 'Application\Controller\SearchController',
            'Application\Controller\SearchApi'      => 'Application\Controller\SearchApiController',
            'Application\Controller\Test'           => 'Application\Controller\TestController',
            'Application\Controller\Home'           => 'Application\Controller\HomeController',
            'Application\Controller\More'           => 'Application\Controller\MoreController',
            'Application\Controller\Gigya'          => 'Application\Controller\GigyaController',
            'Application\Controller\AppGrid'        => 'Application\Controller\AppGridController',
            'Application\Controller\Live'           => 'Application\Controller\LiveController',
            'Application\Controller\Lang'           => 'Application\Controller\LangController',
            'Application\Controller\Vindicia'       => 'Application\Controller\VindiciaController',
            'Application\Controller\OnLogin'        => 'Application\Controller\OnLoginController',
            'Application\Controller\WatchList'      => 'Application\Controller\WatchListController',
            'Application\Controller\XDR'            => 'Application\Controller\XDRController',
            'Application\Controller\SingleAsset'    => 'Application\Controller\SingleAssetController',
            'Application\Controller\RightNow'       => 'Application\Controller\RightNowController',
            'Application\Controller\Genre'          => 'Application\Controller\GenreController',
            'Application\Controller\Group'          => 'Application\Controller\GroupController',
            'Application\Controller\TV'             => 'Application\Controller\TVController',
            'Application\Controller\TMSTranslator'  => 'Application\Controller\TMSTranslatorController',
            'Application\Controller\Social'         => 'Application\Controller\SocialController',
            'Application\Controller\HomeShare'      => 'Application\Controller\HomeShareController',
            'Application\Controller\Test'           => 'Application\Controller\TestController'
        ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../../../public/index.html',
            'application/index/index' => __DIR__ . '/../../../public/index.html',
            'error/404'               => __DIR__ . '/../../../public/404.html',
            'error/index'             => __DIR__ . '/../../../public/404.html',
            'social/layout'           => __DIR__ . '/../../../public/social-layout.html',
            'social/view'           => __DIR__ . '/../../../public/social-view.html',
            'homeshare/view'           => __DIR__ . '/../../../public/homeshare-view.html',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
    'externalApi' => array(
        'adapter'   => 'Hott\ExternalApi\ExternalApiAdapter',
        'endpoints' => array(
            'search' => array(
                'longMetadata'=>'/search/v1/full/providers/75212/docs',
                'shortMetadata'=>'/search/v1/full/providers/75212/mini'
            ),
            'instant_search' => array(
                'people' => '/search/v1/instant/providers/75212/people',
                'live'   => '/search/v1/instant/providers/75212/live',
                'vod'    => '/search/v1/instant/providers/75212/vod'
            ),
            'discovery_search'=>array(
                'discovery'=>'/v2/discover/trending/top_titles',
                'similar'=>'/v2/discover/similar/assets',
                'personal'=>'/v2/discover/personal'
            ),
            'ooyala_backlot' => array(
                'backlot_api_key'     => "R3ZHExOjHcfMbqoMxpYBE7PbDEyB.gJfQr",
                'backlot_secret_key'  => "MOtexAq0umlHf2LIRM4v33-J7SSu_o9tWG_gvxdW"
            ),
            'xdr'=>array(
                'xdrpoint'           => '/xdr/v1/playhead_positions'
            ),
            'watchlist' => array(
                'get' => '/watchlist/v2/list',
                'has' => '/watchlist/v2/list/has',
                'all' => '/watchlist/v2/list/all'
            )

        )
    ),
    'search' => array(
        'adapter'            => "Directv\Search\SearchAdapter",
        'genreList'          => '/search/v1/genres',
        'xdrpoint'           => '/xdr/v1/playhead_positions',
        'searchpoint_asset'  => '/search/v1/full/providers/75212/documents/',
        'searchurl'          => '/search/v1/full/providers/75212/matches',
        'searchminiurl'      => '/search/v1/full/providers/75212/mini',
        'entitlements'       => "/commerce/entitlements",
        'episode_list'       => '/search/v1/full/providers/75212/series',
        'cache'              => array(
            'enabled' => true,
            'ttl'     => 900
        ),
    ),
    'gigya_constants' => array(
        'API_KEY'                      => "@@gigya_api_key",
        'SECRET_KEY'                   => "@@gigya_secret_key",
        'BASE_URL'                     => "@@server_url",
        'CLIENT_BASE_URL'              => "@@client_url",
        'RIGHT_NOW_URL'                => "@@server_url",
        'BUILD_NUMBER'                 => "@@app_build_number"
    ),
    'mobile_app' => array(
        'ios_app_id'       => "@@ios_app_id",
        'ios_app_name'     => "@@ios_app_name",
        'ios_app_download' => "itms://itunes.apple.com/us/app/id@@ios_app_id?mt=8",
        'android_app_id'   => "@@android_app_id",
        'android_app_name' => "@@android_app_name",
        'android_app_download' => "https://play.google.com/store/apps/details?id=@@android_app_id",
    ),
    'app' => array(
        'appKey'    => "@@appgrid_key",
        'baseUrl'   => "https://appgrid-api.cloud.accedo.tv/"
    ),
    'appconfig' => array(
        'adapter'         => "Directv\AppConfig\AppviewAdapter",
        'appKey'          => "@@appgrid_key",
        'baseUrl'         => "https://appgrid-api.cloud.accedo.tv/",//"http://appgrid-staging.cloud.accedo.tv/api/"
        'geoIpUrl'        => "plugin/geoip/location",
        'metadata'        => "metadata",
        'gateways'        => "metadata/gateways",
        'player_errors'   => "metadata/player_errors",
        'ip_ranges'       => "metadata/ip_ranges",
        'email_template'  => "metadata/emailtemplate",
        'appgridTimeout'  => 1200,//seconds -- 20minutes
        'cache'     => array(
            'enabled' => true,
            'ttl'     => 900
        ),
    ),
    'ondemand' => array(
        'adapter'                => "Directv\OnDemand\OnDemandAdapter",
        'genre'                  => '/search/v1/full/providers/75212/matches',
        'searchpoint'            => '/search/v1/full/providers/75212/matches',
        'searchpoint_asset'      => '/search/v1/full/providers/75212/documents/',
        'searchpointpeople'      => '/search/v1/instant/providers/75212/people',
        'searchpointlive'        => '/search/v1/instant/providers/75212/live',
        'searchpointvod'         => '/search/v1/instant/providers/75212/vod',
        'recently_added'         => '/search/v1/full/providers/75212/documents/last_added',
        'episode_list'           => '/search/v1/full/providers/75212/series',
        'livepoint'              => '@@server_url/json/Live_Content.json',
        'watchlistlist'          => '/watchlist/v1/list',
        'watchlisthasItem'       => '/watchlist/v1/list/has',
        'watchlistdeleteAllItem' => '/watchlist/v1/list/all',
        'xdrpoint'               => '/xdr/v1/playhead_positions',
        'xdrpointDeleteAllItem'  => '/xdr/v1/playhead_positions/all',
        'timeSlice'   => 30,
        'cache'       => array(
                'enabled'  => true,
                'ttl'      => 900
        ),
    ),
    'ooyala' => array(
        'backlot_api_key'     => "R3ZHExOjHcfMbqoMxpYBE7PbDEyB.gJfQr",
        'backlot_secret_key'  => "MOtexAq0umlHf2LIRM4v33-J7SSu_o9tWG_gvxdW"
    ),
    'general_routes' => array(
        'pcode'         => 'R3ZHExOjHcfMbqoMxpYBE7PbDEyB',
        'vindicia'      => array(
                'initialize_request'      => "/commerce/transactions/new",
                'review_request'          => "/commerce/transactions/review",
                'confirm_request'         => "/commerce/transactions/confirm",
                'product_request'         => "/commerce/products",
                'account_product_request' => "/commerce/accounts/products",
                'account_product_purchase' => "/commerce/accounts/purchases",
                'entitlements'            => "/commerce/entitlements",
                'campaigns'               => "/commerce/campaigns",
                'billing_history'         => "/commerce/accounts/history/billing",
                'transaction_history'     => "/commerce/accounts/history/transactions",
                'payment_methods'         => "/commerce/accounts/payment-methods",
                'account_update'          => "/commerce/accounts/update",
                'processPackages'         => "/commerce/subscriptions/{{subId}}/items",
                'packagesRemove'         => "/commerce/subscriptions/{{subId}}/items/{{productId}}"
        ),
        'movieAndTv' => array(
            "most_popular" => "/v2/discover/trending/top",
            "recommended"  => "/v2/discover/trending/momentum",
            "most_popular_new" => "/v2/discover/trending",

        ),
        'liveStream' => array(
            "tracks"         => "/v2/tracks",
            "track_segments" => "/v2/track_segments",
            "track_assets"   => array(
                "path"        => "/v2/assets",
                "query_param" => "asset_type='remote_asset'+AND+status='live'+AND+labels+INCLUDES+'LiveNow'",
            )
        ),
        'similarAssests' => "/v2/discover/similar/assets/"
    ),
    'gigya' => array(
        'adapter'   => "Directv\Gigya\GigyaPostHandlerAdapter",
        'cache'     => array(
            'enabled' => true,
            'ttl'     => 900
        ),
    ),
    'smtp' => array(
        'host'        => "@@smtp_host",
        'username'    => "@@smtp_username",
        'password'    => "@@smtp_password",
        'port'        => "@@smtp_port",
        'smtp_auth'   => true,
        'smtp_secure' => "ssl",
        'smtp_debug'  => 1
    ),
    'cookieSecretKey' => "ThIsIs@PerpLeXedP@ssw0rd",
    'curloptions' => array(
            CURLOPT_ENCODING       => '',
            CURLOPT_FOLLOWLOCATION => TRUE,
            CURLOPT_HEADER         => FALSE,
            //------- to remove all cache ---------------//
            CURLOPT_FRESH_CONNECT  => FALSE,
            CURLOPT_HTTPHEADER     => array("Content-type: application/json"),
            CURLOPT_SSL_VERIFYPEER => FALSE,
            CURLOPT_RETURNTRANSFER => TRUE,
            //------- for proxy set ---------------//
           // CURLOPT_PROXY => "127.0.0.1",
           // CURLOPT_PROXYPORT => "8888"
    ),
    'phpSettings'   => array(
        'max_execution_time'            => 600,
        'mbstring.internal_encoding'    => 'UTF-8',
    ),
);
