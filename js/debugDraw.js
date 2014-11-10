define(function (require) {
    var Box2D = require('box2d');

    var b2Color = Box2D.b2Color;
    var b2Vec2 = Box2D.b2Vec2;

    var e_shapeBit = 0x0001;
    var e_jointBit = 0x0002;
    var e_aabbBit = 0x0004;
    var e_pairBit = 0x0008;
    var e_centerOfMassBit = 0x0010;

    //to replace original C++ operator =
    function copyVec2(vec) {
        return new b2Vec2(vec.get_x(), vec.get_y());
    }

    //to replace original C++ operator * (float)
    function scaleVec2(vec, scale) {
        vec.set_x( scale * vec.get_x() );
        vec.set_y( scale * vec.get_y() );
    }

    //to replace original C++ operator *= (float)
    function scaledVec2(vec, scale) {
        return new b2Vec2(scale * vec.get_x(), scale * vec.get_y());
    }


    // http://stackoverflow.com/questions/12792486/emscripten-bindings-how-to-create-an-accessible-c-c-array-from-javascript
    function createChainShape(vertices, closedLoop) {
        var shape = new b2ChainShape();
        var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
        var offset = 0;
        for (var i=0;i<vertices.length;i++) {
            Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float'); // x
            Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float'); // y
            offset += 8;
        }
        var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
        if ( closedLoop )
            shape.CreateLoop(ptr_wrapped, vertices.length);
        else
            shape.CreateChain(ptr_wrapped, vertices.length);
        return shape;
    }

    function createPolygonShape(vertices) {
        var shape = new b2PolygonShape();
        var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
        var offset = 0;
        for (var i=0;i<vertices.length;i++) {
            Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float'); // x
            Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float'); // y
            offset += 8;
        }
        var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
        shape.Set(ptr_wrapped, vertices.length);
        return shape;
    }

    function createRandomPolygonShape(radius) {
        var numVerts = 3.5 + Math.random() * 5;
        numVerts = numVerts | 0;
        var verts = [];
        for (var i = 0; i < numVerts; i++) {
            var angle = i / numVerts * 360.0 * 0.0174532925199432957;
            verts.push( new b2Vec2( radius * Math.sin(angle), radius * -Math.cos(angle) ) );
        }
        return createPolygonShape(verts);
    }

    function setColorFromDebugDrawCallback(context, color) {
        var col = Box2D.wrapPointer(color, b2Color);
        var red = (col.get_r() * 255)|0;
        var green = (col.get_g() * 255)|0;
        var blue = (col.get_b() * 255)|0;
        var colStr = red+","+green+","+blue;
        context.fillStyle = "rgba("+colStr+",0.5)";
        context.strokeStyle = "rgb("+colStr+")";
    }

    function drawSegment(context, vert1, vert2) {
        var vert1V = Box2D.wrapPointer(vert1, b2Vec2);
        var vert2V = Box2D.wrapPointer(vert2, b2Vec2);
        context.beginPath();
        context.moveTo(vert1V.get_x(),vert1V.get_y());
        context.lineTo(vert2V.get_x(),vert2V.get_y());
        context.stroke();
    }

    function drawPolygon(context, vertices, vertexCount, fill) {
        context.beginPath();
        for(tmpI=0;tmpI<vertexCount;tmpI++) {
            var vert = Box2D.wrapPointer(vertices+(tmpI*8), b2Vec2);
            if ( tmpI == 0 )
                context.moveTo(vert.get_x(),vert.get_y());
            else
                context.lineTo(vert.get_x(),vert.get_y());
        }
        context.closePath();
        if (fill)
            context.fill();
        context.stroke();
    }

    function drawCircle(context, center, radius, axis, fill) {
        var centerV = Box2D.wrapPointer(center, b2Vec2);
        var axisV = Box2D.wrapPointer(axis, b2Vec2);

        context.beginPath();
        context.arc(centerV.get_x(),centerV.get_y(), radius, 0, 2 * Math.PI, false);
        if (fill)
            context.fill();
        context.stroke();

        if (fill) {
            //render axis marker
            var vert2V = copyVec2(centerV);
            vert2V.op_add( scaledVec2(axisV, radius) );
            context.beginPath();
            context.moveTo(centerV.get_x(),centerV.get_y());
            context.lineTo(vert2V.get_x(),vert2V.get_y());
            context.stroke();
        }
    }

    function drawTransform(context ,transform) {
        var trans = Box2D.wrapPointer(transform,b2Transform);
        var pos = trans.get_p();
        var rot = trans.get_q();

        context.save();
        context.translate(pos.get_x(), pos.get_y());
        context.scale(0.5,0.5);
        context.rotate(rot.GetAngle());
        context.lineWidth *= 2;
        drawAxes(context);
        context.restore();
    }

    function getCanvasDebugDraw(context) {
        var debugDraw = new Box2D.JSDraw();

        debugDraw.DrawSegment = function(vert1, vert2, color) {
            setColorFromDebugDrawCallback(context, color);
            drawSegment(context, vert1, vert2);
        };

        debugDraw.DrawPolygon = function(vertices, vertexCount, color) {
            setColorFromDebugDrawCallback(context, color);
            drawPolygon(context, vertices, vertexCount, false);
        };

        debugDraw.DrawSolidPolygon = function(vertices, vertexCount, color) {
            setColorFromDebugDrawCallback(context, color);
            drawPolygon(context, vertices, vertexCount, true);
        };

        debugDraw.DrawCircle = function(center, radius, color) {
            setColorFromDebugDrawCallback(context, color);
            var dummyAxis = b2Vec2(0,0);
            drawCircle(context, center, radius, dummyAxis, false);
        };

        debugDraw.DrawSolidCircle = function(center, radius, axis, color) {
            setColorFromDebugDrawCallback(context, color);
            drawCircle(context, center, radius, axis, true);
        };

        debugDraw.DrawTransform = function(transform) {
            drawTransform(context, transform);
        };

        return debugDraw;
    }

    function DebugDraw(canvas, world) {
        this.canvas = canvas;
        this.world = world;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect( 0, 0, canvas.width, canvas.height );

        this.debugDraw = getCanvasDebugDraw(this.context);
        this.debugDraw.SetFlags(1);
        this.world.SetDebugDraw(this.debugDraw);

        this.canvasOffset = {};
        this.canvasOffset.x = this.canvas.width/2;
        this.canvasOffset.y = 480;
        this.ptm = 20;

    }

    DebugDraw.prototype.setDrawOptions = function(options) {
        this.canvasOffset.x = options.canvasOffset.x || this.canvasOffset.x;
        this.canvasOffset.y = options.canvasOffset.y || this.canvasOffset.y;
        this.ptm = options.ptm || this.ptm;
        this.target = options.target || 0;
    };

    DebugDraw.prototype.updateTarget = function() {
        var ctx = this.context;
        ctx.fillStyle = "rgb(0,0,255,0.5)"
        ctx.strokeStyle = "rgb(0,0,255)"
        ctx.fillRect(this.target - 0.2, 0, 0.2, 0.5);
    };

    DebugDraw.prototype.setViewCenter = function(position) {
        this.canvasOffset.x = -position.get_x() * this.ptm + this.canvas.width/2;
    }

    DebugDraw.prototype.update = function(options) {
        var ctx = this.context;
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save()
        ctx.translate(this.canvasOffset.x, this.canvasOffset.y);
        ctx.scale(1,-1);
        ctx.scale(this.ptm,this.ptm);
        ctx.lineWidth /= this.ptm;
        this.world.DrawDebugData();
        this.updateTarget();
        ctx.restore();
    }

    return DebugDraw;
});
