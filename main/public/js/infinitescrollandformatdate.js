// Allows for infinite scrolling in post_list
$(document).ready(function () {

  // Format date
    function format_date(input_class, date_format, skip) {
      var num_widgets = $('.' + input_class).length;
      
      for (i = skip; i < num_widgets; i++) {
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
  
    format_date('format_date_bottom', 'h:mma', 0);
    format_date('format_date_top', 'M/D', 0);



  
  // Infinite scroll
    var ajax_current  =  0;
    var skip          =  20;
    
    $(window).scroll(function() {
        if ( $(window).scrollTop() >= ( $(document).height() - $(window).height() - 1000) ) {
  
          if (ajax_current == 0) {
            // Prevent it from loading too much data
              ajax_current = 1;
              setTimeout(function() { ajax_current = 0; }, 1000);
      
            // Load the new data
              $.get('/bubbles/510f16f12898e00238000005/events_list_pagelet/'+skip, function(data) {
                $('#post_list').append(data);
  
                format_date('format_date_bottom', 'h:mma', skip);
                format_date('format_date_top', 'M/D', skip);
  
                skip += 20;
              });
          }
  
        }
    });

});
