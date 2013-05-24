// Pulls up a map api when the user clicks "map_it"
$(document).ready(function () {


    function initialize_map() {
      var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map_canvas"),
          mapOptions);
    }

    $('#map_it').click(function() {
      alert('hey')
      initialize_map()
    });








})
