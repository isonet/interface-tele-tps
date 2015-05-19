module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false
            },
            deploy: {
                files: {
                    'dist/lib/Blob.js': 'bower_components/Blob/Blob.js',
                    'dist/lib/FileSaver.js': 'bower_components/FileSaver/FileSaver.min.js',
                    'dist/lib/canvas-toBlob.js': 'bower_components/canvas-toBlob/canvas-toBlob.js',
                    'dist/lib/d3.js': 'bower_components/d3/d3.js',
                    'dist/lib/jquery.js': 'bower_components/jquery/dist/jquery.js',
                    'dist/lib/bootstrap.js': 'bower_components/bootstrap/dist/js/bootstrap.js',
                    'dist/lib/angular.js': 'bower_components/angular/angular.js',
                    'dist/lib/angular-route.js': 'bower_components/angular-route/angular-route.js',
                    'dist/lib/angular-resource.js': 'bower_components/angular-resource/angular-resource.js',
                    'dist/lib/ngStorage.js': 'bower_components/ngstorageGsklee/ngStorage.js',
                    'dist/lib/moment-with-locales.js': 'bower_components/moment/min/moment-with-locales.js',
                    'dist/lib/datetimepicker.js': 'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
                    'dist/lib/angular-toastr.js': 'bower_components/angular-toastr/dist/angular-toastr.js',
                    'dist/lib/angular-animate.js': 'bower_components/angular-animate/angular-animate.js',
                    'dist/scripts/modules/controllers.module.js': 'scripts/modules/controllers.module.js',
                    'dist/scripts/modules/directives.module.js': 'scripts/modules/directives.module.js',
                    'dist/scripts/modules/filters.module.js': 'scripts/modules/filters.module.js',
                    'dist/scripts/vendor/teleTpsLocalize.js': 'scripts/vendor/teleTpsLocalize.js',
                    'dist/scripts/app.js': 'scripts/app.js',
                    'dist/scripts/Interface.js': 'scripts/Interface.js',
                    'dist/scripts/NetworkInterface.js': 'scripts/NetworkInterface.js',
                    'dist/scripts/Resource.js': 'scripts/Resource.js',
                    'dist/scripts/TP.js': 'scripts/TP.js'
                }
            }
        },
        concat: {
            css: {
                src: [
                    'styles/main.css',
                    'bower_components/bootstrap/dist/css/bootstrap.css',
                    'bower_components/bootstrap/dist/css/bootstrap-theme.css',
                    'bower_components/font-awesome/css/font-awesome.css',
                    'bower_components/angular-toastr/dist/angular-toastr.css',
                    'bower_components/angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
                ],
                dest: 'tmp/combined.css'
            }
        },
        cssmin: {
            css:{
                src: 'tmp/combined.css',
                dest: 'dist/css/release.css'
            }
        },
        htmlmin: {
            deploy: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'tmp/index.html',     // 'destination': 'source'
                    'dist/partials/edit.html': 'partials/edit.html',
                    'dist/partials/header.html': 'partials/header.html',
                    'dist/partials/metaDialog.html': 'partials/metaDialog.html',
                    'dist/partials/new.html': 'partials/new.html',
                    'dist/partials/removalDialog.html': 'partials/removalDialog.html'
                }
            }
        },
        'json-minify': {
            deploy: {
                files: 'dist/**/*.json'
            }
        },
        copy: {
            deploy: {
                files: [
                    {expand: true, flatten:true, src: ['config.json'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, src: ['localization/**'], dest: 'dist/'},
                    {expand: true, flatten:true, src: ['bower_components/bootstrap/fonts/*'], dest: 'dist/fonts/', filter: 'isFile' },
                    {expand: true, flatten:true, src: ['bower_components/font-awesome/fonts/*'], dest: 'dist/fonts/', filter: 'isFile' }
                ]
            }
        },
        processhtml: {
            deploy: {
                files: {
                    'tmp/index.html': ['index.html']
                }
            }
        },
        clean: ["dist", "tmp"]
    });

    grunt.registerTask('css', ['concat:css', 'cssmin:css']);

    grunt.registerTask('default', ['clean', 'css', 'uglify', 'processhtml', 'htmlmin', 'copy']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-json-minify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
};