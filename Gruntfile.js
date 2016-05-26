module.exports = function (grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  /** Version banner for static files (keep version format for "grunt-bump") */
  var banner = "/*! github.com/micmro/PerfCascade Version:<%= pkg.version %> <%= grunt.template.today(\"(dd/mm/yyyy)\") %> */\n";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ["temp/", "src/dist/"],
      pages: ["gh-pages/"],
      js: ["src/ts/**/*.js", "src/ts/**/*.js.map"]
    },
    concat: {
      options: {
        banner: banner
      },
      dist: {
        src: ["src/css-raw/normalize.css", "src/css-raw/page.css", "src/css-raw/main.css"],
        dest: "src/dist/perf-cascade-full.css",
      },
      pages: {
        src: ["src/css-raw/normalize.css", "src/css-raw/gh-page.css", "src/css-raw/main.css"],
        dest: "src/dist/perf-cascade-gh-page.css",
      }

    },
    browserify: {
      options: {
        plugin: [['tsify']],
        banner: banner,
        browserifyOptions: {
          standalone: "perfCascade"
        }
      },
      dist: {
        files: {
          "src/dist/perf-cascade.js": ["src/ts/main.ts"],
        }
      }
    },
    tslint: {
      options: {
        configuration: "tslint.json"
      },
      files: {
        src: [
          "src/ts/**/*.ts"
        ]
      }
    },
    uglify: {
      options: {
        compress: {
          global_defs: {
            "DEBUG": false
          },
          dead_code: true
        },
        banner: banner
      },
      dist: {
        files: {
          "src/dist/perf-cascade.min.js": ["src/dist/perf-cascade.js"]
        }
      }
    },
    watch: {
      ts: {
        files: ["src/ts/**/*.ts", "Gruntfile.js"],
        tasks: ["distBase"],
        options: {
          spawn: false,
          interrupt: true
        },
      },
      css: {
        files: ["src/css-raw/**/*.css"],
        tasks: ["concat:dist"],
        options: {
          spawn: false,
          interrupt: true
        },
      }
    },
    copy: {
      pages: {
        expand: true,
        flatten: true,
        src: ["src/dist/perf-cascade-gh-page.css", "src/dist/perf-cascade.min.js"],
        dest: "gh-pages/src/",
        filter: "isFile",
      },
    },
    "gh-pages": {
      options: {
        base: "gh-pages",
        add: true,
        // tag: '<%= pkg.version %>'
      },
      src: ["**/*"]
    },
    bump: {
      //to test run: grunt bump --dry-run
      options :{
        files: [
            "package.json",
            "src/dist/perf-cascade.js",
            "src/dist/perf-cascade.min.js",
            "src/dist/perf-cascade-full.css"
        ],
        updateConfigs: ['pkg'],
        commit: true,
        push: true,
        createTag: true,
        // dryRun: true,
        commitFiles: [
            "package.json",
            "src/dist/perf-cascade.js",
            "src/dist/perf-cascade.min.js",
            "src/dist/perf-cascade-full.css"
        ],
      }
    }
  });

  grunt.registerTask("distBase", ["clean:dist", "browserify:dist", "concat:dist"]);

  //build uptimized release file
  grunt.registerTask("releaseBuild", ["tslint", "distBase", "uglify:dist"]);

  //releases the current version on master to github-pages (gh-pages branch)
  grunt.registerTask("ghPages", ["clean:pages", "releaseBuild", "concat:pages", "copy:pages", "gh-pages"]);

  //releases master and gh-pages at the same time (with auto-version bump)
  grunt.registerTask("release", ["clean:pages", "releaseBuild", "bump", "concat:pages", "copy:pages", "gh-pages"]);

  grunt.registerTask("default", ["distBase", "watch"]);
};