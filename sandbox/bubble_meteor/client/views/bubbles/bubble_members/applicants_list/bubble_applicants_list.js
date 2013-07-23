Template.bubbleApplicantsList.helpers({
	getApplicants: function() {
    var applicantIds = this.users.applicants;
    return Meteor.users.find({_id: {$in: applicantIds}}).fetch();
  }
});