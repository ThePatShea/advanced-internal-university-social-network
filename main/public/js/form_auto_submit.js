// Controls the date and time selector in forms
$(document).ready(function () {

  $('#input_post_image').change(function() {
    $('#loader_post_image').css({display: 'block'});
    $('#upload_post_image').submit();
  });

});
