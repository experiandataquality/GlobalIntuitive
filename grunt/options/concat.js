module.exports = function(grunt){
	/**
     * Concatenation setup. Concatenated files are built to the path defined by the d variable
     * Includes closure banner and footer. Keep these in if you want to wrap concatenated code in closures
     */
    grunt.config('concat', {
      options: {
        banner: '<%= banner %>' +
                '\n;(function(window, document, undefined) {\n\n    "use strict";\n\n',
        footer: '\n})(window, window.document);\n'
      },
      dist: {
        src: ['<%= s %>js/_scaffolding.js', '<%= s %>js/**/*.js', '<%= s %>js/main-address.js'], // Define specific files in dependency order if required 
        dest: '<%= d %>js/<%= filename %>.js'
      }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
};