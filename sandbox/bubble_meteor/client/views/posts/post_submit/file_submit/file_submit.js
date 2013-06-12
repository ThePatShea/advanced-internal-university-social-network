Template.fileSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var file = template.find('[name=file]').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      buffer = e.target.result;
      file_header = buffer.slice(0, 40);
      var re = new RegExp('\:(.+)\;');
      var m = re.exec(file_header);
      var file_type = null;
      if(m.length == 2){
        file_type =  m[1];
        console.log(m[1]);
      }
      else{
        file_type = 'binary/octet-stream'
      }
      //console.log(buffer.slice(4,20));
      createPost({
        name: $(e.target).find('[name=name]').val(),
        file: e.target.result,
        fileType: file_type,
        postType: 'file',
        bubbleId: Session.get('currentBubbleId')
      });
    }
    reader.readAsDataURL(file);
  }
});





/*reader.onload = function(e) {
      var buffer = reader.result;
      var int32View = new Int32Array(buffer);
      switch(int32View[0]) {
          case 1196314761: 
              file.verified_type = "image/png";
              break;
          case 944130375:
              file.verified_type = "image/gif";
              break;
          case 544099650:
              file.verified_type = "image/bmp";
              break;
          case -520103681:
              file.verified_type = "image/jpg";
              break;
          default:
              file.verified_type = "unknown";
              break;
      }
    };*/