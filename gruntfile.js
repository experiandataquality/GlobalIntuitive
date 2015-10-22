module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),             // Read in package variable from package.json

    //filename: 'contact-data-services.<%= pkg.version %>',
    filename: 'contact-data-services',                    // Construct a filename from package vars

    timestamp: new Date().toUTCString(),                  // Get a timestamp for banner comments

    // Construct a banner containing package and build information
    banner: '/*! <%= filename %>.js | <%= pkg.url %> | <%= pkg.license %>\n' +
            '*   <%= pkg.author %> | <%= pkg.contact %> */\n',
            //'*   Built on <%= timestamp %> */\n',

    s: 'src/',   // The source directory
    d: 'dist/',  // The distributable directory, where built files will end up
    t: 'test/',  // The test directory, for unit test files/specs

    /**
     * Concatenation setup. Concatenated files are built to the path defined by the d variable
     * Includes closure banner and footer. Keep these in if you want to wrap concatenated code in closures
     */
    concat: {
      options: {
        banner: '<%= banner %>' +
                '\n;(function(window, document, undefined) {\n\n    "use strict";\n',
        footer: '\n})(window, window.document);\n'
      },
      dist: {
        src: ['<%= s %>js/scaffolding.js', '<%= s %>js/**/*.js', '<%= s %>js/main.js'], // Define specific files in dependency order if required 
        dest: '<%= d %>js/<%= filename %>.js'
      }
    },

    /**
     * Uglification (minification) setup. Uglified files are built to the path defined by the d variable and get a .min suffix
     */
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          '<%= d %>js/<%= filename %>.min.js': ['<%= concat.dist.dest %>'] // Each concatenated file will get an uglified version
        }
      }
    },

    /**
     * Jasmine unit test setup. Includes Istanbul code coverage setup with Coveralls-friendly output
     */
    jasmine: {
      src: ['<%= s %>js/scaffolding.js', '<%= s %>js/**/*.js', '<%= s %>js/main.js'], // Define specific files in dependency order if required 
      options: {
        specs: '<%= t %>**/*.js',
        template: require('grunt-template-jasmine-istanbul'),
        templateOptions: {
          coverage: 'coverage/coverage.json',
          report: [
            { type: 'lcov', options: { dir: 'coverage' }},      // Create .lcov report, required by Coveralls
            { type: 'html', options: { dir: 'coverage/html' }}, // Create an html report, readable by humans
            { type: 'text-summary' }                            // Output results to console post-build
          ],
          thresholds: {
            // Test result thresholds all set to 0 to begin with. Commented values are suggestions
            lines: 0, // 75
            statements: 0, // 75
            branches: 0, // 75
            functions: 0 // 75
          }
        }
      }
    },

    /**
     * JSHint static analysis setup
     */
    jshint: {
      files: ['gruntfile.js', '<%= s %>**/*.js', '<%= t %>**/*.js'], // Analyse this file and all source and test files for errors
      options: {
        browser: true, // Assume general browser globals
        globals: {
          predef: ['ContactDataServices']   // Any global variables go here, if required 
        }
      }
    },

    /**
     * Less setup
     */
    less: {
      dev: {
        options: {
            paths: ['<%= s %>less/**/*.less'], // Process all Less files in Less folder
        },
        files: {
          "<%= d %>css/styles.css": "<%= s %>less/_styles.less" // Build styles.css based on _styles.less
        }
      } 
    },

    /**
     * Copy setup
     */
    copy: {
      fonts: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= s %>fonts/**/*'], 
            dest: '<%= d %>fonts',
            filter: 'isFile'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= s %>/images/**/*', '!<%= s %>images/**/*.db'], // Include all files in images folder, excluding .db
            dest: '<%= d %>images',
            filter: 'isFile'
          }
        ]
      }
    },

    /**
     * Watch setup. The configured tasks will run when and of the files tested by JSHint are changed
     */
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'jasmine', 'less']
    },

    /**
     * Coveralls setup. Tells Coveralls where to find code coverage information
     */
    coveralls: {
      options: {
        force: true
      },
      src: 'coverage/lcov.info'
    }

  });

  // Load tasks in this order
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-coveralls');

  // Register test and build tasks.These can be run from the command line with "grunt test" or "grunt build"
  // "grunt watch" should be run while developing to notify you when things go wrong
  grunt.registerTask('test', ['jshint', 'jasmine', 'coveralls']);
  grunt.registerTask('build', ['jshint', 'jasmine', 'concat', 'uglify', 'less', 'copy']);

};