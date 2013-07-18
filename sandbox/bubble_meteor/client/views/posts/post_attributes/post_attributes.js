Template.postAttributes.helpers({
    hasChildren: function() {
      if (this.children != undefined && this.children.length > 0)
        return true;
      else
        return false;
    }
});
