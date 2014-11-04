requirejs.config({
    paths: {
        "jquery": "../bower_components/jquery/dist/jquery",
        "matter-js": '../bower_components/matter-js/build/matter-0.8.0',
        "box2d": "lib/box2d"
    },
    shim: {
        'matter-js': {
            exports: 'Matter'
        },

        'box2d': {
            exports: "Box2D"
        }
    }
});

requirejs(['game']);
