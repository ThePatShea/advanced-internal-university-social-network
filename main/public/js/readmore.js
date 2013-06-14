// Controls the "read more" button in each post description
$(document).ready(function () {
  var description_height = $('#post_description').height();

  if (description_height == 185 || description_height == 295) {
    $('#read_more').css({display: 'block'});

    $('#read_more').click(function() {
      $('#post_description').css({'max-height': 'none'});
      $('#read_more').css({display: 'none'});
    });
  }

});
