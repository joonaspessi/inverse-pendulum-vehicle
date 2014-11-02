requirejs.config({
    paths: {
        "matter-js": '../bower_components/matter-js/build/matter-0.8.0'
    },
    shim: {
        'matter-js': {
            exports: 'Matter'
        },
    }
});

requirejs(['game']);
