require.config({
	paths: {
		'jquery': 'http://code.jquery.com/jquery-1.9.1.min',
		'thorax': 'http://cdnjs.cloudflare.com/ajax/libs/thorax/2.0.0rc6/thorax',
		'text': 'http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text'
	},
  urlArgs: "bust=" +  (new Date()).getTime()
});

define(['thoraxdemo'], function() {})