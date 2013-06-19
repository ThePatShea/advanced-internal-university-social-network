Template.wysiwyg.rendered = function() {
  $('.wysiwyg').wysiwyg();

  /*Two handlers are bound to the DOMSubtreeModified event
  dom_modified_findimages looks for new images and marks them as unparsed.
  dom_modified_parseimages looks for unparsed images, changes their width
  and height, and then marks them as parsed.
  */


  dom_modified_findimages = function(e){
  	images = $(e.srcElement).find('img');
  	for(var i = 0; i < images.length; i++){
  		var image = images[i];
  		if($(image).attr('class') != 'parsed'){
  			$(image).attr('class', 'unparsed');
  		}
  	}
  };

  dom_modified_parseimages = function(e){
  	//console.log(e);
  	images = $(e.srcElement).find('img');
  	for(var i = 0; i < images.length; i++){
  		var image = images[i];
  		if($(image).attr('class') != 'parsed'){
  			$(image).attr('class', 'parsed');

  			//The height and width of each image is checked, and if either
  			//are greater than 300, then the image height and width attributes
  			//are reset to 300. This keeps small images untouched, while
  			//shrinking larger images. Aspect ratio is preserved.
    		$(image).load(function(){
		  		width = $(image).width();
		  		height = $(image).height();
		  		console.log(width, height);
		  		if(width > 300 || height > 300){
			  		$(image).attr('width', 300);
			  		$(image).attr('height', 300);	
		  		}
		  	});

  		}
  	}
  };

  $('.wysiwyg').bind('DOMSubtreeModified', dom_modified_findimages);
  $('.wysiwyg').bind('DOMSubtreeModified', dom_modified_parseimages);
}
