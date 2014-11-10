requirejs.config({
    paths: {
        "jquery": "../bower_components/jquery/dist/jquery",
        "box2d": "lib/box2d"
    },
    shim: {
        'box2d': {
            exports: "Box2D"
        }
    }
});

requirejs(['game']);
