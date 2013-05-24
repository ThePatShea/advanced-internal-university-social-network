// Controls the date and time selector in forms
$(document).ready(function () {

  $('#start_time').datetimepicker({
    timeFormat: "hh:mm tt"
  });

  $('#end_time').datetimepicker({
    timeFormat: "hh:mm tt"
  });

});
