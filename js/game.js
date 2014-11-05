define(function (require) {
    var $ = require('jquery');
    var Matter = require('matter-js');
    var IPVehicle = require('IPVehicle');
    var Box2D = require('box2d');
    var DebugDraw = require('debugDraw');

    // Pixel to Meters conversion
    var PTM = 20;

    function Game() {
        this.world = new Box2D.b2World(new Box2D.b2Vec2(0.0, -30.0));
        this.initDegugDraw();
        this.initGround();
        this.ipv = new IPVehicle({
            world: this.world
        });

        this.canvasOffset = {};
        this.canvasOffset.x = this.canvas.width/2;
        this.canvasOffset.y = 480;
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
        shape.Set(new Box2D.b2Vec2(-1000, 0.5), new Box2D.b2Vec2(1000, 0.5));

        var ground = this.world.CreateBody(new Box2D.b2BodyDef());
        ground.CreateFixture(shape, 0.0);
    };

    Game.prototype.addEventListeners = function() {
        document.addEventListener('keyup', function(event) {
            var target = this.ipv.getTargetPosition();

            if (event.keyCode === 37) { // left-arrow
                target = Math.max(target - 2, -23);
                this.ipv.setTargetPosition(target);
            } else if(event.keyCode === 39) { // right-arrow
                var target = Math.min(target + 2, 23);
                this.ipv.setTargetPosition(target + 2);
            } else if(event.keyCode === 38) { // up-arrow
                PTM *= 1.1;
            } else if(event.keyCode === 40) { // down-arrow
                PTM *= 0.9;
            }
        }.bind(this));
    };

    Game.prototype.update = function() {
        this.ipv.step()
        this.world.Step(1 / 60, 3, 2);

        // TODO: move canvas related stuff to debugDraw
        var ctx = this.context;
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save()

        ctx.translate(this.canvasOffset.x, this.canvasOffset.y);
        ctx.scale(1,-1);
        ctx.scale(PTM,PTM);
        ctx.lineWidth /= PTM;
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
