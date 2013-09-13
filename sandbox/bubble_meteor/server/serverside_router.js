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


Meteor.Router.add('/2013-09-09/posts?:q', 'GET', function(q){
    console.log('REST API: ', this.request.originalUrl);
    urlLevels = this.request.originalUrl.split('/');
    //console.log(urlLevels);

    if(urlLevels.length == 3){
        console.log('3');
        var query = urlLevels[2].split('?');
        if(query.length == 2){
            var queryParams = query[1];
            console.log('Query Params: ', queryParams);
            var fieldListString = queryParams.split('=');
            var fields = fieldListString[1].split(',');
            var response = getPosts(25, 0, fields);
            var serializedResponse = JSON.stringify(response);
            return [200, {'Content-type': 'application/json'}, serializedResponse];
        }
    }
    else if(urlLevels.length == 4){
        console.log('4');
        var query = urlLevels[2].split('?');
        var fields = [];
        if(query.length == 2){
            var queryParams = query[1];
            console.log('Query Params: ', queryParams);
            var fieldListString = queryParams.split('=');
            var fields = fieldListString[1].split(',');
            console.log('fields: ', fields);
        }
        var paginationParams = urlLevels[3].split('&');
        console.log('Pagination Params: ', paginationParams);
        var limit = parseInt(paginationParams[0].split('=')[1]);
        var offset = parseInt(paginationParams[1].split('=')[1]);
        var response = getPosts(limit, offset, fields);
        var serializedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, serializedResponse];
    }
});

Meteor.Router.add('/2013-09-09/posts/:params', 'GET', function(params){
    console.log('REST API: ', params, this.request.originalUrl);
    var paginationParams = this.request.originalUrl.split('&');

    if(paginationParams.length <= 1){

        var post = Posts.findOne({_id: params});
        if(post){
            var serializedPost = JSON.stringify(post);
            return [200, {'Content-type': 'application/json'}, serializedPost];
        }
        else{
            return [400, 'Post not found'];
        }
    }
    else{
        var limit = parseInt(paginationParams[0].split('=')[1]);
        var offset = parseInt(paginationParams[1].split('=')[1]);
        var response = getPosts(limit, offset, []);
        var serializedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, serializedResponse];
    }
});



Meteor.Router.add('/2013-09-09/explores/:exploreId/posts?:q', 'GET', function(exploreId, q){
    console.log('REST API: ', this.request.originalUrl);
    urlLevels = this.request.originalUrl.split('/');
    //console.log(urlLevels);

    if(urlLevels.length == 5){
        console.log('4');
        var query = urlLevels[4].split('?');
        if(query.length == 2){
            var queryParams = query[1];
            console.log('Query Params: ', queryParams);
            var fieldListString = queryParams.split('=');
            var fields = fieldListString[1].split(',');
            var response = getExplorePosts(25, 0, fields, exploreId);
            var serializedResponse = JSON.stringify(response);
            return [200, {'Content-type': 'application/json'}, serializedResponse];
        }
    }
    else if(urlLevels.length == 6){
        console.log('4');
        var query = urlLevels[4].split('?');
        var fields = [];
        if(query.length == 2){
            var queryParams = query[1];
            console.log('Query Params: ', queryParams);
            var fieldListString = queryParams.split('=');
            var fields = fieldListString[1].split(',');
            console.log('fields: ', fields);
        }
        var paginationParams = urlLevels[5].split('&');
        console.log('Pagination Params: ', paginationParams);
        var limit = parseInt(paginationParams[0].split('=')[1]);
        var offset = parseInt(paginationParams[1].split('=')[1]);
        var response = getExplorePosts(limit, offset, fields, exploreId);
        var serializedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, serializedResponse];
    }
});

