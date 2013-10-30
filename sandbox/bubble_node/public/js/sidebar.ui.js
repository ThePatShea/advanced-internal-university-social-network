
$(document).ready(function(){
	$('.side-bar button').click(function(){
	  $('.side-bar button').removeClass('active');
	  $(this).addClass('active');
	});
});