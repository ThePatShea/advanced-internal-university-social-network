Template.postAttributes.events({
  'click #download-btn': function(event) {
    event.preventDefault();
     
    var fileData = $('#file-data').html();  //TODO: Remove this from the html and get it directly in this js file
    var uriContent = "application/octet-stream," + encodeURIComponent(fileData);
    //var uriContent = encodeURIComponent(fileData);

    location.href = uriContent
  }
});
