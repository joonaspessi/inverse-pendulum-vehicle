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

        this.ipv = new IPVehicle({
            world: this.world
        });
    }

    Game.prototype.initDegugDraw = function() {
        this.canvas = document.getElementById("canvas")

        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect( 0, 0, canvas.width, canvas.height );
        this.debugDraw = new DebugDraw(this.context);
        this.debugDraw.SetFlags(1);
        this.world.SetDebugDraw(this.debugDraw);
        this.addEventListeners();
    };

    Game.prototype.initGround = function() {
        var shape = new Box2D.b2EdgeShape();
        shape.Set(new Box2D.b2Vec2(-100, 0), new Box2D.b2Vec2(100, 0));

        var ground = this.world.CreateBody(new Box2D.b2BodyDef());
        ground.CreateFixture(shape, 0.0);
    };

    Game.prototype.addEventListeners = function() {
        document.addEventListener('keyup', function(event) {
            var currentTarget = this.ipv.getTargetPosition();
            if (event.keyCode === 37) { // left-arrow
                this.ipv.setTargetPosition(currentTarget - 3);
            } else if(event.keyCode === 39) { // right-arrow
                this.ipv.setTargetPosition(currentTarget + 3);
            }
        }.bind(this));
    };

    Game.prototype.update = function() {

        this.ipv.step()
        this.world.Step(1 / 60, 3, 2);

        // Target position

        // TODO: move canvas related stuff to debugDraw
        var ctx = this.context;
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save()

        ctx.translate(320, 480);
        ctx.scale(1,-1);
        ctx.scale(26,26);
        ctx.lineWidth /= 26;
        this.world.DrawDebugData();
        //draw target position marker
        ctx.fillStyle = "rgb(0,0,255,0.5)"
        ctx.strokeStyle = "rgb(0,0,255)"
        ctx.fillRect(this.ipv.getTargetPosition() - 0.2, 0, 0.2, 0.5);
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
