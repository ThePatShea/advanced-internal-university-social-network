Template.formElementsFileCreate.rendered = function(){
	//console.log(this.fileArray);
}


Template.formElementsFileCreate.helpers({
	'submit form': function(evt){
		evt.preventDefault();
		alert('Hi');
		console.log('File submitted.');
	}
});