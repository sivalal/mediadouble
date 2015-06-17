/*
--------------------------------------------------------------
DOM READY
--------------------------------------------------------------
*/
$(function(){
	$('#searchForm label').inFieldLabels();

	$('.back-to-top').on('click', function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
    	return false;
	});
	
});

/*
--------------------------------------------------------------
FUNCITONS
--------------------------------------------------------------
*/
// inFieldLabels
(function(e){e.InFieldLabels=function(t,n,r){var i=this;i.$label=e(t);i.label=t;i.$field=e(n);i.field=n;i.$label.data("InFieldLabels",i);i.showing=true;i.init=function(){var t;i.options=e.extend({},e.InFieldLabels.defaultOptions,r);if(i.options.className){i.$label.addClass(i.options.className)}setTimeout(function(){if(i.$field.val()!==""){i.$label.hide();i.showing=false}else{i.$label.show();i.showing=true}},200);i.$field.focus(function(){i.fadeOnFocus()}).blur(function(){i.checkForEmpty(true)}).bind("keydown.infieldlabel",function(e){i.hideOnChange(e)}).bind("paste",function(){i.setOpacity(0)}).change(function(){i.checkForEmpty()}).bind("onPropertyChange",function(){i.checkForEmpty()}).bind("keyup.infieldlabel",function(){i.checkForEmpty()});if(i.options.pollDuration>0){t=setInterval(function(){if(i.$field.val()!==""){i.$label.hide();i.showing=false;clearInterval(t)}},i.options.pollDuration)}};i.fadeOnFocus=function(){if(i.showing){i.setOpacity(i.options.fadeOpacity)}};i.setOpacity=function(e){i.$label.stop().animate({opacity:e},i.options.fadeDuration,function(){if(e===0){i.$label.hide()}});i.showing=e>0};i.checkForEmpty=function(e){if(i.$field.val()===""){i.prepForShow();i.setOpacity(e?1:i.options.fadeOpacity)}else{i.setOpacity(0)}};i.prepForShow=function(){if(!i.showing){i.$label.css({opacity:0}).show();i.$field.bind("keydown.infieldlabel",function(e){i.hideOnChange(e)})}};i.hideOnChange=function(e){if(e.keyCode===16||e.keyCode===9){return}if(i.showing){i.$label.hide();i.showing=false}i.$field.unbind("keydown.infieldlabel")};i.init()};e.InFieldLabels.defaultOptions={fadeOpacity:.5,fadeDuration:300,pollDuration:0,enabledInputTypes:["text","search","tel","url","email","password","number","textarea"],className:false};e.fn.inFieldLabels=function(t){var n=t&&t.enabledInputTypes||e.InFieldLabels.defaultOptions.enabledInputTypes;return this.each(function(){var r=e(this).attr("for"),i,s;if(!r){return}i=document.getElementById(r);if(!i){return}s=e.inArray(i.type,n);if(s===-1&&i.nodeName!=="TEXTAREA"){return}new e.InFieldLabels(this,i,t)})}})(jQuery);