function responsive_resize(){
 	var current_width = $(window).width();
 	var videoBoxHeight = $('#video').height();

    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
    	if(current_width > 320){
	      $('#videoTrigger').css({'height':videoBoxHeight+'px'});
	 	}
    }
}

$(window).resize(function(){
     responsive_resize();
});

$(function(){
	
	responsive_resize();

	var player = $('iframe');
    var url = window.location.protocol + player.attr('src').split('?')[0];
    var status = $('.status');

    // Listen for messages from the player
    if (window.addEventListener){
        window.addEventListener('message', onMessageReceived, false);
    }
    else {
        window.attachEvent('onmessage', onMessageReceived, false);
    }

    // Handle messages received from the player
    function onMessageReceived(e) {
        var data = JSON.parse(e.data);
        
        switch (data.event) {
            case 'ready':
                onReady();
                break;
               
            case 'playProgress':
                onPlayProgress(data.data);
                break;
                
            case 'pause':
                onPause();
                break;
               
            case 'finish':
                onFinish();
                break;
        }
    }

    // Helper function for sending a message to the player
    function post(action, value) {
        var data = {
          method: action
        };
        
        if (value) {
            data.value = value;
        }
        
        var message = JSON.stringify(data);
        player[0].contentWindow.postMessage(data, url);
    }

    function onReady() {
        if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
			$('#videoTrigger').css({'height':$('#video').height()+'px'});
		}
        post('setVolume','0');
        post('setLoop',false);
        post('play');
    }

    function onPause() {
        console.log("paused");
    }

    function onFinish() {
        console.log("finished");
    }

	$('#videoBox #videoTrigger img').on( 'click', function(){
        $('#video').attr('src','//player.vimeo.com/video/120851486?api=1&player_id=video');
		setTimeout(function(){
            $('#videoBox #videoTrigger').remove();
            $('#video').load(function(e) { 
                post('setVolume','0.7');
            });
            
        },500);
	});
});




