var _          = require("underscore")
  , express    = require('express')
  , app        = express()
  , stylus     = require('stylus')
  , path       = require('path')
  , handlebars = require('hbs')
  , Snockets   = require('snockets')
  , snockets   = new Snockets();


// Set location of static content, compile Stylus files there
app.use(express.static(__dirname + '/server/public'));
app.use(stylus.middleware(path.resolve(__dirname, '/server/public')));

// Serve up the backbone app files raw, but only in development
app.configure('development', function() {
  app.use('/client', express.static(__dirname + '/client'));
});

// Set location of Express views with Handlebars as the template language
app.set('views', __dirname + '/server/views');
app.set('view engine', '.html.handlebars');
app.engine('.html.handlebars', handlebars.__express);

// Handlebars asset pipeline helper
handlebars.registerHelper("js", function(){

  if(process.env.NODE_ENV != 'production') {
    // Output a dependency-ordered series of <script> tags
    js = snockets.getCompiledChain('client/manifest.js', { async: false });

    scripts = _(js).map(function(jsFile) {
      return "<script src='" + jsFile.filename + "'></script>";
    }).join("\n  ");
  } else {
    // Output the <script> tag of the compiled application (see its route below)
    scripts = "<script src='/application.js'></script>";
  }

  return scripts;
});


// Server Routes
app.get('/', function(req, res) {
  res.render('app'); // The main app template
});

// The compiled and minifed Marionette application
app.get('/application.js', function(req, res) {
  minifiedApp = snockets.getConcatenation('client/manifest.js', { async: false, minify: true });
  res.type('application/javascript');
  res.send(minifiedApp);
});

// Resources TODO: bring in the real routes
app.get('/explores', function(req, res) {
  // Dummy to build out frontend
  _.delay(function() {
    res.json([
      { id: 1, name: "Campus" },
      { id: 2, name: "Campus2" },
      { id: 3, name: "Campus3" },
      { id: 4, name: "Campus4" }
    ]);
  }, 2000);
});


// Start it up!
console.log('Server listening on 3000');
app.listen(3000); // TODO: production port management

module.exports = app;
