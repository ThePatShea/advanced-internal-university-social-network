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
    authToken = null;
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
    };

    parent.sync.call(instance, method, model, opts);
  }

  // Overrides
  function processOpts(instance, options) {
    var opts = options ? _.clone(options) : {};

    console.log('1111', opts.success);

    var success = opts.success;
    opts.success = function(model, data) {
      if (instance.fetchRelated) {
        instance.fetchRelated(model, function(model) {
          if (success)
            success.call(instance, model, data, options);
        });
      } else {
        if (success)
          success.call(instance, model, data, options);
      }
    };

    return opts;
  }

  function buildWrapper(type) {
    var parent = type.prototype;

    return {
      fetch: function(options) {
        options = processOpts(this, options);
        return parent.fetch.call(this, options);
      },
      save: function(key, val, options) {
        if (key === null || typeof key === 'object')
          options = val;

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

  // Public API
  window.BubbleRest = {
    Model: Backbone.Model.extend(buildWrapper(Backbone.Model)),
    Collection: Backbone.Collection.extend(buildWrapper(Backbone.Collection))
  };
})();
