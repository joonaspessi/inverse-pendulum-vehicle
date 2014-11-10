define(function (require) {
    var $ = require('jquery');
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
        this.addEventListeners();
        this.mouseJointGroundBody = this.world.CreateBody( new Box2D.b2BodyDef() );
    }

    Game.prototype.initDegugDraw = function() {
        this.canvas = document.querySelector("#canvas");
        this.debugDraw = new DebugDraw(canvas, this.world);
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
                target = Math.max(target - 2, -1000);
                this.ipv.setTargetPosition(target);
            } else if(event.keyCode === 39) { // right-arrow
                var target = Math.min(target + 2, 1000);
                this.ipv.setTargetPosition(target + 2);
            } else if(event.keyCode === 38) { // up-arrow
                PTM *= 1.1;
            } else if(event.keyCode === 40) { // down-arrow
                PTM *= 0.9;
            }
        }.bind(this));

        this.canvas.addEventListener('mousemove', function(event) {
            console.log('mousemove');
        });
    };


    Game.prototype.update = function() {
        this.ipv.step()
        this.world.Step(1 / 60, 3, 2);


        this.debugDraw.setDrawOptions({
            canvasOffset: {
                x: this.canvas.width / 2,
                y: 480
            },
            ptm: PTM,
            target: this.ipv.getTargetPosition()
        });
        this.debugDraw.setViewCenter(this.ipv.getPosition());
        this.debugDraw.update();

    };

    var game = new Game();

    function mainGameLoop() {
        game.update();
        window.requestAnimationFrame(mainGameLoop);
    }

    // Fire up!
    mainGameLoop();
});
