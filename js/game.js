define(function (require) {
    var Matter = require('matter-js');
    var IPVehicle = require('IPVehicle');
    console.log('main game');
    var ipVehicle = new IPVehicle();

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
            enableSleeping: false
    };

    var container   = document.getElementById('canvas-container'),
        _engine      = Engine.create(container, options),
        _world      = _engine.world;
        _mouse       = MouseConstraint.create(_engine);

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

    var scale = 0.9;
    World.add(_world, Composites.car(150, 100, 100 * scale, 40 * scale, 30 * scale));
});
