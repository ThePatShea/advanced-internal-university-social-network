var publicStripeApiKey = 'pk_live_5hgjLOKbcWn0FCJWvHTSOy5E';
var publicStripeApiKeyTesting = 'pk_test_tbF9KUhe3bXdwaaEE3qbm1gw';

Stripe.setPublishableKey(publicStripeApiKeyTesting);

function stripeResponseHandler (status, response) {
  if (response.error) {
    $('#error').text(response.error.message);
    $('#error').slideDown(300);
    $('#stripe-form .submit-button').removeAttr("disabled");
    return;
  }
  
  var form = $("#payment-form");
  form.append("<input type='hidden' name='stripeToken' value='" + response.id + "'/>");

  $.post(
    form.attr('action'),
    form.serialize(),
    function (status) {
      if (status != 'ok') {
        $('#error').text(status);
        $('#error').slideDown(300);
      }
      else {
        $('#error').hide();
        $('#success').slideDown(300);
      }
      $('.submit-button').removeAttr("disabled");
    }
  );
}

// http://stripe.com/docs/tutorials/forms
$("#payment-form").submit(function(event) {
  $('#error').hide();
  // disable the submit button to prevent repeated clicks
  $('.submit-button').attr("disabled", "disabled");

  Stripe.createToken({
    number: $('.card-number').val(),
    cvc: $('.card-cvc').val(),
    exp_month: $('.card-expiry-month').val(),
    exp_year: $('.card-expiry-year').val()
  }, stripeResponseHandler);

  // prevent the form from submitting with the default action
  return false;
});
