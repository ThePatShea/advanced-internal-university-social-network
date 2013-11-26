(function() {
  var privData = {
    authToken: null,
    inAuth: false,
    authQueue: []
  };

  function getToken(callback) {
    if (privData.inAuth) {
      privData.authQueue.push(callback);
      return;
    }

    if (privData.authToken) {
      callback(privData.authToken);
    } else {
      privData.inAuth = true;

      Meteor.call('getRestToken', function(error, token) {
        if (!token) {
          // TODO: Navigate to login page?
          console.log('Not authenticated!', error);
        }

        privData.authToken = token;
        privData.inAuth = false;

        try {
          callback(token);
        } catch(e) {
          console.log('Token error: ', e);
        }

        for (var n in privData.authQueue) {
          try {
            privData.authQueue[n](token);
          } catch (e) {
            console.log('Token error: ', e);
          }
        }
      });
    }
  }

  function resetToken(callback) {
    privData.authToken = null;
    getToken(callback);
  }

  function syncCall(instance, token, parent, method, model, options, retry) {
    var opts = _.clone(options);

    if (!opts)
      opts = {};

    // Error handler
    var error = opts.error;
    opts.error = function(resp, data) {
      // If 403 and this is not retry, re-authenticate and try again
      if (!retry && resp.status === 403) {
        resetToken(function(token) {
          syncCall(instance, token, parent, method, model, options, true);
        });
      }

      if (error)
        error.call(instance, resp, data, options);
    };

    var beforeSend = opts.beforeSend;
    opts.beforeSend = function(xhr) {
      xhr.setRequestHeader('x-authentication', token);

      if (beforeSend)
        beforeSend.call(instance, xhr);

      //console.log(xhr);
    };

    parent.sync.call(instance, method, model, opts);
  }

  // Overrides
  function processOpts(instance, options) {
    var opts = options ? _.clone(options) : {};

    var success = opts.success;
    opts.success = function(model, data) {
      instance.fetchRelated(model, function(model) {
        if (success)
          success.call(instance, model, data, options);
      });
    };

    return opts;
  }

  function buildWrapper(type) {
    var parent = type.prototype;

    return {
      fetchRelated: function(data, callback) {
        callback(data);
      },
      fetch: function(options) {
        options = processOpts(this, options);
        return parent.fetch.call(this, options);
      },
      save: function(attrs, options) {
        options = processOpts(this, options);
        return parent.save.call(this, key, val, options);
      },
      sync: function(method, model, options) {
        var self = this;

        getToken(function(token) {
          syncCall(self, token, parent, method, model, options, false);
        });
      }
    };
  }

  function buildModel(type) {
    var opts = buildWrapper(type);

    _.extend(opts, {
      save: function(attrs, options) {
        if (!options)
          options = {};

        if (this.excludeFields)
          attrs = _.omit(attrs, this.excludeFields);

        return Backbone.Model.prototype.save.call(this, attrs, options);
      }
    });

    return opts;
  }

  function buildCollection(type) {
    var opts = buildWrapper(type);

    _.extend(opts, {
      fetchRelated: function(coll, callback) {
        // If model is not set or model does not have fetchRelated property - skip
        if (!coll.model || !coll.model.prototype.fetchRelated) {
          callback(coll);
          return;
        }

        var count = 0;
        var initialized = false;

        function maybeContinue() {
          count -= 1;

          if (initialized && count <= 0)
            callback(coll);
        }

        for (var m = 0; m < coll.models.length; ++m) {
          var model = coll.models[m];

          count += 1;
          model.fetchRelated.call(model, model, maybeContinue);
        }

        // If there are no pending dependencies - continue
        initialized = true;

        if (!count)
          callback(coll);
      }
    });

    return opts;
  }

  // Public API
  window.BubbleRest = {
    Model: Backbone.Model.extend(buildModel(Backbone.Model)),
    Collection: Backbone.Collection.extend(buildCollection(Backbone.Collection))
  };
})();
