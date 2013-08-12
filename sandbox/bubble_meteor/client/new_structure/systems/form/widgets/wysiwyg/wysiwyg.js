Template.wysiwyg2.rendered = function() {
  $(".wysiwyg").wysiwyg();
}

Template.wysiwyg2.events({
    'click .wysiwyg': function() {
      $('.wysiwyg').children('.wysiwyg-placeholder').remove();
    }
});
