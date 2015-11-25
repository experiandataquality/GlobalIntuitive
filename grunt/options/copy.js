module.exports = function(grunt){
	
    /**
     * Copy setup
     */
    grunt.config('copy',{
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
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};