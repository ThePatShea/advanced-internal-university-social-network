Domains = new Meteor.Collection('domains');

addDomain = function(domain) {
	Domains.insert({domain: domain});
};