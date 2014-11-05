define(function (require) {
    "use strict";
    var Pid = function Pid(options) {
        options = options || {};
        this._gainP = options.gainP || 1;
        this._gainI = options.gainI || 1;
        this._gainD = options.gainD || 1;

        this._currentError = options.gaincurrentError || 0;
        this._previousError = options.previousError || 0;
        this._integral = options.integral || 0;
        this._output = options.output || 0;
    };

    Pid.prototype.setGains = function setGains(p, i, d) {
        this._gainP = p;
        this._gainI = i;
        this._gainD = d;
    };

    Pid.prototype.setError = function setError(error) {
        this._currentError = error;
        return this._currentError;
    };

    Pid.prototype.step = function step(dt)  {
        this._integral = dt * (this._integral + this._currentError);
        var derivative = (1/dt) * (this._currentError - this._previousError);
        this._output = this._gainP * this._currentError + this._gainI * this._integral + this._gainD * derivative;
        this._previousError = this._currentError;
    };

    Pid.prototype.getOutput = function getOutput() {
        return this._output;
    };

    return Pid;
});
