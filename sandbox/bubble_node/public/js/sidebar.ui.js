
$(document).ready(function(){
	$('.side-bar button').click(function(){
	  $('.side-bar button').removeClass('active');
	  $(this).addClass('active');
	});

	$('.bubbles a').click(function(){
		$('.bubbles a').removeClass('tab-active');
		$(this).addClass('tab-active');
	});
});