Template.listHeading.rendered = function(){
  // Handles the cancel button for forms
    $('.visible-toggle-parent').click(function() {
      if ($(this).hasClass('toggle-hide')) {
        $(this).removeClass('toggle-hide');
        $(this).addClass('toggle-show');
      } else {
        $(this).removeClass('toggle-show');
        $(this).addClass('toggle-hide');
      }
    });
}