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
          $('#pending_members').prepend(ui.item.label)

          var bubble_id  =  $('#autocomplete_hidden_bubble_id').html()
          var user_id    =  $('.user_id').html() // TODO: Make this line dynamic

          $.post('/bubbles/' + bubble_id + '/add_applicant/' + user_id, function(data) { // TODO: Change this to add invitee
            
          });
        }
    })

})
