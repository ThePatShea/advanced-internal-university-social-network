this.SearchHelpers = {
  'searchBubblesQueue': [],
  'searchUsersQueue': [],
  'searchEventsQueue': [],
  'searchDiscussionsQueue': [],
  'searchFilesQueue': [],

  searchBubblesMeteor: function(searchText, callback) {
    if (!Session.get('searchingBubbles')) {
      Session.set('searchingBubbles', true);
      Meteor.call('search_bubbles', searchText, function(err, res) {
        if (err) {
          Session.set('searchingBubbles', false);
          callback(err, res);
        } else {
          Session.set('searchingBubbles', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchBubblesQueue, SearchHelpers.searchBubblesMeteor);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchBubblesQueue.push(queuedSearch);
    }
  },

  searchUsersMeteor: function(searchText, callback) {
    if (!Session.get('searchingUsers')) {
      Session.set('searchingUsers', true);
      Meteor.call('search_users', searchText, function(err, res) {
        if (err) {
          Session.set('searchingUsers', false);
          callback(err, res);
        } else {
          Session.set('searchingUsers', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchUsersQueue, SearchHelpers.searchUsersMeteor);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchUsersQueue.push(queuedSearch);
    }
  },

  searchEventsMeteor: function(searchText, callback) {
    if (!Session.get('searchingEvents')) {
      Session.set('searchingEvents', true);
      Meteor.call('search_events', searchText, function(err, res) {
        if (err) {
          Session.set('searchingEvents', false);
          callback(err, res);
        } else {
          Session.set('searchingEvents', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchEventsQueue, SearchHelpers.searchEventsMeteor);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchEventsQueue.push(queuedSearch);
    }
  },

  searchDiscussionsMeteor: function(searchText, callback) {
    if (!Session.get('searchingDiscussions')) {
      Session.set('searchingDiscussions', true);
      Meteor.call('search_discussions', searchText, function(err, res) {
        if (err) {
          Session.set('searchingDiscussions', false);
          callback(err, res);
        } else {
          Session.set('searchingDiscussions', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchDiscussionsQueue, SearchHelpers.searchDiscussionsMeteor);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchDiscussionsQueue.push(queuedSearch);
    }
  },

  searchFilesMeteor: function(searchText, callback) {
    if (!Session.get('searchingFiles')) {
      Session.set('searchingFiles', true);
      Meteor.call('search_files', searchText, function(err, res) {
        if (err) {
          Session.set('searchingFiles', false);
          callback(err, res);
        } else {
          Session.set('searchingFiles', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchFilesQueue, SearchHelpers.searchFilesMeteor);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchFilesQueue.push(queuedSearch);
    }
  },

  _popQueue: function(queue, searchCall){
    var queuedSearch = queue.pop();
    if (queuedSearch) {
      searchCall(queuedSearch.searchText, queuedSearch.callback);
    }
  }

}