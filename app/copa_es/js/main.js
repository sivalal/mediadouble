/*
--------------------------------------------------------------
DOM READY
--------------------------------------------------------------
*/
$(function(){
	$('#langswitch').change(function(){
		var url = window.location.toString();
		window.location = url.replace('/copa_es','/copa_en');
	});

	$('.back-to-top').on('click', function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
    	return false;
	});
});

/*
--------------------------------------------------------------
FUNCTIONS
--------------------------------------------------------------
*/