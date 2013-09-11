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



Meteor.Router.add('/2013-09-11/?:q', 'GET', function(q){
    console.log('2013-09-11 REST API: ', q, this.request.originalUrl);

    var urlSections = this.request.originalUrl.split('/');
    var fields = [];
    if(urlSections.length == 3){        // URL /2013-09-09/posts?fields=name,body
        var firstSegment = urlSections[2];
        if(firstSegment.indexOf('?') != -1){
            var subSegments = firstSegment.split('?');
            var collectionName = subSegments[0];
            var parameters = subSegments[1].split('=');
            var parameterValues = parameters[1].split(',');
            fields = parameterValues;
            console.log('Collection: ', collectionName);
            console.log('Fields: ', parameterValues);
            var response = getCollection(collectionName, 10, 0, fields);
            var stringifiedResponse = JSON.stringify(response);
            return [200, {'Content-type': 'application/json'}, stringifiedResponse];
        }
        else{                           // URL /2013-09-09/posts
            var collectionName = subSegments[0];
            console.log('Collection: ', collectionName);
            var response = getCollection(collectionName, 10, 0, fields);
            var stringifiedResponse = JSON.stringify(response);
            return [200, {'Content-type': 'application/json'}, stringifiedResponse];
        }
    }
    else if(urlSections.length == 4){   // URL /2013-09-09/posts?fields=name,body/limit=1&offset=2
        firstSegment = urlSections[2];
        secondSegment = urlSections[3];
        var fields = [];
       if(firstSegment.indexOf('?') != -1){
            var subSegments = firstSegment.split('?');
            var collectionName = subSegments[0];
            var parameters = subSegments[1].split('=');
            var parameterValues = parameters[1].split(',');
            fields = parameterValues;
            console.log('Collection: ', collectionName);
            console.log('Fields: ', parameterValues);
        }
        else{
            var collectionName = subSegments[0];
            console.log('Collection: ', collectionName);
        }
        var paginationParams = secondSegment.split('&');
        var firstParam = paginationParams[0].split('=');
        var secondParam = paginationParams[1].split('=');
        var limit = parseInt(firstParam[1]);
        var offset = parseInt(secondParam[1]);

        var response = getCollection(collectionName, limit, offset, fields);
        var stringifiedResponse = JSON.stringify(response);
        return [200, {'Content-type': 'application/json'}, stringifiedResponse];

    }

    return [200, 'Success'];

});



function getCollection(collectionName, limit, offset, fields){
    if(collectionName == 'posts'){
        var response = getPosts(limit, offset, fields);
        return response;
    }
    else if(collectionName == 'explores'){
        var response = getExplores(limit, offset, fields);
        return response;
    }
    else if(collectionName == 'bubbles'){
        var response = getBubbles(limit, offset, fields);
        return response;
    }
}


function getExplores(limit, offset, fields){
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
        var allExplores = Explores.find({}, {fields: JSON.parse(fieldString)}).fetch();
        var explores = allExplores.slice(offset*limit, (offset+1)*limit);
        var response = {'count': exploresCount, 'pages': pages, 'page': offset, 'explores': explores};
        return response;
    }
}


function getBubbles(limit, offset, fields){
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
        var allBubbles = Bubbles.find({}, {fields: JSON.parse(fieldString)}).fetch();
        var bubbles = allBubbles.slice(offset*limit, (offset+1)*limit);
        var response = {'count': bubblesCount, 'pages': pages, 'page': offset, 'bubbles': bubbles};
        return response;
    }
}


function getPosts(limit, offset, fields){
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
        var allPosts = Posts.find({}, {fields: JSON.parse(fieldString)}).fetch();
        var posts = allPosts.slice(offset*limit, (offset+1)*limit);
        var response = {'count': postCount, 'pages': pages, 'page': offset, 'posts': posts};
        return response;
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
        var response = {'count': postCount, 'pages': pages, 'page': offset,  'posts': posts};
        return response;
    }
}



function randomInt(min, max){
    return Math.floor(Math.random() * (max-min+1)) + min;
}