Meteor.Router.add('/2013-09-09/explores/:exploreId/posts/:params', 'GET', function(exploreId, params){
    console.log('REST API: ', params, this.request.originalUrl);
    //var paginationParams = this.request.originalUrl.split('&');
    var paginationParams = params.split('&');

    if(paginationParams.length <= 1){

        var post = Posts.findOne({_id: params, 'exploreId': exploreId});
        if(post){
            var serializedPost = JSON.stringify(post);
            return [200, {'Content-type': 'application/json'}, serializedPost];
        }
        else{
            return [400, 'Post not found'];
        }
    }
    else{
        var limit = parseInt(paginationParams[0].split('=')[1]);
        var offset = parseInt(paginationParams[1].split('=')[1]);
        var response = getExplorePosts(limit, offset, [], exploreId);
        var serializedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, serializedResponse];
    }
});



//**************************Begin REST GET****************************************

//REST api for retreiving selected fields from collections with pagination support
Meteor.Router.add('/2013-09-11/?:q', 'GET', function(q){
    console.log('2013-09-11 REST API: ', q, this.request.originalUrl);

    var urlSections = this.request.originalUrl.split('/');
    var fields = [];
    var limit = 10;
    var offset = 0;
    var objectId = undefined;
    var urlNumSections = urlSections.length - 2;
    //console.log(urlSections[urlSections.length-1]);
    //if(urlSections[urlNumSections-1].indexOf('&') != -1){
    if(urlSections[urlSections.length-1].indexOf('&') != -1){
        var paginationSegment = urlSections[urlSections.length-1];
        var paginationParams = paginationSegment.split('&');
        var firstParam = paginationParams[0].split('=');
        var secondParam = paginationParams[1].split('=');
        limit = parseInt(firstParam[1]);
        offset = parseInt(secondParam[1]);
        urlNumSections = urlNumSections - 1;
    }
    else if( (urlSections[urlSections.length-1].length != 0) && (urlSections[urlSections.length-1].indexOf('posts') == -1) && (urlSections[urlSections.length-1].indexOf('bubbles') == -1) &&(urlSections[urlSections.length-1].indexOf('explores') == -1) && (urlSections[urlSections.length-1].indexOf('users') == -1) ){
        objectId = urlSections[urlSections.length-1];
        urlNumSections = urlNumSections-1;
        console.log('Collection objectId: ', objectId);
    }
    if(urlNumSections == 1){        // URL /2013-09-09/posts?fields=name,body
        console.log('1');
        var firstSegment = urlSections[2];
        if(firstSegment.indexOf('?') != -1){
            var subSegments = firstSegment.split('?');
            var collectionName = subSegments[0];
            var parameters = subSegments[1].split('=');
            var parameterValues = parameters[1].split(',');
            fields = parameterValues;
            console.log('Collection: ', collectionName);
            console.log('Fields: ', parameterValues);
            var response = getCollection(collectionName, limit, offset, fields, objectId);
            var stringifiedResponse = JSON.stringify(response);
            return [200, {'Content-type': 'application/json'}, stringifiedResponse];
        }
        else{                           // URL /2013-09-09/posts
            var collectionName = firstSegment;
            console.log('Collection: ', collectionName);
            var response = getCollection(collectionName, limit, offset, fields);
            var stringifiedResponse = JSON.stringify(response);
            return [200, {'Content-type': 'application/json'}, stringifiedResponse];
        }
    }
    else if(urlNumSections == 2){
        console.log('2');
        var firstSegment = urlSections[2];
        var secondSegment = urlSections[3];
        var collectionName = firstSegment;
        var itemId = secondSegment;
        var response = getItem(collectionName, itemId);
        if(response == 'Not Found'){
            return [500, 'Not Found in Collection'];
        }
        else{
            var stringifiedResponse = JSON.stringify(response);
            return [200, {'Content-type': 'application/json'}, stringifiedResponse];
        }
    }

    return [400, 'Malformed request'];

});




//REST API for retreiving particular items from Collections
Meteor.Router.add('/2013-09-11/posts/:id', 'GET', function(id){
    var response = getItem('posts', id);
    if(response == 'Not Found'){
        return [500, 'Not Found in Collection'];
    }
    else{
        var stringifiedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, stringifiedResponse];
    }
});

