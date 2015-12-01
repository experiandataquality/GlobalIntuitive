module.exports = function(grunt){
	/**
     * CSS min setup
     */
    grunt.config('cssmin', {
      target: {
        files: [{
          expand: true,
          cwd: '<%= d %>css',
          src: ['*.css', '!*.min.css'],
          dest: '<%= d %>css',
          ext: '.min.css'
        }]
      }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
};