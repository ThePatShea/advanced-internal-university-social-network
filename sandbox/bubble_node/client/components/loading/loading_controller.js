App.module("Components.Loading", function(Loading, App, Backbone, Marionette, $, _) {

  Loading.LoadingController = App.Controllers.Base.extend({
    initialize: function(options){
      var view = options.view
      var config = options.config

      config = _.isBoolean(config) ? {} : config

      _.defaults(config, {
        entities: this.getEntities(view),
        loadingType: "spinner",
        debug: false,
        done: function(){}
      })

      switch(config.loadingType){
        case "spinner":
          var loadingView = new Loading.View
          this.show(loadingView);
      }

      this.showRealView(view, config, loadingView)
    },
    
    showRealView: function(realView, config, loadingView){
      xhrs = _.chain([config.entities]).flatten().pluck("_fetch").value()

      _this = this
      $.when.apply($, xhrs).done(function(){
        // ================================================================
        // If the region we are trying to insert is not the loadingView then
        // we know the user has navigated to a different page while the loading
        // view was still open. In that case, we know to manually close the real
        // view so its controller is also closed.  We also prevent showing the real
        // view (which would snap the user back to the old view unexpectedly)
        // ================================================================
        if(loadingView && (_this.region.currentView !== loadingView)){
          return realView.close()
        }

        if(!config.debug){
          _this.show(realView)
        }
        config.done()
      })

      $.when.apply($, xhrs).always(function(){
        _this.close()
      }) 
            
    },

    getEntities: function(view){
      return _.chain(view).pick("model", "collection").toArray().compact().value()
    }
  })

  App.commands.setHandler("show:loading", function(view, options){
    new Loading.LoadingController({
      view: view,
      config: options.loading,
      region: options.region
    })
  })
})