module.exports = function(grunt){
	/**
     * Uglification (minification) setup. Uglified files are built to the path defined by the d variable and get a .min suffix
     */
    grunt.config('uglify', {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          '<%= d %>js/<%= filename %>.min.js': ['<%= concat.dist.dest %>'] // Each concatenated file will get an uglified version
        }
      }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
};