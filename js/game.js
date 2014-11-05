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
        shape.Set(new Box2D.b2Vec2(-40.0, 0.0), new Box2D.b2Vec2(40.0, 0.0));

        var ground = this.world.CreateBody(new Box2D.b2BodyDef());
        ground.CreateFixture(shape, 0.0);

        var shape = new Box2D.b2PolygonShape();
        shape.SetAsBox(0.25, 0.25);

        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        bd.set_position(new Box2D.b2Vec2(-7.7, 15.0));
        var b4 = this.world.CreateBody(bd);
        b4.CreateFixture(shape, 10.0);




        var shape2 = new Box2D.b2PolygonShape();
        shape2.SetAsBox(0.5,0.5);

        var bd2 = new Box2D.b2BodyDef();
        bd2.set_type(Box2D.b2_dynamicBody);
        bd2.set_position(new Box2D.b2Vec2(0, 2));
        bd2.set_fixedRotation(true);
        var cartBody = this.world.CreateBody(bd2);

        cartBody.CreateFixture(shape2, 2.0);
        debugger;
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