Meteor.Router.add('/2013-09-11/bubbles/:id', 'GET', function(id){
    var response = getItem('bubbles', id);
    if(response == 'Not Found'){
        return [500, 'Not Found in Collection'];
    }
    else{
        var stringifiedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, stringifiedResponse];
    }
});

Meteor.Router.add('/2013-09-11/explores/:id', 'GET', function(id){
    var response = getItem('explores', id);
    if(response == 'Not Found'){
        return [500, 'Not Found in Collection'];
    }
    else{
        var stringifiedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, stringifiedResponse];
    }
});

Meteor.Router.add('/2013-09-11/users/:id', 'GET', function(id){
    var response = getItem('users', id);
    if(response == 'Not Found'){
        return [500, 'Not Found in Collection'];
    }
    else{
        var stringifiedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, stringifiedResponse];
    }
});


//REST api for retreiving sub-collections of collections
Meteor.Router.add('/2013-09-11/explores/:id/?:q', 'GET', function(id){
    var urlSections = this.request.originalUrl.split('/');
    var fields = [];
    var limit = 10;
    var offset = 0;
    var urlNumSections = urlSections.length - 2;
    var explore = Explores.findOne(id);
    if(!explore){
        return [500, 'Explore not found'];
    }
    if(urlSections[urlSections.length-1].indexOf('&') != -1){
        var paginationSegment = urlSections[urlSections.length-1];
        var paginationParams = paginationSegment.split('&');
        var firstParam = paginationParams[0].split('=');
        var secondParam = paginationParams[1].split('=');
        limit = parseInt(firstParam[1]);
        offset = parseInt(secondParam[1]);
        urlNumSections = urlNumSections - 1;
    }
    var subCollectionSegment = urlSections[4];
    if(subCollectionSegment.indexOf('?') != -1){
        var subSegments = subCollectionSegment.split('?');
        var subCollectionName = subSegments[0];
        var parameters = subSegments[1].split('=');
        var parameterValues = parameters[1].split(',');
        fields = parameterValues;
    }
    else{
        var subCollectionName = subCollectionSegment;
    }

    console.log('Limit, Offset', limit, offset);
    var response = getSubCollection('explores', id, subCollectionName, limit, offset, fields);
    var serializedResponse = JSON.stringify(response);
    return [200, {'Content-type': 'application/javascript'}, serializedResponse];
});


Meteor.Router.add('/2013-09-11/bubbles/:id/?:q', 'GET', function(id){
    var urlSections = this.request.originalUrl.split('/');
    var fields = [];
    var limit = 10;
    var offset = 0;
    var urlNumSections = urlSections.length - 2;
    var bubble = Bubbles.findOne(id);
    if(!bubble){
        return [500, 'Bubble not found.'];
    }
    if(urlSections[urlSections.length-1].indexOf('&') != -1){
        var paginationSegment = urlSections[urlSections.length-1];
        var paginationParams = paginationSegment.split('&');
        var firstParam = paginationParams[0].split('=');
        var secondParam = paginationParams[1].split('=');
        limit = parseInt(firstParam[1]);
        offset = parseInt(secondParam[1]);
        urlNumSections = urlNumSections - 1;
    }
    var subCollectionSegment = urlSections[4];
    if(subCollectionSegment.indexOf('?') != -1){
        var subSegments = subCollectionSegment.split('?');
        var subCollectionName = subSegments[0];
        var parameters = subSegments[1].split('=');
        var parameterValues = parameters[1].split(',');
        fields = parameterValues;
    }
    else{
        var subCollectionName = subCollectionSegment;
    }

    console.log('Limit, Offset', limit, offset);
    var response = getSubCollection('bubbles', id, subCollectionName, limit, offset, fields);
    var serializedResponse = JSON.stringify(response);
    return [200, {'Content-type': 'application/javascript'}, serializedResponse];
});


