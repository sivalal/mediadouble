'use strict';

angular.module('services.config', [])
  .constant('configuration', {
    server_url: 'http://local.hottdirectv.com',
    client_url: 'http://local.hottdirectv.com',
    app_build_number: 'Build v1.6.3-(5660)',
    gigya_api_key: '3_S-RFzoSriGGKpRr4PT2aM4W-il0xUamIxH-eWy46vco8Nq-Q91Vu7_b8gBspj2TU',
    omniture_rsid: 'dtvdtvdirectvhottest',
    fw_site_section_id:'test_site_section',
    fw_site_section_id_mob:'test_site_section',
    fw_mrm_network_id:'382100',
    fw_player_profile:'382100:hott_as3_test',
    html5_player_profile:'382100:hott_js_test',
    adManager:'http://adm.fwmrm.net/p/hott_as3_test/AdManager.swf',
    fw_ad_module_js:'http://adm.fwmrm.net/p/hott_js_test/AdManager.js',
    smtp_host:'http://adm.fwmrm.net/p/hott_js_test/AdManager.js',
    smtp_username:'AKIAJNFB4YX2VDNBZ2TQ',
    smtp_password:'ArqNRYr2LTO6GchUvISuC9De/d29YKavy22vAhMscL/I',
    smtp_port:'587',
    youbora_account_code:'dtvdev',
    youbora_service:'',
    default_language:'en_US',
    ios_app_id : '949616101',
    ios_app_name : 'Yaveo',
    android_app_id : 'tv.accedo.hott',
    android_app_name : 'Yaveo'
  });
