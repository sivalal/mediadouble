<?php

/*
--------------------------------------------------------------
PAGE VARIABLES
--------------------------------------------------------------
*/
if(isset($_GET['cnt'])){
    $team = $_GET['cnt'];
}else{
    $team = '';
}

// DATA
switch($team) {
    case 'mexico':
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-mexico.jpg';
        $bannerImage2 = 'img/banner-mexico-text-en.png';
        $copaLogo = 'img/copa-logo-en.png';
        $headline1 = 'Every game. Every goal. Anywhere you are.';
        $headline2 = 'Stream Copa America LIVE on Yaveo for only $7.99 a month.';
        $headlineCTA = 'Try it Free today!';
        $teamImage = 'img/mexico_copamodule_ENG.jpg';
        $teamHeadline = 'Live the excitement of Copa América with El Tri.';
        $teamText = 'Stream the games of the Mexican team plus all 26 games of Copa América LIVE. Enjoy the tournament at home, on the go, or wherever you are for only $7.99 a month! No contract. No satellite. Watch on your laptop, tablet, smartphone or Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = 'Sign up now!';
        $pageName = 'CopaMexico_En';
        break;
    case 'brazil':
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-brazil.jpg';
        $bannerImage2 = 'img/banner-brazil-text-en.png';
        $copaLogo = 'img/copa-logo-en.png';
        $headline1 = 'Every game. Every goal. Anywhere you are.';
        $headline2 = 'Stream Copa America LIVE on Yaveo for only $7.99 a month.';
        $headlineCTA = 'Try it Free today!';
        $teamImage = 'img/brazil_copamodule_ENG.jpg';
        $teamHeadline = 'Live the excitement of watching la Canarinha during Copa América.';
        $teamText = 'Stream the games of the Brazilian team plus all 26 games of Copa América LIVE. Enjoy the tournament at home, on the go, or wherever you are for only $7.99 a month! No contract. No satellite. Watch on your laptop, tablet, smartphone or Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = 'Sign up now!';
        $pageName = 'CopaBrazil_En';
        break;
    case 'colombia':
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-colombia.jpg';
        $bannerImage2 = 'img/banner-colombia-text.png';
        $copaLogo = 'img/copa-logo-en.png';
        $headline1 = 'Every game. Every goal. Anywhere you are.';
        $headline2 = 'Stream Copa America LIVE on Yaveo for only $7.99 a month.';
        $headlineCTA = 'Try it Free today!';
        $teamImage = 'img/columbia_copamodule_ENG.jpg';
        $teamHeadline = 'Follow los Cafeteros and live the excitement of Copa América.';
        $teamText = 'Stream the games of the Colombian team plus all 26 games of Copa América LIVE. Enjoy the tournament at home, on the go, or wherever you are for only $7.99 a month! No contract. No satellite. Watch on your laptop, tablet, smartphone or Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = 'Sign up now!';
        $pageName = 'CopaColombia_En';
        break;
    case 'argentina':
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-argentina.jpg';
        $bannerImage2 = 'img/banner-argentina-text.png';
        $copaLogo = 'img/copa-logo-en.png';
        $headline1 = 'Every game. Every goal. Anywhere you are.';
        $headline2 = 'Stream Copa America LIVE on Yaveo for only $7.99 a month.';
        $headlineCTA = 'Try it Free today!';
        $teamImage = 'img/argentina_copamodule_ENG.jpg';
        $teamHeadline = 'Live the excitement of seeing Messi and la Albiceleste during Copa América.';
        $teamText = 'Stream the games of the Argentinean team plus all 26 games of Copa América LIVE. Enjoy the tournament at home, on the go, or wherever you are for only $7.99 a month! No contract. No satellite. Watch on your laptop, tablet, smartphone or Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = 'Sign up now!';
        $pageName = 'CopaArgentina_En';
        break;
    default:
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-generic.jpg';
        $bannerImage2 = '';
        $copaLogo = 'img/copa-logo-generic-en.png';
        $headline1 = 'Every game. Every goal. Anywhere you are.';
        $headline2 = 'Stream Copa America LIVE on Yaveo for only $7.99 a month.';
        $headlineCTA = 'Try it Free today!';
        $teamImage = 'img/generic_copamodule_ENG.jpg';
        $teamHeadline = 'All the excitement of Copa América LIVE, on Yaveo for $7.99 a month!';
        $teamText = 'Stream all 26 games of Copa América LIVE. Enjoy the tournament at home, on the go, or wherever you are for only $7.99 a month! No contract. No satellite. Watch on your laptop, tablet, smartphone or Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = 'Sign up now!';
        $pageName = 'CopaGeneral_En';
        break;
}

