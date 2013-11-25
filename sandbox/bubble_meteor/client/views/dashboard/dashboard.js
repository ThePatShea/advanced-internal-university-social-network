// Helpers
function refreshUpdates() {
  LoadingHelper.start();

  var opts = {
    limit: Session.get('updatesToShow')
  };

  UpdatesHelper.getUpdates(opts, function(result) {
    Session.set('dashboardUpdateCount', result.count);
    Session.set('dashboardUpdates', result.updates);

    LoadingHelper.stop();
  });
}

Template.dashboard.helpers({
  getFiveExplorePostsBB: function() {
		return Session.get('dashboardPosts');
  },
  haveUpdates: function() {
		return Session.get('dashboardUpdateCount') > 0;
  },
	getNumUpdates: function() {
		return Session.get('dashboardUpdateCount');
	},
	getUpdates: function() {
		return Session.get('dashboardUpdates');
	}
});

Template.dashboard.events({
  'click .clear-updates': function() {
    var updates = Updates.find({userId: Meteor.userId(), read:false}).fetch();
    _.each(updates, function(update) {
      Meteor.call('setRead', update);
    });
  },

  'click #dashboard-icon-2a': function() {
	//location.href="https://play.google.com/store/apps/details?id=io.cordova.emorybubble";
        window.open('https://play.google.com/store/apps/details?id=io.cordova.emorybubble', '_blank');
  },

  'click #dashboard-icon-2b': function() {
	//location.href="https://itunes.apple.com/us/app/emory-bubble/id538091098";
        window.open('https://itunes.apple.com/us/app/emory-bubble/id538091098', '_blank');
  },

  'click #dashboard-icon-3a': function() {
        Meteor.Router.to('/explore/hk3Crz5rY4LwBfbTS/home');
  },

  'click #dashboard-icon-3b': function() {
        Meteor.Router.to('/explore/9G3DYCXWbi3uJAQkj/home');
  },

  'click #dashboard-icon-3c': function() {
        Meteor.Router.to('/explore/uuaWh9sgTM7YmPEBM/home');
  },

  'click #dashboard-icon-3d': function() {
        Meteor.Router.to('/explore/ycDfNiYzwj5TqyYvT/home');
  },

  'click .dashboard-more-updates': function() {
  	Session.set('updatesToShow', 0);
  },
});

Template.dashboard.rendered = function () {
	//Meteor.subscribe('fiveExplorePosts');

	$('.carousel').carousel();

	/*$('.dashboard-more-updates').click(function(){
		$('.threeUpdtes').addClass('visible-0');
		$('.allUpdates').removeClass('visible-0');
		$('.dashboard-more-updates').addClass('visible-0');
		$('.dashboard-updates').css('height',(75*Session.get('numUpdates'))+'px');
	});*/

	$(document).attr('title', 'Dashboard - Emory Bubble');
};


Template.dashboard.created = function() {
	Session.set('updatesToShow',3);
	dashboardDep = new Deps.Dependency;
	Meteor.subscribe('updatedPosts', Meteor.userId());

	LoadingHelper.start();

	var dashboardData = new ExploreData.Dashboard();
	dashboardData.getData(function(error, data) {
		Session.set('dashboardPosts', data);
		LoadingHelper.stop();
	});

	this.updateWatch = Meteor.autorun(function() {
		refreshUpdates();
	});
};


Template.dashboard.destroyed = function() {
	this.updateWatch.stop();
};
