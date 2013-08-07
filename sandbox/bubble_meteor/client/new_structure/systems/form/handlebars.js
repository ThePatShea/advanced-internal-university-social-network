Handlebars.registerHelper("systemForm", {
  formParams   : {
    bubble : {
      create : {
        validate       : ["title", "category", "body"],
        templateName   : "formElementsBubbleCreate",
        isCollapsed    : "collapse-false",
        objectNameDash : "bubble-create",
        wysiwygHeading : "Description",
        arrowVisible   : "false"
      },
      edit   : {
        validate       : ["title", "category", "body"],
        templateName   : "formElementsBubbleCreate",
        isCollapsed    : "collapse-true",
        objectNameDash : "bubble-edit",
        wysiwygHeading : "Description",
        arrowVisible   : "false",
      }
    },
    file   : {
      create : {
        validate       : [],
        templateName   : "formElementsFileCreate",
        isCollapsed    : "collapse-true",
        objectNameDash : "file-create",
        arrowVisible   : "true",
        fileArray      : [],
        submit         : function(){
          console.log(this.fileArray);
          //e.preventDefault();
          //Google Analytics
          _gaq.push(['_trackEvent', 'Post', 'Create File', $(event.target).find('[name=name]').val()]);

          var files = this.fileArray;
          
          for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            //console.log('Testing f: ', f.type, f.size);
            reader.onload = (function(f){
              return function(e) {
                console.log(f.type, f.size);
                /*if(f.type.match('image.*')){
                    createPost({
                      name: escape(f.name),
                      file: imageData,
                      fileType: f.type,
                      fileSize: f.size,
                      postType: 'file',
                      numDownloads: 0,
                      lastDownloadTime: new Date().getTime(),
                      bubbleId: Session.get('currentBubbleId')
                    });
                }*/
                
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
        }
      }
    }
  }
});




//This function obtains the correct width and height of an image and then passes them onto a callback together with the imagedata
var imageDimensions = function(imageDataURL, callback){
  $('<img/>').attr('src', imageDataURL).load(function(){
    callback(this.width, this.height, imageDataURL);
  });

}


var storeImage = function(f){
  var reader = new FileReader();
  //console.log('Testing f: ', f.type, f.size);
  reader.onload = (function(f){
    return function(e){
      $('<img />').attr('src', imageDataURL).load(function(){
        var width = this.width;
        var height = this.height;
        var retinaCanvas = ($('<canvas/>').width(width*2).height(height*2))[0];
        var retinaContext = retinaCanvas.getContext('2d');
        var tempImage = new Image();
        tempImage.src = this.src;
        retinaContext.drawImage(coverImage, 0, 0, width, height, 0, 0, width*2, height*2);
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
      });
    }
  });
}
