(function(){
  function changeStatus(flag) {
    var count = Deps.nonreactive(function() {
      return Session.get('loadingStatus');
    });

    Session.set('loadingStatus', count + flag);

    //console.trace(count + flag);

    return count + flag;
  }

  window.LoadingHelper = {
    start: function() {
      return changeStatus(1);
    },
    stop: function() {
      return changeStatus(-1);
    }
  };

  Handlebars.registerHelper('isLoading', function() {
    return Session.get('loadingStatus') > 0;
  });

  Session.set('loadingStatus', 0);
})();
