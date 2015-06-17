
$(function(){

	
$('#videoBox #videoTrigger img').on( 'click', function(){
        $('#video').attr('src','http://player.vimeo.com/video/120851485?api=1&player_id=video&autoplay=1');
		setTimeout(function(){
            $('#videoBox #videoTrigger').remove();
           
            
        },500);
	});
});




