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



Meteor.Router.add('/loadtest/:number', 'GET', function(number){
    var explorePosts = Posts.find({exploreId: {$exists: true}}).fetch();
    var max = explorePosts.length;
    var dataPackage = [];
    for(var i=0; i < number; i++){
        var randomIndex = randomInt(0, max);
        dataPackage.push(explorePosts[randomIndex]);
    }

    var stringifiedDataPackage = JSON.stringify(dataPackage);

    return [200, stringifiedDataPackage];
});



function randomInt(min, max){
    return Math.floor(Math.random() * (max-min+1)) + min;
}