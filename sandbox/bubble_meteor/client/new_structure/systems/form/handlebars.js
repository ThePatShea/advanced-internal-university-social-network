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
      },
      edit   : {
        validate       : ["title", "category", "body"],
        templateName   : "formElementsBubble",
        isCollapsed    : "collapse-true",
        objectNameDash : "bubble-edit",
        wysiwygHeading : "Description",
        arrowVisible   : "false",
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
        }
      }
    }
  }
});
