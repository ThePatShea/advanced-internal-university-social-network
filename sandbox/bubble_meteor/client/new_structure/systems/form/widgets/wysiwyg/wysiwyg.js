Template.wysiwyg2.rendered = function() {
  $(".wysiwyg").wysiwyg();
}

Template.wysiwyg2.events({
    'click .wysiwyg': function() {
      $('.wysiwyg').children('.wysiwyg-placeholder').remove();
    }
});

Template.wysiwyg2.helpers({
	isBubble: function(){
		if(typeof this.bubbleType != 'undefined'){
			return true;
		}
		else{
			return false;
		}
	},

	isPost: function(){
		if(typeof this.postType != 'undefined'){
			return true;
		}
		else{
			return false;
		}
	}
});