Meteor.Router.add('/2013-09-11/users/:id/?:q', 'GET', function(id){
    var urlSections = this.request.originalUrl.split('/');
    var fields = [];
    var limit = 10;
    var offset = 0;
    var urlNumSections = urlSections.length - 2;
    if(urlSections[urlSections.length-1].indexOf('&') != -1){
        var paginationSegment = urlSections[urlSections.length-1];
        var paginationParams = paginationSegment.split('&');
        var firstParam = paginationParams[0].split('=');
        var secondParam = paginationParams[1].split('=');
        limit = parseInt(firstParam[1]);
        offset = parseInt(secondParam[1]);
        urlNumSections = urlNumSections - 1;
    }
    var subCollectionSegment = urlSections[4];
    if(subCollectionSegment.indexOf('?') != -1){
        var subSegments = subCollectionSegment.split('?');
        var subCollectionName = subSegments[0];
        var parameters = subSegments[1].split('=');
        var parameterValues = parameters[1].split(',');
        fields = parameterValues;
    }
    else{
        var subCollectionName = subCollectionSegment;
    }

    console.log('Limit, Offset', limit, offset);
    var response = getSubCollection('users', id, subCollectionName, limit, offset, fields);
    var serializedResponse = JSON.stringify(response);
    return [200, {'Content-type': 'application/javascript'}, serializedResponse];
});


Meteor.Router.add('/2013-09-11/users?:q', 'GET', function(q){
    console.log('Users Selected Fields: ', this.request.originalUrl);
    return [200, 'Success'];
});

//*********************************End REST GET*************************************



//*********************************Begin REST POST**********************************

Meteor.Router.add('/2013-09-11/bubbles/new', 'POST', function(){
    //console.log(this.request.body);
    var bubbleTitle = this.request.body.title;
    var bubbleCategory = this.request.body.category;
    var bubbleDescription = this.request.body.description;
    var bubbleCoverPhoto = this.request.body.coverPhoto;
    var bubbleRetinaCoverPhoto = this.request.body.retinaCoverPhoto;
    var bubbleProfilePicture = this.request.body.profilePicture;
    var bubbleRetinaProfilePicture = this.request.body.retinaProfilePicture;
    var bubbleType = this.request.body.bubbleType;
    var bubbleUsers = this.request.body.users;
    console.log(bubbleTitle, bubbleCategory, bubbleDescription, bubbleCoverPhoto, bubbleRetinaCoverPhoto, bubbleProfilePicture, bubbleRetinaProfilePicture, bubbleType, bubbleUsers);
});

//*********************************End REST POST************************************




function getItem(collectionName, itemId){
    if(collectionName == 'posts'){
        var post = Posts.findOne(itemId);
        if(!post){
            return 'Not Found';
        }
        else{
            return post;
        }
    }
    else if(collectionName == 'bubbles'){
        var bubble = Bubbles.findOne(itemId);
        if(!bubble){
            return 'Not Found';
        }
        else{
            return bubble;
        }
    }
    else if(collectionName == 'explores'){
        var explore = Explores.findOne(itemId);
        if(!explore){
            return 'Not Found';
        }
        else{
            return explore;
        }
    }
    else if(collectionName == 'users'){
        var user = Meteor.users.findOne({_id: itemId}, {fields: {
            'createdAt': 1,
            'emails': 1,
            'name': 1,
            'profilePicture': 1,
            'userType': 1,
            'username': 1
        }});

        if(!user){
            return 'Not Found';
        }
        else{
            return user;
        }
    }
}


function getCollection(collectionName, limit, offset, fields, objectId){
    if(collectionName == 'posts'){
        var response = getPosts(limit, offset, fields, objectId);
        return response;
    }
    else if(collectionName == 'explores'){
        var response = getExplores(limit, offset, fields, objectId);
        return response;
    }
    else if(collectionName == 'bubbles'){
        var response = getBubbles(limit, offset, fields, objectId);
        return response;
    }
    else if(collectionName == 'users'){
        var response = getUsers(limit, offset, fields, objectId);
        return response;
    }
}


