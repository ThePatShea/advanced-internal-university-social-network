// Disables a form's submit button until the user fills out all the fields
$(document).ready(function () {

function inspectAllInputFields(){
     var count = 0;
     $('.requiredInput').each(function(i){
       if( $(this).val() === '') {
           //show a warning?
           count++;
        }
        if(count == 0){
          $('#submitBtn').prop('disabled', false);
          $('#submitBtn').removeClass('grayed_out');
        }else {
          $('#submitBtn').prop('disabled', true);
          $('#submitBtn').addClass('grayed_out');
        }

    });
}


$('.requiredInput').each(function() {
   var elem = $(this);

   // Save current value of element
   elem.data('oldVal', elem.val());

   // Look for changes in the value
   elem.bind("propertychange keyup input paste", function(event){
      // If value has changed...
      if (elem.data('oldVal') != elem.val()) {
       // Updated stored value
       elem.data('oldVal', elem.val());

       // Do action
       inspectAllInputFields();
     }
   });
 });


$('#submitBtn').prop('disabled', true);
$('#submitBtn').addClass('grayed_out');
inspectAllInputFields();

$('.requiredInput').change(function() {
   inspectAllInputFields();
});


// Controls the slider used to specify the discount % in the deals form
  $( "#slider" ).slider({
     min: 1, 
     max: 100,
     slide: function (event, ui) {
        m_val = ui.value;
        if (m_val < 0) {
            m_val = 0;
            $(this).slider({ value: 0 });
        }
        $(this).find("a:first").text(m_val + "% off");
        $("#discount").val(m_val);
        inspectAllInputFields();
     },
     create: function( event, ui ) {
       $(this).find("a:first").text("0% off");
     }
  });


});
