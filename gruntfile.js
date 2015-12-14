module.exports = function(grunt) {
  
  // Initialise config.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json')
  });

  // Load per-task config from separate files.
  grunt.loadTasks('grunt/options');

  // Register test and build tasks.These can be run from the command line with "grunt test" or "grunt build"
  // "grunt watch" should be run while developing to notify you when things go wrong
  grunt.registerTask('test', ['jshint', 'jasmine', 'coveralls']);
  grunt.registerTask('build', ['jshint', 'jasmine', 'concat', 'uglify', 'less', 'cssmin', 'copy']);
};