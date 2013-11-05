App.module("Controllers", function(Controllers, App, Backbone, Marionette, $, _) {
  Controllers.Base = Marionette.Controller.extend({
    constructor: function(options) {
      this.region = options.region || App.request('default:region');
      Marionette.Controller.prototype.constructor.call(this, options);
    },

    show: function(view, options) {
      var options = options || {}
      _.defaults(options, {
        region: this.region
      });

      this.setMainView(view);
      this._manageView(view, options); 
    },

    setMainView: function(view) {
      if(this._mainView) { return }
      this._mainView = view;
      this.listenTo(view, "close", this.close);
    },

    getMainView: function(){
      this._mainView
    },

    _manageView: function(view, options) {
      options.region.show(view);
    }
  });
});
