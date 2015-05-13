Template.exploreCover.helpers({
  getExploreIcon: function(exploreObject){
      var iconName = exploreObject.exploreIcon;
      if(iconName == 'announcements'){
        return Template['icon-official']();
      }
      else if(iconName == 'campus events'){
        return Template['icon-events']();
      }
      else if(iconName == 'classifieds'){
        return Template['icon-classifieds']();
      }
      else if(iconName == 'professor reviews'){
        return Template['icon-professorreviews']();
      }
      else if(iconName == 'controversial topics'){
        return Template['icon-controversial']();
      }
      else if(iconName == 'student deals'){
        return Template['icon-deals']();
      }
      else if(iconName == 'nightlife'){
        return Template['icon-nightlife']();
      }
  },

  getExploreIconName: function(exploreObject){
      var iconName = exploreObject.exploreIcon;
      if(iconName == 'announcements'){
        return 'icon-official';
      }
      else if(iconName == 'campus events'){
        return 'icon-events';
      }
      else if(iconName == 'classifieds'){
        return 'icon-classifieds';
      }
      else if(iconName == 'professor reviews'){
        return 'icon-professorreviews';
      }
      else if(iconName == 'controversial topics'){
        return 'icon-controversial';
      }
      else if(iconName == 'student deals'){
        return 'icon-deals';
      }
      else if(iconName == 'nightlife'){
        return 'icon-nightlife';
      }
  },

  isExploreType: function(exploretype){
    if(this.exploreType == exploretype){
      console.log(exploretype, this.exploreType == exploretype);
      return true;
    }
    else{
      console.log(exploretype, this.exploreType == exploretype)
      return false;
    }
  }

});
