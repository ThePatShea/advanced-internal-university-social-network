// Controls the autocomplete box that grabs information from the database
$(document).ready(function () {

  // Reveal the #invite_member_search section when the user clicks the #invite_member button
  $('#invite_member').click(function() {
    $('#invite_member_search').css({display: 'block'});
    $('#invite_member_start').css({display: 'none'});
  });


  // Attach autocomplete to the #invite_member_input input box
    $('#invite_member_input').autocomplete({
        source: '/search/users'
      , autoFocus: true
      , minLength: 2
      , html: true
      , select: function( event, ui ) {
          var bubble_id     =  $('#autocomplete_hidden_bubble_id').html()
          var user_id       =  $('.user_id').html()

          // TODO: Change this from add_applicant to add_invitee
          $('<form action="/bubbles/' + bubble_id + '/add_applicant/' + user_id + '" method="POST">' + 
            '<input type="hidden" name="redirect_url" value="/edit/bubbles/' + bubble_id + '">' +
            '</form>').submit();
        }
    })

})