function getSubCollection(collectionName, collectionId, subCollectionName, limit, offset, fields){
    //console.log('Limit, Offset', limit, offset);
    if(collectionName == 'explores'){
        var exploreId = collectionId;
        var response = getExplorePosts(limit, offset, fields, exploreId);
        return response;
    }
    else if(collectionName == 'bubbles'){
        var bubbleId = collectionId;
        var response = getBubblePosts(limit, offset, fields, bubbleId);
        return response;
    }
    else if(collectionName == 'users'){
        var userId = collectionId;
        if(subCollectionName == 'bubbles'){
            var response = getUsersBubbles(limit, offset, fields, userId);
            return response;
        }
        else if(subCollectionName == 'posts'){
            var response = getUsersPosts(limit, offset, fields, userId);
            return response;
        }
    }
}


function getExplores(limit, offset, fields, objectId){
    var exploresCount = Explores.find().count();
    var pages = Math.floor(exploresCount/limit);
    if(pages*limit < exploresCount){
        pages = pages + 1;
    }
    if(fields.length == 0){
        var allExplores = Explores.find({}).fetch();
        var explores = allExplores.slice(offset*limit, (offset+1)*limit);
        var response = {'count': exploresCount, 'pages': pages, 'page': offset, 'explores': explores};
        return response;
    }
    else{
        var fieldString = '{';
        for(var i = 0; i < fields.length; i++){
            fieldString = fieldString + '"' + fields[i] + '": 1,';
        }
        fieldString = fieldString.slice(0, fieldString.length-1);
        fieldString = fieldString + '}';
        if(objectId == undefined){
            var allExplores = Explores.find({}, {fields: JSON.parse(fieldString)}).fetch();
            var explores = allExplores.slice(offset*limit, (offset+1)*limit);
            renameIdAttribute(explores);
            var response = {'count': exploresCount, 'pages': pages, 'page': offset, 'explores': explores};
            return response;
        }
        else{
            var explore = Explores.findOne({_id: objectId}, {fields: JSON.parse(fieldString)});
            if(!explore){
                return 'Not Found';
            }
            else{
                explore.id = explore._id;
                delete explore._id;
                var response = explore;
                return response;
            }
        }
    }
}


function getBubbles(limit, offset, fields, objectId){
    var bubblesCount = Bubbles.find().count();
    var pages = Math.floor(bubblesCount/limit);
    if(pages*limit < bubblesCount){
        pages = pages + 1;
    }
    if(fields.length == 0){
        var allBubbles = Bubbles.find({}).fetch();
        var bubbles = allBubbles.slice(offset*limit, (offset+1)*limit);
        var response = {'count': bubblesCount, 'pages': pages, 'page': offset, 'bubbles': bubbles};
        return response;
    }
    else{
        var fieldString = '{';
        for(var i = 0; i < fields.length; i++){
            fieldString = fieldString + '"' + fields[i] + '": 1,';
        }
        fieldString = fieldString.slice(0, fieldString.length-1);
        fieldString = fieldString + '}';
        if(objectId == undefined){
            var allBubbles = Bubbles.find({}, {fields: JSON.parse(fieldString)}).fetch();
            var bubbles = allBubbles.slice(offset*limit, (offset+1)*limit);
            renameIdAttribute(bubbles);
            var response = {'count': bubblesCount, 'pages': pages, 'page': offset, 'bubbles': bubbles};
            return response;
        }
        else{
            var bubble = Bubbles.findOne({_id: objectId}, {fields: JSON.parse(fieldString)});
            if(!bubble){
                return 'Not Found.'
            }
            else{
                bubble.id = bubble._id;
                delete bubble._id;
                var response = bubble;
                return response;
            }
        }

    }
}


