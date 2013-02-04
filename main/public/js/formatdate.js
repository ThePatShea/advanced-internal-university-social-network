// Converts timestamps into readable dates
$(document).ready(function () {

  function format_date(input_class, date_format) {
    var num_widgets = $('.' + input_class).length;

    for (i = 0; i < num_widgets; i++) {
      // Get the date from inside the widget
        var widget_id = '#' + input_class + '_'+i;
        var unformatted_date = $(widget_id).html();      

      // If the date is a unix timestamp, convert it to a Javascript date
        if (parseInt(unformatted_date) == unformatted_date)
          var unformatted_date = new Date($(widget_id).html()*1000);

      // Re-format the date
        var formatted_date = moment(unformatted_date).format(date_format);

      // Display the newly-formatted date
        $(widget_id).html(formatted_date);
        $(widget_id).css({display: 'inherit'});
    }
  }


  format_date('format_date_bottom', 'h:mma');
  format_date('format_date_top', 'M/D');
 
});
