module.exports = function (grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        clean: [
            './dist'
        ],

        copy: {
            base: {
                files: [
                    {
                        expand: true,
                        cwd: './splitter',
                        src: ['splitter.css'],
                        dest: './dist/'
                    },
                    {
                        expand: true,
                        cwd: './splitter',
                        src: ['horizontal.png'],
                        dest: './dist/'
                    },
                    {
                        expand: true,
                        cwd: './splitter',
                        src: ['vertical.png'],
                        dest: './dist/'
                    },
                    {
                        expand: true,
                        cwd: './bower_components/bootstrap/dist/css',
                        src: ['bootstrap.min.css'],
                        dest: './dist/'
                    },
                    {
                        expand: true,
                        cwd: './bower_components/bootstrap/dist/js',
                        src: ['bootstrap.min.js'],
                        dest: './dist/'
                    },
                    {
                        expand: true,
                        cwd: './bower_components/jQuery/dist/',
                        src: ['jquery.min.js'],
                        dest: './dist/'
                    },
                    {
                        expand: true,
                        cwd: './',
                        src: ['index.html'],
                        dest: './dist/'
                    },
                    {expand: true, cwd: './bower_components/syntax/lib', src: ['**'], dest: './dist/'}
                ],
            },

        },

        concat: {

            options: {
                separator: '',
            },

            universalSplitter: {

                src: './splitter/**.js',
                dest: './dist/universalSplitter.min.js',


            },

        },

        uglify: {
            options: {
                mangle: false
            },
            universalSplitter: {
                files: {
                    './dist/universalSplitter.min.js': './dist/universalSplitter.min.js',
                }
            }
        },

        watch: {

            js: {
                files: ['splitter/**.js'],
                tasks: ['clean', 'concat:universalSplitter', 'copy'],
                options: {
                    nospawn: true
                }
            },

            html: {
                files: ['./index.html'],
                tasks: ['copy'],
                options: {
                    nospawn: true
                }
            }

        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            watches: {
                tasks: ["watch:html", "watch:js"]
            }
        },


    });


    /* production */
    grunt.registerTask('build', ['clean', 'concat:universalSplitter', 'copy', 'uglify:universalSplitter' ]);

    /* development  */
    grunt.registerTask('dev', ['clean', 'concat:universalSplitter', 'copy', 'concurrent:watches']);


};