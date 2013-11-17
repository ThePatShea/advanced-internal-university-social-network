this.SearchHelpers = {

  searchBubblesMeteor: function(searchText, callback) {
    if (!Session.get('searchingBubbles')) {
      Session.set('searchingBubbles', true);
      Meteor.call('search_bubbles', searchText, function(err, res) {
        if (err) {
          console.log('Search Helpers Error: ', err);
          Session.set('searchingBubbles', false);
        } else {
          Session.set('searchingBubbles', false);
          callback(err, res);
        }
      });
    }
  },

  searchUsersMeteor: function(searchText, callback) {
    if (!Session.get('searchingUsers')) {
      Session.set('searchingUsers', true);
      Meteor.call('search_users', searchText, function(err, res) {
        if (err) {
          console.log('Search Helpers Error: ', err);
          Session.set('searchingUsers', false);
        } else {
          Session.set('searchingUsers', false);
          callback(err, res);
        }
      });
    }
  },

  searchEventsMeteor: function(searchText, callback) {
    if (!Session.get('searchingEvents')) {
      Session.set('searchingEvents', true);
      Meteor.call('search_events', searchText, function(err, res) {
        if (err) {
          console.log('Search Helpers Error: ', err);
          Session.set('searchingEvents', false);
        } else {
          Session.set('searchingEvents', false);
          callback(err, res);
        }
      });
    }
  },

  searchDiscussionsMeteor: function(searchText, callback) {
    if (!Session.get('searchingDiscussions')) {
      Session.set('searchingDiscussions', true);
      Meteor.call('search_discussions', searchText, function(err, res) {
        if (err) {
          console.log('Search Helpers Error: ', err);
          Session.set('searchingDiscussions', false);
        } else {
          Session.set('searchingDiscussions', false);
          callback(err, res);
        }
      });
    }
  },

  searchFilesMeteor: function(searchText, callback) {
    if (!Session.get('searchingFiles')) {
      Session.set('searchingFiles', true);
      Meteor.call('search_files', searchText, function(err, res) {
        if (err) {
          console.log('Search Helpers Error: ', err);
          Session.set('searchingFiles', false);
        } else {
          Session.set('searchingFiles', false);
          callback(err, res);
        }
      });
    }
  }

}