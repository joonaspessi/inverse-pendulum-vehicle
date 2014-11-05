define(function (require) {
    var $ = require('jquery');
    var Matter = require('matter-js');
    var IPVehicle = require('IPVehicle');
    var Box2D = require('box2d');
    var DebugDraw = require('debugDraw');


    function Game() {
        this.world = new Box2D.b2World(new Box2D.b2Vec2(0.0, -10.0));
        this.initDegugDraw();
        this.initGround();
        this.initBodies();
    }

    Game.prototype.initDegugDraw = function() {
        this.canvas = document.getElementById("canvas")

        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect( 0, 0, canvas.width, canvas.height );
        this.debugDraw = new DebugDraw(this.context);
        this.debugDraw.SetFlags(1);
        this.world.SetDebugDraw(this.debugDraw);
    };

    Game.prototype.initGround = function() {
        var shape = new Box2D.b2EdgeShape();
        shape.Set(new Box2D.b2Vec2(-100, 0), new Box2D.b2Vec2(100, 0));

        var ground = this.world.CreateBody(new Box2D.b2BodyDef());
        ground.CreateFixture(shape, 0.0);
    };

    Game.prototype.initBodies = function() {
        // Cart
        var shape2 = new Box2D.b2PolygonShape();
        shape2.SetAsBox(0.5,0.5);

        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        bd.set_position(new Box2D.b2Vec2(0, 2));
        bd.set_fixedRotation(true);

        var cartBody = this.world.CreateBody(bd);
        cartBody.CreateFixture(shape2, 2.0);

        // Wheel
        bd.set_fixedRotation(false);

        var circleShape = new Box2D.b2CircleShape();
        circleShape.set_m_radius(1);

        var fd = new Box2D.b2FixtureDef();
        fd.set_shape(circleShape);
        fd.set_density(2);
        fd.set_friction(1);
        fd.get_filter().set_groupIndex(-1);

        bd.set_position(new Box2D.b2Vec2(0, 2));
        var wheelBody = this.world.CreateBody(bd);
        wheelBody.CreateFixture(fd);

        // Joint
        var jd = new Box2D.b2WheelJointDef();
        jd.set_bodyA(cartBody);
        jd.set_bodyB(wheelBody);
        jd.set_localAnchorA(new Box2D.b2Vec2(0, 0));
        jd.set_localAnchorB(new Box2D.b2Vec2(0, 0));
        jd.set_localAxisA(new Box2D.b2Vec2(0, 1));
        jd.set_frequencyHz(20);
        jd.set_dampingRatio(1);

        var wheelJoint = Box2D.castObject(this.world.CreateJoint(jd), Box2D.b2WheelJoint);
        wheelJoint.EnableMotor(true);
        wheelJoint.SetMaxMotorTorque(500);
        wheelJoint.SetMotorSpeed(1);

        //Pendulum
        var polygonShape = new Box2D.b2PolygonShape();
        polygonShape.SetAsBox(0.5,5);

        var bd2 = new Box2D.b2BodyDef();
        bd2.set_type(Box2D.b2_dynamicBody);
        bd2.set_position(new Box2D.b2Vec2(0, 2 + 5));
        var pendulumBody = this.world.CreateBody(bd2);

        var fd2 = new Box2D.b2FixtureDef();
        fd2.set_shape(polygonShape);
        fd2.set_density(1);
        fd2.get_filter().set_groupIndex(-1)
        pendulumBody.CreateFixture(fd2);

        var jd2 = new Box2D.b2RevoluteJointDef();
        jd2.set_bodyA(cartBody);
        jd2.set_bodyB(pendulumBody);
        jd2.set_localAnchorA(new Box2D.b2Vec2(0.0,0.0));
        jd2.set_localAnchorB(new Box2D.b2Vec2(0.0,-5.0));
        jd2.set_collideConnected( false );
        var pendulumJoint = Box2D.castObject(this.world.CreateJoint(jd2), Box2D.b2RevoluteJoint);
    };

    Game.prototype.update = function() {
        this.world.Step(1 / 60, 3, 2);

        var ctx = this.context;
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save()

        ctx.translate(320, 480);
        ctx.scale(1,-1);
        ctx.scale(26,26);
        ctx.lineWidth /= 26;
        this.world.DrawDebugData();
        ctx.restore();
    };

    var game = new Game();

    function mainGameLoop() {
        game.update();
        window.requestAnimationFrame(mainGameLoop);
    }

    // Fire up!
    mainGameLoop();
});
