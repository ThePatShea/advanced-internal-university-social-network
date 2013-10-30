var path = require('path');

module.exports = function(grunt){

	grunt.initConfig({
		'watch': {
			files: ['app.js']
		},

		'express': {
			myServer: {
				options: {
					port: 3000,
					server: path.resolve('./app')
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express');

	grunt.registerTask('default', ['express:myServer', 'express-keepalive']);
	//grunt.registerTask('express', ['express-keepalive']);
}