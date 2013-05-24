// Makes file-upload forms automatically submit right when the file is selected, so the user doesn't need to press a submit button
$(document).ready(function () {

  $('#input_post_image').change(function() {
    $('#loader_post_image').css({display: 'block'});
    $('#upload_post_image').submit();
  });

});
