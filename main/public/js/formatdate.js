// Converts timestamps into readable dates
$(document).ready(function () {

  function format_date() {
    var num_widgets = $('.format_date_top').length;

    for (i = 0; i < num_widgets; i++) {
      var widget_id = '#format_date_top_'+i;
      var unformatted_date = $(widget_id).html();
      var formatted_date = moment(unformatted_date).format('ddd');
      $(widget_id).html(formatted_date);
      $(widget_id).css({display: 'inherit'});
    }


    var num_widgets = $('.format_date_bottom').length;

    for (i = 0; i < num_widgets; i++) {
      var widget_id = '#format_date_bottom_'+i;
      var unformatted_date = $(widget_id).html();
      var formatted_date = moment(unformatted_date).format('h:mma');
      $(widget_id).html(formatted_date);
      $(widget_id).css({display: 'inherit'});
    }
  }

  format_date();
 
});
