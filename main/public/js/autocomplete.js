// Controls the autocomplete box that grabs information from the database
$(document).ready(function () {

  $('#invite_member').click(function() {
    $('#invite_member_search').css({display: 'block'});
    $('#invite_member_start').css({display: 'none'});
  });

$(function() {
  var availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];

    $('#invite_member_input').autocomplete({
      source: availableTags,
      minLength: 2,
      select: function( event, ui ) {
        alert('clicked!')
      }
    });
})

})
