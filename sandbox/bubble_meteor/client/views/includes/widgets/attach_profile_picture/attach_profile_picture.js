/*Template.dropZone.events({ */
  /*'dragover .drop-zone': function(evt, parent){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },*/

  /*'drop .drop-zone': function(evt, parent){
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();*/


    /*var files = evt.dataTransfer.files;
    //console.log(this.fileArray);
    
    for (var i = 0, f; f = files[i]; i++) {
      //this.files.append(files[i]);
      this.fileArray.push(files[i]);


      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        // Render thumbnail.*/
        /*var li = document.createElement('li');
        li.innerHTML = ['<img class="previewthumb" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('list').insertBefore(li, null);*/
        /*$(parent.find('.attachments-list')).append('<li><img class="previewthumb" src="'+ e.target.result+
                        '" title="'+ escape(theFile.name)+ '"></li>');
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
            console.log(e.target.result);*/
            /*var li = document.createElement('li');
            li.innerHTML = ["<div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + theFile.name + "</div></div>"].join('');
            document.getElementById('list').insertBefore(li, null);*/
            /*$(parent.find('.attachments-list')).append("<li><div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + theFile.name+ "</div></div></li>");
            console.log('Added an icon: ', $(this).find('[class=attachments-list]'));
          };
        })(f);

        reader.readAsDataURL(f);
      }
    }

    console.log(this.fileArray);
  },

  'change .file-chooser-invisible': function(evt, parent){
    var files = evt.target.files;*/

    /*l = document.getElementById('list');
    while(l.hasChildNodes()){
      l.removeChild(l.lastChild);
    };*/
    /*console.log(this);
    a = $(parent.find('.attachments-list'));
    $(parent.find('.attachments-list')).html('');

    for (var i = 0, f; f = files[i]; i++) {
      //this.files.append(files[i]);
      this.fileArray.push(files[i]);


      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        // Render thumbnail.*/
        /*var li = document.createElement('li');
        li.innerHTML = ['<img class="previewthumb" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('list').insertBefore(li, null);*/
        /*$(parent.find('.attachments-list')).append('<li><img class="previewthumb" src="'+ e.target.result+
                        '" title="' +escape(theFile.name) + '"></li>');
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
            console.log(e.target.result);*/
            /*var li = document.createElement('li');
            li.innerHTML = ["<div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + theFile.name + "</div></div>"].join('');
            document.getElementById('list').insertBefore(li, null);*/
            /*$(parent.find('.attachments-list')).append("<li><div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + theFile.name+ "</div></div></li>");
            console.log('Added an icon: ', $(this).find('[class=attachments-list]'));
          };
        })(f);

        reader.readAsDataURL(f);
      }
    }

    console.log(this.fileArray);
  }

});



Template.dropZone.rendered = function(){
}*/