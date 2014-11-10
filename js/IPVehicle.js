define(function (require) {
    var Pid = require('Pid');

    var DEGTORAD = 0.0174532925199432957;
    var RADTODEG = 57.295779513082320876;

    function normalizeAngle(angle) {
        while (angle >  180 * DEGTORAD) angle -= 360 * DEGTORAD;
        while (angle < -180 * DEGTORAD) angle += 360 * DEGTORAD;
        return angle;
    }

    function limit(number, min, max) {
        return Math.min(Math.max(number,min),max);
    }

    var Vehicle = function IPVehicle(options) {
        this.world = options.world

        this.angleController = new Pid();
        this.angleController.setGains( 1000, 0, 250 );

        this.positionController = new Pid();
        this.positionController.setGains( 0.5, 0.0, 1.5 );

        this._posAvg = 0;
        this._targetPosition = 0;

        this._createVehicle();
    };

    Vehicle.prototype._createVehicle = function () {
        // Cart
        var shape2 = new Box2D.b2PolygonShape();
        shape2.SetAsBox(0.5,0.5);

        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        bd.set_position(new Box2D.b2Vec2(0, 2));
        bd.set_fixedRotation(true);

        this._cartBody = this.world.CreateBody(bd);
        this._cartBody.CreateFixture(shape2, 2.0);

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
        this._wheelBody = this.world.CreateBody(bd);
        this._wheelBody.CreateFixture(fd);

        // Joint
        var jd = new Box2D.b2WheelJointDef();
        jd.set_bodyA(this._cartBody);
        jd.set_bodyB(this._wheelBody);
        jd.set_localAnchorA(new Box2D.b2Vec2(0, 0));
        jd.set_localAnchorB(new Box2D.b2Vec2(0, 0));
        jd.set_localAxisA(new Box2D.b2Vec2(0, 1));
        jd.set_frequencyHz(20);
        jd.set_dampingRatio(1);

        this._wheelJoint = Box2D.castObject(this.world.CreateJoint(jd), Box2D.b2WheelJoint);
        this._wheelJoint.EnableMotor(true);
        this._wheelJoint.SetMaxMotorTorque(500);
        this._wheelJoint.SetMotorSpeed(1);

        //Pendulum
        var polygonShape = new Box2D.b2PolygonShape();
        polygonShape.SetAsBox(0.5,5);

        var bd2 = new Box2D.b2BodyDef();
        bd2.set_type(Box2D.b2_dynamicBody);
        bd2.set_position(new Box2D.b2Vec2(0, 2 + 5));
        this._pendulumBody = this.world.CreateBody(bd2);

        var fd2 = new Box2D.b2FixtureDef();
        fd2.set_shape(polygonShape);
        fd2.set_density(1);
        fd2.get_filter().set_groupIndex(-1)
        this._pendulumBody.CreateFixture(fd2);

        var jd2 = new Box2D.b2RevoluteJointDef();
        jd2.set_bodyA(this._cartBody);
        jd2.set_bodyB(this._pendulumBody);
        jd2.set_localAnchorA(new Box2D.b2Vec2(0.0,0.0));
        jd2.set_localAnchorB(new Box2D.b2Vec2(0.0,-5.0));
        jd2.set_collideConnected( false );
        this._pendulumJoint = Box2D.castObject(this.world.CreateJoint(jd2), Box2D.b2RevoluteJoint);
    };

    Vehicle.prototype.step = function() {
        this._posAvg = 0.95 * this._posAvg + 0.05 * this._pendulumBody.GetPosition().get_x();
        this.positionController.setError(this._targetPosition - this._posAvg);
        this.positionController.step(1/60);
        var targetLinAccel = this.positionController.getOutput();
        var targetAngle = targetLinAccel / this.world.GetGravity().get_y();
        var targetAngle = limit(targetAngle, -15 * DEGTORAD, 15 * DEGTORAD);

        var currentAngle = this._pendulumBody.GetAngle();
        currentAngle = normalizeAngle(currentAngle);
        this.angleController.setError(targetAngle - currentAngle);
        this.angleController.step(1/60);
        var targetSpeed = this.angleController.getOutput();

        //Give up if ipv is katollaan
        if (Math.abs(targetSpeed) > 1000) {
            targetSpeed = 0;
        }

        var targetAngularVelocity = -targetSpeed / (2 * Math.PI * 1); // Wheel circumference 2*pi*r
        this._wheelJoint.SetMotorSpeed(targetAngularVelocity);
    };

    Vehicle.prototype.setTargetPosition = function(target) {
        this._targetPosition = target;
    }

    Vehicle.prototype.getTargetPosition = function(target) {
        return this._targetPosition;
    }

    Vehicle.prototype.getPosition = function(target) {
        return this._pendulumBody.GetPosition();
    }

    return Vehicle;
});
