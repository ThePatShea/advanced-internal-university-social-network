Template.fileSubmit.events({

  'submit form': function(e, template) {
    e.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create File', $(event.target).find('[name=name]').val()]);
    
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = (function(f){
        return function(e) {
          console.log(f.type, f.size);
          
          createPost({
            name: escape(f.name),
            file: e.target.result,
            fileType: f.type,
            fileSize: f.size,
            postType: 'file',
            numDownloads: 0,
            lastDownloadTime: new Date().getTime(),
            bubbleId: Session.get('currentBubbleId')
          });
        }
      })(f);
      reader.readAsDataURL(f);
    }
  },

  'dragover #drop_zone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop #drop_zone': function(evt){
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files;
    
    for (var i = 0, f; f = files[i]; i++) {


      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        // Render thumbnail.
        var li = document.createElement('li');
        li.innerHTML = ['<img class="previewthumb" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('list').insertBefore(li, null);
        };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
      } else {
        console.log('Else');
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            console.log(e.target.result);
            var li = document.createElement('li');
            li.innerHTML = ["<div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + theFile.name + "</div></div>"].join('');
            document.getElementById('list').insertBefore(li, null);
          };
        })(f);

        reader.readAsDataURL(f);
      }
    }
  },

  'change #filesToUpload': function(evt){
    files = evt.target.files;

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
        span.innerHTML = ['<img class="thumb" src="', e.target.result,
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



});

