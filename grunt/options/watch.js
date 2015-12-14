module.exports = function(grunt){
	/**
     * Watch setup. The configured tasks will run when and of the files tested by JSHint are changed
     */
    grunt.config('watch', {
      files: ['<%= jshint.files %>', '<%= less.dev.options.paths %>'],
      tasks: ['jshint', 'jasmine', 'less']
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};