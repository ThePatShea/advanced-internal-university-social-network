Template.fileSubmit.events({

  'submit form': function(e, template) {
    e.preventDefault();
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = (function(f){
        return function(e) {
          console.log(f.type);
          /*buffer = e.target.result;
          file_header = buffer.slice(0, 40);
          var re = new RegExp('\:(.+)\;');
          var m = re.exec(file_header);
          var file_type = null;
          if(m.length == 2){
            file_type =  m[1];
            console.log(m[1]);
          }
          else{
            file_type = 'application/octet-stream'
          }*/
          
          createPost({
            name: escape(f.name),
            file: e.target.result,
            fileType: f.type,
            postType: 'file',
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
        span.innerHTML = ['<div class="pdf-icon">', 'PDF', escape(theFile.name), '"</div>'].join('');
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



});

