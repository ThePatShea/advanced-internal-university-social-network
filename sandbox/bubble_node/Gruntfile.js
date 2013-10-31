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
			},

			handlebars: {
				files: ['views/*.handlebars'],
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
					script: path.resolve(__dirname, 'app.js')
				}
			}
		},

		'handlebars': {
			some: {
				options: {
					namespace: 'BubbleApp.templates',
					templateRoot: 'views/',
					processName: function(filePath){
						var i = filePath.indexOf('views/');
						var j = filePath.indexOf('.handlebars');
						var templateName = filePath.slice(6, j);

						return templateName;
					}
				},
				files: {
					'public/js/templates.js': ['views/*.handlebars']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	grunt.registerTask('default', ['handlebars', 'express:dev', 'watch']);
}