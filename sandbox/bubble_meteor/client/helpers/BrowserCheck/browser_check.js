Template.browserCheck.rendered = function(){
	var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	    // At least Safari 3+: "[object HTMLElementConstructor]"
	var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
	var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6

	//console.log('Browser check: ', isOpera, isFirefox, isSafari, isChrome, isIE);

	if(!(isFirefox || isSafari || isChrome)){
		//$(location).attr('href', 'https://test.emorybubble.com/browser_unsupported');
		Meteor.Router.to('/browser_unsupported');
	}
	else{
		//console.log('Browser supported.');
		Meteor.Router.to('/dashboard');
	}
}