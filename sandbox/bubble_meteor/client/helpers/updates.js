(function() {
  function filterUpdates(updateList, limit) {
    if (updateList.length > 0) {
      // To combine updates with same userId, invokerId, updateType and postId
      _.each(updateList, function(update){
        updateList = _.reject(updateList, function(newUpdate) {
          return update.bubbleId === newUpdate.bubbleId &&
                 update.userId === newUpdate.userId &&
                 update.invokerId === newUpdate.invokerId &&
                 update.updateType === newUpdate.updateType &&
                 update.postId === newUpdate.postId;
        });

        if (!_.contains(updateList,update)) {
          updateList.push(update);
        }
      });

      // Combine updates for same post
      _.each(updateList, function(update){
        // Remove replies
        var commentUpdates = _.reject(updateList, function(update) {
          return update.updateType !== 'replied';
        });

        // Combine and chain the names together
        if (commentUpdates.length > 0) {
          updateList = _.reject(updateList, function(newUpdate) {
            return update.postId == newUpdate.postId &&
                    update.updateType == newUpdate.updateType &&
                    update.updateType == "replied";
          });

          if(!_.contains(updateList,update)) {
            //Pull out comment updates that belong to the same post
            singleTypeUpdates = _.reject(commentUpdates, function(newUpdate) {
              return update.postId != newUpdate.postId;
            });
            if (singleTypeUpdates.length > 0) {
              //Create the chained name
              var nameArray = _.pluck(singleTypeUpdates,"invokerName");
              var chainedName = nameArray.join();
              var maxLength = 13;

              //Checks to see if the length of names exceed a certain limit
              if(chainedName.length > maxLength) {
                chainedName = chainedName.substring(0,maxLength);
                var nameList = chainedName.split(',');
                if(nameArray[0].length > maxLength) {
                  nameList[0] = nameArray[0];
                }else{
                  nameList.pop();
                }
                var excessCount = nameArray.length - nameList.length;
                chainedName = nameList.join();
                if(excessCount == 1) {
                  chainedName = chainedName + " and " + excessCount + " other";
                }else if(excessCount > 1){
                  chainedName = chainedName + " and " + excessCount + " others";
                }
              }else{
                chainedName = chainedName.replace(/,([^,]*)$/," and $1");
              }

              //Add the chained name to the invokerName
              update.invokerName = chainedName;
            }
            updateList.push(update);
          }
        }
      });

      // To combine and chain up names for similar updates
      _.each(updateList, function(originalUpdate) {
        if (originalUpdate.collapsible) {
          var type = originalUpdate.updateType;

          var singleTypeUpdates = _.reject(updateList, function(update) {
            return update.updateType !== type;
          });

          if (singleTypeUpdates.length > 0) {
            var nameArray = _.pluck(singleTypeUpdates, 'invokerName');
            var chainedName = nameArray.join();
            var maxLength = 13;

            if (chainedName.length > maxLength) {
              chainedName = chainedName.substring(0,maxLength);
              var nameList = chainedName.split(',');
              if (nameArray[0].length > maxLength) {
                nameList[0] = nameArray[0];
              } else{
                nameList.pop();
              }

              var excessCount = nameArray.length - nameList.length;
              chainedName = nameList.join();

              if (excessCount === 1) {
                chainedName = chainedName + " and " + excessCount + " other";
              } else {
                chainedName = chainedName + " and " + excessCount + " others";
              }
            } else{
              chainedName = chainedName.replace(/,([^,]*)$/," and $1");
            }

            originalUpdate.invokerName = chainedName;

            // Next remove all applicants
            updateList = _.reject(updateList, function(newUpdate) {
              return newUpdate.updateType == type;
            });

            //Now add back with the applicant that has a changed invoker name
            if (firstUpdate){
              updateList.push(firstUpdate);
            }
          }
        }
      });

      updateList = _.sortBy(updateList, function(newUpdate) {
        return newUpdate.submitted;
      });

      var result = {
        count: updateList.length,
        updates: updateList.reverse()
      };

      if (limit)
        result.updates = _.first(result.updates, limit);

      return result;
    }

    return {
      count: 0,
      updates: []
    };
  }

  function postProcess(result, opts, callback) {
    // Load related models
    var count = 0;
    var initialized = false;

    function maybeContinue() {
      count -= 1;

      if (initialized && count <= 0)
        callback(result);
    }

    _.each(result.updates, function(update) {
      // Load post for these update types
      if (update.updateType === 'new attendee' ||
           update.updateType === 'replied' ||
           update.updateType === 'posted' ||
           update.updateType === 'edited post') {
        count += 1;

        var post = new BubbleModels.Post({id: update.postId});
        post.fetch({
          success: function(post) {
            update.postData = post.toJSON();
            maybeContinue();
          },
          error: function() {
            update.postData = null;
            maybeContinue();
          }
        });
      }

      // Load associated user
      count += 1;

      var user = new BubbleModels.User({id: update.invokerId});
      user.fetch({
        success: function(user) {
          update.userData = user.toJSON();
          maybeContinue();
        },
        error: function() {
          update.userData = null;
          maybeContinue();
        }
      });
    });

    initialized = true;
    count += 1;
    maybeContinue();
  }

  // Public API
  window.UpdatesHelper = {
    getUpdates: function(opts, callback) {
      if (typeof callback === 'undefined') {
        callback = opts;
        opts = null;
      }

      var query = {
        userId: Meteor.userId(),
        read: false
      };

      if (opts.query)
        query = _.extend(query, opts.query);

      var updateList = Updates.find(query, {sort: {date: -1}}).fetch();

      result = filterUpdates(updateList, opts.limit);

      postProcess(result, opts, callback);
    }
  };

  // Pulls the count of compressed list of updates for each bubble
  Handlebars.registerHelper('compressedUpdatesCount', function(bubbleId) {
    if (!bubbleId)
      bubbleId = Session.get('currentBubbleId');

    var updateList = Updates.find({userId: Meteor.userId(), bubbleId: bubbleId, read:false}).fetch();

    // TODO: Speed me up
    return filterUpdates(updateList).count;
  });
})();