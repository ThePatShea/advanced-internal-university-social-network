Template.wysiwyg.rendered = function() {
  files = [];
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

  $("#fileuploadtool").slideToggle();
};


Template.wysiwyg.events({
  'click #fileattachments': function(){
    $("#fileuploadtool").slideToggle();
  },


  'dragover #drop_zone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop #drop_zone': function(evt){
    l = document.getElementById('list');
    while(l.hasChildNodes()){
      l.removeChild(l.lastChild);
    };
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();

    if(typeof files == 'undefined'){
      files = [];
     for(var i = 0, f; f=evt.dataTransfer.files[i]; i++){
        files.push(evt.dataTransfer.files[i]);
      };
    }
    else{
      console.log(files);
      for(var i = 0, f; f=evt.dataTransfer.files[i]; i++){
        files.push(evt.dataTransfer.files[i]);
      };
    }
    
    for (var i = 0, f; f = files[i]; i++) {


      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        // Render thumbnail.
        var span = document.createElement('span');
        span.innerHTML = ['<img class="previewthumb" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('list').insertBefore(span, null);
        };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
      }

      //If it is a PDF then render a PDF icon
      else if (f.type.match('pdf.*')){
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        //Render a PDF icon
        var span = document.createElement('span');
        span.innerHTML = ['<div class="pdf-icon">', 'PDF', escape(theFile.name), '</div>'].join('');
        document.getElementById('list').insertBefore(span, null);
        };
        })(f);

        //Read file as a data url.
        reader.readAsDataURL(f);
      }
      else if (f.type.match('msword.*') || f.type.match('ms-excel.*') || f.type.match('officedocument.*')){
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        //Render a PDF icon
        var span = document.createElement('span');
        span.innerHTML = ['<div class="word-icon">', 'Word Document: ', escape(theFile.name), '</div>'].join('');
        document.getElementById('list').insertBefore(span, null);
        };
        })(f);

        //Read file as a data url.
        reader.readAsDataURL(f);
      }
      else{
        console.log('Else');
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            console.log(e.target.result);
          };
        })(f);

        reader.readAsDataURL(f);
      }


    }
  },

  'change #filesToUpload': function(evt){
    //files = evt.target.files;
    l = document.getElementById('list');
    while(l.hasChildNodes()){
      l.removeChild(l.lastChild);
    };

    if(typeof files == 'undefined'){
      files = [];
      for(var i = 0, f; f=evt.target.files[i]; i++){
        files.push(evt.target.files[i]);
      }
    }
    else{
      for(var i = 0, f; f=evt.target.files[i]; i++){
        files.push(evt.target.files[i]);
      }
    }

    l = document.getElementById('list');
    while(l.hasChildNodes()){
      l.removeChild(l.lastChild);
    };

    for (var i = 0, f; f = files[i]; i++) {


      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        // Render thumbnail.
        var span = document.createElement('span');
        span.innerHTML = ['<img class="previewthumb" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('list').insertBefore(span, null);
        };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
      }

      //If it is a PDF then render a PDF icon
      else if (f.type.match('pdf.*')){
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        //Render a PDF icon
        var span = document.createElement('span');
        span.innerHTML = ['<div class="pdf-icon">', 'PDF', escape(theFile.name), '</div>'].join('');
        document.getElementById('list').insertBefore(span, null);
        };
        })(f);

        //Read file as a data url.
        reader.readAsDataURL(f);
      }
      else if (f.type.match('msword.*') || f.type.match('ms-excel.*') || f.type.match('officedocument.*')){
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        //Render a PDF icon
        var span = document.createElement('span');
        span.innerHTML = ['<div class="word-icon">', 'Word Document: ', escape(theFile.name), '</div>'].join('');
        document.getElementById('list').insertBefore(span, null);
        };
        })(f);

        //Read file as a data url.
        reader.readAsDataURL(f);
      }
      else{
        console.log('Else');
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            console.log(e.target.result);
          };
        })(f);

        reader.readAsDataURL(f);
      }
    }

}

})