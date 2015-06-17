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
        $bannerImage2 = 'img/banner-mexico-text-es.png';
        $copaLogo = 'img/copa-logo-es.png';
        $headline1 = 'Todos los partidos. Todos los goles. Donde quiera que estés.';
        $headline2 = 'Haz streaming de Copa América EN VIVO en Yaveo por solo $7.99 al mes.';
        $headlineCTA = '¡Pruébalo gratis hoy!';
        $teamImage = 'img/mexico_copamodule_ESP.jpg';
        $teamHeadline = 'Vive con el Tri toda la emoción de la Copa América.';
        $teamText = 'Haz streaming y disfruta en tu casa, en la calle o donde estés, los juegos de la selección mexicana y todos los 26 partidos de la Copa América en vivo, por solo $7.99 al mes. Sin contrato y sin satélite. Velos en tu laptop, tableta, smartphone o Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = '¡Conéctate ya!';
        $pageName = 'CopaMexico_Es';
        break;
    case 'brazil':
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-brazil.jpg';
        $bannerImage2 = 'img/banner-brazil-text-es.png';
        $copaLogo = 'img/copa-logo-es.png';
        $headline1 = 'Todos los partidos. Todos los goles. Donde quiera que estés.';
        $headline2 = 'Haz streaming de Copa América EN VIVO en Yaveo por solo $7.99 al mes.';
        $headlineCTA = '¡Pruébalo gratis hoy!';
        $teamImage = 'img/brazil_copamodule_ESP.jpg';
        $teamHeadline = 'Vive la emoción de ver a la Canarinha en la Copa América.';
        $teamText = 'Haz streaming y disfruta en tu casa, en la calle o donde estés, los juegos de la selección brasileña y todos los 26 partidos de la Copa América en vivo, por solo $7.99 al mes. Sin contrato y sin satélite. Velos en tu laptop, tableta, smartphone o Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = '¡Conéctate ya!';
        $pageName = 'CopaBrazil_Es';
        break;
    case 'colombia':
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-colombia.jpg';
        $bannerImage2 = 'img/banner-colombia-text.png';
        $copaLogo = 'img/copa-logo-es.png';
        $headline1 = 'Todos los partidos. Todos los goles. Donde quiera que estés.';
        $headline2 = 'Haz streaming de Copa América EN VIVO en Yaveo por solo $7.99 al mes.';
        $headlineCTA = '¡Pruébalo gratis hoy!';
        $teamImage = 'img/columbia_copamodule_ESP.jpg';
        $teamHeadline = 'Sigue a los Cafeteros y vive la emoción de la Copa América.';
        $teamText = 'Haz streaming y disfruta en tu casa, en la calle o donde estés, los juegos de la selección colombiana y todos los 26 partidos de la Copa América en vivo, por solo $7.99 al mes. Sin contrato y sin satélite. Velos en tu laptop, tableta, smartphone o Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = '¡Conéctate ya!';
        $pageName = 'CopaColombia_Es';
        break;
    case 'argentina':
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-argentina.jpg';
        $bannerImage2 = 'img/banner-argentina-text.png';
        $copaLogo = 'img/copa-logo-es.png';
        $headline1 = 'Todos los partidos. Todos los goles. Donde quiera que estés.';
        $headline2 = 'Haz streaming de Copa América EN VIVO en Yaveo por solo $7.99 al mes.';
        $headlineCTA = '¡Pruébalo gratis hoy!';
        $teamImage = 'img/argentina_copamodule_ESP.jpg';
        $teamHeadline = 'Vive la emoción de ver a Messi y a la Albiceleste en la Copa América..';
        $teamText = 'HHaz streaming y disfruta en tu casa, en la calle o donde estés, los juegos de la selección argentina y todos los 26 partidos de la Copa América en vivo, por solo $7.99 al mes. Sin contrato y sin satélite. Velos en tu laptop, tableta, smartphone o Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = '¡Conéctate ya!';
        $pageName = 'CopaArgentina_Es';
        break;
    default:
        $loginLink = 'https://www.yaveo.com/login';
        $bannerImage = 'img/banner-generic.jpg';
        $bannerImage2 = '';
        $copaLogo = 'img/copa-logo-generic-es.png';
        $headline1 = 'Todos los partidos. Todos los goles. Donde quiera que estés.';
        $headline2 = 'Haz streaming de Copa América EN VIVO en Yaveo por solo $7.99 al mes.';
        $headlineCTA = '¡Pruébalo gratis hoy!';
        $teamImage = 'img/generic_copamodule_ESP.jpg';
        $teamHeadline = 'Toda la emoción de la Copa América EN VIVO, en Yaveo por $7.99 por mes!';
        $teamText = 'Haz streaming y disfruta en tu casa, en la calle o donde estés, todos los 26 partidos de la Copa América en vivo, por solo $7.99 al mes. Sin contrato y sin satélite. Velos en tu laptop, tableta, smartphone o Xbox360<sup>&reg;</sup>.*';
        $teamMoreLink = 'https://www.yaveo.com/selectPackage';
        $teamMoreLinkText = '¡Conéctate ya!';
        $pageName = 'CopaGeneral_Es';
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
            s.prop5 = s.eVar5 = 'es_ES'; //language of the page en_EN for english and es_ES 
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
                                    <input type="checkbox" name="langswitch" class="langswitch-checkbox" id="langswitch" checked>
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
                                <h2>Entretenimiento en grande para que lo disfrute toda la familia.</h2>
                                <p>Con Yaveo disfruta EN VIVO de lo mejor de las ligas de fútbol europeas con beIN SPORTS en español y miles de horas de programación ON DEMAND de Latinoamérica, España y los E.E.U.U.</p>
                            </div>
                        </div>
                    </div>

                    <div id="promo" class="module">
                        <div class="row">
                            <div class="col-xs-12 hidden-sm hidden-md hidden-lg hidden-xl">
                                <img src="img/devices-image-stacked.png" class="img-responsive" alt=""/>
                            </div>
                            <div class="col-xs-12 col-sm-5 col-md-5">
                                <h2>¡Nunca te pierdas tus programas favoritos! Llévalos contigo.</h2>
                                <p>Tú puedes disfrutar Yaveo donde y cuando quieras usando una computadora, tableta, smartphone o Xbox360<sup>&reg;</sup>. Todo lo que tienes que hacer es conectarte al Internet. Con Yaveo, jamás te perderás lo que más te gusta ver.</p>
                            </div>
                            <div class="hidden-xs col-sm-7 col-md-7">
                                <img src="img/devices-horizontal_spanish.png" class="img-responsive" alt=""/>
                            </div>
                        </div>
                    </div>

                    <div id="offerMod" class="module">
                        <div class="row">
                            <div class="col-xs-12 col-sm-5 col-md-5">
                                <img src="img/free_week.jpg" class="img-responsive" alt=""/>
                            </div>
                            <div class="col-xs-12 col-sm-7 col-md-7">
                                <h2>Solo $7.99 al mes. ¡Te regalamos la primera semana!</h2>
                                <p>¡No tienes que ser un cliente de DIRECTV para disfrutar Yaveo! La primera semana es gratis y, al terminar el periodo de prueba, Yaveo solo cuesta $7.99 al mes. No se requiere contrato ni satélite. ¡Disfruta del mejor entretenimiento en español a tu manera!</p>
                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-11 col-lg-8">
                                        <a href="https://www.yaveo.com/selectPackage" class="btn btn-orange btn-tall btn-block">¡Comienza tu semana gratis!</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div id="footer" class="textcenter">
                    <a href="#" class="back-to-top"><i class="fa fa-chevron-up fa-2x"></i></a>
                    <ul class="disclaimer">
                        <li>*Solo pueden verse por streaming dos programas a la vez. Las funcionalidades varian según el dispositivo compatible.</li>
                        <li>Los canales en vivo están incluidos por tiempo limitado en el servicio de Yaveo de $7.99. Ve los <a href="https://www.yaveo.com/offerdetails/index_es.html" target="_blank">Detalles de la oferta</a> para más información. La oferta termina el 31 de julio de 2015.</li>
                        <li>Este servicio solo está disponible en Estados Unidos (excepto Puerto Rico). Todas las funcionalidades y la programación están sujetas acambio en cualquier momento. </li>
                    </ul>
                    <ul class="list-inline">
                        <li class="blue-text">&copy;2015 DIRECTV DIGITAL LLC | </li>
                        <li><a href="https://www.yaveo.com/pp">Política de privacidad</a></li>
                        <li><a href="https://www.yaveo.com/tou">Términos de uso</a></li>
                        <li><a href="https://ayuda.yaveo.com">Ayuda</a></li>
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