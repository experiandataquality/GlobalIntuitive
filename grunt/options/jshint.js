module.exports = function(grunt){
	/**
     * JSHint static analysis setup
     */
    grunt.config('jshint', {
      files: ['gruntfile.js', '<%= s %>**/*.js', '<%= t %>**/*.js'], // Analyse this file and all source and test files for errors
      options: {
        browser: true, // Assume general browser globals
        globals: {
          predef: ['ContactDataServices']   // Any global variables go here, if required 
        }
      },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};