var path = require('path');

module.exports = function(grunt){

	grunt.initConfig({

		'watch': {
			express: {
				files: ['app.js'],
				tasks: ['express:dev'],
				options: {
					nospawn: true
				}
			}
		},
		
		'express': {
			dev: {
				options: {
					port: 3000,
					script: path.resolve(__dirname, 'app.js')
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');

	grunt.registerTask('default', ['express:dev', 'watch']);
}