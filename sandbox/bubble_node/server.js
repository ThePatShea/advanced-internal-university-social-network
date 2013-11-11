var _ = require("underscore");
var express = require('express');
var app = express();
var stylus = require('stylus');
var path = require('path');
var handlebars = require('hbs');
var Snockets = require('snockets');
var snockets = new Snockets();

//Tell Express to use the Stylus middleware to 
//compile any .styl files under the public folder
app.use(stylus.middleware(path.resolve(__dirname, '/server/public')));

//Set Handlebars as the templating engine on files ending in .html.handlebars
app.set('view engine', '.html.handlebars');
app.engine('.html.handlebars', handlebars.__express);

//Register Handlebars helpers
handlebars.registerHelper("js", function(){
  js = snockets.getCompiledChain('client/manifest.js', {async: false});

  scripts = _(js).map(function(jsFile) {
    return "<script src='" + jsFile.filename + "'></script>";
  }).join("\n  ");

  return scripts;
});

handlebars.registerHelper("CSSAssets", function(){
  return '/css/style.css';
});

//var environment = process.env.NODE_ENV;

handlebars.registerHelper("isProduction", function(environment){
  return false;
});

//Set location of static content
app.use(express.static(__dirname + '/server/public'));

//Set location of Backbone Marionette app static files
app.use('/client', express.static(__dirname + '/client'));

//Set location of Express views
app.set('views', __dirname + '/server/views');


//Server Routes
app.get('/', function(req, res) {
  res.render('app'); // The main app template
});



console.log('Server listening on 3000');
app.listen(3000);

module.exports = app;
