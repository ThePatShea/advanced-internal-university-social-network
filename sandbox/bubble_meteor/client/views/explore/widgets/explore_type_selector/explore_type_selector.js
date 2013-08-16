Template.exploreTypeSelector.helpers({
  getExploreTypes: function() {
    return exploreTypes;
  }
});


Template.exploreTypeSelector.events({
  'change .exploretypeselector': function(evt){
    //console.log(evt.target.selectedOptions[0].id);
    selectedExploreType = evt.target.selectedOptions[0].id;
  }
});

Template.exploreTypeSelector.rendered = function(){
  selectedExploreType = 'event';
}