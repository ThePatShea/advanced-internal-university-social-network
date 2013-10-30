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
				files: ['views/*.html'],
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
					namespace: 'BubbleApp.templates'
				},
				files: {
					'./public/js/templates.js': ['./views/*.handlebars']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	//grunt.loadNpmTasks('grunt-handlebars-compiler');

	grunt.registerTask('default', ['express:dev', 'watch']);
}