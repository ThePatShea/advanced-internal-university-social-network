var fs = Npm.require('fs');


this.RestHandlers = {
  handleFileUpload: function() {
    // Security check
    if (!RestHelpers.authUser(this))
      return RestHelpers.jsonResponse(403, 'Not authenticated');

    if (!this.request.files || !this.request.files.file)
      return RestHelpers.jsonResponse(421, 'No files attached');

    var file = this.request.files.file;

    var future = new RestHelpers.Future();
    fs.readFile(file.path, RestHelpers.bindFuture(future));

    var contents = future.wait();

    var newId = new Meteor.Collection.ObjectID().toHexString();
    var obj = {
      _id: newId,
      name: file.name,
      type: file.type,
      userId: this.userId,
      size: file.size,
      body: new MongoDB.Binary(contents),
      submitted: new Date().getTime(),
      // TODO: configurable endpoint
      url: Meteor.absoluteUrl('api/v1_0/file/' + newId + '/get')
    };

    var results = RestHelpers.mongoInsert(Files, obj);

    if (results.length == 0)
      return RestHelpers.jsonResponse(500, 'Failed to create model');

    var result = results[0];

    // CORS
    var headers = {
      'Access-Control-Allow-Origin': '*'
    };

    return RestHelpers.jsonResponse(200, RestPost.postprocessFile(result), headers);
  },

  handleFileRequest: function(id) {
    var obj = RestHelpers.mongoFindOne(Files, id);
    if (!obj)
      return RestHelpers.jsonResponse(404, 'File not found.');

    var headers = {
      'Content-Type': obj.type,
      'Content-Length': obj.size,
      'Content-Disposition': 'filename=' + obj.name
    };

    return [200, headers, obj.body.buffer];
  },

  handleCorsRequest: function() {
    var headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'x-authentication'
    };

    return [200, headers, ''];
  }
};
