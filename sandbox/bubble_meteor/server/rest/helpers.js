var Future = Npm.require('fibers/future');

var DEFAULT_LIMIT = 10;
var MAX_LIMIT = 50;

this.RestHelpers = {
  Future: Future,

  /**
   * Return callback function that will either finish `Future` or rethrow exception
   * @param  {Future} future
   */
  bindFuture: function(future) {
    return function(err, result) {
      if (err) {
        future.throw(err);
      } else {
        future.return(result);
      }
    };
  },

  /**
   * Merge source into target object
   * @param  {object} target
   * @param  {object} source
   * @return {object} new object with combined properties
   */
  mergeObjects: function(target, source) {
    var result = {};

    for (var n in target)
      result[n] = target[n];

    for (var n in source)
      result[n] = source[n];

    return result;
  },

  deepCompare: function(left, right) {
    var leftChain = [];
    var rightChain = [];

    function compare(x, y) {
      var p;

      // remember that NaN === NaN returns false
      // and isNaN(undefined) returns true
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number')
        return true;

      // Compare primitives and functions.
      // Check if both arguments link to the same object.
      // Especially useful on step when comparing prototypes
      if (x === y)
        return true;

      // Works in case when functions are created in constructor.
      // Comparing dates is a common scenario. Another built-ins?
      // We can even handle functions passed across iframes
      if ((typeof x === 'function' && typeof y === 'function') ||
         (x instanceof Date && y instanceof Date) ||
         (x instanceof RegExp && y instanceof RegExp) ||
         (x instanceof String && y instanceof String) ||
         (x instanceof Number && y instanceof Number)) {
          return x.toString() === y.toString();
      }

      // At last checking prototypes as good a we can
      if (!(x instanceof Object && y instanceof Object))
        return false;

      if (x.isPrototypeOf(y) || y.isPrototypeOf(x))
        return false;

      if (x.constructor !== y.constructor)
        return false;

      if (x.prototype !== y.prototype)
        return false;

      // check for infinitive linking loops
      if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1)
        return false;

      // Quick checking of one object beeing a subset of another.
      // todo: cache the structure of arguments[0] for performance
      for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
          return false;
        }
      }

      for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
          return false;
        }

        switch (typeof (x[p])) {
          case 'object':
          case 'function':
            leftChain.push(x);
            rightChain.push(y);

            if (!compare(x[p], y[p]))
              return false;

            leftChain.pop();
            rightChain.pop();
            break;
          default:
            if (x[p] !== y[p])
              return false;
            break;
        }
      }

      return true;
    }

    return compare(left, right);
  },

  /**
   * Get property value from dot-separated path
   * @param  {object} obj  object
   * @param  {string} path property to get
   * @return          value or undefined
   */
  getField: function(obj, path) {
    var parts = path.split('.');

    for (var n in parts) {
      var p = parts[n];
      obj = obj[p];

      if (!obj)
        break;
    }

    return obj;
  },

  /**
   * Check if objects have different fields
   * @param  {object} o1     first object
   * @param  {object} o2     second object
   * @param  {list} fields list of field names to check
   * @return {bool}        true or false
   */
  haveChangedFields: function(o1, o2, fields) {
    for (var n in fields) {
      var f = fields[n];

      if (!this.deepCompare(this.getField(o1, f), this.getField(o2, f))) {
        return f;
      }
    }

    return null;
  },

  /**
   * Parse requested field list into object
   * @param  {string} fieldList field list
   * @return {object}           filters
   */
  getFieldList: function(fieldList) {
    if (fieldList) {
      var fields = fieldList.split(',');
      var result = {};

      for (var f in fields)
        result[fields[f]] = true;

      return result;
    }

    return null;
  },

  /**
   * Build MongoDB filter options out of parsed API options
   * @param  {object} apiOptions options
   * @return {object}            MongoDB filter
   */
  buildOptions: function(apiOptions) {
    if (apiOptions) {
      var options = {};

      options.limit = apiOptions.limit || DEFAULT_LIMIT;

      if (options.limit > MAX_LIMIT) {
        options.limit = MAX_LIMIT;
      }

      if (apiOptions.page) {
        options.skip = apiOptions.page * options.limit;
      }

      return options;
    }

    return {
      limit: DEFAULT_LIMIT
    };
  },

  /**
   * Convert model from MongoDB to application format
   * @param  {object} model
   * @return {object}       model
   */
  fromMongoModel: function(model) {
    model.id = model._id;
    delete model._id;
    return model;
  },

  /**
   * Convert model from application format to MongoDB
   * @param  {[type]} model [description]
   * @return {[type]}       [description]
   */
  toMongoModel: function(model) {
    model._id = model.id;
    delete model.id;
    return model;
  },

  /**
   * Run MongoDB .find() through raw MongoDB API to get count and records
   * @param  {Collection} collection Meteor collection
   * @param  {object} query      query
   * @param  {object} fields     fields
   * @param  {object} options    options
   * @return {array}             result
   */
  mongoFind: function(collection, query, fields, options) {
    var rawCollection = MongoHelper.getRawCollection(collection);
    var countFuture = new Future();
    var itemsFuture = new Future();

    rawCollection.find(query).count(this.bindFuture(countFuture));
    rawCollection.find(query, fields, options).toArray(this.bindFuture(itemsFuture));

    return {
      count: countFuture.wait(),
      items: itemsFuture.wait()
      };
  },

  /**
   * Run findOne through raw MongoDB API
   * @param  {collection} collection Meteor collection
   * @param  {object} query      filter or record ID
   * @param  {object} fields     fields object
   * @return result
   */
  mongoFindOne: function(collection, query, fields) {
    var rawCollection = MongoHelper.getRawCollection(collection);
    var future = new Future();

    if (typeof query == 'string')
      query = {_id: query};

    rawCollection.findOne(query, this.bindFuture(future));
    var obj = future.wait();

    // MongoDB does not support field filtering with findOne
    if (fields) {
      var result = {};

      for (var n in obj) {
        if (n === '_id' || fields[n])
          result[n] = obj[n];
      }

      return result;
    }

    return obj;
  },

  /**
   * Insert through MongoDB raw API
   * @param  {Collection} collection Meteor collection
   * @param  {object} obj        record to insert
   * @return inserted document
   */
  mongoInsert: function(collection, obj) {
    var rawCollection = MongoHelper.getRawCollection(collection);
    var future = new Future();

    rawCollection.insert(obj, this.bindFuture(future));
    return future.wait();
  },

  /**
   * Update through MongoDB raw API
   * @param  {Collection} collection Meteor collection
   * @param  {string} id         record ID
   * @param  {object} obj        new record data
   * @return true if updated
   */
  mongoUpdate: function(collection, id, obj) {
    var rawCollection = MongoHelper.getRawCollection(collection);
    var future = new Future();

    rawCollection.update({_id: id}, obj, {w: 1}, this.bindFuture(future));
    return future.wait() === 1;
  },

  /**
   * Delete through MongoDB raw API
   * @param  {Collection} collection Meteor collection
   * @param  {string} id         record ID
   * @return true if updated
   */
  mongoDelete: function(collection, id) {
    var rawCollection = MongoHelper.getRawCollection(collection);
    var future = new Future();

    rawCollection.remove({_id: id}, {w: 1}, this.bindFuture(future));
    return future.wait() === 1;
  },

  /**
   * Create JSON response with proper encoding
   * @param  {int} code    HTTP status code
   * @param  {any} payload Payload to be sent
   * @return {object}      response object
   */
  jsonResponse: function(code, payload, headers) {
    headers = headers || {};
    headers['Content-Type'] = 'application/json';
    return [code, headers, JSON.stringify(payload)];
  },

  /**
   * Create query response
   * @param  {object} apiOptions   API options
   * @param  {object} queryOptions query filter
   * @param  {object} data         request data
   * @param  {object} viewOptions  view options
   * @return {object}              response object
   */
  makeQueryResponse: function(apiOptions, queryOptions, data, viewOptions) {
    // Generate result
    var name = (viewOptions && viewOptions.name) || 'items';

    var result = {
      count: data.count,
      pages: Math.floor(data.count / queryOptions.limit) + ((data.count % queryOptions.limit > 0) ? 1 : 0),
      page: apiOptions.page
    };

    // Rename _id to id
    for (var n in data.items) {
      this.fromMongoModel(data.items[n]);
    }

    result[name] = data.items;

    return this.jsonResponse(200, result);
  },

  /**
   * Authenticate user with x-authentication header. After successful authentication
   * will contribute userId and user to context.
   * @param  {object} ctx request context
   * @return {bool}       true if successfully authenticated
   */
  headerAuth: function(ctx) {
    var authHeader = ctx.request.headers['x-authentication'];
    if (!authHeader)
      return false;

    var userId = RestCrypto.verifyToken(authHeader);
    if (!userId)
      return false;

    var user = Meteor.users.findOne(userId);
    if (!user)
      return false;

    ctx.userId = userId;
    ctx.user = user;
    return true;
  },

  /**
   * Either run custom authentication function or header-based authentication
   * @param  {object} ctx  request context
   * @param  {object} opts options
   * @return {bool}        true if authenticated
   */
  authUser: function(ctx, opts) {
    if (opts && opts.authUser)
      return opts.authUser(ctx, opts);

    return this.headerAuth(ctx);
  },

  /**
   * Create express.js raw request body parser. Not used at the moment.
   */
  rawBodyParser: function() {
    var connect = Npm.require('connect');
    var defaultParser = connect.bodyParser;

    var needle = '/api/v1_0';

    return function(req, response, next) {
      // TODO: Fix me - need to remove once there are no other REST endpoints anymore
      if (req.url.slice(-needle.length) != needle)
        return defaultParser(req, response, next);

      var buf;
      if (req._body) {
        return next();
      }

      req._body = true;

      buf = '';
      req.on('data', function(chunk) {
        return buf += chunk;
      });

      return req.on('end', function() {
        req.body = buf;
        return next();
      });
    };
  }
};
