Handlebars.registerHelper("systemForm", {
  formParams   : {
    bubble : {
      create : {
        validate       : ["title", "category", "body"],
        templateName   : "formElementsBubble",
        isCollapsed    : "collapse-false",
        objectNameDash : "bubble-create",
        wysiwygHeading : "Description",
        arrowVisible   : "false",
        submit         : function() {
          var bubble = {
            category             : $(event.target).find('[name=category]').val(),
            bubbleType           : $('.cb-form').find('[name=bubbleType]').val(),
            description          : $('.cb-form').find('[name=body]').html(),
            title                : $('.cb-form').find('[name=title]').val(),
            retinaProfilePicture : $('#profileRetinaPhoto').attr('src'),
            retinaCoverPhoto     : $('#coverRetinaPhoto').attr('src'),
            profilePicture       : $('#profilePhoto').attr('src'),
            coverPhoto           : $('#coverPhoto').attr('src'),
          };

          Meteor.call('bubble', bubble, function(error, bubbleId) {
            if (error) {
              throwError(error.reason);
            } else {
              Meteor.Router.to('bubblePage', bubbleId);
            }
          });
        },
      },
      edit   : {
        validate       : ["title", "category", "body"],
        templateName   : "formElementsBubble",
        isCollapsed    : "collapse-true",
        objectNameDash : "bubble-edit",
        wysiwygHeading : "Description",
        arrowVisible   : "false",
        submit         : function() {
          var currentBubbleId = Meteor.call("systemBubble.selectedBubble");
      
          var bubbleProperties = {
            category    : $(event.target).find('[name=category]').val(),
            title       : $(event.target).find('[name=title]').val(),
            description : $(event.target).find('[name=body]').html(),
            lastUpdated : new Date().getTime()
          }
      
          Bubbles.update(currentBubbleId, {$set: bubbleProperties}, function(error) {
            if (error) {
              throwError(error.reason);
            } else {
              createBubbleEditUpdate();
              Meteor.Router.to('bubblePage', currentBubbleId);
            }
          });
        }
      }
    },
    discussion : {
      create : {
        validate       : ["name", "body"],
        templateName   : "formElementsDiscussionCreate",
        isCollapsed    : "collapse-true",
        objectNameDash : "discussion-create",
        wysiwygHeading : "Discussion body",
        arrowVisible   : "true",
        submit         : function() {
          createPostWithAttachments({
            bubbleId: Meteor.call("systemBubble.selectedBubble"),
            body: $(event.target).find('[name=body]').html(),
            name: $(event.target).find('[name=name]').val(),
            postType: 'discussion',
            children: [],
          }, files);
        }
      }
    },
    file       : {
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
