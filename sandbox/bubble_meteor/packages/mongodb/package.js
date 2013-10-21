Package.describe({
  summary: "Mongodb driver"
});

Npm.depends({'mongodb':"1.3.8"});

Package.on_use(function (api) {
  api.add_files('lib.js', 'server');
});