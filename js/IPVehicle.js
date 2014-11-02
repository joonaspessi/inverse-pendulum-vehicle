define(function (require) {
    var Matter = require('matter-js');
    var Pid = require('Pid');

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


    var DEGTORAD = 0.0174532925199432957;
    var RADTODEG = 57.295779513082320876;
    function normalizeAngle(angle) {
        while (angle >  180 * DEGTORAD) angle -= 360 * DEGTORAD;
        while (angle < -180 * DEGTORAD) angle += 360 * DEGTORAD;
        return angle;
    }

    var vehicle = function IPVehicle(options) {
        this.engine = options.engine
        this.xx = options.x;
        this.yy = options.y;
        this.width = options.width || 10;
        this.height = options.height || 200;
        this.wheelSize = options.wheelSize || 20;

        this.angleController = new Pid();
        this.angleController.setGains( 1.0, 0.0, 1.5 );

        this.positionController = new Pid();
        this.positionController.setGains( 0.5, 0.0, 1.5 );

        this._posAvg = 0;
        this._targetPosition = 300;
    };

    vehicle.prototype.getView = function () {
        var groupId = Body.nextGroupId(),
            wheelBase = -20,
            wheelAOffset = 0,
            wheelYOffset = 0;

        var ipv = Composite.create({ label: 'IPV' });
        var offset = 10;
        this.body = Bodies.trapezoid(this.xx, this.yy - this.height/2 , this.width, this.height, 0, {
            groupId: groupId,
        });

        this.wheel = Bodies.circle(this.xx, this.yy, this.wheelSize, {
            groupId: groupId,
            restitution: 0.8
        });

        var constraint = Constraint.create({
            bodyA: this.body,
            pointA: { x: 0, y: 100 },
            bodyB: this.wheel,
            stiffness: 0.05,
            angularStiffness: 0
        });

        Composite.addBody(ipv, this.body);
        Composite.addBody(ipv, this.wheel);

        // DEBUG TODO REMOVE
        window.wheel = this.wheel;
        window.body = this.body;

        Composite.addConstraint(ipv, constraint);

        return ipv;
    };

    vehicle.prototype.step = function() {
        this._posAvg = 0.95 * this._posAvg + 0.05 * this.wheel.position.x;
        this.positionController.setError(this._targetPosition - this._posAvg);
        this.positionController.step(1/60);
        var targetLinAccel = this.positionController.getOutput();
        var targetAngle = targetLinAccel / this.engine.world.gravity.y;

        var currentAngle = this.body.angle;
        currentAngle = normalizeAngle(currentAngle);

        this.angleController.setError(targetAngle - currentAngle);
        this.angleController.step(1/60);
        var targetSpeed = this.angleController.getOutput();
        // console.log(targetSpeed);

    };


    return vehicle;
});
