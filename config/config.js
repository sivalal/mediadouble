'use strict';

angular.module('services.config', [])
  .constant('configuration', {
    server_url: '@@server_url',
    client_url: '@@client_url',
    app_build_number: '@@app_build_number',
    gigya_api_key: '@@gigya_api_key',
    omniture_rsid: '@@omniture_rsid',
    fw_site_section_id:'@@fw_site_section_id',
    fw_site_section_id_mob:'@@fw_site_section_id_mob',
    fw_mrm_network_id:'@@fw_mrm_network_id',
    fw_player_profile:'@@fw_player_profile',
    html5_player_profile:'@@html5_player_profile',
    adManager:'@@adManager',
    fw_ad_module_js:'@@fw_ad_module_js',
    smtp_host:'@@fw_ad_module_js',
    smtp_username:'@@smtp_username',
    smtp_password:'@@smtp_password',
    smtp_port:'@@smtp_port',
    youbora_account_code:'@@youbora_account_code',
    youbora_service:'@@youbora_service',
    default_language:'@@default_language',
    ios_app_id : '@@ios_app_id',
    ios_app_name : '@@ios_app_name',
    android_app_id : '@@android_app_id',
    android_app_name : '@@android_app_name'
  });
