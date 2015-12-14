module.exports = function(grunt){
	
	// Construct a banner containing package and build information
	grunt.config('banner',		
	    '/*! <%= filename %>.js | <%= pkg.url %> | <%= pkg.license %>\n' +
        '*   <%= pkg.author %> | <%= pkg.contact %> */\n'
        //'*   Built on <%= timestamp %> */\n',
    );
};