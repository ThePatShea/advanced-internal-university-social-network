// Implements features specific to mobile devices
$(document).ready(function () {
  if ( isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() ) {
    $('.mobile_visible').css({display: 'block'});
  }
})
