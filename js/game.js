define(function (require) {
    var $ = require('jquery');
    var Matter = require('matter-js');
    var IPVehicle = require('IPVehicle');


    // Matter aliases
    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Constraint = Matter.Constraint,
        RenderPixi = Matter.RenderPixi,
        Events = Matter.Events,
        Bounds = Matter.Bounds,
        Vector = Matter.Vector,
        Vertices = Matter.Vertices,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Query = Matter.Query;

    var options = {
            positionIterations: 6,
            velocityIterations: 4,
            enableSleeping: false,
    };

    var container       = document.getElementById('canvas-container'),
        _engine         = Engine.create(container, options),
        _world          = _engine.world;
        _mouse          = MouseConstraint.create(_engine);
        _renderOptions  = _engine.render.options

        _renderOptions.showCollisions = true;
        _renderOptions.showPositions = true;
        _renderOptions.showAngleIndicator = true;
        _renderOptions.showVelocity = true;

    window.engine = _engine;

    // Add borders
    var offset = 5;
    World.add(_world, [
        Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
        Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
        Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
        Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true })
    ]);

    World.add(_engine.world, _mouse);

    Engine.run(_engine);

    var ipVehicle = new IPVehicle({engine: _engine, x: 300, y: 550});
    window.ipv = ipVehicle;

    World.add(_world, [
        ipVehicle.getView()
    ]);


    // Main game loop
    Events.on(_engine, 'tick', function(event) {
        ipVehicle.step();
    });

    $(document).on('keydown', function(event) {
        if (wheel.speed > 4) return;
        if (event.keyCode === 39) {
            Matter.Body.applyForce(wheel, {x:0,y:20}, {x:0.02,y:0});
        } else if (event.keyCode === 37) {
            Matter.Body.applyForce(wheel, {x:0,y:20}, {x:-0.02,y:0});
        }
    });

});
