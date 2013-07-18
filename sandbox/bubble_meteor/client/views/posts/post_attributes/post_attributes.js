Template.postAttributes.helpers({
    hasChildren: function() {
      if (this.children != undefined)
        return true;
      else
        return false;
    }
});
