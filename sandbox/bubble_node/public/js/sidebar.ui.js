
$(document).ready(function(){
	$('.side-bar button').click(function(){
	  $('.side-bar button').removeClass('active');
	  $(this).addClass('active');
	});

	
	$(function(){
	    $('.hasItems .activate').click(function(e){
	        var parent = $(this).parent().toggleClass('drop-active'); // Variable
	        $('.hasItems.drop-active').not(parent).removeClass('drop-active'); // Removes the class dropactive from the <li> on click.
	        e.stopPropagation();
	    });
	    $(document).click(function(e) {
	       $('.hasItems.drop-active').removeClass('drop-active'); // Makes the dropdown function like the old style(facebook style aswell).
	    });
	});
});