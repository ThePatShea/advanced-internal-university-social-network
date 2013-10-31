
$(document).ready(function(){
	$('.side-bar button').click(function(){
	  $('.side-bar button').removeClass('active');
	  $(this).addClass('active');
	});



	$('.user-menu li').click(function(){
	  var thisClass = $(this).attr('class');
	  if(thisClass != undefined){
	    if(thisClass.indexOf('hasItems') != -1){
	      $(this).addClass('drop-active');
	    }
	    else{
	      $('.user-menu li').removeClass('drop-active');
	    }
	  }
	  else{
	    $('.user-menu li').removeClass('drop-active');
	  }
	});

	// $('.user-menu li').click(function(){
	//   var thisClass = $(this).attr('class');
	//   if(thisClass.indexOf('hasItems') != -1){
	//     $(this).addClass('drop-active');
	//   } else {
	  	
	//   }
	// });
});