requirejs.config({
    paths: {
        "jquery": "../bower_components/jquery/dist/jquery",
        "matter-js": '../bower_components/matter-js/build/matter-0.8.0'
    },
    shim: {
        'matter-js': {
            exports: 'Matter'
        },
    }
});

requirejs(['game']);
