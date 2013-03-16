// Keeps the hidden edit form in sync witht he data the user inputs
$(document).ready(function () {

  $('.connect_hidden').change(function() {
    $( '#hidden_' + $(this).attr('id') ).val( $(this).val() )
  });

});
