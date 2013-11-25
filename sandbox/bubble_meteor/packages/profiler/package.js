Package.describe({
  summary: "Devtools"
});

Npm.depends({'webkit-devtools-agent':"0.2.1"});

Package.on_use(function (api) {
  api.add_files('lib.js', 'server');
});