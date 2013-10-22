Template.postAttributes.helpers({
    hasChildren: function() {
      if (this.children != undefined && this.children.length > 0)
        return true;
      else
        return false;
    },

    fileSizeWords: function(){
    	if(typeof this.fileSize != 'undefined'){
    		var fileSizeBytes = this.fileSize;
    		var fileSizeKiloBytes = this.fileSize/1000;
    		var fileSizeMegaBytes = this.fileSize/1000000;
    		var fileSizeGigaBytes = this.fileSize/1000000000;
    		if(fileSizeGigaBytes >= 1){
    			return Math.round(fileSizeGigaBytes*100)/100 + ' gb'; 
    		}
    		else if(fileSizeMegaBytes >= 1){
    			return Math.round(fileSizeMegaBytes*100)/100 + ' mb';
    		}
    		else{
    			return Math.round(fileSizeKiloBytes*100)/100 + ' kb';
    		}
    	}
    	else{
    		return -1;
    	}
    }
  , reverseAttendees: function() {
      if (this.attendees) {
        return this.attendees.reverse();
      }
    },

  isEvent: function(){
    if(this.postType == 'event'){
      return true;
    }
    else{
      return false;
    }
  },

  isDiscussion: function(){
    if(this.postType == 'discussion'){
      return true;
    }
    else{
      return false;
    }
  },

  isFile: function(){
    if(this.postType == 'file' && typeof this.parent == 'undefined'){
      return true;
    }
    else{
      return false;
    }
  }

});

Template.postAttributes.events({
    'click .file-download': function(e){
        console.log("File Download Click: ", this);
        /*e.stopPropagation();
        e.preventDefault();
        window.open(this.file,'_.blank');*/
    }
})