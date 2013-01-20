// Allows the user to click a button to reveal hidden page content
$(document).ready(function () {

  $('.toggle_visible').click(function() {
    $('.toggle_invisible').css({display: 'block'});
    $('.toggle_visible').css({display: 'none'});
  });

});
