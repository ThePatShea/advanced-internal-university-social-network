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
          if (unformatted_date)
            var formatted_date = moment(unformatted_date).format(date_format);
  
        // Display the newly-formatted date
          $(widget_id).html(formatted_date);
          $(widget_id).css({display: 'inherit'});
      }
    }
  
    format_date('format_date_bottom', 'h:mma', 0);
    format_date('format_date_top', 'M/D', 0);



  
  // Infinite scroll
    function load_pagelet() {
      if (ajax_current == 0 && list_pagelet_url != null) {
        // Prevent it from loading too much data
          ajax_current = 1;
          setTimeout(function() { ajax_current = 0; }, 1000);
      
        // Load the new data
          $.get(list_pagelet_url+skip, function(data) {
            $('#post_list').append(data);
  
            format_date('format_date_bottom', 'h:mma', skip);
            format_date('format_date_top', 'M/D', skip);
  
            skip += 20;
          });
      }
    }

    var list_pagelet_url  =  $('#list_pagelet_url').html();
    var skip              =  0;
    var ajax_current      =  0;

    load_pagelet()


    $(window).scroll(function() {
        if ( $(window).scrollTop() >= ( $(document).height() - $(window).height() - 1000) ) {
          load_pagelet()
        }
    });

});
