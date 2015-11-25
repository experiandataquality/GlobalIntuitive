module.exports = function(grunt){
	/**
     * Coveralls setup. Tells Coveralls where to find code coverage information
     */
    grunt.config('coveralls', {
      options: {
        force: true
      },
      src: 'coverage/lcov.info'
    });

    grunt.loadNpmTasks('grunt-coveralls');
};