Template.postAttributes.events({
  'click #download-btn': function(event) {
    event.preventDefault();
     
    var fileData = $('#file-data').html();  //TODO: Remove this from the html and get it directly in this js file
    var uriContent = "data:application/octet-stream," + encodeURIComponent(fileData);

    location.href = uriContent
  }
});
