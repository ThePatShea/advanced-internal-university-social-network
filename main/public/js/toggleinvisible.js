// Allows the user to click a button to reveal hidden page content
$(document).ready(function () {

  $('.toggle_visible_reverse').click(function() {
    $('.toggle_make_invisible').css({display: 'block'});
    $('.toggle_invisible').css({display: 'none'});
  });

  $('.toggle_visible').click(function() {
    $('.toggle_make_invisible').css({display: 'none'});
    $('.toggle_invisible').css({display: 'block'});
  });

});
