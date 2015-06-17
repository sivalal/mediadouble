// Generated on 2014-05-15 using generator-angular 0.8.0
'use strict';

var modRewrite = require('connect-modrewrite');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-build-control');

    grunt.loadNpmTasks('grunt-cdn');

    grunt.loadNpmTasks('grunt-cache-breaker');

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'public'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ],
                    middleware: function (connect, options) {
                        var middlewares = [];
                        middlewares.push(modRewrite([
                            '!\\.html|\\.js|\\.css|\\.png|\\woff|\\ttf|\\swf$ /index.html [L]'
                        ]));
                        options.base.forEach(function (base) {
                            // Serve static files.
                            middlewares.push(connect.static(base));
                        });
                        return middlewares;
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*',
                        '!<%= yeoman.dist %>/ooyala*',
                        '!<%= yeoman.dist %>/index.php'
                    ]
                }]
            },
            build:{
              files:[
              {
                dot: true,
                src: [
                  'build/*',
                  //'!build/.git*'
                ]
              }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: '<%= yeoman.app %>/'
            },
            sass: {
                src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: '<%= yeoman.app %>/bower_components/'
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }
            }
        },

        cachebreaker: {
            dev: {
                options: {
                    match: ['vendor.css','main.css']
                },
                files: {
                    src: ['<%= yeoman.dist %>/index.html']
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            rightnow: ['<%= yeoman.dist %>/rightnow/scripts/integration.js'],
            html: ['<%= yeoman.dist %>/{,*/}*.html','<%= yeoman.dist %>/views/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/styles','<%= yeoman.dist %>/scripts'],
                patterns: {
                    rightnow: [
                        [/(rightnow\.css)/, 'Replacing CSS file'],
                        [/(rightnow\.js)/, 'Replacing JS file']
                    ]
                }
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '.tmp/styles/{,*/}*.css',
        //         '<%= yeoman.app %>/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },
        // The following *-min tasks produce minified files in the dist folder

        concat:{
            dist:{
                files:{
                    '<%= yeoman.dist %>/scripts/rightnow.js':[
                        '<%= yeoman.app %>/bower_components/jquery/dist/jquery.js',
                        '<%= yeoman.app %>/scripts/libs/bootstrap.min.js'
                    ]
                }
            }
        },
        cssmin: {
            dist:{
              files:{
                  '<%= yeoman.dist %>/styles/rightnow.css':[
                      '.tmp/styles/css/bootstrap.min.css',
                      '<%= yeoman.app %>/styles/css/bootstrap.min.css',
                      '.tmp/styles/base/app.css',
                      '<%= yeoman.app %>/styles/base/app.css',
                      '.tmp/styles/css/rightnow.css',
                      '<%= yeoman.app %>/styles/css/rightnow.css'
                  ]
              }
            },
            options: {
                root: '<%= yeoman.app %>'
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/images'
                },{
                    expand: true,
                    cwd: '<%= yeoman.app %>/dummy',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/dummy'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        // ngmin tries to make the code safe for minification automatically by
        // using the Angular long form for dependency injection. It doesn't work on
        // things like resolve or inject so those have to be done manually.
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        cdn: {
            options: {
                /* @required - root URL of your CDN (may contains sub-paths as shown below) */
                cdn: '//s.yaveo.com',
                /* @optional  - if provided both absolute and relative paths will be converted */
                flatten: true,
                /* @optional  - if provided will be added to the default supporting types */
                supportedTypes: { 'phtml': 'html' }
            },
            dist: {
                /* @required  - gets sources here, may be same as dest  */
                cwd: '<%= yeoman.dist %>/',
                /* @required  - puts results here with respect to relative paths  */
                dest: '<%= yeoman.dist %>/',
                /* @required  - string (or array of) including grunt glob variables */
                src: ['*.html','styles/*.css','scripts/*.js']
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'rightnow/{,*/}*.{css,js}',
                        'player/{,*/}*.{css,js}',
                        'json/Live_Content.json',
                        'views/{,*/}*.html',
                        'images/{,*/}*.{webp}',
                        'styles/fonts/**/*.{svg,eot,ttf,woff}',
                        'sizzle/**',
                        'signupnow/**',
                        'offerdetails/**',
                        'affiliate/**',
                        'copa_en/**',
                        'copa_es/**',
                        'wheretowatch/**'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            build:{
                expand: true,
                dest: 'build',
                src: ['module/**',
                    'config/application.config.php',
                    'public/**',
                    'public/.htaccess',
                    'vendor/**',
                    'init_autoloader.php',
                    'data/log/dir.info'
                ]
            },
            // This copies concatinated scripts from tmp. Only needed if uglify in disabled.
            concatinated:{
                files: [{
                    expand: true,
                    cwd: '.tmp/concat',
                    dest: '<%= yeoman.dist %>',
                    src: ['**']
                }]
            },
            gitignore:{
                src:'config/gitignore',
                dest:'build/.gitignore'
            }

        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'compass:server'
            ],
            test: [
                'compass'
            ],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        },


        replace: {
            local: {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('./config/environments/local.json')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/config.js'],
                        dest: '<%= yeoman.app %>/scripts/services/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/rightnow/integration.js'],
                        dest: '<%= yeoman.app %>/rightnow/scripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/module.config.php'],
                        dest: './module/Application/config/'

                    }
                ]
            },
            development: {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('./config/environments/development.json')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/config.js'],
                        dest: '<%= yeoman.app %>/scripts/services/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/rightnow/integration.js'],
                        dest: '<%= yeoman.app %>/rightnow/scripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/module.config.php'],
                        dest: './module/Application/config/'

                    }
                ]
            },
            next_development: {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('./config/environments/next-development.json')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/config.js'],
                        dest: '<%= yeoman.app %>/scripts/services/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/rightnow/integration.js'],
                        dest: '<%= yeoman.app %>/rightnow/scripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/module.config.php'],
                        dest: './module/Application/config/'

                    }
                ]
            },
            next_staging: {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('./config/environments/next-staging.json')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/config.js'],
                        dest: '<%= yeoman.app %>/scripts/services/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/rightnow/integration.js'],
                        dest: '<%= yeoman.app %>/rightnow/scripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/module.config.php'],
                        dest: './module/Application/config/'

                    }
                ]
            },
            sandbox: {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('./config/environments/sandbox.json')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/config.js'],
                        dest: '<%= yeoman.app %>/scripts/services/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/rightnow/integration.js'],
                        dest: '<%= yeoman.app %>/rightnow/scripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/module.config.php'],
                        dest: './module/Application/config/'

                    }
                ]
            },
            staging: {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('./config/environments/staging.json')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/config.js'],
                        dest: '<%= yeoman.app %>/scripts/services/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/rightnow/integration.js'],
                        dest: '<%= yeoman.app %>/rightnow/scripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/module.config.php'],
                        dest: './module/Application/config/'

                    }
                ]
            },
            next_production: {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('./config/environments/next-production.json')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/config.js'],
                        dest: '<%= yeoman.app %>/scripts/services/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/rightnow/integration.js'],
                        dest: '<%= yeoman.app %>/rightnow/scripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/module.config.php'],
                        dest: './module/Application/config/'

                    }
                ]
            },
            production: {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('./config/environments/production.json')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/config.js'],
                        dest: '<%= yeoman.app %>/scripts/services/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/rightnow/integration.js'],
                        dest: '<%= yeoman.app %>/rightnow/scripts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./config/module.config.php'],
                        dest: './module/Application/config/'

                    }
                ]
            }
        },

        buildcontrol:{
            options: {
                dir : 'build',
                commit : true,
                push : true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            staging: {
                options: {
                    remote: 'git@bitbucket.org:accedo/directvyaveo-web.git',
                    branch: 'staging'
                }
            },
            production: {
                options: {
                    remote: 'git@bitbucket.org:accedo/directvyaveo-web.git',
                    branch: 'production'
                    // remote: 'ssh://directv@ec2-54-183-21-44.us-west-1.compute.amazonaws.com/home/directv/git/hott-prd.git',                    
                     //branch: 'master'
                }
            },
            development: {
                options: {
                    remote: 'git@bitbucket.org:accedo/directvyaveo-web.git',
                    branch: 'development'
                    // remote: 'ssh://directv@ec2-54-183-21-44.us-west-1.compute.amazonaws.com/home/directv/git/hott-dev.git',                    
                    // branch: 'master'
                }
            },
            sandbox: {
                options: {
                    remote: 'git@bitbucket.org:accedo/directvyaveo-web.git',
                    branch: 'sandbox'
                }
            },
            next_development: {
                options: {
                    remote: 'git@bitbucket.org:accedo/directvyaveo-web.git',
                    branch: 'next-development'
                }
            },
            next_staging: {
                options: {
                    remote: 'git@bitbucket.org:accedo/directvyaveo-web.git',
                    branch: 'next-staging'
                }
            },
            next_production: {
                options: {
                    remote: 'git@bitbucket.org:accedo/directvyaveo-web.git',
                    branch: 'next-production'
                    // remote: 'ssh://directv@ec2-54-183-21-44.us-west-1.compute.amazonaws.com/home/directv/git/hott-prd.git',                    
                     //branch: 'master'
                }
            }
            
        },


        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('staging', [
        'replace:staging',
        'build',
        'buildcontrol:staging'        
        // Add further deploy related tasks here
    ]);

    grunt.registerTask('next-staging', [
        'replace:next_staging',
        'build',
        'buildcontrol:next_staging'        
        // Add further deploy related tasks here
    ]);

    grunt.registerTask('next-production', [
       'replace:next_production',
       'build',
       'buildcontrol:next_production'
    ]);

    grunt.registerTask('production', [
       'replace:production',
       'prod_build',
       'buildcontrol:production'
    ]);


    grunt.registerTask('development', [
       'replace:development',
       'local_build',
       'buildcontrol:development'
    ]);

    grunt.registerTask('sandbox', [
       'replace:sandbox',
       'build',
       'buildcontrol:sandbox'
    ]);

    grunt.registerTask('next-development', [
       'replace:next_development',
       'build',
       'buildcontrol:next_development'
    ]);

    grunt.registerTask('local', [
       'replace:local',
       'local_build'
    ]);

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bowerInstall',
            'replace:local',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('local_build', [
        'clean:dist',
        'bowerInstall',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        // 'ngmin',
        'copy:dist',
        'cdnify',
        'cssmin',
        // 'uglify',
        'copy:concatinated',
        'rev',
        'usemin',
        'cachebreaker',
        'htmlmin',
        'clean:build',
        'copy:build',
        'copy:gitignore'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'bowerInstall',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'cachebreaker',
        'htmlmin',
        'clean:build',
        'copy:build',
        'copy:gitignore'        
    ]);

    grunt.registerTask('prod_build', [
        'clean:dist',
        'bowerInstall',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'cachebreaker',
        'cdn',
        'htmlmin',
        'clean:build',
        'copy:build',
        'copy:gitignore'        
    ]);
    
    grunt.registerTask('default', [
        //'newer:jshint',
      //  'test',
        'build'
    ]);


};
