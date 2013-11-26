this.SearchHelpers = {
  'searchBubblesQueue': [],
  'searchUsersQueue': [],
  'searchEventsQueue': [],
  'searchDiscussionsQueue': [],
  'searchFilesQueue': [],

  searchSetupMeteor: function() {
    if(!SearchHelpers.getUserListObject)
      SearchHelpers.getUserListObject = new SearchData.GetUserList();
    if(!SearchHelpers.getBubbleListObject)
      SearchHelpers.getBubbleListObject = new SearchData.GetBubbleList();
    if(!SearchHelpers.getPostListObject)
      SearchHelpers.getPostListObject = new SearchData.GetPostList();
  },

  searchBubblesMeteor: function(searchText, callback) {
    if (!Session.get('searchingBubbles')) {
      Session.set('searchingBubbles', true);
      Meteor.call('search_bubbles', searchText, function(err, res) {
        if (err) {
          Session.set('searchingBubbles', false);
          callback(err, res);
        } else {
          Session.set('searchingBubbles', false);
          SearchHelpers.getBubbleListObject.getBubbleList(res,function(err,res) {
            callback(err,res);
          });
          //callback(err, res);
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
          SearchHelpers.getUserListObject.getUserList(res,function(err,res) {
            callback(err,res);
          });
          //callback(err, res);
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
          SearchHelpers.getPostListObject.getPostList(res,function(err,res) {
            console.log("EVENTS: ", res);
            callback(err,res);
          });
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
          SearchHelpers.getPostListObject.getPostList(res,function(err,res) {
            callback(err,res);
          });
          //callback(err, res);
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
          SearchHelpers.getPostListObject.getPostList(res,function(err,res) {
            callback(err,res);
          });
          //callback(err, res);
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

  searchSetupREST: function() {
    Session.set('searchingBubbles', false);
    Session.set('searchingUsers', false);
    Session.set('searchingEvents', false);
    Session.set('searchingDiscussions', false);
    Session.set('searchingFiles', false);

    if (!SearchHelpers.searchBubblesObject)
      SearchHelpers.searchBubblesObject = new SearchData.SearchBubbles();

    if (!SearchHelpers.searchUsersObject)
      SearchHelpers.searchUsersObject = new SearchData.SearchUsers();

    if (!SearchHelpers.searchEventsObject)
      SearchHelpers.searchEventsObject = new SearchData.SearchEvents();

    if (!SearchHelpers.searchDiscussionsObject)
      SearchHelpers.searchDiscussionsObject = new SearchData.SearchDiscussions();

    if (!SearchHelpers.searchFilesObject)
      SearchHelpers.searchFilesObject = new SearchData.SearchFiles();
  },

  searchBubblesREST: function(searchText, callback) {
    if (!Session.get('searchingBubbles')) {
      Session.set('searchingBubbles', true);
      console.log('searchBubblesREST');
      SearchHelpers.searchBubblesObject.search(searchText, function(err, res) {
        if (err) {
          Session.set('searchingBubbles', false);
          callback(err, res);
        } else {
          Session.set('searchingBubbles', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchBubblesQueue, SearchHelpers.searchBubblesREST);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchBubblesQueue.push(queuedSearch);
    }
  },

  searchUsersREST: function(searchText, callback) {
    if (!Session.get('searchingUsers')) {
      Session.set('searchingUsers', true);
      SearchHelpers.searchUsersObject.search(searchText, function(err, res) {
        if (err) {
          Session.set('searchingUsers', false);
          callback(err, res);
        } else {
          Session.set('searchingUsers', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchUsersQueue, SearchHelpers.searchUsersREST);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchUsersQueue.push(queuedSearch);
    }
  },

  searchEventsREST: function(searchText, callback) {
    if (!Session.get('searchingEvents')) {
      Session.set('searchingEvents', true);
      SearchHelpers.searchEventsObject.search(searchText, function(err, res) {
        if (err) {
          Session.set('searchingEvents', false);
          callback(err, res);
        } else {
          Session.set('searchingEvents', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchEventsQueue, SearchHelpers.searchEventsREST);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchEventsQueue.push(queuedSearch);
    }
  },

  searchDiscussionsREST: function(searchText, callback) {
    if (!Session.get('searchingDiscussions')) {
      Session.set('searchingDiscussions', true);
      SearchHelpers.searchDiscussionsObject.search(searchText, function(err, res) {
        if (err) {
          Session.set('searchingDiscussions', false);
          callback(err, res);
        } else {
          Session.set('searchingDiscussions', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchDiscussionsQueue, SearchHelpers.searchDiscussionsREST);
      });
    } else {
      var queuedSearch = {
        'searchText': searchText,
        'callback': callback
      }
      SearchHelpers.searchDiscussionsQueue.push(queuedSearch);
    }
  },

  searchFilesREST: function(searchText, callback) {
    if (!Session.get('searchingFiles')) {
      Session.set('searchingFiles', true);
      SearchHelpers.searchFilesObject.search(searchText, function(err, res) {
        if (err) {
          Session.set('searchingFiles', false);
          callback(err, res);
        } else {
          Session.set('searchingFiles', false);
          callback(err, res);
        }
        SearchHelpers._popQueue(SearchHelpers.searchFilesQueue, SearchHelpers.searchFilesREST);
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


Meteor.startup(function() {
  SearchHelpers.searchSetupMeteor();
  SearchHelpers.searchSetupREST();
});