function getPosts(limit, offset, fields, objectId){
    var postCount = Posts.find().count();
    var pages = Math.floor(postCount/limit);
    console.log('getPosts: ', limit, offset, fields);
    if(pages*limit < postCount){
        pages = pages + 1;
    }
    //var posts = Posts.find({}).skip((offset-1)*limit).limit(limit).fetch();
    if(fields.length == 0){
        var allPosts = Posts.find({}).fetch();
        var posts = allPosts.slice(offset*limit, (offset+1)*limit);
        var response = {'count': postCount, 'pages': pages, 'page': offset, 'posts': posts};
        return response;
    }
    else{
        var fieldString = '{';
        for(var i = 0; i < fields.length; i++){
            fieldString = fieldString + '"' + fields[i] + '": 1,';
        }
        fieldString = fieldString.slice(0, fieldString.length-1);
        fieldString = fieldString + '}';
        console.log('fieldString: ', fieldString);
        if(objectId == undefined){
            var allPosts = Posts.find({}, {fields: JSON.parse(fieldString)}).fetch();
            var posts = allPosts.slice(offset*limit, (offset+1)*limit);
            renameIdAttribute(posts);
            var response = {'count': postCount, 'pages': pages, 'page': offset, 'posts': posts};
            return response;
        }
        else{
            var post = Posts.findOne({_id: objectId}, {fields: JSON.parse(fieldString)});
            if(!post){
                return 'Not Found';
            }
            else{
                post.id = post._id;
                delete post._id;
                var response = post;
                return response;
            }
        }
    }
}


function getUsers(limit, offset, fields, objectId){
    var userCount = Meteor.users.find().count();
    var pages = Math.floor(userCount/limit);
    console.log('getUsers: ', limit, offset, fields);
    if(pages*limit < userCount){
        pages = pages + 1;
    }
    if(fields.length == 0){
        var allUsers = Meteor.users.find({}).fetch();
        var users = allUsers.slice(offset*limit, (offset+1)*limit);
        renameIdAttribute(users);
        var response = {'count': userCount, 'pages': pages, 'page': offset, 'users': users};
        return response;
    }
    else{
        var fieldString = '{';
        for(var i = 0; i < fields.length; i++){
            fieldString = fieldString + '"' + fields[i] + '": 1,';
        }
        fieldString = fieldString.slice(0, fieldString.length-1);
        fieldString = fieldString + '}';
        if(objectId == undefined){
            var allUsers = Meteor.users.find({}, {fields: JSON.parse(fieldString)}).fetch();
            var users = allUsers.slice(offset*limit, (offset+1)*limit);
            renameIdAttribute(users);
            var response = {'count': userCount, 'pages': pages, 'page': offset,  'users': users};
            return response;
        }
        else{
            var user = Meteor.users.findOne({_id: objectId}, {fields: JSON.parse(fieldString)});
            if(!user){
                return 'Not Found';
            }
            else{
                user.id = user._id;
                delete user._id;
                var response = user;
                return response;
            }
        }
    }
}



function getExplorePosts(limit, offset, fields, exploreId){
    var postCount = Posts.find({'exploreId': exploreId}).count();
    var pages = Math.floor(postCount/limit);
    console.log('getPosts: ', limit, offset, fields);
    if(pages*limit < postCount){
        pages = pages + 1;
    }
    //var posts = Posts.find({}).skip((offset-1)*limit).limit(limit).fetch();
    if(fields.length == 0){
        var allPosts = Posts.find({'exploreId': exploreId}).fetch();
        var posts = allPosts.slice(offset*limit, (offset+1)*limit);
        var response = {'count': postCount, 'pages': pages, 'page': offset, 'posts': posts};
        return response;
    }
    else{
        var fieldString = '{';
        for(var i = 0; i < fields.length; i++){
            fieldString = fieldString + '"' + fields[i] + '": 1,';
        }
        fieldString = fieldString.slice(0, fieldString.length-1);
        fieldString = fieldString + '}';
        console.log('fieldString: ', fieldString);
        var allPosts = Posts.find({'exploreId': exploreId}, {fields: JSON.parse(fieldString)}).fetch();
        var posts = allPosts.slice(offset*limit, (offset+1)*limit);
        renameIdAttributes(posts);
        var response = {'count': postCount, 'pages': pages, 'page': offset,  'posts': posts};
        return response;
    }
}


