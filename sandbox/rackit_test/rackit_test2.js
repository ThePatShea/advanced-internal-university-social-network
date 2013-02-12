var rackit = require('rackit');

var file_path = '/Users/patshea56/Google Drive/Sandbox/dynamite.gif'


rackit.init({
    'user' : 'campusbubble',
    'key' : 'f12ab1992b6f9252fcce6be07091afd5'
}, function(err) {
    rackit.add(file_path, function(err, cloudpath) {
        console.log(rackit.getURI(cloudpath));
    });
});
