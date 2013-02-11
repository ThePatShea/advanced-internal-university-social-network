var rackit = require('rackit');

// Initialize with your account information
rackit.init({
    'user' : 'campusbubble',
    'key' : 'f12ab1992b6f9252fcce6be07091afd5'
}, function(err) {
    // Add a local file to the cloud
    rackit.add(__dirname + '/image.jpg', function(err, cloudpath) {
        // Get the CDN URI of the file
        console.log(rackit.getURI(cloudpath));

        // The cloudpath parameter uniquely identifies this file, and is used by other Rackit methods to manipulate it.
        // We should probably store the cloudpath somewhere.
    });
});