function getBubblePosts(limit, offset, fields, bubbleId){
    var postCount = Posts.find({'bubbleId': bubbleId}).count();
    var pages = Math.floor(postCount/limit);
    console.log('getPosts: ', limit, offset, fields);
    if(pages*limit < postCount){
        pages = pages + 1;
    }
    if(fields.length == 0){
        var allPosts = Posts.find({'bubbleId': bubbleId}).fetch();
        var posts = allPosts.slice(offset*limit, (offset+1)*limit);
        var response = {'count': postCount, 'pages': pages, 'page': offset, 'posts': posts};
        return response;
    }
    else{
        var fieldString = '{';
        for(var i = 0; i < fields.length; i++){
            fieldString = fieldString + '"' + fields[i] + '": 1,';
        }
        fieldString = fieldString.slice(0, fieldString.length-1);
        fieldString = fieldString + '}';
        var allPosts = Posts.find({'bubbleId': bubbleId}, {fields: JSON.parse(fieldString)}).fetch();
        var posts = allPosts.slice(offset*limit, (offset+1)*limit);
        renameIdAttribute(posts);
        var response = {'count': postCount, 'pages': pages, 'page': offset,  'posts': posts};
        return response;
    }
}



function getUsersPosts(limit, offset, fields, userId){
    var postCount = Posts.find({'userId': userId}).count();
    var pages = Math.floor(postCount/limit);
    if(pages*limit < postCount){
        pages = pages + 1;
    }
    if(fields.length == 0){
        var allPosts = Posts.find({'userId': userId}).fetch();
        var posts = allPosts.slice(offset*limit, (offset+1)*limit);
        var response = {'count': postCount, 'pages': pages, 'page': offset, 'posts': posts};
        return response;
    }
    else{
        var fieldString = '{';
        for(var i = 0; i < fields.length; i++){
            fieldString = fieldString + '"' + fields[i] + '": 1,';
        }
        fieldString = fieldString.slice(0, fieldString.length-1);
        fieldString = fieldString + '}';
        var allPosts = Posts.find({'userId': userId}, {fields: JSON.parse(fieldString)}).fetch();
        var posts = allPosts.slice(offset*limit, (offset+1)*limit);
        renameIdAttributes(posts);
        var response = {'count': postCount, 'pages': pages, 'page': offset,  'posts': posts};
        return response;      
    }
}



function getUsersBubbles(limit, offset, fields, userId){
    var bubbleCount = Bubbles.find({$or:
            [{'users.admins': {$in: [userId]}},
            {'users.members': {$in: [userId]}}
            ]}).count();
    var pages = Math.floor(bubbleCount/limit);
    if(pages*limit < bubbleCount){
        pages = pages + 1;
    }
    if(fields.length == 0){
        var allBubbles = Bubbles.find({$or:
            [{'users.admins': {$in: [userId]}},
            {'users.members': {$in: [userId]}}
            ]}).fetch();
        var bubbles = allBubbles.slice(offset*limit, (offset+1)*limit);
        var response = {'count': bubbleCount, 'pages': pages, 'page': offset, 'bubbles': bubbles};
        return response;
    }
    else{
        var fieldString = '{';
        for(var i = 0; i < fields.length; i++){
            fieldString = fieldString + '"' + fields[i] + '": 1,';
        }
        fieldString = fieldString.slice(0, fieldString.length-1);
        fieldString = fieldString + '}';
        var allBubbles = Bubbles.find({$or:
            [{'users.admins': {$in: [userId]}},
            {'users.members': {$in: [userId]}}
            ]}, {fields: JSON.parse(fieldString)}).fetch();
        var bubbles = allBubbles.slice(offset*limit, (offset+1)*limit);
        renameIdAttribute(bubbles);
        var response = {'count': bubbleCount, 'pages': pages, 'page': offset, 'bubbles': bubbles};
        return response;
    }
}



function renameIdAttribute(objectList){
    _.each(objectList, function(item){
        item.id = item._id;
        delete item._id;
    });
}



function randomInt(min, max){
    return Math.floor(Math.random() * (max-min+1)) + min;
}





