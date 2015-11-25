module.exports = function(grunt){
	/**
     * Jasmine unit test setup. Includes Istanbul code coverage setup with Coveralls-friendly output
     */
    grunt.config('jasmine', {
      src: ['<%= s %>js/_scaffolding.js', '<%= s %>js/**/*.js', '<%= s %>js/main-address.js'], // Define specific files in dependency order if required 
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
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
};