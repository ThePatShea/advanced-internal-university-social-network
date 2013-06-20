Template.wysiwyg.rendered = function() {
  $('.wysiwyg').wysiwyg();

  var maxwidth = 300;
  var maxheight = 300;

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
  			//are greater than the maxwidth or maxheight, then the image is
  			//drawn on an HTML5 canvas element and re-scaled. This keeps small
  			//images untouched, while shrinking larger images.
  			//Aspect ratio is preserved.
    		$(image).load(function(){
    			var mycanvas = document.createElement('canvas');
		  		width = $(this).width();
		  		height = $(this).height();
		  		var ratio = 1;
		  		if(width > maxwidth){
		  			ratio = maxwidth / width;
		  		}
		  		else if(height > maxheight){
		  			ratio = maxheight / height;
		  		}

		  		mycanvas.width = width*ratio;
		  		mycanvas.height = height*ratio;

		  		console.log(width, height);
		  		if(width > maxwidth || height > maxheight){
			  		var context = mycanvas.getContext('2d');
			  		context.drawImage(this, 0, 0, mycanvas.width, mycanvas.height);
			  		var imagedata = mycanvas.toDataURL();
			  		$(this).attr("src", imagedata);
		  		}
		  	});

  		}
  	}
  };

  $('.wysiwyg').bind('DOMSubtreeModified', dom_modified_findimages);
  $('.wysiwyg').bind('DOMSubtreeModified', dom_modified_parseimages);
}
