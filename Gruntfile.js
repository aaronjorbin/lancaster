module.exports = function(grunt) {
	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	var _ = require('lodash-node'),
		fs = require('fs'),
		slides = fs.readdirSync( 'content' ), 
		config = {
		clean: {
			public: 'public/**/*'
		},
		jade: _.object( slides, _.map( slides , function( slide ){
			var slideContent = _.compact( 
				fs.readFileSync( 'content/' + slide ).toString().split( "\n" ) 
			);
			return {
				files: [{
					expand: true,
					cwd: 'src/',
					src: 'slides.jade',
					dest: 'public/',
					rename: function( dest, src ){
						return 'public/' + slide + '.html'
					},
					ext: '.html'
				}],
				options: {
					data: {
						pageTitle: slide,
						'slideContent': slideContent	
					},
					pretty: true,
				}
			}
		} ) ), // end _.map, _.object, jade task
		copy: {
			src: {
				files: [{
					expand: true,
					cwd: 'src/',
						src: [
							'**/*',
							'!slides.jade',
							'!index.jade'
						],
					dest: 'public/'
					}]
			}
		},
		watch: {
			jade: {
				files: _.map(slides, function(slide){ return 'content/' + slide }).concat( ['src/index.jade', 'src/slides.jade'] ),
				tasks: 'jade'
			},
			copy: {
				files: [
					'<%= copy.src.files[0].cwd + copy.src.files[0].src[0] %>',
					'!<%= jade.src.files[0].cwd + jade.src.files[0].src %>',
				],
				tasks: 'copy:src'
			},
            less: {
                files: ['src/styles/{,*/}*.less'],
                tasks: ['less', 'autoprefixer']
            },
			public: {
				files: [
					'public/**/*',
					'!public/bower_components/**/*'
				],
				options: {
				livereload: 31729
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 3000,
					base: 'public',
					keepalive: true,
					middleware: function(connect, options) {
						return [
							require('connect-livereload')({
								port: config.watch.public.options.livereload
							}),
							connect.static(options.base)
						];
					}
				}
			}
		},
        less: {
          dist: {
            src: ['src/styles/main.less'],
            dest: 'public/styles/main.css',
            options: {
                sourceMap: true,
                sourceMapFilename: 'public/styles/main.css.map',
                sourceMapBasepath: 'src/',
                sourceMapRootpath: '/'
            }
          }
        },
		open: {
			server: {
				path: 'http://localhost:<%= connect.server.options.port %>'
			}
		},
		concurrent: {
			compile: {
				tasks: [
					'jade',
					'less',
					'copy'
				],
				options: {
					logConcurrentOutput: false
				}
			},
			server: {
				tasks: [
					'connect',
					'open',
					'watch:jade',
					'watch:less',
					'watch:copy',
					'watch:public'
				],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	};

	grunt.initConfig(config);

	grunt.registerTask('default', ['clean', 'concurrent:compile']);
	grunt.registerTask('server', ['default', 'concurrent:server']);

};
