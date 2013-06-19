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
	  		$(image).attr('width', 300);
	  		$(image).attr('height', 300);
  		}
  	}
  };

  $('.wysiwyg').bind('DOMSubtreeModified', dom_modified_findimages);
  $('.wysiwyg').bind('DOMSubtreeModified', dom_modified_parseimages);
}
