define(function (require) {
    var $ = require('jquery');
    var Matter = require('matter-js');
    var IPVehicle = require('IPVehicle');
    var Box2D = require('box2d');


    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2AABB = Box2D.Collision.b2AABB,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
        b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef;


    var world = new b2World(new b2Vec2(0, 10), true);

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.1;

    var bodyDef = new b2BodyDef;

    //create world box
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.Set(10, 400 / 30 + 1.8);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(10, -1.8);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    fixDef.shape.SetAsBox(2, 14);
    bodyDef.position.Set(-1.8, 13);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(21.8, 13);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(0.5, 0.5);

    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.Set(10, 10);
    bodyDef.fixedRotation = true;
    var cartBody = world.CreateBody(bodyDef)
    cartBody.CreateFixture(fixDef);

    bodyDef.fixedRotation = false;

    fixDef.shape = new b2CircleShape();
    fixDef.shape.m_radius = 1;
    fixDef.density = 2;
    fixDef.friction = 1;
    fixDef.filter.groupIndex = -1;

    bodyDef.position.Set(10,10);
    var wheelBody = world.CreateBody(bodyDef);
    wheelBody.CreateFixture(fixDef);

    var jd = new b2LineJointDef();
    jd.bodyA = cartBody;
    jd.bodyB = wheelBody;
    jd.localAnchorA.Set(0,0);
    jd.localAnchorB.Set(0,0);
    jd.localAxisA.Set(0,1);
    jd.frequencyHz = 20;
    jd.dampingRatio = 1;

    var wheelJoint = world.CreateJoint(jd);
    wheelJoint.EnableMotor(true);
    window.w = wheelJoint;

    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

    world.SetDebugDraw(debugDraw);

    window.setInterval(update, 1000 / 60);

    function update() {
        world.Step(1 / 60, 10, 10);
        world.DrawDebugData();
        world.ClearForces();
    }

    $(document).on('keydown', function(event) {
        if (wheel.speed > 4) return;
        if (event.keyCode === 39) {
            Matter.Body.applyForce(wheel, {x:0,y:20}, {x:0.02,y:0});
        } else if (event.keyCode === 37) {
            Matter.Body.applyForce(wheel, {x:0,y:20}, {x:-0.02,y:0});
        }
    });

});
