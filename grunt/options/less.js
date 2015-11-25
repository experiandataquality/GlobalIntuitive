module.exports = function(grunt){
	/**
     * Less setup
     */
    grunt.config('less', {
      dev: {
        options: {
            paths: ['<%= s %>less/**/*.less'], // Process all Less files in Less folder
        },
        files: {
          "<%= d %>css/styles.css": "<%= s %>less/_styles.less" // Build styles.css based on _styles.less
        }
      } 
    });

    grunt.loadNpmTasks('grunt-contrib-less');
};