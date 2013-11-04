var path = require('path');

module.exports = function(grunt){

	grunt.initConfig({

		'watch': {
			express: {
				files: ['./server.js', './server/public/css/style.styl', './server/views/**/*.html.handlebars'],
				tasks: ['express:dev'],
				options: {
					nospawn: true
				}
			},

			handlebars: {
				files: ['./client/**/*.html.handlebars'],
				tasks: ['handlebars'],
				options: {
					nospawn: true
				}
			}
		},
		
		'express': {
			dev: {
				options: {
					port: 3000,
					script: path.resolve(__dirname, 'server.js')
				}
			}
		},

		'handlebars': {
			some: {
				options: {
					namespace: 'Templates',
					processName: function(filePath){
						return filePath;
					}
				},
				files: {
					'./client/static/js/templates.js': ['./client/**/*.html.handlebars']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	grunt.registerTask('default', ['handlebars', 'express:dev', 'watch']);
}