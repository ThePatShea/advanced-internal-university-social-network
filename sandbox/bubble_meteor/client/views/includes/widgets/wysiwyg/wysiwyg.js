Template.wysiwyg.created = function () {
  this.currentPostId  =  Session.get('currentPostId');
  this.addToDropZone  =  function(attachment) {

  /* TODO: UPDATE THE PART THAT ADDS BACK EXISTING FILES DURING EDIT POST. TEST IF IT WORKS.
    var fileList;
  
    for (var i = 0; i < post.children.length; i++)
      fileList  +=  getFileTypeControls( Posts.findOne({_id: post.children[i]}) ).html;
         
    $("#list").append(fileList);
  */





 /* //OLD Function

  // Initializes controls for each file type
    var fileTypeControls  =  {
        other : {
            html  : function(attachment) {
              return "<li><div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + attachment.name + "</div></div></li>";
            }
          , check : function(attachment) {
              return attachment.fileType.match('pdf.*') || attachment.fileType.match('msword.*') || attachment.fileType.match('ms-excel.*') || attachment.fileType.match('officedocument.*');
            }
        }
      , img : {
            html  : function(attachment) {
              return "<li><img name='" + attachment.name + "' class='previewthumb' src='" + attachment.file + "'/></li>";
            }
          , check : function(attachment) {
              return attachment.fileType.match("image.*");
            }
        }
    };
     
    var getFileTypeControls  =  function(attachment) {
      console.log("getFileTypeControls ran");  // TESTING
      if      ( fileTypeControls.other.check(attachment) )
        return fileTypeControls.other;
      else if ( fileTypeControls.img.check(attachment)   )
        return fileTypeControls.img;
      else
        return false;
    }

    var currentControls = getFileTypeControls(attachment);

    if (currentControls && $("#list").html().indexOf(attachment.name) == -1)
      $("#list").append( currentControls.html(attachment) );
 //*/









// New Function
    if ( attachment.fileType.match('image.*') || attachment.fileType.match('pdf.*') || attachment.fileType.match('msword.*') || attachment.fileType.match('ms-excel.*') || attachment.fileType.match('officedocument.*') )
      $("#list").append("<li><div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + attachment.name + "</div></div></li>");





  } 
}


Template.wysiwyg.rendered = function() {
  $(".wysiwyg").wysiwyg();






  $("#fileuploadtool").slideToggle();






  // Initalizes variables
    var maxheight      =  300;
    var maxwidth       =  300;
    removed            =  [];
    files              =  [];




  // Looks for new images and marks them as unparsed
    dom_modified_findimages = function(e){
    	images = $(e.srcElement).find('img');
    	for(var i = 0; i < images.length; i++){
    		var image = images[i];
    		if($(image).attr('class') != 'parsed'){
    			$(image).attr('class', 'unparsed');
    		}
    	}
    };


  // Looks for unparsed images, changes their width and height, and then marks them as parsed
    dom_modified_parseimages = function(e){
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




  // Calls functions when the page is rendered
    $('.wysiwyg').bind('DOMSubtreeModified', dom_modified_parseimages);
    $('.wysiwyg').bind('DOMSubtreeModified', dom_modified_findimages);


  // If the user is modifying an existing post, it puts that post's existing attachments in the drop zone
    if (this.currentPostId)
      this.addToDropZone( Posts.findOne({_id: this.currentPostId}) );
};


Template.wysiwyg.events({
  'click #fileattachments': function(){
    $("#fileuploadtool").slideToggle();
  },


  'dragover #drop_zone': function(evt){
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop #drop_zone': function(evt, tmpl){
    evt.stopPropagation();
    evt.preventDefault();
     
    if (typeof files == 'undefined') {
      files = [];
      for(var i = 0, f; f=evt.dataTransfer.files[i]; i++){
        files.push(evt.target.files[i]);
      }
    } else {
      for(var i = 0, f; f=evt.dataTransfer.files[i]; i++){
        files.push(evt.dataTransfer.files[i]);
      }
    }

    if (this.currentPostId) {
      var post = Posts.findOne({_id: this.currentPostId});
      var attachments = [];
      for(var i = 0; i < post.children.length; i++){
        var removeIt = false;
        for(var j=0; j < removed.length; j++){
          if(post.children[i] == removed[j]){
            removeIt = true;
            break;
          }
        }
        if(removeIt == false){
          this.addToDropZone( Posts.findOne({_id: this.currentPostId}) );
        }
      }
    }

    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

      reader.tmpl           =  tmpl;
      reader.tmpl.fileType  =  f.type;

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
      return function(e) {
      var fname         =  theFile.name;

      // Render thumbnail.
      theFile.fileType          =  reader.tmpl.fileType;
      theFile.file              =  e.target.result;

      this.tmpl.addToDropZone(theFile);
      };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }


  },

  'change #filesToUpload': function(evt, tmpl){


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

    if(this.currentPostId){
      console.log('Editing');
      var post = Posts.findOne({_id: this.currentPostId});
      var attachments = [];
      for(var i = 0; i < post.children.length; i++){
        var removeIt = false;
        for(var j=0; j < removed.length; j++){
          if(post.children[i] == removed[j]){
            removeIt = true;
            break;
          }
        }
        if(removeIt == false){
          var attachment = Posts.findOne({_id: post.children[i]});
          this.addToDropZone(attachment);          
        }
      }
    }

    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

      reader.tmpl           =  tmpl;
      reader.tmpl.fileType  =  f.type;

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
      return function(e) {
      var fname         =  theFile.name;

      // Render thumbnail.
      theFile.fileType          =  reader.tmpl.fileType;
      theFile.file              =  e.target.result;

      this.tmpl.addToDropZone(theFile);
      };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }

  },

  'click .unsaved-remove': function(e){
      console.log(e.target.id);
      var updated_files = [];
      for(var i = 0; i < files.length; i++){
        console.log(files[i].name, e.target.id);
        if(files[i].name != e.target.id){
          updated_files.push(files[i]);
        }
      }
      $(e.target).parent().remove();
      files = updated_files;
    },


  'click .saved-remove': function(e){
    console.log(e.target.id);
    //Posts.remove({_id: e.target.id});
    if(typeof removed == 'undefined'){
      removed = [];
      removed.push(e.target.id);
    }
    else{
      removed.push(e.target.id);
    }
    $(e.target).parent().remove();
  }

})
