define(function (require) {
    var $ = require('jquery');
    var Matter = require('matter-js');
    var IPVehicle = require('IPVehicle');
    var Box2D = require('box2d');
    var DebugDraw = require('debugDraw');


    function Game() {
        this.world = new Box2D.b2World(new Box2D.b2Vec2(0.0, -30.0));
        this.initDegugDraw();
        this.initGround();
    }

    Game.prototype.initDegugDraw = function() {
        this.canvas = document.getElementById("canvas")

        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect( 0, 0, canvas.width, canvas.height );
        this.context.translate(320, 480);
        this.context.scale(1,-1);
        this.context.scale(26,26);
        this.context.lineWidth /= 26;

        this.debugDraw = new DebugDraw(this.context);
        this.debugDraw.SetFlags(1);
        this.world.SetDebugDraw(this.debugDraw);
    };

    Game.prototype.initGround = function() {

        var shape = new Box2D.b2EdgeShape();
        shape.Set(new Box2D.b2Vec2(-40.0, 0.0), new Box2D.b2Vec2(40.0, 0.0));

        var ground = this.world.CreateBody(new Box2D.b2BodyDef());
        ground.CreateFixture(shape, 0.0);

        shape = new Box2D.b2PolygonShape();
        shape.SetAsBox(6.0, 0.25, new Box2D.b2Vec2(-1.5, 10.0), 0);
        ground.CreateFixture(shape, 0.0);

        shape.SetAsBox(7.0, 0.25, new Box2D.b2Vec2(1.0, 6.0), 0.3);
        ground.CreateFixture(shape, 0.0);

        shape.SetAsBox(0.25, 1.5, new Box2D.b2Vec2(-7.0, 4.0), 0.0);
        ground.CreateFixture(shape, 0.0);
    };

    Game.prototype.update = function() {
        this.world.Step(1 / 60, 3, 2);

        var ctx = this.context;
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.world.DrawDebugData();

    };

    var game = new Game();

    function mainGameLoop() {
        game.update();
        window.requestAnimationFrame(mainGameLoop);
    }

    // Fire up!
    mainGameLoop();
});
