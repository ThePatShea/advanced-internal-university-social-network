var express = require('express');
var app = express();
var stylus = require('stylus');
var path = require('path');
var hbs = require('hbs');

//Tell Express to use the Stylus middleware to 
//compile any .styl files under the public folder
app.use(stylus.middleware(path.resolve(__dirname, '/server/public')));

//Set Handlebars as the templating engine on files ending in handlebars.html
//app.set('view engine', 'hbs');
app.set('view engine', 'html.handlebars');
app.engine('html.handlebars', require('hbs').__express);

//Register Handlebars helpers
hbs.registerHelper("JavaScriptAssets", function(){
  return '/js/compiled.js';
});

hbs.registerHelper("CSSAssets", function(){
  return '/css/style.css';
});

//var environment = process.env.NODE_ENV;

hbs.registerHelper("isProduction", function(environment){
  return false;
});

//Set location of static content
app.use(express.static(__dirname + '/server/public'));

//Set location of Backbone Marionette app static files
app.use('/app', express.static(__dirname + '/client'));

//Set location of Express views
app.set('views', __dirname + '/server/views');


//Server Routes
app.get('/server', function(req, res){
	res.render('index');
});

app.get('/currentdate', function(req, res){
	res.render('currentdatetemplate', {'date': Date()});
});




console.log('Server listening on 3000');
app.listen(3000);

module.exports = app;
