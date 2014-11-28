"use strict";

module.exports = function (grunt) {

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");

	grunt.initConfig({
		"clean": {
			"bin": ["bin"]
		},
		"copy": {
			"images": {
				"expand": true,
				"src": ["img/**/*"],
				"cwd": "src/",
				"dest": "bin/"
			},
			"js": {
				"expand": true,
				"src": ["js/**/*"],
				"cwd": "src/",
				"dest": "bin/"
			}
		},
		"jade": {
			"jades": {
				"options": {
					"pretty": true
				},
				"files": {
					"bin/index.html": "src/jade/index.jade"
				}
			}
		},
		"stylus": {
			"options": {
				"compress": false,
				"use": [
                    require("kouto-swiss")
                ]
			},
			"styles": {
				"files": {
					"bin/css/styles.css": "src/styl/styles.styl"
				}
			}
		},
		"watch": {
			"styles": {
				"files": ["src/styl/*.styl"],
				"tasks": ["stylus"]
			},
			"jades": {
				"files": ["src/jade/*.jade"],
				"tasks": ["jade"]
			},
			"scripts": {
				"files": ["src/js/*.js"],
				"tasks": ["copy"]
			}
		}
	});

	grunt.registerTask("default", ["clean", "build", "watch"]);

	grunt.registerTask("build", [
            "jade",
            "stylus",
            "copy"
        ]);
};
