// Displays 'are you sure warning for when a user tries to delete a bubble, post, orcomment
$(document).ready(function () {
  $('.activate_are_you_sure').click(function(event) {
    event.preventDefault()

    $('.are_you_sure').css({display: 'block'});
    $(this).css({display: 'none'});
  });

  
  $('.are_you_sure_no').click(function(event) {
    event.preventDefault()

    $('.activate_are_you_sure').css({display: 'block'});
    $('.are_you_sure').css({display: 'none'});
  });
});