?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- STYLESHEETS -->
        <link href="css/normalize.css" rel='stylesheet'>
        <link href="css/grid.css" rel='stylesheet'>
        <link href="css/main.css" rel='stylesheet'>
        <link href="fonts/yaveo/yaveofont.css" rel='stylesheet'>
        <link href="fonts/fontawesome/font-awesome.css" rel='stylesheet'>

        <script type="text/javascript" src="js/Ooyala_Omniture.js"></script>

        <script type="text/javascript">

            function resetEvars() {
                s.pageName = '';
                s.server = '';
                s.pageType = '';
                s.events = '';
                s.eVar17 = '';
                s.eVar8 = '';
                s.prop9 = '';
                s.eVar18 = '';
                s.eVar4 = '';
                s.eVar1 = '';
                s.prop1 = '';
                s.eVar2 = '';
                s.prop5 = s.eVar5 = '';
                s.eVar10 = '';
                s.eVar14 = '';
            }

            var s = Reporting.getReportingObject('dtvdirectvhottprod'); // 'dtvdtvdirectvhottest' for testing, 'dtvdirectvhottprod' for production
            s.channel = 'https:www.yaveo.com'; // https:www.yaveo.com for production
            resetEvars();

            var pageName = <?php echo "'".$pageName."'"; ?>; //replace with the page names listed below
            s.pageName = pageName;
            s.server = '';
            s.pageType = '';
            s.events = 'event1,event2';
            var accountNumber = ''; //Sessions.getCookie('userid');
            if (typeof accountNumber !== 'undefined') s.eVar17 = accountNumber;
            s.eVar1 = ''; //<subscriber_type> Subscriber/Non Subscribe //on page load
            s.prop1 = navigator.userAgent; //<device_type>
            s.prop9 = (typeof propNine !== 'undefined') ? propNine : '';
            s.eVar2 = ''; //package of the user //on page load
            //s.prop2='' //not known
            s.eVar3 = ''; //<search_term_typed> //on search
            s.prop3 = ''; //# of results from search //on search
            s.eVar4 = ''; //Piped origin of playback //on video playback
            s.prop4 = ''; //view type
            s.prop5 = s.eVar5 = 'en_EN'; //language of the page en_EN for english and es_ES 
            s.eVar7 = ''; //genre if applicable on page with genre info //on page load
            //s.prop7 //# of Videos in Watchlist //on page load of watchlist
            //s.eVar8 //<movie_title | Showname_Seasonid_Episodeid> //on video playback
            //s.prop8 //promocodes // on signup completion or new subscribtion
            //s.eVar9 //Name of social sharing network //on sharing video
            s.eVar10 = navigator.userAgent; //<device_type> //on page load
            //s.eVar12 //<connection_type> //not sure for web //on page load
            //s.eVar13 //<programmer_name>(if applicable) Only when user selects a network. Capital letter Network Name
            //on page load
            s.eVar14 = ''; //<subscription_type> // on signup completion
            //s.eVar15 //Number of videos in watchlist page //on page load
            //s.eVar16 //<promo_codes> // on signup completion
            var s_code = s.t();
            if (s_code) console.log(s_code);
            console.log(pageName);

        </script>

    </head>
    <body class="<?php echo $pageName; ?>">
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <!-- SITE CONTENT -->
        <div class="container">

            <div class="wrap">
                
                <div id="header">
                    <div class="row">
                        <div class="col-xs-6 col-sm-7">
                            <div class="logo-box">
                                <img src="img/yaveo-logo.png" class="img-responsive"/>
                            </div>
                        </div>
                        <div class="col-xs-6 col-sm-5">
                            <div id="logBox" class="hidden-xs">
                                <a href="<?php echo $loginLink; ?>" class="btn btn-blue btn-short">Log In</a>
                            </div>
                            <div id="langBox">
                                <div class="langswitch">
                                    <input type="checkbox" name="langswitch" class="langswitch-checkbox" id="langswitch">
                                    <label class="langswitch-label" for="langswitch">
                                        <span class="langswitch-inner"></span>
                                        <span class="langswitch-switch"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="banner">
                    
                    <div id="bannerImageBox">
                        <div class="cta-images">
                            <div class="row">
                                <?php if($copaLogo!='') { ?>
                                <div class="col-xs-12 col-sm-12">
                                    <div class="copa-logo">
                                        <img src="<?php echo $copaLogo; ?>" class="img-responsive"/>
                                    </div>
                                </div>
                                <?php } ?>
                                <?php if($bannerImage2!='') { ?>
                                <div class="col-xs-12 col-sm-12">
                                    <div class="text-logo">
                                        <img src="<?php echo $bannerImage2; ?>" class="img-responsive"/>
                                    </div>
                                </div>
                                <?php } ?>
                            </div>
                        </div>
                        <div class="banner-grad"></div>
                        <img id="bannerImage" src="<?php echo $bannerImage; ?>" class="img-responsive" alt=""/>
                    </div>


                    <div class="cta">
                        <div class="text">
                            <div class="headline main"><?php echo $headline1; ?></div>
                            <div class="headline secondary"><?php echo $headline2; ?></div>
                        </div>
                        <div class="button">
                            <a href="https://www.yaveo.com/selectPackage" class="btn btn-orange btn-tall"><?php echo $headlineCTA; ?></a>
                        </div>
                    </div>
                </div>

                <div class="content">

                    <div id="teamMod" class="module">
                        <div class="row">
                            <div class="col-xs-12 col-sm-5 col-md-5">
                                <img src="<?php echo $teamImage; ?>" class="img-responsive" alt=""/>
                            </div>
                            <div class="col-xs-12 col-sm-7 col-md-7">
                                <h2><?php echo $teamHeadline; ?></h2>
                                <p><?php echo $teamText; ?></p>
                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-8 col-lg-6">
                                        <a href="<?php echo $teamMoreLink; ?>" class="btn btn-orange btn-tall btn-block"><?php echo $teamMoreLinkText; ?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="contentMod" class="module">
                        <div class="row">
                            <div class="col-xs-12 col-sm-5 col-md-5">
                                <img src="img/content-wall.jpg" class="img-responsive" alt=""/>
                            </div>
                            <div class="col-xs-12 col-sm-7 col-md-7">
                                <h2>Larger than life entertainment for the whole family to enjoy.</h2>
                                <p>With Yaveo, you will have access to the best European soccer leagues LIVE from beIN SPORTS en Español and thousands of hours of current and classic ON-DEMAND programming from Latin America, Spain and the U.S.</p>
                            </div>
                        </div>
                    </div>

                    <div id="promo" class="module">
                        <div class="row">
                            <div class="col-xs-12 hidden-sm hidden-md hidden-lg hidden-xl">
                                <img src="img/devices-image-stacked.png" class="img-responsive" alt=""/>
                            </div>
                            <div class="col-xs-12 col-sm-5 col-md-5">
                                <h2>Don’t miss a moment of your favorites—take them with you!</h2>
                                <p>You can enjoy Yaveo wherever and whenever, using a computer, tablet, smartphone, or Xbox 360<sup>&reg;</sup>. All you have to do is connect to the Internet. With Yaveo, you’ll never miss what you love to watch most.</p>
                            </div>
                            <div class="hidden-xs col-sm-7 col-md-7">
                                <img src="img/devices-horizontal_english.png" class="img-responsive" alt=""/>
                            </div>
                        </div>
                    </div>

                    <div id="offerMod" class="module">
                        <div class="row">
                            <div class="col-xs-12 col-sm-5 col-md-5">
                                <img src="img/free_week.jpg" class="img-responsive" alt=""/>
                            </div>
                            <div class="col-xs-12 col-sm-7 col-md-7">
                                <h2>Only $7.99 a month. Your first week is on us!</h2>
                                <p>You don’t have to be a DIRECTV customer to enjoy Yaveo! The first week is free and Yaveo is only $7.99 a month after your trial period ends.* No contract or satellite is required. Enjoy the best Spanish-language entertainment your way!</p>
                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-9 col-lg-7">
                                        <a href="https://www.yaveo.com/selectPackage" class="btn btn-orange btn-tall btn-block">Start Your Free Week!</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div id="footer" class="textcenter">
                    <a href="#" class="back-to-top"><i class="fa fa-chevron-up fa-2x"></i></a>
                    <ul class="disclaimer">
                        <li>*Only two programs may be streamed at the same time.</li>
                        <li>Live channels included for a limited time with the Yaveo $7.99 service. See the <a href="https://www.yaveo.com/offerdetails/index_en.html" target="_blank">offer details</a> for more information. Offer ends 7/31/15.</li>
                        <li>Service only available in the United States (excluding Puerto Rico and US Territories). All functions and programming subject to change at any time.</li>
                    </ul>
                    <ul class="list-inline">
                        <li class="blue-text">&copy;2015 DIRECTV DIGITAL LLC | </li>
                        <li><a href="https://www.yaveo.com/pp">Privacy Policy</a></li>
                        <li><a href="https://www.yaveo.com/tou">Terms of Use</a></li>
                        <li><a href="https://help.yaveo.com">Help</a></li>
                    </ul>
                    
                </div>

            </div>
            
        </div>

        <!-- Google Tag Manager -->
        <noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-5J7G8D" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5J7G8D');</script>
        <!-- End Google Tag Manager -->


        <!-- JAVASCRIPT GOES HERE -->
        <script src="js/jquery.min.js"></script>
        <script src="js/jquery-ui.min.js"></script>
        <script src="js/modernizr.js"></script>
        <script src="js/main.js"></script>
    </body>
</html>