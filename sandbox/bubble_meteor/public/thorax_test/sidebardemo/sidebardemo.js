define(['icon_templates', 'sidebar_templates', 'jquery', 'thorax'], function(iconTemplates, sidebarTemplates) {

	var sidebarModel = new Thorax.Model({
		sidebarOpen: false,
		subsectionPanelVisible: false,
		dashboardLink: '#',
		myBubblesLink: '#',
		exploreLink: '#',
		searchLink: '#',
		userProfileLink: '#',
		bubbleSubmitLink: '#',
		selectionDashboard: false,
		selectionMyBubbles: false,
		selectionExplore: false,
		selectionSearch: false,
		selectionSettings: false,
		hasLevel4Permission: false,
		category: 'greek'
	});

	var iconIOSView = new Thorax.View({template: iconTemplates.iconIOS});
	var iconAndroidView = new Thorax.View({template: iconTemplates.iconAndroid});
	/*var iconLogoMainView = new Thorax.View({template: Handlebars.compile('CB')});*/
	var iconSidebarCollapseView = new Thorax.View({template: iconTemplates.iconSidebarCollapse});
	var iconDashboardBigView = new Thorax.View({template: iconTemplates.iconDashboardBig});
	var iconArrowRightView = new Thorax.View({template: iconTemplates.iconArrowRight});
	var iconTwoBubblesView = new Thorax.View({template: iconTemplates.iconTwoBubbles});
	var iconExploreView = new Thorax.View({template: iconTemplates.iconExplore});
	var iconSearchThinView = new Thorax.View({template: iconTemplates.iconSearchThin});
	var iconSettingsBigView = new Thorax.View({template: iconTemplates.iconSettingsBig});
	var iconAddView = new Thorax.View({template: iconTemplates.iconAdd});
	var iconBubbleView = new Thorax.View({template: iconTemplates.iconBubble});
	var iconUserView = new Thorax.View({template: iconTemplates.iconUser});
	var iconInviteView = new Thorax.View({template: iconTemplates.iconInvite});
	var iconAboutView = new Thorax.View({template: iconTemplates.iconAbout});
	var iconSupportView = new Thorax.View({template: iconTemplates.iconSupport});
	var iconTutorialView = new Thorax.View({template: iconTemplates.iconTutorial});



	var sidebarView = new Thorax.View({
		model: sidebarModel,
		'icon-iOS': iconIOSView,
		'icon-Android': iconAndroidView,
		/*'icon-logo-main': iconLogoMainView,*/
		'icon-sidebar-collapse': iconSidebarCollapseView,
		'icon-dashboard-big': iconDashboardBigView,
		'icon-two-bubbles': iconTwoBubblesView,
		'icon-explore': iconExploreView,
		'icon-search-thin': iconSearchThinView,
		'icon-settings-big': iconSettingsBigView,
		'icon-add': iconAddView,
		'icon-bubble': iconBubbleView,
		'icon-user': iconUserView,
		'icon-invite': iconInviteView,
		'icon-about': iconAboutView,
		'icon-support': iconSupportView,
		'icon-tutorial': iconTutorialView,
		template: sidebarTemplates.sidebarView
	});

	sidebarView.appendTo('body');
});