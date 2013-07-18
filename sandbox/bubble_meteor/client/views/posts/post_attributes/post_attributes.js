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
    			return Math.round(fileSizeGigaBytes*100)/100 + ' GB'; 
    		}
    		else if(fileSizeMegaBytes >= 1){
    			return Math.round(fileSizeMegaBytes*100)/100 + ' MB';
    		}
    		else{
    			return Math.round(fileSizeKiloBytes*100)/100 + ' KB';
    		}
    	}
    	else{
    		return -1;
    	}
    }
});
