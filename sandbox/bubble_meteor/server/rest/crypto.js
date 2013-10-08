var crypto = Npm.require('crypto');

// TODO: Should be stored in configuration file
var KEY = 's0m3sEcreTkEy';
var MODE = 'aes-128-cbc';
var TIMEOUT = 1000 * 60 * 60 * 24;
var SAFEGUARD = 'abc';


this.RestCrypto = {
	generateToken: function(userId) {
		var rnd = (Math.random() + '').substr(0, 6) * 123;
		var time = new Date().getTime();
		var payload = rnd + '|' + time + '|' + userId + '|' + SAFEGUARD;

		var cipher = crypto.createCipher(MODE, KEY);
		var data = cipher.update(payload, 'utf-8', 'hex');
		return data + cipher.final('hex');
	},

	verifyToken: function(token) {
		try {
			var cipher = crypto.createDecipher(MODE, KEY);
			var payload = cipher.update(token, 'hex');
			payload += cipher.final('hex');

			var items = payload.split('|');
			if (items.length != 4)
				return null;

			if (items[3] != SAFEGUARD)
				return null;

			var now = new Date().getTime();
			if (now - parseFloat(items[1]) > TIMEOUT)
				return null;

			return items[2];
		} catch (e) {
			return null;
		}
	}
};

Meteor.methods({
	getRestToken: function() {
		var userId = Meteor.userId();

		if (!userId)
			return null;

		return RestCrypto.generateToken(userId);
	}
});