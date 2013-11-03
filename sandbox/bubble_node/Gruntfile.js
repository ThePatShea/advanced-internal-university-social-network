var path = require('path');

module.exports = function(grunt){

	grunt.initConfig({

		'watch': {
			express: {
				files: ['./server.js', './server/public/css/style.styl', './server/views/**/*.handlebars.html'],
				tasks: ['express:dev'],
				options: {
					nospawn: true
				}
			},

			handlebars: {
				files: ['./client/**/*.handlebars.html'],
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
						var i = filePath.indexOf('views/');
						var j = filePath.indexOf('.handlebars');
						var templateName = filePath.slice(6, j);
						return templateName;
					}
				},
				files: {
					'./client/static/js/templates.js': ['./client/**/*.handlebars.html']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	grunt.registerTask('default', ['handlebars', 'express:dev', 'watch']);
}