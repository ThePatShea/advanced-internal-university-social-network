Template.postAttributes.events({
  'click #download-btn': function(event) {
    event.preventDefault();
     
    var fileData = $('#file-data').html();  //TODO: Remove this from the html and get it directly in this js file
    var uriContent = "application/octet-stream," + encodeURIComponent(fileData);
    //location.href = uriContent;
    i = fileData.indexOf(',')
    console.log(i);
    blob = fileData.slice(i+1, fileData.length);
    new_blob = 'data:application/octet-stream;' + blob;
    location.href = new_blob;
    //location.href = '/posts/' + Session.get('currentPostId') + '/getfile';
    //location.href = fileData;
    //console.log(fileData);
    //saveAs(fileData, 'test.pdf');
    //filesaver = new Filesaver(filedata)
  }
});
