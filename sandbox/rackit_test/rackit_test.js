var rackit = require('rackit');

rackit.init({
    'user' : 'campusbubble',
    'key' : 'f12ab1992b6f9252fcce6be07091afd5'
}, function(err) {
    rackit.add(__dirname + '/image2.png', function(err, cloudpath) {
        console.log(rackit.getURI(cloudpath));
    });
});
