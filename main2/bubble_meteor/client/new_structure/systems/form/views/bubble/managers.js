Template.formElementsBubble.events({
  'click .select-bubble-type > .normal': function(evt) {
    evt.preventDefault();
    $("input[name=bubbleType]").val("normal");
    selectedBubbleType = "normal";
    $(".select-bubble-type > .super").removeClass("active-true");
    $(".select-bubble-type > .normal").addClass("active-true");
  },
  'click .select-bubble-type > .super': function(evt) {
    evt.preventDefault();
    $("input[name=bubbleType]").val("super");
    $(".select-bubble-type > .normal").removeClass("active-true");
    $(".select-bubble-type > .super").addClass("active-true");
  }
});


Template.formElementsBubble.rendered = function() {
  var currentCategory = $("[name=category]").val();
  $("[name=" + currentCategory + "]").addClass("active");

  $(".categoryBox").click(function(){
    var newCategory = $(this).attr("name");
    $("[name=category]").val(newCategory);
     
    $(".categoryBox").removeClass("active");
    $(this).addClass("active");
  });
}
