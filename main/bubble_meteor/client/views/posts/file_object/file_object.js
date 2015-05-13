Template.fileObject.helpers({
  isPDF: function() {
  	//console.log(this.fileType);
    if(this.fileType == "application/pdf"){
    	return true;
    }
    else{
    	return false;
    }
  }
});