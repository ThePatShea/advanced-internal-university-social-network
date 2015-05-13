Template.filePreview.helpers({
  isPDF: function() {
  	//console.log(this.fileType);
    if(this.fileType == "application/pdf"){
    	return true;
    }
    else{
    	return false;
    }
  },

  isImage: function(){
  	if(this.fileType.match("image.*")){
  		return true;
  	}
  	else{
  		return false;
  	}
  },

  isDoc: function(){
  	if(this.fileType.match("msword.*")){
  		return true;
  	}
  	else{
  		return false;
  	}
  }
});