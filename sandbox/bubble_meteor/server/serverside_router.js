Meteor.Router.add( '/posts/:id/getfile', 'GET', function (id) { 

    console.log('Attempting to get ' + id);
    post = Posts.findOne({_id: id});
    console.log(post.fileType);
    data = post.file;
    i = data.indexOf(',')
    console.log(i);
    blob = data.slice(i+1, data.length);
    new_blob = 'data:application/octet-stream;' + blob;
    i = post.fileType.indexOf('/');
    file_extension = post.fileType.slice(i+1, post.fileType.length);
    filename = post.name + '.' + file_extension;
    return [200, { 'Content-type': 'binary/octet-stream', 'Content-Disposition': 'attachment; filename="' + filename + '"'}, data];
});
