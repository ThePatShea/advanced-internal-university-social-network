// Allows for infinite scrolling in post_list
$(document).ready(function () {

  var ajax_current = 0;
  
  $(window).scroll(function() {
      if ( $(window).scrollTop() >= ( $(document).height() - $(window).height() - 1000) ) {

        if (ajax_current == 0) {
          // Prevent it from loading too much data
            ajax_current = 1;
            setTimeout(function() { ajax_current = 0; }, 1000);
    
          // Load the new data
            $.get('/bubbles/510f16f12898e00238000005/events_list_pagelet', function(data) {
              $('#post_list').append(data);
            });
        }

      }
  });

});
